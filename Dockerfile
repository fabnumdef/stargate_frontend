FROM node:14 AS base
ADD . /app
WORKDIR /app

FROM base as prod-install
WORKDIR /app
RUN npm ci --only=production

FROM base as prod-build
WORKDIR /app
COPY --from=prod-install /app/node_modules /app/node_modules
RUN npm ci
RUN npm run build

FROM gcr.io/distroless/nodejs:14
WORKDIR /app
COPY --from=base /app /app
COPY --from=prod-install /app/node_modules /app/node_modules
COPY --from=prod-build /app/.next /app/.next

EXPOSE 3000
EXPOSE 9091
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

CMD [ "server/index.js" ]
