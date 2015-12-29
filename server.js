var dns = require('emergency-dns-server');
var express = require('express');
var https = require('https');
var fs = require('fs');
var request = require('request');
var _ = require('lodash');
var mustache = require('mustache');
var WebTorrent = require('webtorrent');
var client = new WebTorrent();


// openssl req -new -nodes -newkey rsa:2048 -out trailers.pem -keyout trailers.key -x509 -days 365 -subj "/C=US/CN=trailers.apple.com"
// openssl x509 -in trailers.pem -outform der -out trailers.cer && cat trailers.key >> trailers.pem

// thumb 640x360
// https://trailers.apple.com/appletv/us/studios/independent/remember/videos/trailer-sd.xml
// magnet:?xt=urn:btih:88594aaacbde40ef3e2510c47374ec0aa396c08e&dn=Big%20Buck%20Bunny&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://tracker.publicbt.com:80/announce

var app = express(),
  credentials = {
    key: fs.readFileSync('trailers.key'),
    cert: fs.readFileSync('trailers.pem'),
  },
  server = https.createServer(credentials, app);


app.get('/play/:hash', function (req, res) {
  res.header("Content-Type", "application/xml");
  var tmp = fs.readFileSync('temp/play.xml', {
    encoding: 'utf8'
  });
  tmp = mustache.render(tmp, {
    hash: req.params.hash
  });
  res.send(tmp);
});

app.get('/details/:name/:hash', function (req, res) {
  res.header("Content-Type", "application/xml");
  var tmp = fs.readFileSync('temp/details.xml', {
    encoding: 'utf8'
  });
  tmp = mustache.render(tmp, {
    name: req.params.name,
    hash: req.params.hash
  });
  res.send(tmp);
});

//https://www.google.com.au/search?q=Arrow.S04E06.HDTV.x264-LOL%5Bettv%5D&safe=off&gbv=1&tbs=iar:t,isz:m&tbm=isch&source=lnt&sa=X
app.get('/image/:search', function (req, res) {
  console.log('https://www.google.com.au/search?q=' + req.params.search + '&safe=off&gbv=1&tbs=iar:t,isz:m&tbm=isch&source=lnt&sa=X');
  request('https://www.google.com.au/search?q=' + req.params.search + '&safe=off&gbv=1&tbs=iar:t,isz:m&tbm=isch&source=lnt&sa=X', function (err, response, body) {
    var match = /src\=\"(https\:\/\/encrypted.+?)"/ig.exec(body);
    if (!match)
      return res.redirect(307, 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRcv8CuL0uGCvSAIIBp29G8LtXQpc51EJhlbVTGhZRyz2HhQxTQIh6NxkcH');
    return res.redirect(307, match[1]);
  });
});

app.get('/appletv/us/index.xml', function (req, res) {

  //https://thepiratebay.se/top/205
  console.log('viewing index');
  request('https://thepiratebay.se/top/205', function (err, response, body) {
    //  console.log(body);
    console.log('loaded TV');

    var myRegexp = /class\=\"detLink\".+?\>(.+?)\<[\s\S]*?href\=\"(.+?)"[\s\S]*?align\=\"right\"\>([0-9]+)[\s\S]*?align\=\"right\"\>([0-9]+)/igm;
    var match = myRegexp.exec(body);

    var listTv = [];
    var count = 0;
    while (match != null) {

      listTv.push({
        raw: match[1],
        count: count++,
        title: match[1].replace(/\./g, ' '),
        magnet: match[2],
        seeds: match[3],
        leech: match[4],
        usTitle: encodeURI(match[1].replace(/\./g, ' ')),
        usRaw: encodeURI(match[1]),
        infoHash: /btih:([a-z0-9]*)/i.exec(match[2])[1]
      });
      match = myRegexp.exec(body);
    }

    res.header("Content-Type", "application/xml");

    var tmp = fs.readFileSync('temp/index.tmp.xml', {
      encoding: 'utf8'
    });
    tmp = mustache.render(tmp, {
      listTv: listTv
    });
    res.send(tmp);
  });

});

//app.get('/appletv/us/:xml', function (req, res) {
//  res.header("Content-Type", "application/xml");
//  console.log('Served ' + 'temp/' + req.params.xml);
//  res.send(fs.readFileSync('temp/' + req.params.xml));
//});

app.get('/appletv/us/js/:file', function (req, res) {
  res.header("Content-Type", "application/x-javascript");
  console.log('Served ' + 'assets/' + req.params.file);
  res.send(fs.readFileSync('assets/' + req.params.file));
});

app.use('/video', express.static('videos/'));

app.get('/trailer.cer', function (req, res) {
  res.send(fs.readFileSync('trailers.cer'));
});

app.get('*', function (req, res) {
  console.log(req._parsedUrl);
  res.send('Hello World');
});



server.listen(443);
app.listen(80);

dns.run({
  _: ['trailers.apple.com:a:192.168.1.16'],
  p: 53,
  u: '8.8.8.8'
});

var http = require('http'),
  fs = require('fs'),
  util = require('util');

http.createServer(function (req, res) {

  if (req.url == '/favicon.ico') {
    res.writeHead(200);
    res.end();
    return;
  }

  var hash = req.url.replace(/[^0-9a-z]/ig, '').toLowerCase();

  function streamTor(torrent) {
    var playFile = {
      length: 0
    };
    if (torrent.files)
      torrent.files.map(function (f) {
        if (f.length > playFile.length)
          playFile = f;
      });

    if (!_.contains(playFile.name.toLowerCase(), '.mp4')) {
      torrent.destroy();
      res.writeHead(500);
      res.end();
      console.log('notmp4');
      return;
    } else {
      console.log('started');
    }

    var total = playFile.length;

    if (req.headers['range']) {
      var range = req.headers.range;
      var parts = range.replace(/bytes=/, "").split("-");
      var partialstart = parts[0];
      var partialend = parts[1];

      var start = parseInt(partialstart, 10);
      var end = partialend ? parseInt(partialend, 10) : total - 1;
      var chunksize = (end - start) + 1;
      console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

      var file = playFile.createReadStream({
        start: start,
        end: end
      });

      file.on('data', function (e) {
        console.log(e);
      });
      res.writeHead(206, {
        'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4'
      });
      file.pipe(res);
    } else {
      console.log('ALL: ' + total);
      res.writeHead(200, {
        'Content-Length': total,
        'Content-Type': 'video/mp4',
        'filename': playFile.name
      });
      playFile.createReadStream().pipe(res);
    }

    //  res.header("Content-Length", playFile.length);
    //  var stream = playFile.createReadStream();
    //  stream.pipe(res);
  }

  var torrentExists = _.find(client.torrents, {
    infoHash: hash.toLowerCase()
  });

  if (!torrentExists)
    client.add('magnet:?xt=urn:btih:' + hash + '&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969', function (torrent) {
      streamTor(torrent);
      var displayComplete = setInterval(function () {
        var pDone = ((100 / torrent.length) * torrent.downloaded);
        console.log(pDone);
        if (pDone > 99) {
          clearInterval(displayComplete);
          // in an hour kill the torrent
          setTimeout(function () {
            torrent.destroy();
          }, 1000 * 60 * 60);
        }

      }, 5000);
    });
  else
    streamTor(torrentExists);

}).listen(8888);





//request({
//  url: 'https://kat.cr/usearch/dvdrip%20category%3Amovies%20age%3Amonth%20lang_id%3A2%20verified%3A1/?rss=1',
//  gzip: true
//}, function (err, response, body) {
//  parseXml(body, function (err, result) {
//    console.log(result.rss.channel[0].item);
//  });
//});




//
//var WebTorrent = require('webtorrent');
//
//var client = new WebTorrent();
//
//client.add('https://torcache.net/torrent/3139040B4287FE6DD2B3FC0A8684BC623261F381.torrent', function (torrent) {
//  setInterval(function () {
//
//    console.log(torrent.name);
//    console.log(_.keys(torrent));
//    console.log(((100 / torrent.length) * torrent.downloaded).toFixed(2) + '%');
//  }, 3000);
//});
