"use strict"
const crypto = require("crypto");

const getRandomString = exports.getRandomString = function()
{
    const chars = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    const charsLen = chars.length;
    return function(length)
    {
        const _length = length || 12;
        const rnd = crypto.randomBytes(_length);
        const value = new Array(_length);
        for(let i = 0; i < _length; ++i)
        {
            value[i] = chars[rnd[i] % charsLen];
        }
        return value.join('');
    }
}();

exports.getHashedPassword(password, options, callback)
{
    if(typeof(options) == "function")
    {
        callback = options;
        options = {};
    }

    const iteration = options.iteration || 10000;
    const digest = options.digest || "sha256";
    const salt = options.salt || getRandomString();

    crypto.pbkdf2(password, salt, iteration, 32, digest, (err, key) =>
    {
        if(err) return callback(new Error(`Cannot get hashed password, ${ err.message }`));
        const hash = key.toString("base64");
        return callback(null, `pbkdf2_${ digest }$${ iteration }$${ salt }$${ hash }`);
    });
}
