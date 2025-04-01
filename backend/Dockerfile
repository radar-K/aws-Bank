# Använder en officiell Node.js-bild baserad på Alpine Linux, som är en lättviktsdistribution
# FROM node:alpine  
# WORKDIR /usr/src/app  
# COPY package*.json ./ 
# RUN npm install  
# COPY . .  
# EXPOSE 3000  
# CMD ["npm", "server.js"]  

# Använder en officiell Node.js-bild baserad på Alpine Linux, som är en lättviktsdistribution
FROM node:alpine  
WORKDIR /usr/src/app  
COPY package*.json ./ 
RUN npm install  
COPY . .  
EXPOSE 3000  
CMD ["npm", "start"]

# Eller kör direkt med node om du inte har start i package.json
# CMD ["node", "server.js"]
