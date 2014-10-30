var ng = require('nodegrass'),
    login = require("./login");

exports.getTicket = function( name, pwd, cb ){
    login.loginWeixin( name, pwd, function(loginRes, cookie){
        if( loginRes.base_resp.ret == 0 ) {
            var redirect_url = loginRes.redirect_url;
            ng.get('https://mp.weixin.qq.com' + redirect_url,function(data, status, header){
                data = data.replace(/\s+/g, '');
                /window\.wx\s*=([\w\W]*?)},/m.test(data);
                var wx = RegExp.$1;
                eval("var weixinWx = " + wx + '}}');
                cb && cb( weixinWx.data, cookie, loginRes );
            }, {
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie" : cookie,
                "Host" : "mp.weixin.qq.com",
                "Referer" :	"http://mp.weixin.qq.com"
            }, {}, 'utf8');
        }

    });
};




