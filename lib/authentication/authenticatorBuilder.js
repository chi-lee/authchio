"use strict"

/**
 * Base class for authenticator builders
 */
class AuthenticatorBuilder
{
    /**
     * Build the authenticator
     * @param {UserManager} userManager
     * @param {Object} options
     * @returns {Authenticator} authenticator
     */ 
    build(userManager, options)
    {
        throw new Error("Calling unimplemented build()");
    }
}
module.exports = exports = AuthenticatorBuilder;

AuthenticatorBuilder.CredentialsCookies = require("./credentialsCookies/builder");
AuthenticatorBuilder.FacebookCookies = require("./facebookCookies/builder");
