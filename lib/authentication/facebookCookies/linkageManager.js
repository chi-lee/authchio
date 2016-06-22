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
     * Create a Facebook linkage
     * @param {String} userId
     * @param {Object} data
     * @param {String} data.facebookId - Facebook user ID
     */
    createLinkage(userId, data, callback)
    {
        this._FacebookLinkage.create({ user: userId, facebookId: data.facebookId }, callback);
    }

    /**
     * Get Facebook linkage by user ID
     * @param {String} userId
     * @param {Function} callback
     */
    getLinkageByUserId(userId, callback)
    {
        this._FacebookLinkage.findOne({ userId: userId }, callback);
    }
    
    /**
     * Get Facebook linkage by Facebook user ID
     * @param {Object} data
     * @param {String} data.facebookId - facebook user ID
     * @param {Function} callback
     */
    getLinkageByData(data, callback)
    {
        this._FacebookLinkage.findOne({ facebookId: data.facebookId }, callback);
    }

    /**
     * Get user of Facebook linkage by user ID
     * @param {String} userId
     * @param {Function} callback
     */
    getUserOfLinkageByUserId(userId, callback)
    {
        this._FacebookLinkage.findOne({ userId: userId }).populate("user").exec((err, refFacebookLinkage) =>
        {
            if(err) return callback(err);
            if(!refFacebookLinkage) return callback();
            return callback(null, refFacebookLinkage.user);
        });
    }
    
    /**
     * Get user of facebook linkage by Facebook user ID
     * @param {Object} data
     * @param {String} data.facebookId - Facebook user ID
     * @param {Function} callback
     */
    getUserOfLinkageByData(data, callback)
    {
        this._FacebookLinkage.findOne({ facebookId: data.facebookId }).populate("user").exec((err, refFacebookLinkage) =>
        {
            if(err) return callback(err);
            if(!refFacebookLinkage) return callback();
            return callback(null, refFacebookLinkage.user);
        });
    }
    
    /**
     * Delete Facebook linkage by user ID
     * @param {String} userId
     * @param {Function} callback
     */
    deleteLinkageByUserId(userId, callback)
    {
        this._FacebookLinkage.remove({ user: userId }, callback);
    } 

    /**
     * Delete Facebook linkage by Facebook user ID
     * @param {Object} data
     * @param {String} data.facebookId - Facebook user ID
     * @param {Function} callback
     */
    deleteLinkageByData(data, callback)
    {
        this._FacebookLinkage.remove({ facebookId: data.facebookId }, callback);
    }
}
module.exports = exports = FacebookLinkageManager;
