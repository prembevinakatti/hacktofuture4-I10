const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const axios = require('axios');
const { processChatMessage } = require('../services/chatService');
const { processNewComplaint } = require('../services/complaintService');
const { processWhatsAppMedia } = require('../services/mediaService');
const User = require('../models/User');
const Complaint = require('../models/Complaint');

const MessagingResponse = twilio.twiml.MessagingResponse;

// 🧠 In-memory session store (Phone Number -> { title, imageUrl, lat, lng })
const userSessions = new Map();

/**
 * 🌐 Health Check & Webhook Status Check (GET)
 * Allows developers and status checkers to easily verify webhook availability.
 */
router.get('/', (req, res) => {
    res.status(200).send('✅ JanSetu WhatsApp Webhook is active and listening for POST requests from Twilio.');
});

/**
 * 🖼️ Authenticated Media Proxy for Twilio Images
 * Allows web browsers to render Twilio WhatsApp attachments without authentication errors.
 */
router.get('/media-proxy', async (req, res) => {
    const rawUrl = req.query.url;
    if (!rawUrl) return res.status(400).send('Missing url parameter');

    try {
        const response = await axios.get(rawUrl, {
            auth: {
                username: process.env.TWILIO_ACCOUNT_SID,
                password: process.env.TWILIO_AUTH_TOKEN
            },
            responseType: 'stream',
            timeout: 15000
        });

        res.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
        res.set('Cache-Control', 'public, max-age=86400');
        response.data.pipe(res);
    } catch (err) {
        console.error('💥 Media proxy streaming error:', err.message);
        res.status(500).send('Failed to fetch media');
    }
});

/**
 * 🛠️ Helper: Resolve or Create Citizen User Safely
 */
async function getOrCreateCitizen(senderPhone) {
    const cleanPhone = (senderPhone || '').replace('whatsapp:', '').trim();
    if (!cleanPhone) return null;

    try {
        let user = await User.findOne({
            $or: [
                { phoneNumber: cleanPhone },
                { email: `${cleanPhone}@jansetu.city` }
            ]
        });

        if (!user) {
            user = await User.create({
                name: `Citizen ${cleanPhone.slice(-4)}`,
                email: `${cleanPhone}@jansetu.city`,
                phoneNumber: cleanPhone,
                password: "tempPassword123",
                role: 'citizen'
            });
        }
        return user;
    } catch (err) {
        console.warn('⚠️ User lookup/create fallback:', err.message);
        return await User.findOne({ email: `${cleanPhone}@jansetu.city` }) || await User.findOne();
    }
}

/**
 * 🛠️ Helper: Reverse Geocode with strict 4s timeout
 */
async function reverseGeocode(lat, lng) {
    let readableLocation = `Coordinates: ${lat}, ${lng}`;
    try {
        const geoRes = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
            {
                headers: { 'User-Agent': 'JanSetu-Smart-City/1.0' },
                timeout: 4000
            }
        );
        if (geoRes.data && geoRes.data.display_name) {
            readableLocation = geoRes.data.display_name;
        }
    } catch (e) {
        console.warn('⚠️ Geocoding failed, using fallback coordinates:', e.message);
    }
    return readableLocation;
}

/**
 * 🛠️ Helper: Submit and Finalize Complaint
 */
async function submitComplaint({ sender, title, lat, lng, imageUrl }) {
    const user = await getOrCreateCitizen(sender);
    const readableLocation = await reverseGeocode(lat, lng);

    const complaint = await processNewComplaint({
        title: title.trim(),
        location: readableLocation,
        userId: user ? user._id : undefined,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        imageUrl: imageUrl || null,
        userEmail: user?.email
    });

    // Clear session after submission
    userSessions.delete(sender);

    const frontendUrl = (process.env.FRONTEND_URL || 'https://hacktofuture4-i10.vercel.app').replace(/\/$/, '');
    const ticketId = complaint._id.toString().slice(-6);
    const hasPhoto = !!complaint.imageUrl;

    return `✅ *Complaint Registered Successfully!*\n\n🔖 Ticket ID: *#${ticketId}*\n🏢 Department: *${complaint.department}*\n⚡ Priority: *${complaint.priority}*\n📍 Location: ${readableLocation.split(',').slice(0, 3).join(',')}\n${hasPhoto ? '📸 *Evidence Photo Attached*\n' : ''}\n🌐 *Track your report online:*\n${frontendUrl}/citizen\n\nOur municipal team has been dispatched. Thank you for making our city better! 🏛️`;
}

/**
 * 📱 Stateful WhatsApp Webhook
 */
router.post('/', async (req, res) => {
    const twiml = new MessagingResponse();
    res.set('Content-Type', 'text/xml');

    try {
        const incomingMsg = req.body.Body ? req.body.Body.trim() : "";
        const sender = req.body.From || "";
        const lat = req.body.Latitude;
        const lng = req.body.Longitude;

        // Twilio media (photos, audio, etc.)
        const numMedia = parseInt(req.body.NumMedia || "0", 10);
        const incomingMediaUrl = numMedia > 0 ? req.body.MediaUrl0 : (req.body.imageUrl || req.body.MediaUrl || null);

        console.log(`-----------------------------------------`);
        console.log(`📩 WhatsApp Message from ${sender}`);
        if (incomingMsg) console.log(`💬 Text: "${incomingMsg}"`);
        if (incomingMediaUrl) console.log(`📸 Image received: ${incomingMediaUrl}`);
        if (lat && lng) console.log(`📍 GPS Pin received: ${lat}, ${lng}`);

        let session = userSessions.get(sender) || {};

        // 0. RESET / CANCEL COMMAND
        if (/^(reset|cancel|clear|start over|restart)$/i.test(incomingMsg)) {
            userSessions.delete(sender);
            twiml.message(`🔄 *Session Reset*\n\nHow can JanSetu assist you? You can:\n• Report a civic issue by describing it\n• Check city stats (e.g. "how many complaints")\n• Type "status" to check your existing reports`);
            return res.status(200).send(twiml.toString());
        }

        // 1. STATUS / TRACK COMMAND
        if (/^(status|track|my complaints|check)$/i.test(incomingMsg)) {
            const cleanPhone = sender.replace('whatsapp:', '');
            const user = await User.findOne({ phoneNumber: cleanPhone });
            if (!user) {
                twiml.message(`ℹ️ No reports found registered for your phone number yet.\n\nTo report a new issue, simply type a description of the problem.`);
                return res.status(200).send(twiml.toString());
            }

            const myComplaints = await Complaint.find({ userId: user._id }).sort({ createdAt: -1 }).limit(3);
            if (!myComplaints.length) {
                twiml.message(`ℹ️ You have no active civic reports.\n\nTo file a new grievance, simply type a description of the problem.`);
                return res.status(200).send(twiml.toString());
            }

            const frontendUrl = (process.env.FRONTEND_URL || 'https://hacktofuture4-i10.vercel.app').replace(/\/$/, '');
            let replyText = `📋 *Your Recent Civic Reports:*\n`;
            myComplaints.forEach((c, idx) => {
                const id = c._id.toString().slice(-6);
                replyText += `\n*${idx + 1}. #${id}*: ${c.title}\n   Status: *${c.status}* | Dept: ${c.department}\n`;
            });
            replyText += `\n🌐 *Full Dashboard & Rewards:*\n${frontendUrl}/citizen`;
            twiml.message(replyText);
            return res.status(200).send(twiml.toString());
        }

        // 2. USER ATTACHES AN EVIDENCE PHOTO 📸
        if (incomingMediaUrl) {
            const accessibleUrl = await processWhatsAppMedia(incomingMediaUrl);
            session.imageUrl = accessibleUrl;

            // If user also attached a text caption with the photo
            if (incomingMsg && incomingMsg.length > 3 && !session.title) {
                session.title = incomingMsg;
            }

            userSessions.set(sender, session);

            // If both title and GPS are now ready, submit!
            if (session.title && (lat || session.lat) && (lng || session.lng)) {
                const finalLat = lat || session.lat;
                const finalLng = lng || session.lng;
                const confirmation = await submitComplaint({
                    sender,
                    title: session.title,
                    lat: finalLat,
                    lng: finalLng,
                    imageUrl: session.imageUrl
                });
                twiml.message(confirmation);
                return res.status(200).send(twiml.toString());
            }

            if (!session.title) {
                twiml.message(`📸 *Photo Evidence Received!*\n\n📝 What is the issue? Please type a brief description of the problem.`);
                return res.status(200).send(twiml.toString());
            }

            if (!lat && !session.lat) {
                twiml.message(`📸 *Photo Evidence Attached!*\n\n📍 Final Step: Please share your *GPS Location pin* (tap 📎 ➔ *Location* ➔ *Send Current Location*) to complete the report.`);
                return res.status(200).send(twiml.toString());
            }
        }

        // 3. USER SAYS 'SKIP' FOR PHOTO ⏭️
        if (/^(skip|no photo|none|no)$/i.test(incomingMsg) && session.title) {
            if (session.lat && session.lng) {
                const confirmation = await submitComplaint({
                    sender,
                    title: session.title,
                    lat: session.lat,
                    lng: session.lng,
                    imageUrl: null
                });
                twiml.message(confirmation);
                return res.status(200).send(twiml.toString());
            } else {
                twiml.message(`Got it! 👍\n\n📍 Now please share your *GPS Location pin* (tap 📎 ➔ *Location* ➔ *Send Current Location*) to finish submitting.`);
                return res.status(200).send(twiml.toString());
            }
        }

        // 4. USER SHARES LOCATION PIN 📍
        if (lat && lng) {
            session.lat = lat;
            session.lng = lng;
            userSessions.set(sender, session);

            if (session.title) {
                // We have everything needed to submit!
                const confirmation = await submitComplaint({
                    sender,
                    title: session.title,
                    lat,
                    lng,
                    imageUrl: session.imageUrl || null
                });
                twiml.message(confirmation);
                return res.status(200).send(twiml.toString());
            } else {
                twiml.message(`📍 *Location Pin Received!*\n\nWhat is the problem? 🧐 Please type your complaint description.`);
                return res.status(200).send(twiml.toString());
            }
        }

        // 5. USER SENDS COMPLAINT TEXT 📝
        if (incomingMsg.length > 5) {
            // Check if user already provided GPS location earlier
            if (session.lat && session.lng) {
                session.title = incomingMsg;
                const confirmation = await submitComplaint({
                    sender,
                    title: incomingMsg,
                    lat: session.lat,
                    lng: session.lng,
                    imageUrl: session.imageUrl || null
                });
                twiml.message(confirmation);
                return res.status(200).send(twiml.toString());
            }

            session.title = incomingMsg;
            userSessions.set(sender, session);

            twiml.message(`I've noted your report:\n*"${incomingMsg}"*\n\n📸 *Step 1/2:* Please send a *Photo of the issue* as evidence (or reply *'skip'*).\n\n📍 *Step 2/2:* Share your *GPS Location pin* (tap 📎 ➔ *Location* ➔ *Send Current Location*).`);
            return res.status(200).send(twiml.toString());
        }

        // 6. GREETINGS & GENERAL INQUIRIES (e.g. "hi", stats)
        const aiReply = await processChatMessage(incomingMsg, sender);
        twiml.message(aiReply);
        return res.status(200).send(twiml.toString());

    } catch (error) {
        console.error("💥 WhatsApp Flow Error:", error.message);
        twiml.message("JanSetu AI received your message. Please share the details or type 'reset' to start over.");
        return res.status(200).send(twiml.toString());
    }
});

module.exports = router;
