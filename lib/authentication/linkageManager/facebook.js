"use strict"
const mongoose = require("mongoose");
const LinkageManager = require("../linkageManager");

/**
 * Class manaing facebook linkages
 * @extends LinkageManager
 */
class FacebookLinkageManager extends LinkageManager
{
    /**
     * Create a FacebookLinkageManager
     */
    constructor()
    {
        const facebookLinkageSchema = new mongoose.Schema(
        {
            facebookId  : { type: String, index: { unique: true } },
            user        : { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        });
        this._FacebookLinkage = mongoose.model("FacebookLinkage", facebookLinkageSchema);
    }
    
    /**
     * Create a facebook linkage
     * @param {String} userId
     * @param {Object} data
     * @param {String} data.facebookId - Facebook user ID
     */
    createLinkage(userId, data, callback)
    {
        this._FacebookLinkage.create({ user: userId, facebookId: data.facebookId }, callback);
    }

    /**
     * Get facebook linkage with user ID
     * @param {String} userId
     * @param {Function} callback
     */
    getLinkageByUserId(userId, callback)
    {
        this._FacebookLinkage.findOne({ userId: userId }, callback);
    }
    
    /**
     * Get user of facebook linkage with facebook user ID
     * @param {Object} data
     * @param {String} data.facebookId - facebook user ID
     * @param {Function} callback
     */
    getLinkage(data, callback)
    {
        this._FacebookLinkage.findOne({ facebookId: data.facebookId }).populate("user").exec((err, refFacebookLinkage) =>
        {
            if(err) return callback(err);
            if(!refFacebookLinkage) return callback();
            return callback(null, refFacebookLinkage.user);
        });
    }
    
    /**
     * Delete facebook linkage with facebook user ID
     * @param {Object} data
     * @param {String} data.facebookId - Facebook user ID
     * @param {Function} callback
     */
    deleteLinkage(data, callback)
    {
        this._FacebookLinkage.remove({ facebookId: data.facebookId }, callback);
    }

    /**
     * Delete facebook linkage with user ID
     * @param {String} userId
     * @param {Function} callback
     */
    deleteLinkageByUserId(userId, callback)
    {
        this._FacebookLinkage.remove({ user: userId }, callback);
    } 
}
module.exports = exports = FacebookLinkageManager;
