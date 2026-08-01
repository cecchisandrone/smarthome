FROM node:22.23.2 AS builder
ADD . /build
WORKDIR /build
RUN npm install --legacy-peer-deps
# The build context is smarthome-ui, so the repo's .git is not available here
# and the build cannot work the revision out on its own - it has to be passed in.
ARG GIT_VERSION=unknown
ENV GIT_VERSION=$GIT_VERSION
RUN npm run build
# arm64v8 rather than the multi-arch nginx tag on purpose: build_ui runs a plain
# `docker build` on an x86 runner, which would resolve a multi-arch tag to amd64
# and push an image the Pi cannot run. The arch has to be pinned here.
FROM arm64v8/nginx:1.29-alpine
COPY --from=builder /build/dist /usr/share/nginx/html/
ADD nginx/default /etc/nginx/conf.d/default.conf
ADD nginx/.htpasswd /etc/nginx/.htpasswd
