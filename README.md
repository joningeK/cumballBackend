# cumballBackend  

To run:
npm run start



First time setup requires you to modify local.settings.json

{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": [your secret azure key]
  },

    "Host": {
    "CORS": "http://localhost:3001",
    "CORSCredentials": false
  }
}

