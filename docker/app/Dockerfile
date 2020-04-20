FROM node:12-alpine

WORKDIR /home/node/app/services/app

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

ARG DATABASE_IDS
ARG DATABASE_PREFIX
ENV REACT_APP_DATABASE_IDS=${DATABASE_IDS}
ENV REACT_APP_DATABASE_PREFIX=${DATABASE_PREFIX}

COPY services/app .
RUN npm install --production=false --unsafe-perm=true --no-audit && npm run build && npm prune

CMD ["npm", "run", "serve"]
