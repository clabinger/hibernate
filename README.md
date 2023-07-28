# hibernate

Hibernate computers with a POST request

## Overview

This app uses two cloud functions:

* __setHibernateFlag__  
  Save the current time to the Cloud Firestore database for a given computer ID.

* __readHibernateFlag__  
  Return `true` if the database time for a given computer ID is within the last 5 minutes, `false` otherwise.

The PC can fetch the `readHibernateFlag` function every 1 minute, and hibernate if it returns `true`.

## Version history

Version 2.0.0 supports multiple computers that can be independently controlled. It uses Cloud Functions and Cloud Firestore directly rather than being set up through the Firebase platform.

Version 1.0.0 supports a single computer and uses Cloud Functions and Cloud Firestore through the Firebase platform.

## Deployment

1. Create an auth token and set it in `config.json` (see `config_sample.json` for reference).

2. Deploy the cloud functions:

    ```bash
    npm install
    npm run deploy
    ```

## PC Integration

Set up a scheduled task to fetch the flag every 1 minute, and send the hibernate command if it returns `true`

Powershell example:

```powershell
$Params = @{
  Method = "Post"
  Uri = "https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/readHibernateFlag"
  Body = "computerId=computer1"
  ContentType = "application/x-www-form-urlencoded"
}

$r = Invoke-RestMethod @Params

if ($r -eq 'true') {
  shutdown.exe /h
}
```

## Trigger with POST request

```bash
curl -X POST "https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/setHibernateFlag" -H "Content-Type:application/json" --data '{"token":"YOUR_TOKEN", "computerId":"computer1"}'
```
