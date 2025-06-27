# Use official LaTeX image
FROM texlive/texlive:latest

# Install Node.js
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Copy code and install dependencies
COPY . .
RUN npm install

# Start the server
CMD ["node", "index.js"]