# frontend/Dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# For Vite/React
RUN npm run build

# Serve via nginx
FROM nginx:1.27-alpine
# Copy our nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy build output (dist for Vite; build for CRA)
COPY --from=build /app/dist /usr/share/nginx/html
# Healthcheck for nginx
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1
EXPOSE 80
