var casper = require('casper').create({
    pageSettings: {
        userAgent : "chrome",
        loadImages:  false,
        loadPlugins: false
    },
    timeout : 30 * 1000,
    onTimeout : function(){
        this.echo(JSON.stringify({
            success : false
        })).exit();
    },
    onError : function(){
        this.echo(JSON.stringify({
            success : false
        })).exit();
    }
});


var base64 =  require('../module/base64'),
    fs = require('fs'),
    userConf = require('../config/userConf'),
    curUser = userConf.website,
    postPath =  'loger/post_content.txt',
    args2 = casper.cli.args,
    post = JSON.parse(fs.read(postPath).toString());

casper.start('http://www.baoxiaoyike.cn/wp-admin/post-new.php', function() {

    //if( this.exists('#loginform') ) {
        this.fill('#loginform', {
            'log': curUser.username,
            'pwd': curUser.password
        }, false);
        this.click('#wp-submit');
        this.echo('正在模拟登录');
    //}

});


casper.waitFor(function check() {
    return this.evaluate(function() {
        return document.querySelectorAll('#titlewrap').length > 0;
    });
}, function then() {

    casper.evaluate(function(title, content, category) {
        document.querySelector('#title').value = title;
        if( typeof tinyMCE != 'undefined' ) {
            tinyMCE.execCommand("mceInsertContent", false,  content);
        } else {
            document.querySelector('#content').innerHTML = content;
        }

        document.querySelector('#in-category-' + category).checked = true;

        document.querySelector('#post-format-video').checked = true;

        document.querySelector('#publish').click();

    }, post.title, post.content, post["in-category"]);

    casper.waitFor(function check() {
        return this.evaluate(function() {
            return document.querySelectorAll('#message').length > 0;
        });
    }, function then() {
        this.echo(JSON.stringify({
            success : true
        })).exit();
    }, function timeout() {

        this.echo(JSON.stringify({
            success : false
        })).exit();
    }, 20 * 1000);
}, function timeout() {
        this.echo(JSON.stringify({
            success : false
        })).exit();
}, 30 * 1000);

casper.run();
