FROM node:20

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 3000

RUN npx prisma generate

ENV FASTIFY_PORT=3000
ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/shopperdatabase?schema=public"

RUN npx prisma migrate

CMD pnpm start
