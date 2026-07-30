# FACIS Issuer Platform Demo

Eine kleine, deploybare Referenzanwendung für den FACIS Credential-Issuance-Flow. Die Startseite visualisiert das Zusammenspiel von Go-/Goa-Services, gRPC mit mTLS, NATS und der OID4VCI-Schnittstelle. Über **Issuance starten** lässt sich eine simulierte Pipeline bis zum Credential Offer ausführen.

> Die Anwendung ist eine UI- und Architektur-Demo. Der enthaltene API-Endpunkt simuliert die Backend-Schritte und stellt weder echte Credentials noch Signaturen aus.

##  Setup

### 1. Clone the repository

```bash
git clone https://github.com/GreenEarthX/geomap-gex.git
cd geomap-gex
```
### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server
```bash
npm run dev
```
Then visit: http://localhost:3000

## Production build

```bash
npm run build
npm start
```

Die Anwendung kann ohne zusätzliche Umgebungsvariablen auf gängigen Next.js-Plattformen oder als Node.js-Container bereitgestellt werden.

