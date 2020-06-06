# hibernate

Hibernate my PC with a POST request

## Overview

This app uses two cloud functions in Firebase:

* __setHibernateFlag__  
  Save the current timestamp to the Cloud Firestore database

* __readHibernateFlag__  
  Return `true` if the database timestamp is within the last 5 minutes, `false` otherwise

The PC should fetch the `readHibernateFlag` function every 1 minute, and hibernate if it returns `true`

## Deployment

    yarn install

    # Set token to prevent unauthorized writes
    firebase functions:config:set main.token="YOUR_TOKEN"
    
    yarn deploy

## PC Integration

Set up a scheduled task to fetch the flag every 1 minute, and send the hibernate command if it returns `true`

Powershell example:

    $r = Invoke-RestMethod https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/readHibernateFlag

    if ($r -eq 'true') {
      shutdown.exe /h
    }

## Trigger with POST request

    curl -X POST "https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/setHibernateFlag" -H "Content-Type:application/json" --data '{"token":"YOUR_TOKEN"}'
