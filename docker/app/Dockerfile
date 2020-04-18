FROM node:12-alpine

WORKDIR /home/node/app/services/app

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

ARG DATABASE_ID
ENV REACT_APP_DATABASE_ID=${DATABASE_ID}

COPY services/app .
RUN npm install --production=false --unsafe-perm=true --no-audit && npm run build && npm prune

CMD ["npm", "run", "serve"]
