# Use recent Node image with Debian
FROM node:18-bullseye-slim

# Install LaTeX tools
RUN apt-get update && \
    apt-get install -y texlive-latex-base texlive-latex-extra texlive-fonts-recommended && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy and install Node dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Start server
CMD ["node", "index.js"]