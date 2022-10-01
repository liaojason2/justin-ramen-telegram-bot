FROM node:16-bullseye

# Install system dependencies
RUN set -e; \
    apt-get update -y && apt-get install -y \
    tini \
    lsb-release; \
    gcsFuseRepo=gcsfuse-`lsb_release -c -s`; \
    echo "deb http://packages.cloud.google.com/apt $gcsFuseRepo main" | \
    tee /etc/apt/sources.list.d/gcsfuse.list; \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | \
    apt-key add -; \
    apt-get update; \
    apt-get install -y gcsfuse \
    && apt-get clean

# Timezone
ENV TZ="Asia/Taipei"

# Node ENV
ENV NODE_ENV=production

# Set fallback mount directory
ENV MNT_DIR /app/data

WORKDIR /app

RUN ["mkdir", "data"]

# Install dependencies
COPY [ "package.json", "yarn.lock", "./" ]
RUN [ "yarn", "--production" ]

# Copy source code
COPY [ \
    "data.json", \
    "index.js", \
    "LICENSE", \
    "gcsfuse_run.sh", \
    "./" \
    ]

EXPOSE 443

# Ensure the script is executable
RUN chmod +x /app/gcsfuse_run.sh

# Use tini to manage zombie processes and signal forwarding
# https://github.com/krallin/tini
ENTRYPOINT ["/usr/bin/tini", "--"] 

# Pass the startup script as arguments to Tini
CMD ["/app/gcsfuse_run.sh"]
