# Stage 1 — build
FROM node:18-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json* yarn.lock* ./
RUN npm install  

COPY . .
RUN npm run build

# Stage 2 — runtime
FROM node:18-alpine AS runtime
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --production

COPY --from=builder /app/dist ./dist
EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]

