
/*
 * GET update listing.
 */

var cheerio = require('cheerio');
var nodegrass = require('nodegrass');
var dateFormat = require('../module/dateFormat');
var http = require("http");
var fs = require('fs');
var base64 =  require('../module/base64');
var spawn = require('child_process').spawn;


exports.post = function(req, res){


        var logerDir = './loger',
            createPath = './create/',
            postPath = logerDir + '/post_content.txt';

    var pBody = req.body,
        index = +pBody.index,
        dir = pBody.dir,
        pageJson = createPath + dir +  '/pageJson.txt',
        resultPath = createPath + dir + '/result.txt',
        category = pBody["in-category"],
        postState = pBody["post-state"],
        have_post = pBody["have_post"],
        sendData = (function(){
            var obj = {
                  title : pBody.title
            },
            pageUrl = pBody.pageUrl,
            imgSrc = pBody.imgSrc,
            content = '[[videoBase64=' + base64.encode( pageUrl + '||' + imgSrc  ) + ']]';
            obj["in-category"] = pBody["in-category"];
            obj.content = content;
            return obj;

        }()),



        resultStr = fs.readFileSync(resultPath ).toString(),
        resultObj = JSON.parse( resultStr );

    fs.writeFileSync(postPath, JSON.stringify(sendData) );

    resultObj.list[index]["in-category"] = category;
    resultObj.list[index]["post-state"] = postState;


    fs.writeFileSync(resultPath, JSON.stringify(resultObj) );

    res.set({'Content-Type':'text/plain'});
    if( postState == 1 && have_post == 0 ) {

        var casper = spawn('casperjs', [
            "casper/post.js"
        ], {});

        var resJson;

        casper.stdout.on('data', function (data) {
            data = data.toString();

            console.log(data);

            try{
                resJson = JSON.parse( data );
            } catch(e){

            }

        });
	

        casper.on('exit', function (code,signal) {
            if( resJson ) {
                if( resJson.success ){
                    resultObj.list[index]["post-status"] = "发布成功";
                    resultObj.list[index].success = 1;

                    fs.writeFileSync(resultPath, JSON.stringify(resultObj) );

                    res.send(JSON.stringify({
                        success : true,
                        data : {
                            msg : "发布成功",
                            detail : {
                                dir : resultObj.dir,
                                list : [resultObj.list[index]]
                            }
                        }
                    }));

                } else {
                    resultObj.list[index]["post-status"] = "发布失败";
                    resultObj.list[index].success = 0;

                    fs.writeFileSync(resultPath, JSON.stringify(resultObj) );

                    res.send(JSON.stringify({
                        success : true,
                        msg : "发布失败",
                        data : {
                            detail : {
                                dir : resultObj.dir,
                                list : [resultObj.list[index]]
                            }
                        }
                    }));
                }
            }
        });

    } else {
        res.send(JSON.stringify({
            success : false
        }));
    }
	
	fs.writeFileSync(resultPath, JSON.stringify(resultObj) );

};