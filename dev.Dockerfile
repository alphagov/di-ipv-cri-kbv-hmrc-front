FROM --platform="linux/arm64" arm64v8/node@sha256:b16c4e21f9e9e4d02c226d7b2dde3283fc9315104b66009af546b50f5c7acad4 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY /src ./src
RUN npm run build

RUN npm prune

FROM --platform="linux/arm64" arm64v8/node@sha256:b16c4e21f9e9e4d02c226d7b2dde3283fc9315104b66009af546b50f5c7acad4 AS final

RUN ["apt-get", "update"]
RUN ["apt-get", "install", "-y", "tini"]

WORKDIR /app

# Copy in compile assets and deps from build container
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/src ./src

# Add in dynatrace layer
COPY --from=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs / /
ENV LD_PRELOAD /opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so


ENV PORT 8080
EXPOSE $PORT

ENTRYPOINT ["tini", "--"]

CMD ["npm", "start"]
