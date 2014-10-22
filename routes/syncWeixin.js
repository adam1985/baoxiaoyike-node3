var Spooky;
try {
    Spooky = require('spooky');
} catch (e) {
    Spooky = require('../lib/spooky');
}

var spooky = new Spooky({
    child: {
        transport: 'http'
    },
    casper: {
        logLevel: 'debug',
        verbose: true,
        viewportSize: {
            width: 1440, height: 768
        },
        pageSettings: {
            outputEncoding: 'gbk'
        }
    }
}, function (err) {

});

spooky.start("http://www.baidu.com");

spooky.then(function () {
    this.echo("1111");
    //这里是CasperJS的方法
});
spooky.thenEvaluate(function () {
// 这里是PhantomJS的方法
});


// this function (and the three spooky calls above) runs in Spooky’s environment
spooky.run();