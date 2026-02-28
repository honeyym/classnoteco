# syntax=docker/dockerfile:1
# Build stage - uses BuildKit secrets; values never stored in image layers
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json npm-shrinkwrap.json ./
RUN npm ci
COPY . .
# Secret mounts: available only during this RUN, not in history or logs
RUN --mount=type=secret,id=VITE_SUPABASE_URL \
    --mount=type=secret,id=VITE_SUPABASE_PUBLISHABLE_KEY \
    export VITE_SUPABASE_URL=$(cat /run/secrets/VITE_SUPABASE_URL) && \
    export VITE_SUPABASE_PUBLISHABLE_KEY=$(cat /run/secrets/VITE_SUPABASE_PUBLISHABLE_KEY) && \
    npm run build

# Production stage - no source maps, no dev deps
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
# Remove any .map files if present
RUN find /usr/share/nginx/html -name "*.map" -delete
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
