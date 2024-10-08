# syntax=docker/dockerfile:1

FROM node:20.18.0-alpine AS base

FROM base AS build

RUN apk add --no-cache dotnet6-sdk dotnet6-build

COPY ./subtitleedit-cli/src /workdir/subtitleedit-cli/src

WORKDIR /workdir/subtitleedit-cli/src/se-cli
RUN dotnet publish -c release -r linux-musl-x64 --self-contained seconv.csproj

FROM node:20.18.0-alpine

COPY --from=build /workdir/subtitleedit-cli/src/se-cli/bin/release/net6.0/linux-musl-x64/publish /opt/secli

RUN npm i -g pnpm

WORKDIR /app

ADD ./package.json ./pnpm-lock.yaml /app/

RUN pnpm install -P

ADD . /app

CMD ["node", "src/index.js"]
