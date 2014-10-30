var fs = require('fs'),
    ticket = require("./ticket"),
    userConf = require('../config/userConf'),
    rootPath = process.cwd(),
    ticketPath = rootPath + '/loger/ticket.txt';

module.exports = function( req, res){

    var query = req.query,
        post_platform = query.post_platform,
        curUser = userConf[post_platform];

    ticket.getTicket(curUser.user, curUser.pwd, function(weixinWx, cookie, loginRes){
        var data = {
            weixinWx : weixinWx,
            cookie : cookie
        };
        fs.writeFileSync(ticketPath, JSON.stringify(data));
        res.set({'Content-Type':'text/plain'});

        res.send(JSON.stringify({
            success : true,
            msg : "操作成功",
            loginRes : loginRes,
            data : data
        }));
    });
};




