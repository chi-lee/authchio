"use strict"
const cookies = require("cookies");
const utils = require("../../utils");
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
     */
    constructor(userManager, sessionManager)
    {
        super(userManager);
        if(!sessionManager instanceof SessionManager) throw new Error("Not an instance of SessionManager");
        this._sessionManager = sessionManager;
    }
    
    /**
     * Generate access token.
     * @param {Request} request
     * @param {Response} response
     * @param {Object} options
     * @param {Function} callback
     */
    token(request, response, options, callback)
    {
        const username = options.credentials.username;
        const password = options.credentials.password;
        const expiresIn = options.expiresIn || -1;
        this._userManager.getUserByUsername(username, (err, refUser) =>
        {
            if(err) return callback(err);
            if(!refUser || refUser.password.length == 0) return callback();
            const hashInfo = refUser.password.split("$");
            utils.getHashedPassword(password, { salt: hashInfo[2] }, (err, hashedPassword) =>
            {
                if(err) return callback(err);
                if(hashedPassword != refUser.password) return callback();
                this._sessionManager.createSession(refUser, (err, refSession) =>
                {
                    if(err) return callback(err);
                    new cookies(request, response).set("sessionId", refSession._id,
                    {
                        secure  : request.protocol == "HTTPS",
                        maxAge  : expiresIn
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
     * @param {Function} callback
     */
    authenticate(request, response, callback)
    {
        const sessionId = new cookies(request, response).get("sessionId")
        if(!sessionId) return callback();
        this._sessionManager.getUserOfSessionWithSessionId(sessionId, callback);
    }

    /**
     * Revoke the access token.
     * @param {Request} request
     * @param {Response} response
     * @param {Function} callback 
     */
    revoke(request, response, callback)
    {
        const userCookies = new cookies(request, response);
        const sessionId = userCookies.get("sessionId");
        if(!sessionId) return callback(null, false);
        this._sessionManager.deleteSessionWithSessionId(sessionId, (err, refSession) =>
        {
            if(err) return callback(err);
            if(!refSession) return callback(null, false);
            userCookies.set("sessionId");
            return callback(null, true);
        });
    }
}
module.exports = exports = CredentialsCookiesAuthenticator;
