"use strict"
const utils = require("../../utils");
const Registrator = require("./registrator");

/**
 * Class responsible for register user with credentials
 */
class CredentialsRegistrator extends Registrator
{
    /**
     * Create a CredentialsRegistrator.
     * @param {UserManager} userManager
     */
    constructor(userManager)
    {
        super(userManager);
    }

    /**
     * Register user.
     * @param {Object} data - info needed for registration
     * @param {String} data.username
     * @param {String} data.password
     * @param {Function} callback 
     */
    register(data, callback)
    {
        utils.getHashedPassword(data.password, (err, hash) =>
        {
            if(err) return callback(err);
            this._userManager.createUser(data.username, hash, callback);
        });
    }
}
module.exports = exports = CredentialsRegistrator;
