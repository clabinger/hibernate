import fs from 'fs';
import functions from '@google-cloud/functions-framework';
import Firestore from '@google-cloud/firestore';

const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

const config = loadJSON('./config.json');
const db = new Firestore();

functions.http('setHibernateFlag', async (req, res) => {
  // Write the current time to the firestore database

  // Must have correct token to set the flag
  if (req.body.token !== config.token) {
    return res.send('Correct token not provided');
  }

  await db.collection('main').doc(req.body.computerId).set({
    time: Firestore.FieldValue.serverTimestamp(),
  });

  return res.send('OK');
});

functions.http('readHibernateFlag', async (req, res) => {
  // Return true if the flag time stored in the database is within the last 5 minutes

  const doc = await db.collection('main').doc(req.body.computerId).get();
  const flagTime = new Date(doc.data().time.toMillis());
  const currentTime = new Date();
  const threshold = 1000 * 60 * 5; // 5 minutes, in milliseconds

  res.send(currentTime - flagTime < threshold);
});
