# Step 1: Build Vite app
FROM node:20 AS build

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY package*.json ./
RUN npm install

# Accept build arg for Vite env var
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

COPY . .

RUN npm run build

# Step 2: Serve with lightweight Node.js static server
FROM node:20-slim

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built frontend
COPY --from=build /app/dist ./dist

# Expose production port (match dev port for consistency)
EXPOSE 5174

# Run static server
CMD ["serve", "-s", "dist", "-l", "5174"]