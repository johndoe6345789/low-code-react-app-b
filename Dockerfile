FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY packages/spark-tools ./packages/spark-tools
COPY packages/spark ./packages/spark

RUN npm ci --include=optional --omit=dev

COPY . .

RUN npm run build

EXPOSE 80

ENV PORT=80

CMD ["npm", "run", "preview"]
