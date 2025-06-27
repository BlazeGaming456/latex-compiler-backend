# Base: use lighter TeXLive variant
FROM ghcr.io/sile-typesetter/texlive:latest

# Install Node.js (minimal, clean)
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy only what's needed
COPY package*.json ./
RUN npm install

# Now copy the rest
COPY . .

# Run app
CMD ["node", "index.js"]