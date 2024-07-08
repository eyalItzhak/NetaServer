FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY . .

CMD ["npm", "start"]

# Expose the port the app runs on
EXPOSE 3001