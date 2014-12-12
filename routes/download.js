var nodegrass = require('nodegrass'),
    querystring = require("querystring"),
    fs = require( 'fs' ),
	http = require('http'),
    path = require('path'),
	tools = require('../module/tools'),
	//ffmpeg = require('fluent-ffmpeg'),
	spawn = require('child_process').spawn,
	exec = require('child_process').exec,
    rootPath = process.cwd();

	//这一段是腾讯视频给的把url转成vid
    function getVidFromUrl(url) {
      url = url || window.location.toString();
      //先从url中分析出vid参数，例如×××××.html?vid=××××××
      var vid = getUrlParam("vid", url),
        r;
      if (!vid) { // 使用新规则生成的专辑单视频页面
        if (r = url.match(/\/\w{15}\/(\w+)\.html/)) {
          vid = r[1];
        }
      }
      // 单视频播放页
      if (!vid) {
        if (r = url.match(/\/page\/\w{1}\/\w{1}\/\w{1}\/(\w+)\.html/)) {
          vid = r[1];
        } else if (r = url.match(/\/(page|play)\/+(\w{11})\.html/)) {
          vid = r[2];
        }
      }
      // 播客专辑播放页
      if (!vid) {
        if (r = url.match(/\/boke\/gplay\/\w+_\w+_(\w+)\.html/)) {
          vid = r[1];
        }
      }
      return encodeURIComponent(vid);
    }
    function getUrlParam(p, u) {
      var u = u || document.location.toString();
      var pa = p + "=";
      var f = u.indexOf(pa);
      if (f != -1) {
        var f2 = u.indexOf("&", f);
        var f2p = u.indexOf("?", f);
        if (f2p != -1 && (f2 == -1 || f2 > f2p))
          f2 = f2p;
        f2p = u.indexOf("#", f);
        if (f2p != -1 && (f2 == -1 || f2 > f2p))
          f2 = f2p;
        if (f2 == -1)
          return u.substring(f + pa.length);
        else
          return u.substring(f + pa.length, f2);
      }
      return "";
    }

    //关于腾讯视频 有问题请找popotang
    function getUrlVid( link, callback){
      var vid = "", r, flashvars = "", return_url;
      //with vid in url query str
      if( r = link.match( new RegExp("(^|&|\\\\?)vid=([^&]*)(&|$|#)") )) {
        vid = encodeURIComponent(r[2]);
        callback( vid );
      }
      //with cid in url
      //如果有连续剧的视频。需要jsonp去腾讯视频后台用cid换取一段json，然后取连续剧的第一集开始播放
      else if( r = link.match( new RegExp("(http://)?v\\.qq\\.com/cover[^/]*/\\w+/([^/]*)\\.html") ) )
      {
        var cid = encodeURIComponent(r[2]), 
		path = 'http://sns.video.qq.com/fcgi-bin/dlib/dataout_ex?auto_id=137&cid=' + cid + '&otype=json'; 
		
		nodegrass.get(path, 
			function ( data ) {
				data = data.toString();
				eval(data);
				try{
					vid = QZOutputJson['videos'][0]['vid'];
				}catch(e){
				}
				callback( vid );
				
		}, 'utf8')

      }
      //with vid in url
      //这里用腾讯视频给的逻辑来做
      else{
        vid = getVidFromUrl(link);
        callback( vid );

      }
    }
	
	var trim = function(str) {
        return str.replace(/^\s+|\s+$/gm, '');
    };
	
module.exports = function( req, response) {

    var query = req.query,
        videoPath = query.url;
		
		getUrlVid(videoPath, function(vid){
			nodegrass.get('http://ibao.sturgeon.mopaas.com/qqVideo/getinfo.php?vid=' + vid, 
			function ( data ) {
				data = data.toString();
				data = data.replace(/QZOutputJson=|;/g, "");	
				var videoParseJson = JSON.parse(data);
				
				var vi = videoParseJson.vl.vi[0];
				var ui = vi.ul.ui;
				var title = vi.ti;
				var fvPath = vi.fn + "?vkey=" + vi.fvkey;
				var firstVideo = true, firstVideoUrl;
				
				/*if(ui.length >>> 0) {
					ui.forEach(function(val){
						if( firstVideo ) {
								firstVideoUrl = val.url + fvPath;
								firstVideo = false;
						}
					});

				}*/
				
				firstVideoUrl = ui[ui.length - 1].url + fvPath;
				
				
				if( firstVideoUrl ) {
					var ext = /(\.\w+)\?vkey=/.exec(firstVideoUrl)[1],
						now = new Date(),
						filename = now.format("yyyy-MM-dd_hh_mm_ss"),
						createPath = './video/' + filename + ext,
						readyPath = './video/' + filename + '_ok' + ext,
						shuiyin = './video/' + 'shuiyin.png';
					console.log(title, 'download...');
					console.log(firstVideoUrl);
					(function(downpath){
						var arg = arguments;
							http.get(downpath, function(res){
								if( res.statusCode == 200 ) {
									var fileData = "";

									res.setEncoding("binary"); 


									res.on("data", function(chunk){
										fileData += chunk;
									});

									res.on("end", function(){
										fs.writeFile(createPath, fileData, "binary", function(err){
											console.log('下载完成!');
											console.log('ffmpeg -i ' + createPath + ' -vf "movie=' + shuiyin + ' [logo],[in][logo] overlay=0:0 [out]" -y -qscale 4 ' + readyPath);
											var child = exec('ffmpeg -i ' + createPath + ' -vf "movie=' + shuiyin + ' [logo],[in][logo] overlay=10:0 [out]" -y -qscale 4 ' + readyPath,
											  function (error, stdout, stderr) {
												if (!error) {
												  response.json({
													success: true,
													msg: '转化成功!'
												  });
												}
											});
										});
									});
								} else {
									arg.callee(res.headers.location);
								}
								
							});
						
					}(firstVideoUrl));
					
				}
				
				
				
			}, 'utf8');
		});

};



