# PopulationManagementSystem

[![CircleCI](https://circleci.com/gh/malmike/PopulationManagementSystem.svg?style=svg)](https://circleci.com/gh/malmike/PopulationManagementSystem)
[![Maintainability](https://api.codeclimate.com/v1/badges/dbe64614cde498572286/maintainability)](https://codeclimate.com/github/malmike/PopulationManagementSystem/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/dbe64614cde498572286/test_coverage)](https://codeclimate.com/github/malmike/PopulationManagementSystem/test_coverage)

This is an poplutation management api that enables one add locations and the number of residents in each location distributed by gender. This application is built using NodeJS, Express, Typescript and MongoDB


## Requirements
In order to run this project locally you would need to have:
- [Node](https://nodejs.org/en/) (Best to install v10.4.0). You can use [NVM](https://github.com/nvm-sh/nvm) to install and manage node versions on your machine
- [MongoDB](https://www.mongodb.com/) (For this project I used a docker image of mongoDB.)
- [Docker](https://www.docker.com) (if you plan to setup mongoDB to run in a docker image)
- [Yarn](https://yarnpkg.com/) - After installing node install Yarn globally by running
```
npm -g install yarn
```

### Setting up MongoDB to run in docker
You can run a docker image of mongo DB using `docker run -p 27017:27017  mongo:3.4.20-jessie`
This command will download the specified mongo image if it does not exist locally and run the image. For this case am running the image `mongo:3.4.20-jessie` but you can get a list of mongo images [here](https://hub.docker.com/_/mongo). The `-p 27017:27017` specifies that the running image is being exposed on port `27017`


## Setup
1. Clone the repository
    ```
    git clone https://github.com/malmike/PopulationManagementSystem.git
    ```
2. Enter the directory and install the project dependencies
    ```
    cd PopulationManagementSystem
    yarn install
    ```
3. Rename sample.env to .env
    ```
    mv sample.env .env
    ```
4. Start mongodb service.
    - If you install mongodb locally run
      ```
      mongod
      ```
      If you require authentication
      ```
      sudo mongod
      ```
    - If you setup mongodb to run in docker then just ensure that the image is running
      ```
      docker container ls
      ```
      If the image is not running then run the command
      ```
      docker run -p 27017:27017  mongo:3.4.20-jessie
      ```
    Ensure that the .env file contains the value `DB_URI=mongodb://localhost:27017/population_management_system`
5. Starting the application
    ```
    yarn start-dev
    ```
    The development environment is setup to allow live reloading using [nodemon](https://nodemon.io/)
6. You can access the application in the browser
    ```
    http://localhost:1337
    ```
    The API uses swagger for documentation and this can be accessed at
    ```
    http://localhost:1337/api-docs/
    ```

## Testing
To execute the applications tests run
```
yarn test
```
To execute tests with coverage run
```
yarn test-coverage
```

## Endpoints
<table>
  <tr>
    <th>TYPE</th>
    <th>API ENDPOINT</th>
    <th>DESCRIPTION</th>
    <th>HEADERS</th>
    <th>PAYLOAD</th>
  </tr>
  <tr>
    <td>POST</td>
    <td>/registerUser</td>
    <td>Creates a user or signs in a existing user</td>
    <td>content-type: applicaton/json</td>
    <td>
      <pre>
      {
        "email": "string",
        "password": "string
      }
      </pre>
    </td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/getUser</td>
    <td>Gets logged in user</td>
    <td>content-type: applicaton/json </br>  x-access-token: token</td>
    <td><pre></pre></td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/addLocation</td>
    <td>Add location </td>
    <td>content-type: applicaton/json </br>  x-access-token: token</td>
    <td>
      <pre>
      {
        "name": "string",
      }
      </pre>
    </td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/getLocations</td>
    <td>Gets all locations</td>
    <td>content-type: applicaton/json </br>  x-access-token: token</td>
    <td><pre></pre></td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/getLocation?name="test"</td>
    <td>Gets location test</td>
    <td>content-type: applicaton/json </br>  x-access-token: token</td>
    <td><pre></pre></td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/addSubLocation?name="test"</td>
    <td>Add sublocation to location test</td>
    <td>content-type: applicaton/json </br>  x-access-token: token</td>
    <td>
      <pre>
      {
        "sub_location_name": "string"
      }
      </pre>
    </td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/deleteSubLocation?name="test"</td>
    <td>Delete sublocation from location test</td>
    <td>content-type: applicaton/json </br>  x-access-token: token</td>
    <td>
      <pre>
      {
        "sub_location_name": "string"
      }
      </pre>
    </td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/addPopulationSize?name="test"</td>
    <td>Add population size to location test</td>
    <td>content-type: applicaton/json </br>  x-access-token: token</td>
    <td>
      <pre>
      {
        "males": 0,
        "females": 0
      }
      </pre>
    </td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/getPopulationSize?name="test"</td>
    <td>Get population size from location test</td>
    <td>content-type: applicaton/json </br>  x-access-token: token</td>
    <td><pre></pre></td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/updatePopulationSize="test"</td>
    <td>Update population size of location test</td>
    <td>content-type: applicaton/json </br>  x-access-token: token</td>
    <td>
      <pre>
      {
        "males": 0,
        "females": 0
      }
      </pre>
    </td>
  </tr>
</table>
