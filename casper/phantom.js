var page = require('webpage').create();

/*page.customHeaders = {
    "Accept" : "text/html",
    "Accept-Language" : "zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3",
    "Accept-Encoding" : 	"gzip, deflate",
    "Host": "mp.weixin.qq.com",
    "Cache-Control" : "max-age=0",
    "Connection" : "keep-alive",
    "Pragma" : "no-cache",
    "Cookie" : "mm_lang=zh_CN",
    "Referer":"https://mp.weixin.qq.com/cgi-bin/home?t=home/index&lang=zh_CN&token=597449367"
};*/

phantom.addCookie({
    'name'     : 'mm_lang',
    'value'    : 'zh_CN',
    'domain'   : '.qq.com',
    'path'     : '/'
});

page.settings.userAgent = "firefox";
page.open('https://res.wx.qq.com/mpres/zh_CN/htmledition/js/biz_common/jquery-1.9.11ec5f7.js', function () {
    console.log(page.content);
    phantom.exit();
});

