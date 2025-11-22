#JustBook SERVICE
FROM node:20
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build && npx prisma generate
EXPOSE 10000
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]


