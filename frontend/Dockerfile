# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package management files
COPY package*.json ./
# There's also a bun.lock, but we'll use npm via package-lock.json to ensure compatibility
RUN npm install

# Copy application source code
COPY . .

# Build the Vite application for production
RUN npm run build

# Production serve stage using Nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default Nginx configuration to support client-side routing (React Router)
RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
