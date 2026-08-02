# Pinned to the build host's own platform so npm/vite run natively on the
# x86 CI runner instead of being emulated. Everything this stage produces is
# static assets, so none of it is architecture specific.
FROM --platform=$BUILDPLATFORM node:22.23.2 AS builder
ADD . /build
WORKDIR /build
# npm ci, not npm install: rollup and esbuild pick platform-specific optional
# binaries, and only a lockfile-exact install is guaranteed to resolve the
# linux ones this stage needs.
RUN npm ci --legacy-peer-deps
# The build context is smarthome-ui, so the repo's .git is not available here
# and the build cannot work the revision out on its own - it has to be passed in.
ARG GIT_VERSION=unknown
ENV GIT_VERSION=$GIT_VERSION
RUN npm run build
# Plain multi-arch tag: the architecture comes from the build's target platform,
# which build_ui sets with `--platform`. Do not pin an arch-prefixed tag here
# (arm64v8/..., arm32v7/...) - those publish a single-platform OCI index, which
# BuildKit fails to match against the x86 runner's default target platform.
FROM nginx:1.29-alpine
COPY --from=builder /build/dist /usr/share/nginx/html/
ADD nginx/default /etc/nginx/conf.d/default.conf
ADD nginx/.htpasswd /etc/nginx/.htpasswd
