var fs = require('fs'),
    querystring = require("querystring"),
    tools = require('./tools'),
    https = require('https'),
    ejs = require('ejs'),
    userConf = require('../config/userConf'),
    rootPath = process.cwd(),
    workPath = rootPath + '/create/',
    ticketPath = rootPath + '/loger/ticket.txt';
module.exports = function( req, res ){
    var query = req.query,
        post_time = query.post_time,
        post_platform = query.post_platform,
        curUser = userConf[post_platform],
        preusername = query.post_preview,
        dataPath = workPath + post_time + '/',
        pageJsonStr = fs.readFileSync( dataPath + 'pageJson.txt').toString(),
        pageJson = JSON.parse( pageJsonStr),
        contentTemplate = fs.readFileSync( rootPath + '/views/' + curUser.template, 'utf8').toString(),
        ticketObj = JSON.parse(fs.readFileSync(ticketPath).toString()),
        weixinWx = ticketObj.weixinWx,
        cookie = ticketObj.cookie;

    pageJson.forEach(function(v, i){
        pageJson[i].viewSource = curUser.viewSource;
    });

    if( pageJson.length ){
        pageJson.forEach(function(v, i){
            var imgPath;
            v.pages.forEach(function(vv, ii){
                if( vv.imgSrc ) {
                    imgPath = vv.imgSrc;
                }
            });
            pageJson[i]['content'] = ejs.render(contentTemplate, {
                list : v.pages,
                picSrc : imgPath
            });
        });
    }


    var postData = (function(){
        var _postData = {};
        pageJson.forEach(function(v, i){
            _postData["title" +i] = v.title;
            _postData["sourceurl" +i] = v.viewSource;
            _postData["show_cover_pic" +i] = 0;
            _postData["fileid" +i] = "";
            _postData["digest" +i] = curUser.intro;
            _postData["content" +i] = v.content;
            _postData["author" +i] = v.username;
        });

        return _postData;

    }());

    var paramQuery = {
            t : "ajax-appmsg-preview",
            sub : "preview",
            type : 10,
            token : weixinWx.t,
            lang : "zh_CN"
        },
        postParam = {
            vid : "",
            AppMsgId : "",
            imgcode : "",
            preusername : preusername,
            token : weixinWx.t,
            random : Math.random(),
            lang : "zh_CN",
            count : pageJson.length,
            f : "json",
            ajax : 1
        },

        paramStr = querystring.stringify( paramQuery );

    postParam = tools.extend(postParam, postData);
    var postParamString = querystring.stringify( postParam),
        contentLength = postParamString.length;

    var options = {
        host: "mp.weixin.qq.com",
        port: 443,
        method: 'POST',
        path: '/cgi-bin/operate_appmsg?' + paramStr,
        headers: {
            "Connection": "keep-alive",
            "Accept": "*/*",
            "X-Requested-With": "XMLHttpRequest",
            "Accept-Encoding": "gzip,deflate,sdch",
            "Accept-Language": "zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4",
            "Cookie" : cookie,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Content-Length': contentLength,
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31',
            'Referer': 'https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&action=edit&type=10&isMul=1&isNew=1&lang=zh_CN&token=' + weixinWx.t,
            "Host" : "mp.weixin.qq.com",
            "Origin" : "https://mp.weixin.qq.com"
        }
    };
    var Req = https.request(options, function (response) {
        var statusCode = response.statusCode;
        //console.log('STATUS: ' + statusCode,options);
        response.setEncoding('utf8');
        var data = '';
        response.on('data', function (chunk) {
            data += chunk;
        }).on('end', function () {
            res.set({'Content-Type':'text/plain'});

            res.send(data);

        });
    });
    Req.write(postParamString, 'utf8');

    Req.end();

    Req.on('error', function (e) {
        console.error("error:" + e);
    });

};
