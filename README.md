# Demo chat app

[ ![Codeship Status for fpvonly/demo-chat-app](https://app.codeship.com/projects/e415c5b0-f091-0135-7e6b-7607cfa71e55/status?branch=master)](https://app.codeship.com/projects/271255)

Personal web app demo platform with websockets chat functionality. Built on React, Expressjs and MongoDB. Compiled with Webpack for the use of npm-modules and ES6+ features in the client side.

## Database setup process:

Install  MongoDB database:
https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-mongodb-on-ubuntu-16-04

Create database, database user and collections:
``` js
mongo
use admin;
db.createUser(
  {
    user: "foo",
    pwd: "bar",
    roles: ["root"]
  }
);

mongo --port 27017 -u adminUser -p adminPass  --authenticationDatabase admin

use site;
db.createCollection('users');
db.createCollection('messages');

```


Database config-file:
- Create a file named 'database_config.json' into 'server' directory with the following content structure:

``` js
{
  "db_username": "joe",
  "db_password": "foobar",
  "db_domain": "localhost",
  "db_port": "27017"
}
```


## Production server setup process:
- Edit the file named 'server_config.json' with the correct server info (this is also used in the client-side production code build bundle):

``` js
{
  "server_domain": "146.185.148.22",
  "server_port": "80"
}
```

To run the backend server and setup mail sending for contact form (run in 'server' -folder):

``` js
/* server is not bundled, so it needs npm packages installed */
npm install
npm run prodbackend -- --gmail=<username,password>
```

## NPM scripts for development, testing and build (client related code):

``` js
/* Install npm packages in 'site' -directory */
npm install
```

Start Webpack Dev server

``` js
npm run dev
```

Do a development build (testing a normal build bundle with NODE_ENV=development set for localhost connections)

``` js
npm run devbuild
```

Do a production build (using server_config.json settings)

``` js
npm run prodbuild
```

Run tests

``` js
npm run test
```

## NPM scripts for development and build (backend related code):

``` js
/* Install npm packages in 'site/server' -directory */
npm install
```

Start a server used for development (e.g. uses nodemon, debug logs, etc)

``` js
npm run devbackend -- --gmail=<username,password> /* setting up email is optional */
```

Start a production server (uses forever)

``` js
npm run prodbackend -- --gmail=<username,password>
```

Note! It is not _necessary_ to run tests and make the production build manually when there are changes ready for the production.
Codeship CI takes care of it via hook that automatically fetches newest code from GitHub after every commit to master-branch.
Codeship runs the tests and creates the production build to production server.
To avoid CI-process, use --skip-ci in the commit message (e.g. git commit -m "Message content --skip-ci")
