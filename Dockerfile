FROM node:19.4-alpine AS build
WORKDIR /app/build
COPY package*.json ./
RUN npm ci
COPY ./ ./
RUN npm run build

FROM node:19.4-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY --from=build /app/build/dist ./dist
CMD ["npm", "start"]
