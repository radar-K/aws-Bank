# Använder en officiell Node.js-bild baserad på Alpine Linux, som är en lättviktsdistribution
FROM node:alpine  
WORKDIR /app  
COPY package*.json ./ 
RUN npm install  
COPY . .  
EXPOSE 3001  
CMD ["npm", "start"]  

