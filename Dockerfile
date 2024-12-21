# Build React frontend
FROM node:16 as build
WORKDIR /app
COPY ./frontend ./frontend
RUN cd frontend && npm install && npm run build

# Setup backend
FROM node:16
WORKDIR /app
COPY ./backend ./backend
COPY --from=build /app/frontend/build ./backend/public
WORKDIR /app/backend
RUN apt-get update && apt-get install -y build-essential python3
RUN npm install && npm run build
WORKDIR /app/backend/dist
CMD ["node", "server.js"]