"use strict"
const https = require("https");
const querystring = require("querystring");

class FacebookConnection
{
    constructor(appId, appSecret)
    {
        this._appId = appId;
        this._appSecret = appSecret;
        this._appToken = null;
    }

    _makeRequest(url, callback)
    {
        https.get(url, res =>
        {
            let buffer = "";
            res.setEncoding("utf8");
            res.on("data", chunk => buffer = buffer + chunk);
            res.on("end", _ => callback(null, buffer));
        }).on("error", err => callback(err));
    }

    _getAppToken(callback)
    {
        if(this._appToken) return callback(null, this._appToken);
        this._makeRequest(`https://graph.facebook.com/oauth/access_token?client_id=${ this._appId }&client_secret=${ this._appSecret }&grant_type=client_credentials`, (err, data) =>
        {
            if(err) return callback(err);
            const _data = querystring.parse(data);
            this._appToken = _data["access_token"];
            callback(null, this._appToken);
        });
    }

    inspectUserToken(userToken, callback)
    {
        this._getAppToken((err, appToken) =>
        {
            if(err) return callback(err);
            this._makeRequest(`https://graph.facebook.com/debug_token?input_token=${ userToken }&access_token=${ this._appToken }`, (err, data) =>
            {
                if(err) return callback(err);
                let _data;
                try
                {
                    _data = JSON.parse(data);
                }
                catch(err)
                {
                    return callback(err);
                }
                if(_data.error) return callback(_data.error);      
                return callback(null, _data);
            });
        })
    }

    getUserProfile(userId, userToken, callback)
    {
        this._getAppToken((err, appToken) =>
        {
            if(err) return callback(err);
            this._makeRequest(`https://graph.facebook.com/${ userId }?access_token=${ userToken }`, (err, data) =>
            {
                if(err) return callback(err);
                let _data;
                try
                {
                    _data = JSON.parse(data);
                }
                catch(err)
                {
                    return callback(err);
                }
                return callback(null, _data);
            });
        });
    }
}
module.exports = exports = FacebookConnection;
