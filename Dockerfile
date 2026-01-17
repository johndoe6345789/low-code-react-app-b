FROM node:lts-alpine AS builder

WORKDIR /app

COPY package*.json ./

COPY packages/spark-tools ./packages/spark-tools
COPY packages/spark ./packages/spark

RUN npm ci --include=optional

COPY . .

RUN npm run build

FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY packages/spark-tools ./packages/spark-tools
COPY packages/spark ./packages/spark

RUN npm ci --include=optional --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 80

ENV PORT=80

CMD ["npm", "run", "preview"]
