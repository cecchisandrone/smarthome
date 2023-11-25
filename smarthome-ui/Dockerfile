FROM node:14.21.3 as builder
ADD . /build
WORKDIR /build
RUN npm install --legacy-peer-deps
RUN npm run build
FROM arm32v7/nginx:1.21.4-alpine
COPY --from=builder /build/dist /usr/share/nginx/html/
ADD nginx/default /etc/nginx/conf.d/default.conf
ADD nginx/.htpasswd /etc/nginx/.htpasswd
