FROM node:18-alpine

# Install required dependencies for Chromium
RUN apk --no-cache add chromium udev ttf-freefont

# Set environment variables to configure Puppeteer to use Chromium
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY . /app

# Install dependencies
RUN npm install

# Install pm2 globally
RUN npm install -g pm2

# Build the app
RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "container"]