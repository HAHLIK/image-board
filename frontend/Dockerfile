#Builder stage
FROM node:24.8.0-alpine AS builder

WORKDIR /usr/local/src

COPY ./nginx.conf ./
COPY ./app/package.json package.json
RUN npm install
COPY ./app ./
RUN npm run build

#Nginx run stage
FROM nginx:1.29.2-alpine

COPY --from=builder /usr/local/src/dist /usr/share/nginx/html
COPY --from=builder /usr/local/src/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD [ "nginx", "-g", "daemon off;" ]