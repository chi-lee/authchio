"use strict"
const SessionManager = require("../../sessionManager");
const AuthenticatorBuilder = require("../authenticatorBuilder");
const FacebookLinkageManager = require("./linkageManager");
const FacebookConnection = require("./connection");
const FacebookCookiesAuthenticator = require("./authenticator");

/**
 * Class for building FacebookCookiesAuthenticator
 */
class FacebookCookiesAuthenticatorBuilder
{
    /**
     * Build a FacebookCookiesAuthenticator
     * @param {UserManager} userManager
     * @param {Object} options
     * @param {String} options.appId - Facebook App ID
     * @param {String} options.appSecret - Facebook App secret
     * @param {String} [options.modelName=FacebookSession] - Model name of session
     * @param {Number} [options.expiresIn=3600] - Expiration time of session in seconds
     * @param {Boolean} [options.secure=false] - HTTPS-only cookies
     * @returns {FacebookCookiesAuthenticator}
     */ 
    build(userManager, options)
    {
        const modelName = options.modelName || "FacebookSession";
        const expiresIn = options.expiresIn || 3600;
        const secure = options.secure || false;

        const sessionManager = new SessionManager({ modelName: modelName, expiresIn: expiresIn });
        const linkageManager = new FacebookLinkageManager();
        const connection = new FacebookConnection(options.appId, options.appSecret);
        const authenticator = new FacebookCookiesAuthenticator(userManager, sessionManager, linkageManager, connection, { secure: secure });
        return authenticator;
    }
}
module.exports = exports = new FacebookCookiesAuthenticatorBuilder();
