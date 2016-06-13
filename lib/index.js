"use strict"
const UserManager = require("./userManager");
const SessionManager = require("./sessionManager");
const Authenticator = require("./authentication/authenticator");
const Registrator = require("./authentication/registrator");
const FacebookConnection = require("../facebook");

class Authchio
{
    constructor()
    {
        this._userManager = new UserManager;
        this._sessionManager = {};
        this._registrator = {};
        this._authenticator = {};
        this._autnenticators = [];
        this._linkageManager = {};
    }

    addSessionManager(strategy, sessionManager)
    {
        if(!sessionManager instanceof SessionManager) throw new Error("Not a SessionManager instance");
        this._sessionManager[strategy] sessionManager;
        return this;
    }

    addRegistrator(strategy, registrator) 
    {
        if(!registrator instanceof Registrator) throw new Error("Not a Registrator instance");
        this._registrator[strategy] = registrator;
        return this;
    }

    addAuthenticator(strategy, authenticator)
    {
        if(!authenticator instanceof Authenticator) throw new Error("Not an Authenticator instance");
        this._authenticator[strategy] = authenticator;
        this._autneitcators.push(authenticator);
        return this;
    }

    addCredentialCookiesStrategy(strategy, options)
    {
        const sessionManager = new SessionManager(options);
        const registrator = new Registrator.Credentials(this._userManager);
        const authenticator = new Authenticator.CredentialsCookies(this._userManager, sessionManager);
        this.addSessionManager(strategy, sessionManager);
        this.addRegistrator(strategy, registrator);
        this.addAuthenticator(strategy, authenticator);
        return this;
    }

    addFacebookCookiesStrategy(strategy, appId, appSecret, options)
    {
        const sessionManager = new SessionManager(options);
        const facebookConnection = new FacebookConnection(appId, appSecret);
        const registrator = new Registrator.Facebook(this._userManager, sessionManager, facebookConnection);
        const facebookLinkageManager = new 
        const authenticator = new Authenticator.Facebook(this._userManager, sessionManager, facebookConnection);
    }

    register(strategy, options, callback)
    {
        if(!this._registrator[strategy]) return callback(new Error(`Can't find registrator for ${ strategy }`));
        this._registrator[strategy].register(options, callback);
    }

    token(strategy, request, response, options, callback)
    {
        if(!this._authenticator[strategy]) return callback(new Error(`Can't find authenticator for ${ strategy }`));
        this._authenticator[strategy].token(request, response, options, callback);
    }

    _authenticate(index, request, response, callback)
    {
        if(!this._authenticators[index]) return callback();
        this._authenticators[index].authenticate(request, response, (err, refUser) =>
        {
            if(err) return callback(err);
            if(!refUser) return this._authenticate(index + 1, request, response, callback);
            return callback(null, refUser);
        });
    }

    authenticate(request, response, callback)
    {
        request.user =
        {
            username        : "Anonymous",
            isAuthenticated : false
        };
        _authenticate(0, request, response, (err, refUser) =>
        {
            if(err) return callback(err);
            if(!refUser) return callback(null, true);
            request.user =
            {
                id              : refUser._id,
                username        : refUser.username,
                isAuthenticated : true,
                roles           : refUser.roles
            };
            return callback(null, true);
        });
    }

    revoke(strategy, request, response, callback)
    {
        if(!this._authenticator[strategy]) return callback(new Error(`Can't find authenticator for ${ strategy }`));
        this._authenticator[strategy].revoke(request, response, callback);
    }
}
const authchio = module.exports = exports = new Authchio;

