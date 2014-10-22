var casper = require('casper').create({
    pageSettings: {
        loadImages:  true,
        loadPlugins: true,
        XSSAuditingEnabled : true,
        localToRemoteUrlAccessEnabled : true
    },
    onTimeout : function(){

    },
    onError : function(){

    }
});


var base64 =  require('../module/base64'),
    fs = require('fs'),
    postPath =  'loger/post_content.txt',
    args2 = casper.cli.args,
    post = JSON.parse(fs.read(postPath).toString());

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)');
casper.start('https://mp.weixin.qq.com/', function() {

    this.capture('casper/weiwin.png');

    /*casper.waitFor(function check() {
        return this.evaluate(function() {
            return document.querySelectorAll('#loginForm').length > 0;
        });
    }, function then() {
        this.fillSelectors('#loginForm', {
            '#account': '308106832@qq.com',
            '#pwd': 'yuan008598',
            '#rememberCheck' : true
        }, false);
        //this.click('#loginBt');
        this.evaluate(function() {
            document.querySelector('#loginForm').submit();
        });
        this.echo('login');
    }, function timeout() { // step to execute if check has failed

    });*/

});



/*casper.waitFor(function check() {
    return this.evaluate(function() {
        return true;
    });
}, function then() {
    this.capture('casper/weiwin.png');
});*/


casper.run();
