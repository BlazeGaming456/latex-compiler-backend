FROM node:18-bullseye-slim

# Install LaTeX with all required packages
RUN apt-get update && \
    apt-get install -y \
    texlive-full \  # This installs most packages
    texlive-xetex \
    texlive-luatex \
    texlive-extra-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "index.js"]