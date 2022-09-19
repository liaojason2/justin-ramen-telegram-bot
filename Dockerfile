FROM debian:bullseye

# Install Node.js
RUN apt update
RUN apt install --yes nodejs 

# Timezone
ENV TZ="Asia/Taipei"

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

COPY . .

EXPOSE 443

CMD [ "node", "index.js" ]