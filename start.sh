#!/bin/sh

# Instala as dependências
npm install

# Gera o Prisma Client
npx prisma generate

# Aguarda o banco de dados (caso precise de espera)
npx prisma migrate deploy

# Inicia a aplicação
npm run dev
