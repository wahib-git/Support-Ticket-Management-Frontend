FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build:prod

FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d

COPY --from=build /app/dist/support-ticket-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]