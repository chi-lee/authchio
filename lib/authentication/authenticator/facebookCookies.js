"use strict"
const FacebookLinkageManager = require("../linkageManager/facebook");
const CredentialsCookiesAuthenticator = require("./credentialsCookies");

/**
 * Class responsible for authentication using facebook
 * then store the session with cookies
 * @extends CredentialsCookiesAuthenticator
 */
class FacebookCookiesAuthenticator extends CredentialsCookiesAuthenticator
{
    /**
     * Create a FacebookCookiesAuthenticator
     * @param {UserManager} userManager
     * @param {SessionManager} sessionManager
     * @param {FacebookUserManager} facebookLinkageManager
     */
    constructor(userManager, sessionManager, facebookLinkageManager)
    {
        super(userManager, sessionManager);
        if(!facebookLinkageManager instanceof FacebookUserManager) throw new Error("Not a FacebookUserManager instance");
        this._facebookLinkageManager = facebookLinkageManager;
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
        const userToken = options.facebookUserToken;
        const expiresIn = options.expiresIn || -1;
        this._facebookConnection.inspectUserToken(userToken, (err, info) =>
        {
            if(err) return callback(err);
            const facebookId = info.user_id;
            this._facebookLinkageManager.getUserOfFacebookLinkageByFacebookId(facebookId, (err, refUser) =>
            {
                if(err) return callback(err);
                if(!refUser) return callback(null, false);
                this._userManager.getUserByUserId(refUser.user, (err, refUser) =>
                {
                    if(err) return callback(err);
                    if(!refUser || refUser.password.length == 0) return callback(null, true);
                    this._sessionManager.createSession(refUser, (err, refSession) =>
                    {
                        if(err) return callback(err);
                        new cookies(request, response).set("sessionId", refSession.sessionId,
                        {
                            secure  : request.protocol == "HTTPS",
                            maxAge  : expiresIn
                        });
                        return callback(null, true);
                    });
                });
            });
        });
    }
}
module.exports = exports = FacebookCookiesAuthenticator;

