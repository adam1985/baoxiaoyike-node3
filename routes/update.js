
/*
 * GET update listing.
 */

var cheerio = require('cheerio');
var nodegrass = require('nodegrass');
var dateFormat = require('../module/dateFormat');
var http = require("http");
var fs = require('fs');
var spawn = require('child_process').spawn;

var trim = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
};


exports.updateData = function(req, res){

    var createpageMessage = function( data ) {
        fs.writeFileSync(listPath, '');
        if( data.length ){
            data.forEach(function(v){
                fs.appendFileSync(listPath, v.sourcePage + '\r\n');
                fs.appendFileSync(listPath, v.title + '\r\n');
                fs.appendFileSync(listPath, v.username + '\r\n');
                fs.appendFileSync(listPath, v.viewSource + '\r\n');
                if(v.pages.length){
                    v.pages.forEach(function(page){
                        
						if(page.imgSrc){
							fs.appendFileSync(listPath, page.imgSrc + '\r\n');
						}
						
						if(page.pageUrl){
							fs.appendFileSync(listPath, page.pageUrl + '\r\n');
						}
                        
                        fs.appendFileSync(listPath, '\r\n');
                    });
                }
                fs.appendFileSync(listPath, '\r\n\r\n');
            });
        }
    };


    var successMessage = function( data ){
        var obj = {
                dir : dateString
            },
            list = [];
        if( data.length ){
            data.forEach(function(v){
                var pages = v.pages, imgSrc, pageUrl;

                pages.forEach(function(v){
                    if(v.pageUrl){
                        imgSrc = v.imgSrc;
                        pageUrl = v.pageUrl;
                    }
                });

                list.push({
                    title : v.title,
                    sourcePage : v.sourcePage,
                    imgSrc : imgSrc,
                    pageUrl : pageUrl
                });
            });
        }

        obj.list = list;
        return obj;
    };


    var dateString = req.body.dir,
        dirPath = './create/' + dateString,
        logerDir = './loger',
        listPath = dirPath + '/list.txt',
        pageJson = dirPath + '/pageJson.txt',
        resultPath = dirPath + '/result.txt';

    var titles = req.body.titles, titleArr;

    if( titles ){
        titleArr = JSON.parse( titles );

        var pageJsonStr = fs.readFileSync( pageJson ).toString(),
            pageJsonObj = JSON.parse( pageJsonStr ),
            resultStr = fs.readFileSync(resultPath ).toString(),
            resultObj = JSON.parse( resultStr );

        titleArr.forEach(function(v, i){
            resultObj.list[i].title = pageJsonObj[i].title = v;
        });

        fs.writeFileSync(pageJson, JSON.stringify(pageJsonObj) );
        fs.writeFileSync(resultPath, JSON.stringify(resultObj) );
        createpageMessage(pageJsonObj);

        res.set({'Content-Type':'text/plain'});
        res.send(JSON.stringify({
            success : true,
            data : resultObj
        }));

    }

};