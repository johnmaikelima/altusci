FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/
COPY client/public ./client/public
COPY client/src ./client/src
COPY client/setupProxy.js ./client/

RUN npm install --legacy-peer-deps --no-audit && \
    cd client && \
    npm install --legacy-peer-deps --no-audit && \
    npm run build && \
    cd ..

COPY . .

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server.js"]
