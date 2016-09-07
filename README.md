# Authchio
Authentication and authorization middleware for Node.js application
## Installation
First install [Node.js](http://nodejs.org/) and [MongoDB](https://www.mongodb.org/downloads). Then:
```
$ npm install authchio
```
## Usage
### Connect to MongoDB
```
const authchio = require("authchio");
authchio.connect("mongodb://localhost/test", err =>
{
  // Add strategies
});
```
### Add strategy
```
authchio.addFacebookCookiesStrategy("facebook", { appId: xxx, appSecret: xxx, expiresIn: 3600 * 24, secure: true });
```
### Register user
```
authchio.register("facebook", request, response, { userToken: xxx }, (err, isSuccessful) =>
{
  // Create app specific profile
});
```
### Log user in
```
authchio.token("facebook", request, response, { userToken: xxx }, (err, isSuccessful) =>
{
  // Update latest login timestamp
});
```
### Authenticate subsequent request
```
authchio.authenticate(request, response, {}, (err, user) =>
{
  if(!user) return; // login failed
});
```
