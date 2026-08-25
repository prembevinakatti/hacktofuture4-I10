const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const axios = require('axios');
const FormData = require('form-data');
const { handleVoiceTurn } = require('../services/voiceService');

const VoiceResponse = twilio.twiml.VoiceResponse;

/**
 * Helper to resolve the active public URL (ngrok or env)
 */
const getPublicUrl = async () => {
  if (process.env.PUBLIC_URL && !process.env.PUBLIC_URL.includes('loca.lt')) {
    return process.env.PUBLIC_URL.replace(/\/$/, '');
  }
  try {
    const ngrokRes = await axios.get('http://127.0.0.1:4040/api/tunnels', { timeout: 1500 });
    const httpsTunnel = ngrokRes.data?.tunnels?.find(t => t.proto === 'https');
    if (httpsTunnel && httpsTunnel.public_url) {
      return httpsTunnel.public_url.replace(/\/$/, '');
    }
  } catch (e) {
    // Ngrok not running on port 4040
  }
  return (process.env.PUBLIC_URL || 'http://localhost:5000').replace(/\/$/, '');
};

/**
 * 📞 Inbound Phone Call Webhook (Twilio Voice)
 * Triggered when a citizen dials the JanSetu helpline number
 */
router.post('/incoming', async (req, res) => {
  try {
    const caller = req.body.From || "Unknown Caller";
    const callSid = req.body.CallSid || `call_${Date.now()}`;
    console.log(`\n📞 [INCOMING CALL] Call from: ${caller} (SID: ${callSid})`);

    const twiml = new VoiceResponse();

    const gather = twiml.gather({
      input: 'speech',
      action: '/api/voice/process',
      method: 'POST',
      timeout: 5,
      speechTimeout: 'auto',
      language: 'en-IN'
    });

    gather.say(
      { voice: 'Polly.Aditi', language: 'en-IN' },
      'Namaste! Welcome to JanSetu Smart City Grievance Helpline. Please describe the civic issue you are facing and mention the location or landmark.'
    );

    // If caller doesn't speak during the initial gather
    twiml.say(
      { voice: 'Polly.Aditi', language: 'en-IN' },
      'We did not hear any response. Please call back anytime to report an issue. Thank you.'
    );
    twiml.hangup();

    res.type('text/xml');
    res.status(200).send(twiml.toString());
  } catch (error) {
    console.error('💥 Voice Incoming Error:', error.message);
    const twiml = new VoiceResponse();
    twiml.say('The JanSetu voice system is temporarily unavailable. Please try again later.');
    twiml.hangup();
    res.type('text/xml');
    res.status(200).send(twiml.toString());
  }
});

/**
 * 🎙️ Voice Processing Turn (Twilio Voice Gather Webhook)
 * Processes citizen speech transcribed by Twilio, queries Groq AI, and speaks back
 */
router.post('/process', async (req, res) => {
  try {
    const speechResult = req.body.SpeechResult || "";
    const caller = req.body.From || "";
    const callSid = req.body.CallSid || "session_default";
    const confidence = req.body.Confidence || 1.0;

    console.log(`🎙️ [SPEECH RECOGNIZED] "${speechResult}" (Confidence: ${confidence}) from ${caller}`);

    const twiml = new VoiceResponse();

    // If speech was not detected / timed out
    if (!speechResult || speechResult.trim().length === 0) {
      const gather = twiml.gather({
        input: 'speech',
        action: '/api/voice/process',
        method: 'POST',
        timeout: 6,
        speechTimeout: 'auto',
        language: 'en-IN'
      });
      gather.say(
        { voice: 'Polly.Aditi', language: 'en-IN' },
        'I am still here. Please describe the civic issue and location so I can assist you.'
      );
      twiml.say(
        { voice: 'Polly.Aditi', language: 'en-IN' },
        'Thank you for calling JanSetu Smart City. Goodbye.'
      );
      twiml.hangup();

      res.type('text/xml');
      return res.status(200).send(twiml.toString());
    }

    // Process the turn using JanSetu Voice Engine
    const result = await handleVoiceTurn({
      sessionId: callSid,
      callerPhone: caller,
      speechResult,
      isWeb: false
    });

    if (result.isFinished) {
      // Completed registration
      twiml.say(
        { voice: 'Polly.Aditi', language: 'en-IN' },
        result.spokenReply
      );
      twiml.hangup();
    } else {
      // Need more information (e.g. location/landmark)
      const gather = twiml.gather({
        input: 'speech',
        action: '/api/voice/process',
        method: 'POST',
        timeout: 6,
        speechTimeout: 'auto',
        language: 'en-IN'
      });
      gather.say(
        { voice: 'Polly.Aditi', language: 'en-IN' },
        result.spokenReply
      );
      twiml.say(
        { voice: 'Polly.Aditi', language: 'en-IN' },
        'Thank you for contacting JanSetu. Goodbye.'
      );
      twiml.hangup();
    }

    res.type('text/xml');
    res.status(200).send(twiml.toString());
  } catch (error) {
    console.error('💥 Voice Processing Error:', error.message);
    const twiml = new VoiceResponse();
    twiml.say(
      { voice: 'Polly.Aditi', language: 'en-IN' },
      'Thank you for your report. Our municipal system is synchronizing your information.'
    );
    twiml.hangup();
    res.type('text/xml');
    res.status(200).send(twiml.toString());
  }
});

/**
 * 🌐 Web-based In-App Voice Call Endpoint
 * Used by the in-browser AI Voice Call Assistant
 */
router.post('/web-agent', async (req, res) => {
  try {
    const { message, sessionId, callerPhone } = req.body;
    const cleanSessionId = sessionId || `web_${Date.now()}`;

    const result = await handleVoiceTurn({
      sessionId: cleanSessionId,
      callerPhone: callerPhone || '+918660465213',
      speechResult: message || '',
      isWeb: true
    });

    res.status(200).json({
      success: true,
      spokenReply: result.spokenReply,
      isFinished: result.isFinished,
      complaint: result.complaint
    });
  } catch (error) {
    console.error('💥 Web Voice Agent Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process voice request',
      spokenReply: 'I am experiencing a momentary connection issue. Please try speaking again.'
    });
  }
});

/**
 * 🎙️ Direct Audio Stream Transcription & AI Turn (Universal Browser Support for Brave/Chrome/Edge/Safari)
 */
router.post('/web-agent-audio', async (req, res) => {
  try {
    const { audioBase64, mimeType, sessionId, callerPhone } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ success: false, message: 'Audio payload missing' });
    }

    const base64Data = audioBase64.replace(/^data:audio\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Transcribe with Groq Whisper
    const form = new FormData();
    form.append('file', buffer, { filename: 'recording.webm', contentType: mimeType || 'audio/webm' });
    form.append('model', 'whisper-large-v3');
    form.append('language', 'en');

    let transcribedText = '';
    try {
      const whisperRes = await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', form, {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          ...form.getHeaders()
        },
        timeout: 20000
      });
      transcribedText = whisperRes.data.text || '';
      console.log(`🎙️ [Groq Whisper STT]: "${transcribedText}"`);
    } catch (whisperErr) {
      console.error('Groq Whisper error:', whisperErr.response?.data || whisperErr.message);
    }

    if (!transcribedText || transcribedText.trim().length === 0) {
      return res.status(200).json({
        success: true,
        transcribedText: '',
        spokenReply: "I didn't hear your response clearly. Please speak again or type your complaint.",
        isFinished: false,
        complaint: null
      });
    }

    const cleanSessionId = sessionId || `web_${Date.now()}`;
    const result = await handleVoiceTurn({
      sessionId: cleanSessionId,
      callerPhone: callerPhone || '+918660465213',
      speechResult: transcribedText,
      isWeb: true
    });

    res.status(200).json({
      success: true,
      transcribedText,
      spokenReply: result.spokenReply,
      isFinished: result.isFinished,
      complaint: result.complaint
    });
  } catch (error) {
    console.error('💥 Web Voice Audio Agent Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process voice audio request',
      spokenReply: 'I am experiencing a momentary connection issue. Please try speaking again.'
    });
  }
});

/**
 * 📲 Outbound AI Call Trigger
 * Calls the citizen's phone directly so they don't have to pay international call charges
 */
router.post('/call-user', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ success: false, message: 'Phone number is required' });

    let formattedPhone = phoneNumber.trim().replace(/[\s-()]/g, '');
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.length === 10) {
        formattedPhone = '+91' + formattedPhone;
      } else {
        formattedPhone = '+' + formattedPhone;
      }
    }

    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      return res.status(500).json({ success: false, message: 'Twilio credentials not configured' });
    }

    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_NUMBER?.replace('whatsapp:', '');

    if (!twilioNumber) {
      return res.status(400).json({ 
        success: false, 
        message: 'TWILIO_PHONE_NUMBER is not set in server/.env' 
      });
    }

    const publicUrl = await getPublicUrl();

    // Construct instant TwiML so Twilio plays greeting immediately on pickup without waiting for initial webhook
    const initialTwiml = new VoiceResponse();
    const gather = initialTwiml.gather({
      input: 'speech',
      action: `${publicUrl}/api/voice/process`,
      method: 'POST',
      timeout: 5,
      speechTimeout: 'auto',
      language: 'en-IN'
    });

    gather.say(
      { voice: 'Polly.Aditi', language: 'en-IN' },
      'Namaste! Welcome to JanSetu Smart City Grievance Helpline. Please describe the civic issue you are facing and mention the location or landmark.'
    );

    initialTwiml.say(
      { voice: 'Polly.Aditi', language: 'en-IN' },
      'We did not hear any response. Please call back anytime to report an issue. Thank you.'
    );
    initialTwiml.hangup();

    const call = await twilioClient.calls.create({
      twiml: initialTwiml.toString(),
      to: formattedPhone,
      from: twilioNumber
    });

    console.log(`📲 Outbound call triggered to ${formattedPhone} from ${twilioNumber} (SID: ${call.sid})`);
    res.status(200).json({
      success: true,
      message: `Calling ${formattedPhone}... Pick up your phone to talk to JanSetu AI!`,
      callSid: call.sid
    });
  } catch (err) {
    console.error('💥 Outbound Call Error:', err.message);

    let userFriendlyMsg = err.message;
    if (err.code === 21215 || err.message?.includes('unverified') || err.message?.includes('trial')) {
      userFriendlyMsg = `Twilio Free Trial Notice: Phone number ${req.body.phoneNumber} is unverified. Please add it to "Verified Caller IDs" in your Twilio Console (Phone Numbers > Manage > Verified Caller IDs), or use the "Talk via Browser" button for instant free calling!`;
    } else if (err.code === 21211 || err.message?.includes('invalid')) {
      userFriendlyMsg = `Invalid phone number format. Please ensure country code is included (e.g. +919876543210).`;
    }

    res.status(500).json({
      success: false,
      message: userFriendlyMsg
    });
  }
});

module.exports = router;

