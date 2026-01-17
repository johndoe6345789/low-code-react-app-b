FROM node:20-alpine AS builder

WORKDIR /app

# Copy all files including workspace packages to support npm workspaces
COPY . .

# Install dependencies
# Note: npm ci doesn't work with workspace: protocol, so we use npm install
RUN npm install

# Build the application
RUN npm run build

FROM nginx:alpine AS runtime

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
