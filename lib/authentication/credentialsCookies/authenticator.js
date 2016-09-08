"use strict"
const crypto = require("crypto");
const cookies = require("cookies");
const Authenticator = require("../authenticator");
const SessionManager = require("../../sessionManager");

/**
 * Class authenticating user using credentials
 * @extends Authenticator
 */
class CredentialsCookiesAuthenticator extends Authenticator
{
    /**
     * Create a CredentialsCookiesAuthenticator.
     * @param {UserManager} userManager
     * @param {SessionManager} sessionManager
     * @param {Object} [options]
     * @param {Boolean} [options.secure] - HTTPS only cookies
     */
    constructor(userManager, sessionManager, options)
    {
        super(userManager);
        if(!sessionManager instanceof SessionManager) throw new Error("Not an instance of SessionManager");
        this._sessionManager = sessionManager;
        
        const _options = options || {};
        this._secure = _options.secure || false;
    }
    
    /**
     * Register user.
     * @param {Request} request
     * @param {Response} response
     * @param {Object} data - Additional info needed for registration
     * @param {String} data.username
     * @param {String} data.password
     * @param {Function} callback 
     */
    register(request, response, data, callback)
    {
        this._getHashedPassword(data.password, (err, hash) =>
        {
            if(err) return callback(err);
            this._userManager.createUser(data.username, hash, callback);
        });
    }
    
    /**
     * Grant access token.
     * @param {Request} request
     * @param {Response} response
     * @param {Object} data - Additional info needed for granting token
     * @param {String} data.username
     * @param {String} data.password
     * @param {Boolean} data.remember
     * @param {Function} callback
     */
    token(request, response, data, callback)
    {
        const username = data.username;
        const password = data.password;
        const remember = data.remember;
        this._userManager.getUserByUsername(username, (err, _user) =>
        {
            if(err) return callback(err);
            if(!_user || _user.password.length == 0) return callback(null, false);
            const hashInfo = _user.password.split("$");
            this._getHashedPassword(password, { salt: hashInfo[2] }, (err, hashedPassword) =>
            {
                if(err) return callback(err);
                if(hashedPassword != _user.password) return callback(null, false);
                this._sessionManager.createSession(_user, (err, _session) =>
                {
                    if(err) return callback(err);
                    new cookies(request, response).set("sessionId", _session._id,
                    {
                        secure  : this._secure,
                        maxAge  : remember? this._sessionManager.getExpiresIn(): -1
                    });
                    return callback(null, true);
                });
            });
        });
    }
    
    /**
     * Authenticate user with the access token and return user
     * @param {Request} request
     * @param {Response} response
     * @param {Object} data - Additional info needed for authentication
     * @param {Function} callback
     */
    authenticate(request, response, data, callback)
    {
        const sessionId = new cookies(request, response).get("sessionId")
        if(!sessionId) return callback(null, false);
        this._sessionManager.getUserOfSessionWithSessionId(sessionId, callback);
    }

    /**
     * Revoke the access token.
     * @param {Request} request
     * @param {Response} response
     * @param {Object} data - Additional info needed for revoking access token
     * @param {Function} callback 
     */
    revoke(request, response, data, callback)
    {
        const userCookies = new cookies(request, response);
        const sessionId = userCookies.get("sessionId");
        if(!sessionId) return callback(null, false);
        this._sessionManager.deleteSessionWithSessionId(sessionId, (err, _session) =>
        {
            if(err) return callback(err);
            if(!_session) return callback(null, false);
            userCookies.set("sessionId");
            return callback(null, true);
        });
    }

    _getRandomString(length)
    {
        const chars = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
        const charsLen = chars.length;
        const _length = length || 12;
        const rnd = crypto.randomBytes(_length);
        const value = new Array(_length);
        for(let i = 0; i < _length; ++i)
        {
            value[i] = chars[rnd[i] % charsLen];
        }
        return value.join('');
    }

    _getHashedPassword(password, options, callback)
    {
        if(typeof(options) == "function")
        {
            callback = options;
            options = {};
        }

        const iteration = options.iteration || 10000;
        const digest = options.digest || "sha256";
        const salt = options.salt || this._getRandomString();

        crypto.pbkdf2(password, salt, iteration, 32, digest, (err, key) =>
        {
            if(err) return callback(new Error(`Cannot get hashed password, ${ err.message }`));
            const hash = key.toString("base64");
            return callback(null, `pbkdf2_${ digest }$${ iteration }$${ salt }$${ hash }`);
        });
    }
}
module.exports = exports = CredentialsCookiesAuthenticator;
