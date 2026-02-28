# Build stage
# For Supabase, pass VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY as build args
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
RUN npm run build

# Production stage - no source maps, no dev deps
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
# Remove any .map files if present
RUN find /usr/share/nginx/html -name "*.map" -delete
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
