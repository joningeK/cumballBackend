# cumballBackend

Enkel backend, bygget med Azure Functions (Node.js + TypeScript)  
og Azure Table Storage

Et enkelt REST-API for CRUD-operasjoner:
- Azure Functions (v4)
- Node.js
- TypeScript
- Azure Table Storage
- Azure Functions Core Tools

---

## Før du starter må du ha installert:

- Node.js (18 LTS eller nyere)
- Azure Functions Core Tools v4
- Azure CLI (`az`)
- En AzureWebJobsStorage nøkkel

---

## Kjøre backend lokalt

### 1. Installer dependencies / konfigurasjon


npm install

Opprett eller rediger `local.settings.json` i root av prosjektet:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "<PUT YOUR AZURE STORAGE CONNECTION STRING HERE>"
  },
  "Host": {
    "CORS": "http://localhost:3001",
    "CORSCredentials": false
  }
}
```



#Logg inn Azure:
```bash
az login
```

#Bygg med:
```bash
npm run build
```

#Start lokal:
```bash
func start
```

#Deploy
```bash
func azure functionapp publish CumballBackEnd
```
