🔹 AWS → Kör Ubuntu                                  🌍 AWS (Molnplattform) 
🔹 Ubuntu → Kör en MySQL-databas                     🐧 Ubuntu (Operativsystem)
🔹 SQL → Används för att kommunicera med databasen   🗄 SQL (Databashantering) 

🚀 Slutsats: AWS är molnplattformen, Ubuntu är operativsystemet och SQL används för att hantera databasen!

🎯 rsync -avz är ett kommando som används för att kopiera eller synkronisera 
filer och kataloger mellan två platser, ofta mellan en lokal dator och en server.

📌 rsync synkar filer och kopierar bara ändringar efter första gången.
📌 scp kopierar allt varje gång, vilket kan vara långsamt vid stora filer.

Starta AWS i terminalen
- [ ] ssh -i ~/krad.pem ubuntu@ec2-13-49-18-194.eu-north-1.compute.amazonaws.com 
- [ ] rsync -avz -e “ssh -1  ~/AWS.pem” —exclude=node_modules ./todo-express ubuntu@ec2-13-49-18-194.eu-north-1.compute.amazonaws.com:/documents/ubuntu


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