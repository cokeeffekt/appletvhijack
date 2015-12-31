var request = require('request');
var domain = 'https://thepiratebay.se/'.trim('/');

function pbget(pths, callback) {
  callback = callback || function () {}
  var rtlst = [];

  pths.map(function (pth) {
    var count = 0;
    request(domain + pth, function (err, response, body) {
      var myRegexp = /class\=\"detLink\".+?\>(.+?)\<[\s\S]*?href\=\"(.+?)"[\s\S]*?align\=\"right\"\>([0-9]+)[\s\S]*?align\=\"right\"\>([0-9]+)/igm;
      var match = myRegexp.exec(body);
      var listTor = [];
      while (match != null) {
        listTor.push({
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
      rtlst.push({
        path: pth,
        list: listTor
      });

      if (rtlst.length === pths.length)
        callback(rtlst);

    });


  });
}

module.exports = pbget;
