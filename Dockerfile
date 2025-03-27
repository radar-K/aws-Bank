# Använder en officiell Node.js-bild baserad på Alpine Linux, som är en lättviktsdistribution
FROM node:alpine  

# Sätter arbetskatalogen till /app i containern
WORKDIR /app  

# Kopierar package.json och package-lock.json till arbetskatalogen
# Detta görs för att dra nytta av Docker-cache vid installation av beroenden
COPY package*.json /app/  

# Installerar alla beroenden som specificeras i package.json
RUN npm install  

# Kopierar hela projektets innehåll från värddatorn till containerns /app-katalog
COPY . .  

# Bygger applikationen, vilket skapar en produktionsklar version i exempelvis /build-mappen (om det är en React/Vue/Next.js-app)
RUN npm run build  

# Exponerar port 3000 så att applikationen kan nås utanför containern
EXPOSE 3000  

# Anger vilket kommando som ska köras när containern startas
CMD ["npm", "start"]  
