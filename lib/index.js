"use strict"
const mongoose = require("mongoose");
const UserManager = require("./userManager");
const AuthenticatorBuilder = require("./authentication/authenticatorBuilder");
const Authenticator = require("./authentication/authenticator");

class Authchio
{
    constructor()
    {
        this._userManager = new UserManager;
        this._authenticator = {};
        this._authenticators = [];
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
        this.addAuthenticator(AuthenticatorBuilder.CredentialsCookies.build(this._userManager, options));
        
    }

    addFacebookCookiesStrategy(strategy, options)
    {
        this.addAuthenticator(AuthenticatorBuilder.FacebookCookies.build(this._userManager, options));
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
        this._authenticators[index].authenticate(request, response, data, (err, refUser) =>
        {
            if(err) return callback(err);
            if(!refUser) return this._authenticate(index + 1, request, response, data, callback);
            return callback(null, refUser);
        });
    }

    authenticate(request, response, data, callback)
    {
        _authenticate(0, request, response, data, (err, refUser) =>
        {
            if(err) return callback(err);
            if(!refUser) return callback(null, true);
            request.user = refUser.toObject();
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
}
const authchio = module.exports = exports = new Authchio;

