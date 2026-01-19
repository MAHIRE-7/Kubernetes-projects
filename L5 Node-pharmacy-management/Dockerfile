FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S pharmacy -u 1001 && \
    chown -R pharmacy:nodejs /app

USER pharmacy

EXPOSE 3000

CMD ["npm", "start"]