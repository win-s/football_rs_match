# our base image
FROM node

# copy app files
COPY . /usr/src/app
WORKDIR /usr/src/app

# install tools
RUN npm install -g bower 
RUN npm install -g gulp 

# install dependencies and deploy web lib
RUN npm install
RUN bower install --allow-root
RUN gulp public --allow-root

EXPOSE 3000

CMD ["npm","start"]