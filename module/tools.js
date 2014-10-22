var dateFormat = require("./dateFormat"),
    fs = require('fs'),
    path = require('path');
dateFormat.format();
var toDate = function( str ){
        str = str.toString();
        var year = +str.substr(0, 4),
            mouth = +str.substr(4, 2) - 1,
            day = +str.substr(6, 2),
            hour = +str.substr(8, 2),
            minute= +str.substr(10, 2),
            second  = +str.substr(12);

        return new Date (year, mouth, day, hour, minute, second);

};

var disposeDirSort = function( dirlists ){
    var obj = {}, list = [];

    if( dirlists.length  ) {
        dirlists.forEach(function(v){
            list.push({
                val1 : v,
                val2 : parseInt(v.replace(/\D/g, ''))
            });
        });

        list = list.sort(function(a, b){
            return b.val2 - a.val2;
        });

        obj.latest = {
            text : toDate(list[0].val2).format("yyyy-MM-dd hh:mm:ss"),
            value : list[0].val1
        };

        obj.list = [];

        list.forEach(function(v){
            obj.list.push({
                text : toDate(v.val2).format("yyyy-MM-dd hh:mm:ss"),
                value : v.val1
            });
        });
    }



    return obj;

};


function readDirNames (dirname) {
    var dirlists = [];
    var basenames = fs.readdirSync(dirname);
    basenames.forEach(function (basename) {
        var filename = path.join(dirname, basename);
        var stats = fs.statSync(filename);
        if (stats.isDirectory()) {
            dirlists.push(basename);
        }
    });

    return dirlists;

}


exports.disposeDirSort = disposeDirSort;
exports.readDirNames = readDirNames;

