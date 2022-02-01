FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Create log folder
RUN mkdir /logs

# Start server
CMD ["/bin/sh", "-c", \
     "touch /logs/server_log.txt && \
      chmod 755 /logs/server_log.txt &&\
      node server.js 2>&1 | tee -a /logs/server_log.txt"]
