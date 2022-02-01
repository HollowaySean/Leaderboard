FROM node:latest as build

# Create app directory
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Set fix to build error
ENV NODE_OPTIONS=--openssl-legacy-provider

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
RUN npm run build

# nginx server for build environment
FROM nginx:latest
COPY --from=build /usr/src/app/build /usr/share/nginx/html

CMD [ "nginx", "-g", "daemon off;" ]
