import fs from 'fs';
import functions from '@google-cloud/functions-framework';
import Firestore from '@google-cloud/firestore';

const loadJSON = (path) =>
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

const config = loadJSON('./config.json');
const db = new Firestore();

functions.http('setHibernateFlag', async (req, res) => {
  // Write the current time to the firestore database

  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  if (req.body?.token !== config.token) {
    return res.status(401).send('Correct token not provided');
  }

  let docRef;

  try {
    docRef = db.collection('main').doc(req.body?.computerId);
  } catch {
    return res.status(400).send('Invalid computerId');
  }

  await docRef.set({
    time: Firestore.FieldValue.serverTimestamp(),
  });

  return res.send('OK');
});

functions.http('readHibernateFlag', async (req, res) => {
  // Return true if the flag time stored in the database is within the last 5 minutes

  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  let docRef;

  try {
    docRef = db.collection('main').doc(req.body?.computerId);
  } catch {
    return res.status(400).send('Invalid computerId');
  }

  const doc = await docRef.get();

  const flagTime = new Date(doc.data().time.toMillis());
  const currentTime = new Date();
  const threshold = 1000 * 60 * 5; // 5 minutes, in milliseconds

  res.send(currentTime - flagTime < threshold);
});
