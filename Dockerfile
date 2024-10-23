FROM node:20-alpine

WORKDIR /app

RUN npm install -g pm2

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production --silent

COPY . .

RUN adduser -D -u 501 appuser -G dialout

RUN chown -R appuser:dialout /app

USER appuser

CMD ["sh", "-c", "npx sequelize-cli db:migrate --env production && npm run start"]
