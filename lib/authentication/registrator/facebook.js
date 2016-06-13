"use strict"
const FacebookConnection = require("../../../facebook");
const UserManager = require("../../userManager");
const FacebookLinkageManager = require("../linkageManager/facebook");

/**
 * Class responsible for register user with facebook
 */
class FacebookRegistrator
{
    /**
     * Create a FacebookRegistrator.
     * @param {UserManager} userManager
     * @param {FacebookConnection} facebookConnection
     * @param {FacebookLinkageManager} facebookLinkageManager
     */
    constructor(userManager, facebookConnection, facebookLinkageManager)
    {
        if(!userManager instanceof UserManager) throw new Error("Not an instance of UserManager");
        if(!facebookConnection instanceof FacebookConnection) throw new Error("Not an instance of FacebookConnection");
        if(!facebookLinkageManager instanceof FacebookLinkageManager) throw new Error("Not an instance of FacebookLinkageManager");
        this._userManager = userManager;
        this._facebookConnection = facebookConnection;
        this._facebookLinkageManager = facebookLinkageManager;
    }

    /**
     * Register a user using facebook login
     * @param {Object} data - info needed for registration
     * @param {String} data.userToken - Facebook User Token (Access Code)
     * @param {Function} callback
     */  
    register(data, callback)
    {
        this._facebookConnection.inspectUserToken(data.userToken, (err, info) =>
        {
            if(err) return callback(err);
            const facebookId = info.user_id;
            this._facebookConnection.getUserProfile(facebookId, userToken, (err, profile) =>
            {
                if(err) return callback(err);
                this._facebookLinkageManager.getFacebookUserByFacebookId(facebookId, (err, refFacebookUser) =>
                {
                    if(err) return callback(err);
                    if(refFacebookUser) return callback(new Error("Facebook user exists"));
                    this._userManager.create(profile.email, "", true, (err, userId) =>
                    {
                        if(err) return callback(err);
                        if(!userId) return callback(new Error("User id exists"));
                        this._FacebookAccount.create({ facebookId: facebookId, user: userId }, callback);
                    });
                });
            });
        });
    }

    /**
     * Deregister a user
     * @param {UserId} userId
     * @param {Function} callback
     */  
    deregister(user, callback)
    {
        this._facebookLinkageManager.deleteFacebookUserWith
    }
}

