# Production image for the Devya quote builder (quote.devya.dev and its
# quote-global / quote-gulf hosts), run on the Devya VPS behind nginx.
# Moved off Vercel 2026-09-25; the Vercel project stays for the legacy
# quote.devya-solutions.com host, whose DNS is not at Cloudflare.
#
# `npm start` wraps next in portless (local dev only), so the runner calls
# `next start` directly. No env: the app reads none at build or runtime.
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx next build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder --chown=nextjs:nodejs /app ./
USER nextjs
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
