# --- frontend ---
FROM node:18 AS frontend

WORKDIR /app
COPY Frontend/package*.json ./
RUN npm install
COPY Frontend .
RUN npm run build

# --- backend + frontend ---
FROM node:18

WORKDIR /usr/src/app

COPY Backend/package*.json ./
RUN npm install

COPY Backend .

COPY --from=frontend /app/dist ./public

CMD ["node", "index.js"]
