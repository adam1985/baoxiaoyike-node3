var webpage = require('webpage').create();
webpage
    .open('https://mp.weixin.qq.com/')
    .then(function () {
        webpage.viewportSize =
        { width:1600, height:1000 };
        webpage.render('casper/page.png');
        slimer.exit()
    });
