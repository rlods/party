FROM node:12-alpine

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

ARG FIREBASE_URL
ENV REACT_APP_FIREBASE_URL=${FIREBASE_URL}

COPY services/app /home/node/app/services/app
WORKDIR /home/node/app/services/app
RUN npm install --production=false --unsafe-perm=true --no-audit

WORKDIR /home/node/app/services/app
RUN npm run build && npm prune

CMD ["npm", "run", "serve"]
