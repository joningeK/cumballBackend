# cumballBackend

Enkel backend, bygget med Azure Functions (Node.js + TypeScript)  
og Azure Table Storage

Et enkelt REST-API for CRUD-operasjoner:
- Azure Functions (v4)
- Node.js (18+ anbefalt)
- TypeScript
- Azure Table Storage
- Azure Functions Core Tools

---

## Før du starter må du ha installert:

- Node.js (18 LTS eller nyere)
- Azure Functions Core Tools v4
- Azure CLI (`az`)
- En Azure-konto med:
  - Function App
  - Storage Account

---

## Kjøre backend lokalt

### 1. Installer dependencies / konfigurasjon

```bash
npm install

Opprett eller rediger local.settings.json i root av prosjektet:
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


#Logg inn Azure:
az login


#Bygg med:
npm run build
