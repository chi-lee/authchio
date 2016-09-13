"use strict"
const mongoose = require("mongoose");
const UserManager = require("./userManager");
const AuthenticatorBuilder = require("./authentication/authenticatorBuilder");
const Authenticator = require("./authentication/authenticator");
const AuthorizationManager = require("./authorization/authorizationManager");

class Authchio
{
    constructor()
    {
        this._userManager = new UserManager;
        this._authenticator = {};
        this._authenticators = [];
        this._authorizationManager = new AuthorizationManager;
    }

    connect(path, credentials, callback)
    {
        mongoose.connect(path, credentials, err =>
        {
            if(err) return callback(err);
            return callback();
        });
    }

    addAuthenticator(strategy, authenticator)
    {
        if(!authenticator instanceof Authenticator) throw new Error("Not an Authenticator instance");
        this._authenticator[strategy] = authenticator;
        this._authenticators.push(authenticator);
    }

    addCredentialsCookiesStrategy(strategy, options)
    {
        this.addAuthenticator(strategy, AuthenticatorBuilder.CredentialsCookies.build(this._userManager, options));
    }

    addFacebookCookiesStrategy(strategy, options)
    {
        this.addAuthenticator(strategy, AuthenticatorBuilder.FacebookCookies.build(this._userManager, options));
    }

    register(strategy, request, response, data, callback)
    {
        if(!this._authenticator[strategy]) return callback(new Error(`Can't find authenticator for ${ strategy }`));
        this._authenticator[strategy].register(request, response, data, callback);
    }

    token(strategy, request, response, data, callback)
    {
        if(!this._authenticator[strategy]) return callback(new Error(`Can't find authenticator for ${ strategy }`));
        this._authenticator[strategy].token(request, response, data, callback);
    }

    _authenticate(index, request, response, data, callback)
    {
        if(!this._authenticators[index]) return callback();
        this._authenticators[index].authenticate(request, response, data, (err, _user) =>
        {
            if(err) return callback(err);
            if(!_user) return this._authenticate(index + 1, request, response, data, callback);
            return callback(null, _user);
        });
    }

    authenticate(request, response, data, callback)
    {
        this._authenticate(0, request, response, data, (err, _user) =>
        {
            if(err) return callback(err);
            if(!_user) return callback(null, true);
            request.user = _user.toObject();
            return callback(null, true);
        });
    }

    revoke(strategy, request, response, data, callback)
    {
        if(!this._authenticator[strategy]) return callback(new Error(`Can't find authenticator for ${ strategy }`));
        this._authenticator[strategy].revoke(request, response, data, callback);
    }

    deregister(strategy, request, response, data, callback)
    {
        if(!this._authenticator[strategy]) return callback(new Error(`Can't find authenticator for ${ strategy }`));
        this,_authenticator[strategy].deregister(request, response, data, callback);
    }

    registerRole(role)
    {
        this._authorizationManager.registerRole(role);
        return this;
    }

    grantRole(role, username, callback)
    {
        if(!this._authorizationManager.hasRole(role)) return callback(new Error(`Unregistered role ${ role }`));
        this._userManager.getUserByUsername(username, (err, _user) =>
        {
            if(err) return callback(err);
            _user.update({ $addToSet: { roles: role } }, err => callback(err));
        });
    }

    addRule(category, name, roles)
    {
        this._authorizationManager.addRule(category, name, roles);
        return this;
    }

    authorize(request, response, category, name, callback)
    {
        this._authorizationManager.authorize(request, response, category, name, callback);
    }
}
Authchio.prototype.Error = require("./errors");
const authchio = module.exports = exports = new Authchio;
