"use strict"
const Authenticator = require("../authenticator");
/**
 * Class responsible for authentication using facebook
 * then store the session with cookies
 * @extends Authenticator
 */
class FacebookCookiesAuthenticator extends Authenticator
{
    /**
     * Create a FacebookCookiesAuthenticator
     * @param {UserManager} userManager
     * @param {SessionManager} sessionManager
     * @param {FacebookLinkageManager} facebookLinkageManager
     * @param {FacebookConnection} facebookConnection
     * @param {Object} [options]
     * @param {Boolean} [options.secure] - HTTPS only cookies
     */
    constructor(userManager, sessionManager, facebookLinkageManager, facebookConnection, options)
    {
        super(userManager);
        if(!sessionManager instanceof SessionManager) throw new Error("Not a SessionManager instance");
        if(!facebookLinkageManager instanceof FacebookLinkageManager) throw new Error("Not a FacebookLinkageManager instance");
        if(!facebookConnection instanceof FacebookConnection) throw new Error("Not a FacebookConnection instance");
        this._sessionManager = sessionManager;
        this._facebookLinkageManager = facebookLinkageManager;
        this._facebookConnection = facebookConnection;
        
        const _options = options || {};
        this._secure = _options.secure || false;
    }
        
    /**
     * Register a user using Facebook login
     * @param {Request} request
     * @param {Response} response
     * @param {Object} data - Additional info needed for registration
     * @param {String} data.userToken - Facebook User Token (Access Code)
     * @param {Function} callback
     */  
    register(request, response, data, callback)
    {
        this._facebookConnection.inspectUserToken(data.userToken, (err, info) =>
        {
            if(err) return callback(err);
            const facebookId = info.user_id;
            this._facebookConnection.getUserProfile(facebookId, userToken, (err, profile) =>
            {
                if(err) return callback(err);
                this._facebookLinkageManager.getLinkageByData({ facebookId, facebookId }, (err, _facebookLinkage) =>
                {
                    if(err) return callback(err);
                    if(_facebookLinkage) return callback(new Error("Facebook user exists"));
                    this._userManager.create(profile.email, "", true, (err, userId) =>
                    {
                        if(err) return callback(err);
                        if(!userId) return callback(new Error("User ID exists"));
                        this._facebookLinkageManager.createLinkage({ facebookId: facebookId, user: userId }, err =>
                        {
                            if(err) return callback(err);
                            return callback(null, true);
                        });
                    });
                });
            });
        });
    }

    /**
     * Grant access token.
     * @param {Request} request
     * @param {Response} response
     * @param {Object} data - Additional info needed for granting token
     * @param {String} data.userToken
     * @param {Function} callback
     */
    token(request, response, data, callback)
    {
        const userToken = data.userToken;
        this._facebookConnection.inspectUserToken(userToken, (err, info) =>
        {
            if(err) return callback(err);
            const facebookId = info.user_id;
            this._facebookLinkageManager.getUserOfLinkageByData({ facebookId: facebookId }, (err, _user) =>
            {
                if(err) return callback(err);
                if(!_user) return callback(null, false);
                this._sessionManager.createSession(_user, (err, refSession) =>
                {
                    if(err) return callback(err);
                    new cookies(request, response).set("sessionId", refSession.sessionId,
                    {
                        secure  : this._secure,
                        maxAge  : this._sessionManager.getExpiresIn() * 1000
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
     * @param {Object} data
     * @param {Function} callback
     */
    authenticate(request, response, data, callback)
    {
        const sessionId = new cookies(request, response).get("sessionId")
        if(!sessionId) return callback();
        this._sessionManager.getUserOfSessionWithSessionId(sessionId, callback);
    }

    /**
     * Revoke the access token.
     * @param {Request} request
     * @param {Response} response
     * @param {Object} data
     * @param {Function} callback 
     */
    revoke(request, response, data, callback)
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
module.exports = exports = FacebookCookiesAuthenticator;

