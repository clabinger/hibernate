const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.setHibernateFlag = functions.https.onRequest(async (request, response) => {
  // Write the current time to the firestore database

  // Must have correct token to set the flag
  if(request.body.token !== functions.config().main.token){
    return response.send('Correct token not provided');
  }

  try{
    await db.collection('main').doc('buttonTime').set({
      time: admin.firestore.Timestamp.fromDate(new Date())
    });
    return response.send('OK');
  } catch (error) {
    return response.send('Could not write to database');
  }
});

exports.readHibernateFlag = functions.https.onRequest(async (request, response) => {
  // Return true if the flag time stored in the database is within the last 5 minutes

  const doc = await db.collection('main').doc('buttonTime').get();

  const flagTime = new Date(doc.data().time._seconds * 1000);
  const currentTime = new Date();

  const threshold = 1000 * 60 * 5 // 5 minutes, in milliseconds

  response.send(currentTime - flagTime < threshold);
});

