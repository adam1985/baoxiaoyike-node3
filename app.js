
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , fetch = require('./routes/fetch')
  , update = require('./routes/update')
  , remote = require('./routes/remote')
  , readArt = require('./routes/readArt')
  , postWeixin = require('./routes/postWeixin')
  , getWeixin = require('./routes/getWeixin')
  , getView = require('./routes/getView')
  , getTicket = require('./routes/getTicket')
  , upload = require('./routes/upload')
  , syncPreview = require('./routes/syncPreview')
  , syncWeixin = require('./routes/syncWeixin')
  , downloadVideo = require('./routes/download')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 2222);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/fetch', fetch.fetchresult);
app.post('/update', update.updateData);
app.post('/remote', remote.post);
app.get('/readArt', readArt.getArt);
app.get('/postWeixin', postWeixin);
app.get('/getWeixin', getWeixin);
app.get('/getView', getView);
app.get('/getTicket', getTicket);
app.get('/upload', upload);
app.get('/syncPreview', syncPreview);
app.get('/syncWeixin', syncWeixin);
app.get('/download', downloadVideo);


http.createServer(app).listen(2222, function(){
  console.log("Express server listening on port " + app.get('port'));
});
