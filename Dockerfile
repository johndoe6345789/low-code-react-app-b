FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and workspace packages for dependency installation
COPY package*.json ./
COPY packages/spark/package.json ./packages/spark/package.json
COPY packages/spark/src ./packages/spark/src

# Install dependencies
# Note: npm ci doesn't work reliably with workspace: protocol, so we use npm install  
RUN npm install

# Copy remaining application files
COPY . .

# Build the application
RUN npm run build

FROM nginx:alpine AS runtime

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
