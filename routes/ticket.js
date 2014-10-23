var ng = require('nodegrass'),
    login = require("./login");

exports.getTicket = function( cb ){
    login.loginWeixin( function(data, cookie){
        if( data.base_resp.ret == 0 ) {
            var redirect_url = data.redirect_url;
            ng.get('https://mp.weixin.qq.com' + redirect_url,function(data, status, header){
                data = data.replace(/\s+/g, '');
                /window\.wx\s*=([\w\W]*?)},/m.test(data);
                var wx = RegExp.$1;
                eval("var weixinWx = " + wx + '}}');
                cb && cb( weixinWx.data, cookie );
            }, {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie" : cookie,
                "Host" : "mp.weixin.qq.com",
                "Referer" :	"http://mp.weixin.qq.com"
            }, {}, 'utf8');
        }

    });
};




