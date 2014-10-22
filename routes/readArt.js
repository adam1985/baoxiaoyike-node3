
/*
 * GET home page.
 */
var fs = require('fs'),
    createDir = './create/';

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

exports.getArt = function(req, res){
    var dir = req.query.dir,
    resultPath = createDir  + dir +  '/result.txt';

    res.set({'Content-Type':'text/plain'});
    res.send(JSON.stringify({
        success : true,
        data : getResult( resultPath )
    }));
};

