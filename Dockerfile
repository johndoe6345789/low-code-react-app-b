FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace configuration and all package files
COPY package*.json ./

# Copy spark-tools package (the actual @github/spark implementation)
COPY packages/spark-tools ./packages/spark-tools

# Copy spark wrapper package
COPY packages/spark ./packages/spark

# Install dependencies - npm ci doesn't fully support workspace protocol in all versions
# So we use npm install which resolves workspaces correctly
RUN npm install --legacy-peer-deps

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
