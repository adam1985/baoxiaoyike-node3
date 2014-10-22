
/*
 * GET home page.
 */
var fs = require('fs'), tools = require('../module/tools'),
    createDir = './create/';
var dirlists = tools.readDirNames( createDir ),
    dirlistsSort = tools.disposeDirSort(dirlists),
    post_times = [],
    resultPath = (function(){
        var _dir =  '/result.txt';
        if( dirlistsSort.latest ) {
            _dir = createDir  + dirlistsSort.latest.value +  '/result.txt';
        }
        return _dir;
    }());

var getResult = function( path ){
    var resultJson;
    if( fs.existsSync( path ) ) {
        var result = fs.readFileSync(path).toString();

        try{
            resultJson = JSON.parse( result );
        } catch ( e ){
            resultJson = {
                list : []
            };
        }

    } else {
        resultJson = {
            list : []
        };
    }

    return resultJson;
};

exports.index = function(req, res){
  var data = {
      title: '微信公众平台数据采集'
  };
  data["detail"] = getResult( resultPath );

  if( dirlists.length ){
      post_times = dirlistsSort.list;
  }

  data["post_times"] = post_times;

  res.render('index', data);
};