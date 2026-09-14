# Runtime-only image: no compile step. tsx (a runtime dependency, not just a
# dev tool here — see package.json) runs the TypeScript source directly,
# because tsc's emitted output currently doesn't run under plain `node`
# (Prisma Next's generated `./contract.d` import assumes bundler-style module
# resolution, which is incompatible with Node's native ESM resolver). See
# MIGRATIONS.md for the reasoning if that ever gets revisited.
FROM node:22-alpine

WORKDIR /app

# Installed separately from the source copy so this layer only rebuilds when
# dependencies actually change.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY tsconfig.json ./
COPY src ./src

ENV NODE_ENV=production
EXPOSE 4000

CMD ["npx", "tsx", "src/index.ts"]
