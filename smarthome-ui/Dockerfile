FROM --platform=linux/amd64 node:10.15.0 as builder
ADD . /build
WORKDIR /build
RUN npm install
RUN npm run build
FROM --platform=linux/arm/v7 nginx:1.21.4-alpine
COPY --from=builder /build/dist /usr/share/nginx/html/
ADD nginx/default /etc/nginx/conf.d/default.conf
