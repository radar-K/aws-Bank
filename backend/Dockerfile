# Använder en officiell Node.js-bild baserad på Alpine Linux, som är en lättviktsdistribution
FROM node:alpine  
WORKDIR /usr/src/app  
COPY package*.json ./ 
RUN npm install  
COPY . .  
EXPOSE 3000  
CMD ["npm", "server.js"]  

