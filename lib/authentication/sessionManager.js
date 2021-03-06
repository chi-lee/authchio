"use strict"
const mongoose = require("mongoose");

/**
 * Class manaing session
 */
class SessionManager
{
    /**
     * Create a SessionManager
     * @param {Object} options
     * @param {String} [options.modelName=Session] - Mongoose Model name
     * @param {Number} [options.expiresIn=3600] - Time to expire of sessions
     */
    constructor(options)
    {
        const _options = options || {};
        this._modelName = _options.modelName || "Session";
        this._expiresIn = _options.expiresIn || 3600;
         
        const sessionSchema = new mongoose.Schema(
        {
            user        : { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            createdAt   : { type: Date, expires: this._expiresIn }
        });
        this._Session = mongoose.model(`${ this._modelName }`, sessionSchema);
    }

    /**
     * Get model name
     * @returns {Sting} modelName
     */
    getModelName()
    {
        return this._modelName;
    }

    /**
     * Get expiresIn
     * @returns {Number} expiresIn
     */
    getExpiresIn()
    {
        return this._expiresIn;
    } 

    /**
     * Create a session
     * @param {String} userId
     * @param {Function} callback
     */
    createSession(userId, callback)
    {
        this._Session.create({ user: userId }, (err, _session) =>
        {
            if(err) return callback(new Error(`Cannot create session for user ${ userId }, ${ err.message }`));
            return callback(null, _session);
        });
    }

    /**
     * Get user of session using session ID
     * @param {String} sessionId
     * @param {Function} callback 
     */
    getUserOfSessionWithSessionId(id, callback)
    {
        this._Session.findOne({ _id: id }).populate("user").exec((err, _session) =>
        {
            if(err) return callback(new Error(`Cannot find session with session id ${ id }, ${ err.message }`));
            if(!_session) return callback();
            return callback(null, _session.user);
        });
    }

    /**
     * Remove session using session ID
     * @param {String} sessionId
     * @param {Function} callback
     */ 
    deleteSessionWithSessionId(id, callback)
    {
        this._Session.remove({ _id: id }, (err, _session) =>
        {
            if(err) return callback(new Error(`Cannot remove session with session id ${ id }, ${ err.message }`));
            return callback(null, _session);
        });
    }

    /**
     * Remove sessions with user ID
     * @param {String} userId
     * @param {Function} callback
     */
    deleteSessionsWithUserId(id, callback)
    {
        this._Session.remove({ user: id }, (err, _sessions) =>
        {
            if(err) return callback(new Error(`Cannot remove sessions with user id ${ id }, ${ err.message }`));
            return callback(null, _sessions);
        });
    }
}
module.exports = exports = SessionManager;
