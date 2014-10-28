var ng = require('nodegrass'),
    crypto = require('crypto'),
    hasher=crypto.createHash("md5"),
    querystring = require("querystring"),
    fs = require( 'fs' ),
    https = require('https'),
    path = require('path'),
    ticket = require("./ticket"),
    userConf = require('../config/userConf'),
    rootPath = process.cwd();

module.exports = function( req, res) {

    var query = req.query,
        post_platform = query.post_platform,
        post_time = query.post_time,
        curUser = userConf[post_platform];

    ticket.getTicket(curUser.user, curUser.pwd, function(weixinWx, cookie){
        var getParam = {
                action : "upload_material",
                f : "json",
                writetype : "doublewrite",
                groupid : 1,
                ticket_id : weixinWx.user_name,
                ticket : weixinWx.ticket
            },
            getParamStr = querystring.stringify(getParam) + weixinWx.param,

            imgFile = rootPath + '/create/2014-10-23_15_38_03/00.jpg',
            file = fs.readFileSync(imgFile);

        var uploadMedia = function (medianame, reqData, callback) {

            var boundary = 'tvmin';
            var max = 9007199254740992;
            var dec = Math.random() * max;
            var hex = boundary + dec.toString(36);

            var ran = (function(){
                var min = 1000,
                    max = 99999,
                    _ran = Math.random() * max;
                if( _ran < min){
                    _ran += min;
                }
                return parseInt(_ran);
            }());

            hasher.update(ran.toString());
            var ranMd5 = hasher.digest('hex').substr(0, 16);

            var mimes = {
                '.bmp': 'image/bmp',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.mp3': 'audio/mp3',
                '.wav': 'audio/x-wav',
                '.amr': 'audior',
                '.wma': 'audio/x-ms-wma',
                '.mp4': 'video/mp4',
                '.rm': 'video/rm',
                '.rmvb': 'videond.rn-realvideo',
                '.wmv': 'video/x-ms-wmv',
                '.avi': 'video/x-msvideo',
                '.mpg': 'video/mpeg',
                '.mpeg': 'video/mpeg'
            };
            var ext = path.extname(medianame).toLowerCase(),
                basename = path.basename(medianame).toLowerCase();
            var mime = mimes[ext];
            //var boundaryKey = '----------GI3KM7gL6Ij5GI3cH2GI3ae0Ij5gL6';
            var boundaryKey = '----------WebKitFormBoundary' + hex;
            //var boundaryKey = '----------' + ranMd5;

            var payload1 = '\r\n\r\n--' + boundaryKey + '\r\n'
                + 'Content-Disposition: form-data; name="Filename"' +
                '\r\n\r\n' + basename;


            var payload2 =  '\r\n--' + boundaryKey + '\r\n'
                + 'Content-Disposition: form-data; name="folder"'
                + '\r\n\r\n' + '/cgi-bin/uploads';



            var payload3 =  '\r\n--' + boundaryKey + '\r\n'
                + 'Content-Disposition: form-data; name="file"; filename="' + basename + '"' + '\r\n'
                + 'Content-Type: application/octet-stream' + '\r\n\r\n';

            var payload = payload1 + payload2 + payload3;

            var enddata = '\r\n--' + boundaryKey + '\r\n'
                        + 'Content-Disposition: form-data; name="Upload"\r\n\r\n'
                        + 'Submit Query\r\n'
                        + '--' + boundaryKey + '--';

            console.log(payload, enddata);


            var contentLength = Buffer.byteLength(payload, 'utf8') +  reqData.length + Buffer.byteLength(enddata, 'utf8');

            var options = {
                host: "mp.weixin.qq.com",
                port: 443,
                method: 'POST',
                path: '/cgi-bin/filetransfer?' + getParamStr,
                headers: {
                    "Connection": "keep-alive",
                    "Accept": "*/*",
                    "Accept-Encoding": "gzip,deflate,sdch",
                    "Accept-Language": "zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4",
                    "Cookie" : cookie,
                    'Content-Type': 'multipart/form-data; boundary=' + boundaryKey,
                    'Content-Length': contentLength,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31',
                    'Referer': 'https://mp.weixin.qq.com/cgi-bin/filepage?type=2&begin=0&count=12&t=media/img_list&token=' + weixinWx.t + '&lang=zh_CN',
                    "Host" : "mp.weixin.qq.com",
                    "Origin" : "https://mp.weixin.qq.com"
                }
            };
            var req = https.request(options, function (response) {
                var statusCode = response.statusCode;
                //console.log('STATUS: ' + statusCode,options);
                response.setEncoding('utf8');
                var data = '';
                response.on('data', function (chunk) {
                    data += chunk;
                }).on('end', function () {
                    callback(data);
                });
            });
            req.write(payload, 'utf8');
            req.write(reqData, 'binary');
            req.write(enddata, 'utf8');

            req.end();

            req.on('error', function (e) {
                console.error("error:" + e);
            });
        };

        uploadMedia( imgFile, file, function(data){
            res.set({'Content-Type':'text/plain'});
            res.send(JSON.stringify({
                success : true,
                msg : "操作成功",
                data : data
            }));

        });

    });

};



