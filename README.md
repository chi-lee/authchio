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
authchio.addCredentialsCookiesStrategy("credentials", { expiresIn: 3600 * 24 });
authchio.addFacebookCookiesStrategy("facebook", { appId: xxx, appSecret: xxx, expiresIn: 3600 * 24, secure: true });
```
### Register user
```
authchio.register("credentials", request, response, { username: "foo", password: "bar" }, (err, isSuccessful) =>
{
  // Create app specific profile
});
authchio.register("facebook", request, response, { userToken: xxx }, (err, isSuccessful) =>
{
  // Create app specific profile
});
```
### Log user in
```
authchio.token("credentials", request, response, { username: "foo", password: "bar" }, (err, isSuccessful) =>
{
    if(err) // database/server error
    if(!isSuccessful) // no user / wrong password
});
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
### Log user out
```
authchio.revoke("credentials", request, response, null, (err, isSuccessful) =>
{
});
```

