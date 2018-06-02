# Waypoint API
<img src="https://raw.githubusercontent.com/wwami-pipeline/Front-End/master/public/assets/logo.png" width="500">
Repository for the Waypoint API.

## About
Server-side code provides data for program organizations that have been imported from survey data
provided by WWAMI organizations. Users can access all organizations, access an organization by ID and
name, and filter organizations by location and other features.

## Tech and Dependencies
Built with TypeScript. Runs on Express.js. Transpiling handled by gulp. Uses mocha for tests. Finally,
API is deployed using Docker.

## Setup
Clone the Repository.

Running locally:<br/><br/>
Setup should be as easy as pulling the repo and running `npm install` to get all the dependencies. There are two scripts that have been written
for ease of use:
* `npm run build`: runs the gulp scripts specified in gulpfile.js. Will transpile everything into the `build` folder.
* `npm start`: starts the express server on port 3000

Running on server:
* Create DockerHub account at https://hub.docker.com
* Compile and transpile using `npm run build`
* Build Docker container with command `docker build -t <YOUR DOCKERHUB USERNAME>/pipelineapi .`
* Push docker container to Dockerhub with command `docker push <YOUR DOCKERHUB USERNAME>/pipelineapi`
* SSH into server at nwhealthcareerpath.uw.edu
* Pull docker container with command `docker pull <YOUR DOCKERHUB USERNAME>/pipelineapi`
* Clean any untagged images with command `docker image prune -f`
* Run API with command:
```
docker run -d \
-p 127.0.0.1:4001:4001 \
--network pipeline \
--name pipelineapi \
-e PORT=4001 \
<YOUR DOCKERHUB USERNAME>/pipelineapi
```
* You may need sudo privileges to run these commands.

