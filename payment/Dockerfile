FROM node:18-alpine

WORKDIR /app

COPY . /app

# Install dependencies
RUN npm install

# Build the app
RUN npm run build

EXPOSE 3003

CMD ["npm", "run", "container"]
