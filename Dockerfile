FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY angular.json tsconfig*.json ./

COPY src ./src

RUN npm run build:prod

FROM nginx:alpine

COPY --from=build /app/dist/support-ticket-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]