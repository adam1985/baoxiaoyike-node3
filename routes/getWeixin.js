
/*
 * GET home page.
 */
var fs = require('fs'),
    tools = require('../module/tools'),
    ejs = require('ejs');

var rootPath = process.cwd(),
    createDir = rootPath + '/create/';

module.exports = function(req, res){
var     dirlists = tools.readDirNames( createDir ),
        dirlistsSort = tools.disposeDirSort(dirlists),
        resultPath = (function(){
            var _dir =  '/pageJson.txt';
            if( dirlistsSort.latest ) {
                _dir = createDir  + dirlistsSort.latest.value +  '/pageJson.txt';
            }
            return _dir;
        }());
    var dir = req.query.dir,
        view_template = req.query.template,
        resPath;
    if( dir ){
        resPath = createDir  + req.query.dir  +  '/pageJson.txt';
    } else {
        resPath = resultPath;
    }
    var contentTemplate = fs.readFileSync( rootPath + '/views/' + view_template, 'utf8').toString(),
        postSource = JSON.parse(fs.readFileSync( resPath, 'utf8').toString());

    if( postSource.length ){
        postSource.forEach(function(v, i){
			var imgPath = 'http://adam1985.github.io/bxyk/assets/images/logo.jpg';
			v.pages.forEach(function(vv, ii){
				if( vv.imgSrc ) {
					imgPath = vv.imgSrc;
				}
			});
			postSource[i]['content'] = ejs.render(contentTemplate, {
                list : v.pages,
				picSrc : imgPath
            });
        });
    }

    var callback = req.query.callback || '';
    res.set({'Content-Type':'text/plain'});
    res.send(callback + '(' + JSON.stringify({
        success : true,
        data : postSource
    }) + ');');
};