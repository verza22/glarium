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

# Generate prisma migrations and client
RUN npx prisma migrate deploy --schema=src/dataAccess/prisma/schema.prisma
RUN npx prisma generate --schema=src/dataAccess/prisma/schema.prisma

# Compile TypeScript to JavaScript
RUN npm run build

# Default command to run the backend server
CMD ["node", "dist/index.js"]