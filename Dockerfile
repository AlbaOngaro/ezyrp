FROM oven/bun:1-alpine as base
ARG NPM_TOKEN
ENV NPM_TOKEN=${NPM_TOKEN}
WORKDIR /usr/src/app

COPY package.json bun.lockb bunfig.toml ./
# --ingore-scripts ingores the postinstall script to install husky hooks
RUN bun install --ignore-scripts --frozen-lockfile

COPY . .

RUN bunx convex deploy --preview-create $COOLIFY_BRANCH --cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL --cmd \"bun run build\"

EXPOSE 3000
ENV PORT 3000

CMD ["bun run start"]
