# syntax=docker/dockerfile:1
# Base images pinned by digest for reproducible builds
FROM node:20-alpine@sha256:09e2b3d9726018aecf269bd35325f46bf75046a643a66d28360ec71132750ec8 AS builder
WORKDIR /app
COPY package.json npm-shrinkwrap.json .npmrc ./
RUN npm ci
COPY . .
# Secret mounts: available only during this RUN, not in history or logs
RUN --mount=type=secret,id=VITE_SUPABASE_URL \
    --mount=type=secret,id=VITE_SUPABASE_PUBLISHABLE_KEY \
    export VITE_SUPABASE_URL=$(cat /run/secrets/VITE_SUPABASE_URL) && \
    export VITE_SUPABASE_PUBLISHABLE_KEY=$(cat /run/secrets/VITE_SUPABASE_PUBLISHABLE_KEY) && \
    npm run build && \
    find /app/dist -name "*.map" -delete

# Build minimal static file server
FROM golang:1.22-alpine@sha256:1699c10032ca2582ec89a24a1312d986a3f094aed3d5c1147b19880afe40e052 AS server
WORKDIR /build
COPY go.mod ./
RUN go mod download
COPY cmd/ ./cmd/
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /server ./cmd/static-server && \
    CGO_ENABLED=0 go build -ldflags="-s -w" -o /healthcheck ./cmd/healthcheck

# Production: distroless + minimal static server
FROM gcr.io/distroless/static:nonroot@sha256:f512d819b8f109f2375e8b51d8cfd8aafe81034bc3e319740128b7d7f70d5036
COPY --from=server /server /server
COPY --from=server /healthcheck /healthcheck
COPY --from=builder /app/dist /srv
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ["/healthcheck"]
ENTRYPOINT ["/server"]
