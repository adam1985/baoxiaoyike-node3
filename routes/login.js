var crypto = require('crypto'),
    ng = require('nodegrass'),
    querystring = require("querystring");

exports.loginWeixin = function( name, pwd, cb ) {
    hasher=crypto.createHash("md5");
    hasher.update(pwd);
    pwd = hasher.digest('hex');

    var query = {
            username : name,
            pwd : pwd,
            imgcode : '',
            f : 'json'
        },
        paramStr = querystring.stringify( query );

    ng.post('https://mp.weixin.qq.com/cgi-bin/login',function(data, status, header){
        var cookieArr = header['set-cookie'], cookie = '';
        cookieArr.forEach(function(v){
            cookie += v.split(';')[0] + ';';
        });

        cb && cb(JSON.parse(data), cookie);
    }, {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": paramStr.length,
        "Host" : "mp.weixin.qq.com",
        "Referer" :	"http://mp.weixin.qq.com"
    }, query, 'utf8');
};
