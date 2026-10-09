const mongoose = require('mongoose');
require('dotenv').config();
const Complaint = require('./models/Complaint');
const User = require('./models/User');

const seedComplaints = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-city-complaints');
    console.log('Connected to MongoDB');

    let citizen = await User.findOne({ role: 'citizen' });
    if (!citizen) {
      citizen = await User.findOne({});
    }

    const demoComplaints = [
      {
        title: "Overflowing Garbage Container and Plastic Debris",
        text: "Municipal garbage bin on 7th Cross Market Road is overflowing on the pedestrian pathway since 3 days. Severe odor and stray dogs causing safety issues.",
        imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
        location: "7th Cross Market Road, Ward 14, Central Zone",
        lat: 15.3647,
        lng: 75.1240,
        userId: citizen._id,
        category: "Sanitation",
        department: "Sanitation",
        priority: "High",
        priorityScore: 3,
        severity: "High",
        status: "Resolved",
        resolutionImageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
        resolutionNote: "Sanitation squad dispatched with compactor truck #KA25-8812. Debris cleared, area disinfected with bleaching powder.",
        resolvedAt: new Date(Date.now() - 3600000 * 5),
        verificationStatus: "Verified",
        verificationScore: 94,
        verificationVerdict: "Clean pathway confirmed. 94% visual restoration.",
        deadline: new Date(Date.now() + 86400000)
      },
      {
        title: "Drinking Water Pipeline Rupture Flooding Roadway",
        text: "Main feeder pipe under 4th Cross junction ruptured this morning. High pressure clean drinking water is being wasted and flooding nearby shops.",
        imageUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
        location: "4th Cross Junction, Indira Nagar, Ward 9",
        lat: 15.3522,
        lng: 75.1380,
        userId: citizen._id,
        category: "Water Supply",
        department: "Water Supply",
        priority: "High",
        priorityScore: 3,
        severity: "High",
        status: "In Progress",
        deadline: new Date(Date.now() + 3600000 * 8)
      },
      {
        title: "Deep Hazardous Pothole Near Primary School Gate",
        text: "A 2-foot deep pothole has developed right in front of National Public School gate. Two two-wheelers skidded yesterday during morning drop-off.",
        imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
        location: "Station Road, Near NPS School, Ward 22",
        lat: 15.3411,
        lng: 75.1492,
        userId: citizen._id,
        category: "Roads & Footpaths",
        department: "Public Works",
        priority: "High",
        priorityScore: 3,
        severity: "High",
        status: "Resolved",
        resolutionImageUrl: "https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=800&q=80",
        resolutionNote: "PWD road repair squad laid asphalt cold-mix patch and rolled. Road restored to smooth riding quality.",
        resolvedAt: new Date(Date.now() - 3600000 * 12),
        verificationStatus: "Verified",
        verificationScore: 91,
        verificationVerdict: "Pothole filled and sealed completely. Road surface leveled.",
        deadline: new Date(Date.now() + 86400000)
      },
      {
        title: "High-Voltage Streetlight Pole Sparking in Rains",
        text: "Streetlight pole #EB-442 is sparking and buzzing loudly whenever drizzle starts. Children play nearby and loose ground wire is exposed.",
        imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
        location: "Ashok Nagar 3rd Main, Pole #EB-442, Ward 11",
        lat: 15.3705,
        lng: 75.1121,
        userId: citizen._id,
        category: "Electricity",
        department: "Electric Board",
        priority: "High",
        priorityScore: 3,
        severity: "High",
        status: "In Progress",
        deadline: new Date(Date.now() + 3600000 * 4)
      },
      {
        title: "Traffic Signal Failure Causing Major Peak Hour Jam",
        text: "Automated 4-way signal at Court Circle is completely dark. Vehicles converging from all 4 directions with no traffic warden present.",
        imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&w=800&q=80",
        location: "Court Circle Signal Junction, Ward 3",
        lat: 15.3589,
        lng: 75.1325,
        userId: citizen._id,
        category: "Traffic & Law",
        department: "Police",
        priority: "Medium",
        priorityScore: 2,
        severity: "Medium",
        status: "Resolved",
        resolutionImageUrl: "https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=800&q=80",
        resolutionNote: "Signal controller board rebooted and UPS battery swapped. Traffic police squad deployed during reset.",
        resolvedAt: new Date(Date.now() - 3600000 * 2),
        verificationStatus: "Verified",
        verificationScore: 88,
        verificationVerdict: "Signal operational and traffic flow normalized.",
        deadline: new Date(Date.now() + 3600000 * 18)
      },
      {
        title: "Blocked Storm Water Drain Causing Stagnant Sewage",
        text: "Pre-monsoon storm drain clogged with construction silt and debris. Foul water accumulating outside residential apartments.",
        imageUrl: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80",
        location: "Kuvempu Nagar 2nd Stage, Ward 17",
        lat: 15.3490,
        lng: 75.1410,
        userId: citizen._id,
        category: "Drainage",
        department: "Sanitation",
        priority: "Medium",
        priorityScore: 2,
        severity: "Medium",
        status: "Pending",
        deadline: new Date(Date.now() + 86400000 * 2)
      },
      {
        title: "Low Pressure Water Supply in Residential Layout",
        text: "Entire 5th block has received only trickling water supply for the past 4 days. Borewell valve suspected to be choked.",
        imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80",
        location: "Vivekananda Nagar, Block 5, Ward 8",
        lat: 15.3620,
        lng: 75.1290,
        userId: citizen._id,
        category: "Water Supply",
        department: "Water Supply",
        priority: "Medium",
        priorityScore: 2,
        severity: "Medium",
        status: "Pending",
        deadline: new Date(Date.now() + 86400000 * 3)
      },
      {
        title: "Encroached Footpath by Construction Materials",
        text: "Heavy gravel, granite slabs, and cement bags dumped on the walking pavement, forcing elderly and pedestrians onto active motor traffic.",
        imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
        location: "Commercial Axis Road, Ward 5",
        lat: 15.3550,
        lng: 75.1350,
        userId: citizen._id,
        category: "Encroachment",
        department: "General",
        priority: "Low",
        priorityScore: 1,
        severity: "Low",
        status: "Pending",
        deadline: new Date(Date.now() + 86400000 * 4)
      }
    ];

    for (const item of demoComplaints) {
      const existing = await Complaint.findOne({ title: item.title });
      if (!existing) {
        await Complaint.create(item);
        console.log(`+ Created complaint: "${item.title}" [${item.department}]`);
      } else {
        console.log(`. Complaint exists: "${item.title}"`);
      }
    }

    console.log('✅ Complaints seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding complaints:', err);
    process.exit(1);
  }
};

seedComplaints();
