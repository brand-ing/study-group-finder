const admin = require('firebase-admin');
const serviceAccount = require('../../scripts/study-group-finder-833f3-firebase-adminsdk-o31ch-14cb13f121.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addMajors() {
  const majors = [
    {
        "name": "Computer Science",
        "department": "Engineering",
        "code": "CS",
        "description": "The study of computation and information."
      },
      {
        "name": "Biology",
        "department": "Science",
        "code": "BIO",
        "description": "The study of living organisms."
      },
      {
        "name": "Chemistry",
        "department": "Science",
        "code": "CHEM",
        "description": "The study of substances and their interactions."
      },
      {
        "name": "Physics",
        "department": "Science",
        "code": "PHYS",
        "description": "The study of matter, energy, and the fundamental forces of nature."
      },
      {
        "name": "Mechanical Engineering",
        "department": "Engineering",
        "code": "ME",
        "description": "The design and manufacturing of mechanical systems."
      },
      {
        "name": "Civil Engineering",
        "department": "Engineering",
        "code": "CE",
        "description": "The design and construction of infrastructure projects."
      },
      {
        "name": "Psychology",
        "department": "Social Sciences",
        "code": "PSY",
        "description": "The study of human behavior and mental processes."
      },
      {
        "name": "Business Administration",
        "department": "Business",
        "code": "BA",
        "description": "The study of management and organizational operations."
      },
      {
        "name": "Nursing",
        "department": "Medicine and Health Sciences",
        "code": "NUR",
        "description": "The practice of caring for individuals and communities."
      },
      {
        "name": "Fine Arts",
        "department": "Arts and Humanities",
        "code": "FA",
        "description": "The creation and study of visual and performing arts."
      }
  ];

  const batch = db.batch();
  majors.forEach((major) => {
    const majorRef = db.collection('Majors').doc(major.name.replace(/\s+/g, ''));
    batch.set(majorRef, major);
  });

  await batch.commit();
  console.log('Majors added!');
}

addMajors();
