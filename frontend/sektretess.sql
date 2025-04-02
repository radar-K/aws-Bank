🔹 AWS → Kör Ubuntu                                  🌍 AWS (Molnplattform) 
🔹 Ubuntu → Kör en MySQL-databas                     🐧 Ubuntu (Operativsystem)
🔹 SQL → Används för att kommunicera med databasen   🗄 SQL (Databashantering) 

🚀 Slutsats: AWS är molnplattformen, Ubuntu är operativsystemet och SQL används för att hantera databasen!

🎯 rsync -avz är ett kommando som används för att kopiera eller synkronisera 
filer och kataloger mellan två platser, ofta mellan en lokal dator och en server.

📌 rsync synkar filer och kopierar bara ändringar efter första gången.
📌 scp kopierar allt varje gång, vilket kan vara långsamt vid stora filer.

Starta AWS i terminalen
- [ ] ssh -i ~/filnamn.pem ubuntu@ec2-13-49-18-194.eu-north-1.compute.amazonaws.com
- [ ] rsync -avz -e “ssh -1  ~/filnamn.pem” —exclude=node_modules ./todo-express ubuntu@ec2-13-49-18-194.eu-north-1.compute.amazonaws.com:/documents/ubuntu


+--------------------------+
|  🖥️ Användare            |
|  (Webbläsare)            |
+-----------+--------------+
            |
            ▼
+--------------------------+
| 🌍 Nginx (EC2-server)       |   Användaren besöker webbadressen som är kopplat med EC2 
| - Serverar React (frontend) |   Användaren gör en API-förfrågan
| - Proxy till Express (API)  |   Nginx vidarebefordrar anropet till Express-backenden eller skickar react-filer
+-----------+--------------+
            |
            ▼
+--------------------------+
| 🚀 Express (Node.js API) |         Express hanterar API-anropet, tar emot förfrågan från Nginx. 
| - Hanterar API-anrop     |         som svarar och hämtar data från databasen.
| - Servar statiska React-filer |    Nginx skickar tillbaka svaret till användaren och visar resultatet på webbsidan
+-----------+--------------+
            |
            ▼
+--------------------------+
| 📦 EC2-instans (Ubuntu)  |               EC2 är själva datorn i molnet där både Nginx och Express körs.
| - Kör både frontend & backend  |         EC2-instansen kör allt i bakgrunden
| - Håller processer igång (PM2) |         Processhanteraren PM2 ser till att Express alltid är igång och startas om om den kraschar.
+--------------------------+

SAMMANFATTNING
--------------
💥  Express skickar sitt svar till Nginx.
💥  Nginx skickar det vidare till webbläsaren.
🎯  Webbläsaren tar emot datan och React uppdaterar sidan med den nya informationen.





Express
+--------------------------+
Express är ett backend-ramverk för Node.js som gör det enkelt att skapa API:er och hantera serverlogik. Det används för att hantera förfrågningar från klienten (React) och kan även servera frontend-filer.
Vi installerade Express med npm install express cors.


EC2 (Elastic Compute Cloud)
+--------------------------+
EC2 är en tjänst i AWS (Amazon Web Services) som låter dig skapa och hantera virtuella servrar i molnet. Det fungerar som en dator där du kan installera och köra din applikation.

Vi startade en EC2-instans, vilket är en virtuell server.
📌  Vi använder SSH (ssh -i your-key.pem ubuntu@your-ec2-ip) för att ansluta till servern.


SCP (Secure Copy Protocol)
+--------------------------+
SCP är ett kommando för att kopiera filer över SSH. Det används för att flytta React- och backend-filer från din lokala dator till EC2.

📌  scp -i your-key.pem -r my-react-app ubuntu@your-ec2-ip:~/my-react-app
➡️  Skicka mappen my-react-app till katalogen ~/my-react-app på EC2-servern.


Node.js
+--------------------------+
Node.js är en JavaScript-miljö som gör det möjligt att köra JavaScript-kod utanför webbläsaren. Det används ofta för att bygga backend-tjänster.

➡️ installera Node.js på EC2 med sudo apt install -y nodejs npm.
Node.js används för att köra Express-servern.


Nginx
+--------------------------+
Nginx är en webbserver och omvänd proxy. Det används för att:

Servera React-filerna (index.html och andra statiska filer).
Vidarebefordra API-anrop till backend (Express) via en proxy.

🔴  Användaren laddar webbsidan → Nginx skickar index.html och frontend startar.
🔴  Användaren klickar på "Visa användare" → Nginx ser att det är en API-förfrågan och skickar den vidare till Express-backenden.
<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>

Vi konfigurerade Nginx så att:
➡️ http://your-ec2-ip serverar React-webbplatsen.
➡️ http://your-ec2-ip/api/ skickar API-anrop till Express-backenden.


PM2
+--------------------------+
PM2 är en processhanterare för Node.js som gör att Express-servern fortsätter köra även om terminalen stängs.

➡️  installera det med npm install -g pm2.
Vi använder pm2 start server.js för att starta backenden permanent.


Proxy
+--------------------------+
En proxy är en mellanhand mellan klienten och servern. I vår setup:

Nginx fungerar som en proxy genom att skicka API-anrop till Express.
React-applikationen kan göra anrop till /api/ istället för att direkt kontakta Express-servern på port 5000.


Miljövariabler
+--------------------------+
Miljövariabler används för att lagra konfigurationer som portnummer, API-nycklar eller databasinformation.

Vi använder process.env.PORT || 5000 i Express för att kunna ändra port utan att ändra koden.


EXPRESS-ROUTE
()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()

* Express-route: (rutter) för att hantera inkommande HTTP-förfrågningar och skicka tillbaka svar. 
 En route består av en HTTP-metod (GET, POST, PUT, DELETE osv.), en URL-path och en 
 callback-funktion som körs när en matchande förfrågan tas emot.

* SKAPA en route för GET-förfrågningar till "/"
app.get('/', (req, res) => {
    res.send('Hej, välkommen till min Express-app!');
});

   app: Express-applikationen.
   METHOD: HTTP-metoden (t.ex. get, post, put, delete).
   PATH: URL-sökvägen som matchas.


// Middleware-funktioner/Route-handler har alltid tre parametrar:
// req → Innehåller all information om förfrågan (t.ex. headers, body).
// res → Används för att skicka svar till klienten.
// next() → Skickar requesten vidare till nästa middleware eller route.


* EXTRAHERA data
req.body innehåller data som skickats från klienten (t.ex. via en HTML-formulär eller API-anrop).

RES - Ett objekt som representerar HTTP-svaret från servern till klienten. 
+--------------------------+-----------------------------------------------------------+
| **Metod**                | **Beskrivning**                                            |
+--------------------------+-----------------------------------------------------------+
| **res.send()**            | Skickar ett enkelt svar, t.ex. text, HTML eller objekt.   |
| **Exempel:**              | res.send("Hej världen!")                                  |
+--------------------------+-----------------------------------------------------------+
| **res.json()**            | Skickar JSON-data till klienten.                          |
| **Exempel:**              | res.json({ name: "Alice", age: 25 })                      |
+--------------------------+-----------------------------------------------------------+
| **res.status()**          | Sätter HTTP-statuskod.                                    |
| **Exempel:**              | res.status(404).send("Not Found")                         |
+--------------------------+-----------------------------------------------------------+
| **res.cookie()**          | Sätter en cookie i webbläsaren.                           |
| **Exempel:**              | res.cookie("user", "Alice")                               |
+--------------------------+-----------------------------------------------------------+


Vad är JWT-token och OAuth-baserad API-autentisering?
< --------------------------------------------------- >
🔹 JWT (JSON Web Token) – En säker metod för att skicka användarinformation
JWT är en kompakt och säker token som används för att identifiera användare och skicka data mellan klient och server.
Den är signerad (oftast med HMAC eller RSA) vilket gör att den inte kan ändras av någon annan än den som skapat den.
Hur fungerar JWT?

1. En användare loggar in (t.ex. via Shopify).
2. Servern skapar en JWT-token som innehåller användar-ID och annan relevant data.
3. Tokenen skickas tillbaka till klienten (PWA:n eller en extern tjänst).
4. Klienten lagrar tokenen (i localStorage eller cookies).
5. Vid framtida API-anrop skickas tokenen i Authorization-headern.
6. Servern verifierar tokenen och hämtar användarinformation utan att behöva slå upp databasen varje gång.

✅ Snabb och säker autentisering
✅ Behöver ingen session på servern (stateless)
✅ Enkel att använda mellan olika tjänster

✅ PWA anpassar sig till skärmar, kan installeras som en app,
 fungerar offline (via Service Workers), skickar pushnotiser,
 laddar snabbare (caching) och lagrar data lokalt.

OAuth-baserad API-autentisering – Standard för säker inloggning
OAuth är ett autentiseringsprotokoll som används för att ge en tredjepartsapplikation (t.ex. en PWA) säker åtkomst till en användares data utan att dela lösenord.

🔹 Hur fungerar OAuth?
1. Användaren loggar in via Shopify (eller en annan OAuth-leverantör som Google, Facebook).
2. Shopify genererar en "Auth Code" och skickar den till den externa PWA:n.
3. PWA:n skickar Auth Code till Shopify API och byter den mot en "Access Token".
4. PWA:n använder Access Token för att hämta användardata och göra API-anrop.

OAuth 🔹 Ge tredjepartsappar åtkomst () JWT 🔹 Autentisering mellan klient och server
Token-typ 🔹 Access Token + Refresh Token () Endast en token

✅ WebGL (Web Graphics Library) - äldre
✅ WebGPU (Web Graphics Processing Unit) - nyare


