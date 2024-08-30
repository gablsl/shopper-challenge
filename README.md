# Shopper Challenge

## 🛠️ Tecnologias

-   NodeJS, TypeScript, Fastify, Prisma, Docker, dotenv

## 📦 Como rodar o projeto?

1. Crie um arquivo docker-compose.yml

    ```bash
    version: '3.0'

    services:
        postgres:
            image: gabrielsousadeveloper/postgres-shopper-database:1.0.0
            environment:
                POSTGRES_USER: postgres
                POSTGRES_PASSWORD: postgres
                POSTGRES_DB: postgres
            volumes:
                - postgres_data:/var/lib/postgresql/data
            ports:
                - '5432:5432'

        app:
            image: gabrielsousadeveloper/shopper-app:1.0.0
            ports:
                - '3000:3000'
            environment:
                GEMINI_API_KEY: ${GEMINI_API_KEY}
                FASTIFY_PORT: 3000
                DATABASE_URL: 'postgresql://postgres:postgres@postgres:5432/shopperdatabase?schema=public'
            command: sh -c 'npx prisma generate && npx prisma migrate dev --name init && npm run start'
            depends_on:
                - postgres

    volumes:
        postgres_data:

    networks:
        app-network:

    ```

2. Crie um arquivo .env e coloque a sua GEMINI_API_KEY:

    ```bash
    GEMINI_API_KEY="SUA GEMINI API KEY"
    ```

    ** Se preferir você pode colocar a sua api_key diretamente no docker-compose.yml
   
2. Inicie o docker

    ```bash
    docker-compose up
    ```

## **Como resolver possíveis erros**

1. Deu algum problema no docker-compose?
   
   Se o docker compose estiver dando erro, apenas corrijá a indentação do mesmo.
   
2. Projeto não rodou?

    As vezes quando você rodar o docker-compose up o projeto rodará apenas o banco de dados, então basta você iniciar o shopper-app no container que dará tudo certo!

Developed with ❤️ Gabriel
