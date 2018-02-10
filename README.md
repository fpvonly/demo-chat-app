# Demo chat app

Personal web app demo platform with websockets chat functionality. Built on React, Expressjs and MongoDB. Compiled with Webpack for the use of npm-modules and ES6+ features in the client side.

## Database setup process:

Install  MongoDB database:
https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-mongodb-on-ubuntu-16-04

Create database users and collections:
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

/* If more users needed -> */
db.grantRolesToUser(
   "username",
   [ "userAdminAnyDatabase","userAdmin","readWrite","dbAdmin","clusterAdmin","readWriteAnyDatabase","dbAdminAnyDatabase" ]
)
/* <- */

mongo --port 27017 -u adminUser -p adminPass  --authenticationDatabase admin

use site;
db.createCollection('users');
db.createCollection('messages');

```


Database config-file:
- Create a file named 'database_config.json' to 'server' directory with the following content structure:

``` js
{
  "db_username": "joe",
  "db_password": "foobar",
  "db_domain": "localhost",
  "db_port": "27017"
}
```


## Server setup process:

To run the backend server and setup mail sending for contact form:

``` js
npm run prodbackend -- --gmail=<username,password>
```
