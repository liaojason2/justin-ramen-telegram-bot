FROM node:16-bullseye-slim

# Timezone
ENV TZ="Asia/Taipei"

ENV NODE_ENV=production

WORKDIR /app

# Install dependencies
COPY [ "package.json", "yarn.lock", "./" ]
RUN [ "yarn", "--production" ]

# Copy source code
COPY [ \
    "data.json", \
    "index.js", \
    "LICENSE", \
    "./" \
    ]

EXPOSE 443

CMD [ "node", "index.js" ]
