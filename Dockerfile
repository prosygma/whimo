FROM node:20-alpine AS builder
WORKDIR /app

# Declare build arguments
ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_BASE_URL

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build with environment variables
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}
ENV VITE_BASE_URL=${VITE_BASE_URL}

RUN npm run build

# Stage 2: Prepare output
FROM scratch AS export
COPY --from=builder /app/dist /dist