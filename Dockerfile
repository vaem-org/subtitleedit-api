FROM node:18.14-bullseye

RUN apt-get update && apt-get install -y mono-complete \
    libhunspell-dev \
    libmpv-dev \
    tesseract-ocr \
    xvfb

RUN wget -O /tmp/SE3611.zip https://github.com/SubtitleEdit/subtitleedit/releases/download/3.6.11/SE3611.zip && \
    unzip /tmp/SE3611.zip -d /opt/subtitleedit && \
    rm /tmp/SE3611.zip

RUN npm i -g pnpm

WORKDIR /app

ADD ./package.json ./pnpm-lock.yaml /app/

RUN pnpm install -P

ADD . /app

CMD ["node", "src/index.js"]
