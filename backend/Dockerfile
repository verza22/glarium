# Base image
FROM node@sha256:eabac870db94f7342d6c33560d6613f188bbcf4bbe1f4eb47d5e2a08e1a37722

# Working directory
WORKDIR /app

#set npm
RUN npm install -g npm@10.8.2

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Default command to run the backend server
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]