"use strict"
const SessionManager = require("../../sessionManager");
const AuthenticatorBuilder = require("../authenticatorBuilder");
const CredentialsCookiesAuthenticator = require("./authenticator");

/**
 * Class for building CredentialsCookiesAuthenticator
 */
class CredentialsCookiesAuthenticatorBuilder
{
    /**
     * Build a CredentialsCookiesAuthenticator
     * @param {UserManager} userManager
     * @param {Object} [options]
     * @param {String} [options.modelName] - Model name of session
     * @param {Number} [options.expiresIn] - Expiration time of session in seconds
     * @param {Boolean} [options.secure] - HTTPS-only cookies
     * @returns {CredentialsCookiesAuthenticator}
     */ 
    build(userManager, options)
    {
        const sessionManager = new SessionManager(options);
        const authenticator = new CredentialsCookiesAuthenticator(userManager, sessionManager, options);
        return authenticator;
    }
}
module.exports = exports = new CredentialsCookiesAuthenticatorBuilder();
