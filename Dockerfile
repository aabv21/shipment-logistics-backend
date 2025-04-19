# Use Node.js LTS version
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install pnpm and PM2 globally
RUN npm install -g pnpm pm2

# Copy package files
COPY pnpm-lock.yaml package*.json ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application with PM2
CMD ["pm2-runtime", "npx", "--", "tsx", "main.ts"] 