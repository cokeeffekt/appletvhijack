// Templates

// Set the doesJavaScriptLoadRoot to true because we are loading the root URL in onAppEntry
atv.config = {
  "doesJavaScriptLoadRoot": true,

  "VERSION": 1365186643,

  // Templates
  "TEMPLATES": {
    "SHOWTIMES": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<atv>\n\t<head>\n\t\t<%= scriptTags() %>\n\t<\/head>\n\t<body>\n\t\t<listScrollerSplit id=\"<%= pageId() %>\">\n\t\t\t<header>\n\t\t\t\t<simpleHeader>\n\t\t\t\t\t<title>Local Showtimes<\/title>\n\t\t\t\t<\/simpleHeader>\n\t\t\t<\/header>\n\t\t\t<menu>\n\t\t\t\t<sections>\n\n\t\t\t\t\t<% if( theatreData.length > 0 ) { %>\n\n\t\t\t\t\t<menuSection>\n\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t<textDivider alignment=\"left\">\n\t\t\t\t\t\t\t\t<title>Nearby Theatres<\/title>\n\t\t\t\t\t\t\t<\/textDivider>\n\t\t\t\t\t\t<\/header>\n\t\t\t\t\t\t<items>\n\n\n\t\t\t\t\t\t\t<% theatreData.forEach( function( theatre, index ) { %>\n\n\t\t\t\t\t\t\t\t<% var showtimes = moviePosterItems( theatre ) %>\n\n\t\t\t\t\t\t\t\t<% if( showtimes ) { %>\n\t\t\t\t\t\t\t\t<oneLineMenuItem id=\"theatre_list_<%= index %>\">\n\t\t\t\t\t\t\t\t\t<label><%= theatre.name %><\/label>\n\t\t\t\t\t\t\t\t\t<preview>\n\t\t\t\t\t\t\t\t\t\t<scrollerPreview id=\"<%= pageId() +'_'+ theatre.id %>\">\n\t\t\t\t\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t\t\t\t\t<grid columnCount=\"5\" id=\"GRID_<%= pageId() %>_<%= theatre.id %>\">\n\t\t\t\t\t\t\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<%= showtimes %>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<\/items>\n\t\t\t\t\t\t\t\t\t\t\t\t<\/grid>\n\t\t\t\t\t\t\t\t\t\t\t<\/items>\n\t\t\t\t\t\t\t\t\t\t<\/scrollerPreview>\n\t\t\t\t\t\t\t\t\t<\/preview>\n\t\t\t\t\t\t\t\t<\/oneLineMenuItem>\n\t\t\t\t\t\t\t\t<% } %>\n\n\t\t\t\t\t\t\t<% }) %>\n\n\t\t\t\t\t\t<\/items>\n\t\t\t\t\t<\/menuSection>\n\n\t\t\t\t\t<% } %>\n\n\t\t\t\t\t<menuSection>\n\t\t\t\t\t\t<header>\n\t\t\t\t\t\t\t<textDivider alignment=\"left\">\n\t\t\t\t\t\t\t\t<title>Settings<\/title>\n\t\t\t\t\t\t\t<\/textDivider>\n\t\t\t\t\t\t<\/header>\n\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t<oneLineMenuItem accessibilityLabel=\"Set Location\" id=\"CHANGE_LOCATION\" onSelect=\"Trailers.fireCallbackEvent( 'PromptForLocation' );\">\n\t\t\t\t\t\t\t\t<label>Set Location<\/label>\n\t\t\t\t\t\t\t\t<rightLabel><%= location() %><\/rightLabel>\n\t\t\t\t\t\t\t<\/oneLineMenuItem>\n\t\t\t\t\t\t<\/items>\n\t\t\t\t\t<\/menuSection>\n\t\t\t\t<\/sections>\n\t\t\t<\/menu>\n\t\t<\/listScrollerSplit>\n\t<\/body>\n<\/atv>",
    "MOVIEPAGE": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<atv>\n  <head>\n      <%= scriptTags() %>\n      <stash>\n        <% var theatre = selectedTheatre().shift() %>\n        <% var movie = selectedMovie( theatre ).shift() %>\n        <% var otherTheatres = nearbyTheatres( theatre ) %>\n        <movieDetailProperties>{ \"tribune_id\":\"<%= tribune_id %>\", \"movie_id\":\"<%= movie_id %>\", \"theatre_id\":\"<%= theatre_id %>\" }<\/movieDetailProperties>\n        <movieData><%= escape( JSON.stringify( movieData ) ) %><\/movieData>\n      <\/stash>\n  <\/head>\n  <body>\n    <listByNavigation id=\"<%= pageId() %>\" onNavigate=\"Trailers.handleOnNavigate( event, 'MovieShowtimesNavigationHandler' )\">\n        <header>\n            <tumblerWithSubtitle accessibilityLabel=\"Showtime for <%= date.toLocaleDateString() %> near <%= location() %>\">\n                <subtitle>Location: <%= location() %><\/subtitle>\n            <\/tumblerWithSubtitle>\n        <\/header>\n        <navigation currentIndex=\"1\">\n\n          <%= dateNavigation( date ) %>\n\n        <\/navigation>\n\n        <menu id=\"showtime_menu\" >\n            <sections>\n                <% if( movieData && movieData.title ) { %>\n                <menuSection id=\"TRAILER_DETAILS\">\n                    <items>\n                        <twoLineMenuItem id=\"MOVIE_DETAIL_LINK\" accessibilityLabel=\"<%= ATVUtils.accessibilitySafeString( movieData.title ) %>\" onSelect=\"atv.loadURL('<%= Trailers.getDetailsUrl( movieData.webURL ) %>');\" onPlay=\"atv.loadURL('<%= Trailers.getTrailerUrl( movieData.webURL ) %>');\">\n                            <label><![CDATA[<%= movieData.title %>]]><\/label>\n                            <label2><%= movieData.studio %><\/label2>\n                            <image><%= moviePoster( 'thumbnail' ) %><\/image>\n                            <preview>\n                                <keyedPreview>\n                                    <title><![CDATA[<%= movieData.title || movie.title %>]]><\/title>\n                                    <summary><![CDATA[<%= formatDescription() %>]]><\/summary>\n                                    <rating><%= movieData.rating %><\/rating>\n                                    <image><%= moviePoster() %><\/image>\n                                    <footnote><![CDATA[\u00a9 <%= studioFootnote() %>]]><\/footnote>\n                                    <metadataKeys>\n                                        <label>Rotten Tomatoes<\/label>\n                                        <label>Runtime<\/label>\n                                        <label>Theater<\/label>\n                                        <label>Address<\/label>\n                                        <label>Phone<\/label>\n                                    <\/metadataKeys>\n                                        <metadataValues>\n                                        <label><%= movieInfo( \"rottenRating\", movie) %><\/label>\n                                        <label><%= movieInfo( \"runtime\", movie ) %><\/label>\n                                        <label><%= theatreInfo( \"name\", theatre ) %><\/label>\n                                        <label><![CDATA[<%= theatreAddress( theatreInfo( \"address\", theatre ) ) %>]]><\/label>\n                                        <label><%= theatreInfo( \"phone\", theatre ) %><\/label>\n                                    <\/metadataValues>\n                                <\/keyedPreview>\n                            <\/preview>\n                        <\/twoLineMenuItem>\n                    <\/items>\n                <\/menuSection>\n                <% } %>\n                <menuSection id=\"SHOWTIMES\">\n                    <header>\n                        <horizontalDivider alignment=\"left\" accessibilityLabel=\"<%= theatreInfo( \"name\", theatre ) %>\">\n                            <title><%= theatreInfo( \"name\", theatre ) %><\/title>\n                        <\/horizontalDivider>\n                    <\/header>\n                    <items id=\"SHOWTIMES_ITEMS\">\n                    <% if( movie && theatre && completeShowtimesList.length > 0 ) { %>\n                        <% completeShowtimesList.forEach( function( showtime, index) { %>\n\n                        <oneLineMenuItem id=\"<%= showtime.id %>\" dimmed=\"<%= (isDimmed( showtime )) ? 'true' : 'false' %>\" accessibilityLabel=\"<%= showtime.time %>\">\n                            <label><%= showtime.time %><\/label>\n                            <rightLabel><![CDATA[<%= showtime.badge %>]]><\/rightLabel>\n                            <preview>\n                                <keyedPreview>\n                                    <title><![CDATA[<%= movieData.title || movieInfo( \"title\", movie ) %>]]><\/title>\n                                    <summary><![CDATA[<%= formatDescription() %>]]><\/summary>\n                                    <rating><%= movieData.rating %><\/rating>\n                                    <image><%= moviePoster() %><\/image>\n                                    <footnote><![CDATA[\u00a9 <%= studioFootnote() %>]]><\/footnote>\n                                    <metadataKeys>\n                                        <label>Rotten Tomatoes<\/label>\n                                        <label>Runtime<\/label>\n                                        <label>Theater<\/label>\n                                        <label>Address<\/label>\n                                        <label>Phone<\/label>\n                                    <\/metadataKeys>\n                                    <metadataValues>\n                                        <label><%= movieInfo( \"rottenRating\", movie)  %><\/label>\n                                        <label><%= movieInfo( \"runtime\", movie ) %><\/label>\n                                        <label><%= theatreInfo( \"name\", theatre ) %><\/label>\n                                        <label><![CDATA[<%= theatreAddress( theatreInfo( \"address\", theatre ) ) %>]]><\/label>\n                                        <label><%= theatreInfo( \"phone\", theatre ) %><\/label>\n                                    <\/metadataValues>\n                                <\/keyedPreview>\n                            <\/preview>\n                        <\/oneLineMenuItem>\n\n                        <% }) %>\n                    <% } else { %>\n                        <oneLineMenuItem id=\"NO_SHOWTIMES\">\n                            <label>No showtimes available<\/label>\n                        <\/oneLineMenuItem>\n                    <% } %>\n                    <\/items>\n                <\/menuSection>\n\n\n                <% if( otherTheatres.length > 0  ) { %>\n\n                    <menuSection id=\"NearbyTheatres\">\n                        <header>\n                            <horizontalDivider alignment=\"left\" accessibilityLabel=\"Nearby Theatres\">\n                                <title>Nearby Theaters<\/title>\n                            <\/horizontalDivider>\n                        <\/header>\n                        <items>\n                            <% otherTheatres.forEach( function( otherTheatre ) { %>\n                                <oneLineMenuItem id=\"NB_THEATRE_<%= theatreInfo( 'id', otherTheatre ) %>\" onSelect='Trailers.fireCallbackEvent( \"LOAD_MOVIE_SHOWTIMES\", { \"movie_id\": \"<%= movie_id %>\", \"theatre_id\": \"<%= otherTheatre.id %>\", \"navigationItemId\": \"<%= navigationItemId %>\", \"new_theatre\": \"YES\", \"url\": { \"tribune_id\": \"<%= tribune_id %>\", \"show_date\": \"<%= queryParams.show_date %>\", \"postal_code\": \"<%= location() %>\" } } )'>\n                                    <label><%= theatreInfo( \"name\", otherTheatre ) %><\/label>\n                                    <preview>\n                                        <keyedPreview>\n                                            <title><![CDATA[<%= movieData.title || movieInfo( \"title\", movie ) %>]]><\/title>\n                                            <summary><![CDATA[<%= formatDescription() %>]]><\/summary>\n                                            <rating><%= movieData.rating %><\/rating>\n                                            <image><%= moviePoster() %><\/image>\n                                            <footnote><![CDATA[\u00a9 <%= studioFootnote() %>]]><\/footnote>\n                                            <metadataKeys>\n                                                <label>Rotten Tomatoes<\/label>\n                                                <label>Runtime<\/label>\n                                                <label>Theater<\/label>\n                                                <label>Address<\/label>\n                                                <label>Phone<\/label>\n                                            <\/metadataKeys>\n                                            <metadataValues>\n                                                <label><%= movieInfo( \"rottenRating\", movie)  %><\/label>\n                                                <label><%= movieInfo( \"runtime\", movie ) %><\/label>\n                                                <label><%= theatreInfo( \"name\", otherTheatre ) %><\/label>\n                                                <label><![CDATA[<%= theatreAddress( theatreInfo( \"address\", otherTheatre ) ) %>]]><\/label>\n                                                <label><%= theatreInfo( \"phone\", otherTheatre ) %><\/label>\n                                            <\/metadataValues>\n                                        <\/keyedPreview>\n                                    <\/preview>\n                                <\/oneLineMenuItem>\n                            <% }, this ) %>\n                        <\/items>\n                    <\/menuSection>\n\n                <% } %>\n\n            <\/sections>\n        <\/menu>\n    <\/listByNavigation>\n  <\/body>\n<\/atv>\n",
    "MOVIEPAGENAVIGATION": "<% dates.forEach( function( date ) { %>\n\t<navigationItem accessibilityLabel=\"<%= date.getLocaleDayName() +' '+ date.toLocaleDateString() %>\" id=\"DATE_<%= date.toISOString() %>\">\n\t\t<title><%= date.getLocaleDayName( true ) +\", \"+ date.getLocaleMonthName( true) +\" \"+ date.getDate() %><\/title>\n\t\t<url><%= date.toShowtimeString() %><\/url>\n\t\t<stash>\n\t\t\t<dateTimeStamp><%= date.toISOString() %><\/dateTimeStamp>\n\t\t<\/stash>\n\t<\/navigationItem>\n<% }) %>\n",
    "MOVIEPOSTERITEM": "<% now_showing.forEach( function( show, index ) { %>\n\t<% if( movieIds.indexOf( show.film_id ) == -1 ) { %>\n\t\t<% if( show.film_id ) movieIds.push( show.film_id ) %>\n\t\t<moviePoster accessibilityLabel=\"<%= show.title %>\" id=\"THEATRE_<%= id %>_MOVIE_<%= show.film_id %>\" onPlay=\"atv.loadURL('<%= Trailers.getTrailerUrl( show ) %>');\" onSelect='Trailers.fireCallbackEvent( \"LOAD_MOVIE_SHOWTIMES\", { \"url\":<%= Trailers.getShowtimeUrl( show, id, show_date ) %>, \"template\": \"showtimes-movie-theatre\", \"theatre_id\":\"<%= id %>\", \"movie_id\":\"<%= show.film_id %>\" } );'>\n\t\t\t<title><%= show.title %><\/title>\n\t\t\t<image><%= Trailers.getTrailerImage( show ) %><\/image>\n\t\t\t<defaultImage>resource:\/\/Poster.png<\/defaultImage>\n\t\t<\/moviePoster>\n\t<% } %>\n<% }) %>",
    "NAVBAR": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<atv>\n\t<head>\n\t\t<%= scriptUrls() %>\n\t<\/head>\n\t<body>\n\t\t<viewWithNavigationBar id=\"trailers_navigation\" onNavigate=\"Trailers.handleOnNavigate( event )\">\n\t\t\t<navigation>\n\t\t\t\t<navigationItem id=\"nav1\">\n\t\t\t\t\t<title>Latest Torrents<\/title>\n\t\t\t\t\t<url>http:\/\/trailers.apple.com\/appletv\/us\/index.xml<\/url>\n\t\t\t\t<\/navigationItem>\n\t\t\t\t<% if( showtimes ) { %>\n\t\t\t\t<navigationItem id=\"Showtimes\">\n\t\t\t\t\t<title>Showtimes<\/title>\n\t\t\t\t<\/navigationItem>\n\t\t\t\t<% } %>\n\t\t\t\t<navigationItem id=\"nav5\">\n\t\t\t\t\t<title>Search<\/title>\n\t\t\t\t\t<url>http:\/\/trailers.apple.com\/appletv\/us\/searchtrailers.xml<\/url>\n\t\t\t\t<\/navigationItem>\n\t\t\t<\/navigation>\n\t\t<\/viewWithNavigationBar>\n\t<\/body>\n<\/atv>"
  },

  "RESOLUTION": (atv.device.preferredVideoPreviewFormat) ? "-" + atv.device.preferredVideoPreviewFormat.toLowerCase() + ".xml" : "-" + atv.device.preferredVideoFormat.toLowerCase() + ".xml",

  // Showtimes Location Entry strings
  "LocationEntryTitle": "Zip Code Entry",
  "LocationEntryInstructions": "Please enter a valid US postal code.",
  "LocationEntryLabel": "Zip Code:",
  "LocationEntryFootnote": "",

  "DEV": {
    "DEBUG_LEVEL": 8,
    "ROOT_URL": "http://sample-web-server/trailers/sections/trailers-navigation.xml",
    "SCRIPT_URLS": [
            "http://sample-web-server/trailers/js/main.js",
            "http://sample-web-server/trailers/js/Trailers.js",
            "http://sample-web-server/trailers/js/Trailers.Showtimes.js",
            "http://sample-web-server/trailers/js/showtimesconfig.js"],
    "SHOWTIME_QUERY_URL": "http://trailers.apple.com/trailers/global/scripts/showtimes.theaters.php?items_per_page=7",
    "SHOWTIME_MOVIE_DATA_URL": "http://trailers.apple.com/appletv/us/showtimes/%%MOVIEID%%.json",
    "IMAGE_BASE_URL": "http://trailers.apple.com",
    "TRAILER_BASE_URL": "http://trailers.apple.com/appletv/us",
    "DEFAULT_POSTER": "http://trailers.apple.com/appletv/us/images/movie_large.png"
  },

  "PROD": {
    "DEBUG_LEVEL": 3,
    "ROOT_URL": "http://trailers.apple.com/appletv/us/nav.xml",
    "SCRIPT_URLS": [
            "http://trailers.apple.com/appletv/us/js/main.js",
            "http://trailers.apple.com/appletv/us/js/Trailers.js",
            "http://trailers.apple.com/appletv/us/js/Trailers.Showtimes.js",
            "http://trailers.apple.com/appletv/us/js/showtimesconfig.js"],
    "SHOWTIME_QUERY_URL": "http://trailers.apple.com/trailers/global/scripts/showtimes.theaters.php?items_per_page=7",
    "SHOWTIME_MOVIE_DATA_URL": "http://trailers.apple.com/appletv/us/showtimes/%%MOVIEID%%.json",
    "IMAGE_BASE_URL": "http://trailers.apple.com",
    "TRAILER_BASE_URL": "http://trailers.apple.com/appletv/us",
    "DEFAULT_POSTER": "http://trailers.apple.com/appletv/us/images/movie_large.png"
  },

  // String map to format the badges properly
  "QUALMAP": {
    "Closed Captioning": "CC",
    "Closed Captioned": "CC",
    "AMC Independent": "Ind",
    "Digital Presentation": "Digital",
    "RealD 3D": "3D"
  }

};

atv.onGenerateRequest = function (request) {
  // Set the preferred video format to atv.device.preferredVideoPreviewFormat if it exists, otherwise use atv.device.preferredVideoFormat
  var videoFormat = (atv.device.preferredVideoPreviewFormat) ? atv.device.preferredVideoPreviewFormat : atv.device.preferredVideoFormat,
    env = atv.localStorage.getItem('env');

  ATVUtils.log("ON GENERATE REQUEST: " + JSON.stringify(request), 5);

  ATVUtils.log("ON GENERATE REQUEST: VIDEO FORMAT: " + videoFormat, 5);

  // SD
  if (videoFormat != "HD") {
    request.url = request.url.replace('-hd.xml', '-sd.xml');
  }
  // HD
  else {
    request.url = request.url.replace('-sd.xml', '-hd.xml');
  }

  ATVUtils.log("ON GENERATE REQUEST: FINAL URL: " + request.url, 4);
};

atv.onAppEntry = function () {
  console.log(" == STARTING THE TRAILERS APPLICATION == ");

  var env = atv.localStorage.getItem('env'),
    config = atv.config[env] || atv.config['PROD'];

  // Transitionally I am storing templates in local storage and session storage.
  atv.localStorage.setItem("TEMPLATES", JSON.stringify(atv.config.TEMPLATES));
  atv.sessionStorage.setItem("TEMPLATES", atv.config.TEMPLATES);

  atv.sessionStorage.setItem("DEBUG_LEVEL", config.DEBUG_LEVEL);
  atv.sessionStorage.setItem("ROOT_URL", config.ROOT_URL);
  atv.sessionStorage.setItem("SCRIPT_URLS", config.SCRIPT_URLS);
  atv.sessionStorage.setItem("SHOWTIME_QUERY_URL", config.SHOWTIME_QUERY_URL);
  atv.sessionStorage.setItem("SHOWTIME_MOVIE_DATA_URL", config.SHOWTIME_MOVIE_DATA_URL);
  atv.sessionStorage.setItem("IMAGE_BASE_URL", config.IMAGE_BASE_URL);
  atv.sessionStorage.setItem("TRAILER_BASE_URL", config.TRAILER_BASE_URL);
  atv.sessionStorage.setItem("DEFAULT_POSTER", config.DEFAULT_POSTER);

  atv.sessionStorage.setItem("RESOLUTION", atv.config.RESOLUTION);
  atv.sessionStorage.setItem("QUALMAP", atv.config.QUALMAP);
  atv.sessionStorage.setItem("LocationEntryTitle", atv.config.LocationEntryTitle);
  atv.sessionStorage.setItem("LocationEntryInstructions", atv.config.LocationEntryInstructions);
  atv.sessionStorage.setItem("LocationEntryLabel", atv.config.LocationEntryLabel);
  atv.sessionStorage.setItem("LocationEntryFootnote", atv.config.LocationEntryFootnote);

  var data = {
      "scriptUrls": function () {
        var response = "";

        atv.sessionStorage["SCRIPT_URLS"].forEach(function (script) {
          response += '<script src="' + script + '"/>'
        });

        return response;
      },
      "showtimes": atv.localStorage.getItem('SHOWTIMES_AVAIALABLE')
    },
    template = atv.sessionStorage.TEMPLATES.NAVBAR,
    results = new EJS({
      "text": template
    }).render(data),
    navBarXML = atv.parseXML(results);

  console.log(" == PROCESSTEMPLATE: RESULTS: ==>\n\n" + results + "\n\n<==");

  atv.loadXML(navBarXML);

}

/**
 * These two functions are used to add the needed functionality for AppleTV Screen Saver
 */
atv.onScreensaverPhotosSelectionEntry = function () {
  console.log('photoBatch screensaver photos selection begin', 3);

  // The collection object is passed to atv.onExecuteQuery as parameters to load Images.
  // Currently only one collection is able to be passed.
  var collection = {
    "id": "trailers-posters",
    "name": "Trailer Posters",
    "type": "collection"
  };
  atv.setScreensaverPhotosCollection(collection);

}

atv.onScreensaverPhotosSelectionExit = function () {
  console.log('photo screensaver photos selection exit', 3);
}

/**
 * This method is called each time the AppleTV updates the Screensaver photos
 * In this query you need to return a set of photos.
 */
atv.onExecuteQuery = function (query, callback) {
  var id = null,
    screensaverQueryUrl = "http://trailers.apple.com/appletv/us/ScreenSaver.json";

  console.log("HERE IS THE QUERY: " + JSON.stringify(query), 4);
  for (i = 0; i < query.filters.length; ++i) {
    var filter = query.filters[i];
    if (filter.property == 'id') {
      id = filter.value;
      break;
    }
  }

  var shouldShuffleImages = query.shuffle; // boolean
  var requestedNumImages = query.length;

  console.log('photoBatch execute query: id=' + id + ', shuffle=' + shouldShuffleImages + ', length=' + requestedNumImages);

  if (id == "trailers-posters") {
    console.log("This is the big time: " + atv.localStorage['SCREENSAVERID']);
    var url = atv.localStorage['SCREENSAVERID'] || screensaverQueryUrl;
  } else {
    var url = id;
  }

  console.log("We are going to request this URL" + url);

  // Making a request to the server to get a list of photos for the screensaver, based on the information in the query filters
  var ajax = new ATVUtils.Ajax({
    "url": url + "?shuffle=" + shouldShuffleImages + "&length=" + requestedNumImages,
    "success": function (req) {
      console.log(" --- successfully retrieved the list: --- " + req.responseText);
      var ScreensaverPhotos = JSON.parse(req.responseText);

      if (shouldShuffleImages) {
        ScreensaverPhotos = ATVUtils.shuffleArray(ScreensaverPhotos);
      };

      if (ScreensaverPhotos.length > requestedNumImages) {
        ScreensaverPhotos = ScreensaverPhotos.slice(0, requestedNumImages)
      };

      callback.success(ScreensaverPhotos);
    },
    "failure": function (error, req) {
      console.log("We encountered and error: " + JSON.stringify(error));
      callback.failure(JSON.stringify(error));
    }
  })
}

// ***************************************************
// ATVUtils - a JavaScript helper library for Apple TV
console.log("===========> MAIN.JS: ATVUtils START <===========");

var atvutils = ATVUtils = {
  makeRequest: function (url, method, headers, body, callback) {
    if (!url) {
      throw "loadURL requires a url argument";
    }

    var method = method || "GET",
      headers = headers || {},
      body = body || "";

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      try {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            callback(xhr.responseXML);
          } else {
            console.log("makeRequest received HTTP status " + xhr.status + " for " + url);
            callback(null);
          }
        }
      } catch (e) {
        console.error('makeRequest caught exception while processing request for ' + url + '. Aborting. Exception: ' + e);
        xhr.abort();
        callback(null);
      }
    }
    xhr.open(method, url, true);

    for (var key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }

    xhr.send();
    return xhr;
  },

  makeErrorDocument: function (message, description) {
    if (!message) {
      message = "";
    }
    if (!description) {
      description = "";
    }

    var errorXML = '<?xml version="1.0" encoding="UTF-8"?> \
        <atv> \
        <body> \
        <dialog id="com.sample.error-dialog"> \
        <title><![CDATA[' + message + ']]></title> \
        <description><![CDATA[' + description + ']]></description> \
        </dialog> \
        </body> \
        </atv>';

    return atv.parseXML(errorXML);
  },

  siteUnavailableError: function () {
    // TODO: localize
    return this.makeErrorDocument("sample-xml is currently unavailable. Try again later.", "Go to sample-xml.com/appletv for more information.");
  },

  loadError: function (message, description) {
    atv.loadXML(this.makeErrorDocument(message, description));
  },

  loadAndSwapError: function (message, description) {
    atv.loadAndSwapXML(this.makeErrorDocument(message, description));
  },

  loadURLInternal: function (url, method, headers, body, loader) {
    var me = this,
      xhr,
      proxy = new atv.ProxyDocument;

    proxy.show();

    proxy.onCancel = function () {
      if (xhr) {
        xhr.abort();
      }
    };

    xhr = me.makeRequest(url, method, headers, body, function (xml) {
      try {
        loader(proxy, xml);
      } catch (e) {
        console.error("Caught exception in for " + url + ". " + e);
        loader(me.siteUnavailableError());
      }
    });
  },

  loadURL: function (options) { //url, method, headers, body, processXML) {
    var me = this;
    if (typeof (options) === "string") {
      var url = options;
    } else {
      var url = options.url,
        method = options.method || null,
        headers = options.headers || null,
        body = options.body || null,
        processXML = options.processXML || null;
    }

    this.loadURLInternal(url, method, headers, body, function (proxy, xml) {
      if (typeof (processXML) == "function") processXML.call(this, xml);
      try {
        proxy.loadXML(xml, function (success) {
          if (!success) {
            console.log("loadURL failed to load " + url);
            proxy.loadXML(me.siteUnavailableError());
          }
        });
      } catch (e) {
        console.log("loadURL caught exception while loading " + url + ". " + e);
        proxy.loadXML(me.siteUnavailableError());
      }
    });
  },

  // loadAndSwapURL can only be called from page-level JavaScript of the page that wants to be swapped out.
  loadAndSwapURL: function (options) { //url, method, headers, body, processXML) {
    var me = this;
    if (typeof (options) === "string") {
      var url = options;
    } else {
      var url = options.url,
        method = options.method || null,
        headers = options.headers || null,
        body = options.body || null,
        processXML = options.processXML || null;
    }

    this.loadURLInternal(url, method, headers, body, function (proxy, xml) {
      if (typeof (processXML) == "function") processXML.call(this, xml);
      try {
        proxy.loadXML(xml, function (success) {
          if (success) {
            atv.unloadPage();
          } else {
            console.log("loadAndSwapURL failed to load " + url);
            proxy.loadXML(me.siteUnavailableError(), function (success) {
              if (success) {
                atv.unloadPage();
              }
            });
          }
        });
      } catch (e) {
        console.error("loadAndSwapURL caught exception while loading " + url + ". " + e);
        proxy.loadXML(me.siteUnavailableError(), function (success) {
          if (success) {
            atv.unloadPage();
          }
        });
      }
    });
  },

  /**
   * Used to manage setting and retrieving data from local storage
   */
  data: function (key, value) {
    if (key && value) {
      try {
        atv.localStorage.setItem(key, value);
        return value;
      } catch (error) {
        console.error('Failed to store data element: ' + error);
      }

    } else if (key) {
      try {
        return atv.localStorage.getItem(key);
      } catch (error) {
        console.error('Failed to retrieve data element: ' + error);
      }
    }
    return null;
  },

  deleteData: function (key) {
    try {
      atv.localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove data element: ' + error);
    }
  },


  /**
   * @params options.name - string node name
   * @params options.text - string textContent
   * @params options.attrs - array of attribute to set {"name": string, "value": string, bool}
   * @params options.children = array of childNodes same values as options
   * @params doc - document to attach the node to
   * returns node
   */
  createNode: function (options, doc) {
    var doc = doc || document;
    options = options || {};

    if (options.name && options.name != '') {
      var newElement = doc.makeElementNamed(options.name);

      if (options.text) newElement.textContent = options.text;

      if (options.attrs) {
        options.attrs.forEach(function (e, i, a) {
          newElement.setAttribute(e.name, e.value);
        }, this);
      }

      if (options.children) {
        options.children.forEach(function (e, i, a) {
          newElement.appendChild(this.createNode(e, doc));
        }, this)
      }

      return newElement;
    }
  },

  validEmailAddress: function (email) {
    var emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      isValid = email.search(emailRegex);
    return (isValid > -1);
  },

  softwareVersionIsAtLeast: function (version) {
    var deviceVersion = atv.device.softwareVersion.split('.'),
      requestedVersion = version.split('.');

    // We need to pad the device version length with "0" to account for 5.0 vs 5.0.1
    if (deviceVersion.length < requestedVersion.length) {
      var difference = requestedVersion.length - deviceVersion.length,
        dvl = deviceVersion.length;

      for (var i = 0; i < difference; i++) {
        deviceVersion[dvl + i] = "0";
      };
    };

    // compare the same index from each array.
    for (var c = 0; c < deviceVersion.length; c++) {
      var dv = deviceVersion[c],
        rv = requestedVersion[c] || "0";

      if (parseInt(dv) > parseInt(rv)) {
        return true;
      } else if (parseInt(dv) < parseInt(rv)) {
        return false;
      };
    };

    // If we make it this far the two arrays are identical, so we're true
    return true;
  },

  shuffleArray: function (arr) {
    var tmp, current, top = arr.length;

    if (top) {
      while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = arr[current];
        arr[current] = arr[top];
        arr[top] = tmp;
      };
    };

    return arr;
  },

  loadTextEntry: function (textEntryOptions) {
    var textView = new atv.TextEntry;

    textView.type = textEntryOptions.type || "emailAddress";
    textView.title = textEntryOptions.title || "";
    textView.image = textEntryOptions.image || null;
    textView.instructions = textEntryOptions.instructions || "";
    textView.label = textEntryOptions.label || "";
    textView.footnote = textEntryOptions.footnote || "";
    textView.defaultValue = textEntryOptions.defaultValue || null;
    textView.defaultToAppleID = textEntryOptions.defaultToAppleID || false;
    textView.onSubmit = textEntryOptions.onSubmit,
      textView.onCancel = textEntryOptions.onCancel,

      textView.show();
  },

  log: function (message, level) {
    var debugLevel = atv.sessionStorage.getItem("DEBUG_LEVEL"),
      level = level || 0;

    if (level <= debugLevel) {
      console.log(message);
    }
  },

  accessibilitySafeString: function (string) {
    var string = unescape(string);

    string = string.replace(/&amp;/g, 'and')
      .replace(/&/g, 'and')
      .replace(/&lt;/g, 'less than')
      .replace(/\</g, 'less than')
      .replace(/&gt;/g, 'greater than')
      .replace(/\>/g, 'greater than');

    return string;
  }
};

/**
 * This is an XHR handler. It handles most of tediousness of the XHR request
 * and keeps track of onRefresh XHR calls so that we don't end up with multiple
 * page refresh calls.
 *
 * You can see how I call it on the handleRefresh function below.
 *
 *
 * @params object (hash) options
 * @params string options.url - url to be loaded
 * @params string options.method - "GET", "POST", "PUT", "DELTE"
 * @params bool options.type - false = "Sync" or true = "Async" (You should always use true)
 * @params func options.success - Gets called on readyState 4 & status 200
 * @params func options.failure - Gets called on readyState 4 & status != 200
 * @params func options.callback - Gets called after the success and failure on readyState 4
 * @params string options.data - data to be sent to the server
 * @params bool options.refresh - Is this a call from the onRefresh event.
 */
ATVUtils.Ajax = function (options) {
  var me = this;
  options = options || {}

  /* Setup properties */
  this.url = options.url || false;
  this.method = options.method || "GET";
  this.type = (options.type === false) ? false : true;
  this.success = options.success || null;
  this.failure = options.failure || null;
  this.data = options.data || null;
  this.complete = options.complete || null;
  this.refresh = options.refresh || false;

  if (!this.url) {
    console.error('\nAjax Object requires a url to be passed in: e.g. { "url": "some string" }\n')
    return undefined;
  };

  this.id = Date.now();

  this.createRequest();

  this.req.onreadystatechange = this.stateChange;

  this.req.object = this;

  this.open();

  this.send();

};

ATVUtils.Ajax.currentlyRefreshing = false;
ATVUtils.Ajax.activeRequests = {};

ATVUtils.Ajax.cancelAllActiveRequests = function () {
  for (var p in ATVUtils.Ajax.activeRequests) {
    if (ATVUtils.Ajax.activeRequests.hasOwnProperty(p)) {
      var obj = ATVUtils.Ajax.activeRequests[p];
      if (ATVUtils.Ajax.prototype.isPrototypeOf(obj)) {
        obj.req.abort();
      };
    };
  };
  ATVUtils.Ajax.activeRequests = {};
}

ATVUtils.Ajax.prototype = {
  stateChange: function () {
    var me = this.object;
    switch (this.readyState) {
    case 1:
      if (typeof (me.connection) === "function") me.connection(this, me);
      break;
    case 2:
      if (typeof (me.received) === "function") me.received(this, me);
      break;
    case 3:
      if (typeof (me.processing) === "function") me.processing(this, me);
      break;
    case 4:
      if (this.status == "200") {
        if (typeof (me.success) === "function") me.success(this, me);
      } else {
        if (typeof (me.failure) === "function") me.failure(this.status, this, me);
      }
      if (typeof (me.complete) === "function") me.complete(this, me);
      if (me.refresh) Ajax.currentlyRefreshing = false;
      break;
    default:
      console.log("I don't think I should be here.");
      break;
    }
  },
  cancelRequest: function () {
    this.req.abort();
    delete ATVUtils.Ajax.activeRequests[this.id];
  },
  createRequest: function () {
    try {
      this.req = new XMLHttpRequest();
      ATVUtils.Ajax.activeRequests[this.id] = this;
      if (this.refresh) ATVUtils.Ajax.currentlyRefreshing = true;
    } catch (error) {
      alert("The request could not be created: </br>" + error);
      console.error("failed to create request: " + error);
    }
  },
  open: function () {
    try {
      this.req.open(this.method, this.url, this.type);
    } catch (error) {
      console.log("failed to open request: " + error);
    }
  },
  send: function () {
    var data = this.data || null;
    try {
      this.req.send(data);
    } catch (error) {
      console.log("failed to send request: " + error);
    }
  }
};

// Extend atv.ProxyDocument to load errors from a message and description.
if (atv.ProxyDocument) {
  atv.ProxyDocument.prototype.loadError = function (message, description) {
    var doc = atvutils.makeErrorDocument(message, description);
    this.loadXML(doc);
  }
}


// atv.Document extensions
if (atv.Document) {
  atv.Document.prototype.getElementById = function (id) {
    var elements = this.evaluateXPath("//*[@id='" + id + "']", this);
    if (elements && elements.length > 0) {
      return elements[0];
    }
    return undefined;
  }
}


// atv.Element extensions
if (atv.Element) {
  atv.Element.prototype.getElementsByTagName = function (tagName) {
    return this.ownerDocument.evaluateXPath("descendant::" + tagName, this);
  }

  atv.Element.prototype.getElementByTagName = function (tagName) {
    var elements = this.getElementsByTagName(tagName);
    if (elements && elements.length > 0) {
      return elements[0];
    }
    return undefined;
  }
}

console.log("===========> MAIN.JS: ATVUtils END <===========")
  // End ATVUtils
  // ***************************************************

// EJS START
// ***************************************************
console.log("===========> MAIN.JS: EJS START <===========");

(function () {


  var rsplit = function (string, regex) {
      var result = regex.exec(string),
        retArr = new Array(),
        first_idx, last_idx, first_bit;
      while (result != null) {
        first_idx = result.index;
        last_idx = regex.lastIndex;
        if ((first_idx) != 0) {
          first_bit = string.substring(0, first_idx);
          retArr.push(string.substring(0, first_idx));
          string = string.slice(first_idx);
        }
        retArr.push(result[0]);
        string = string.slice(result[0].length);
        result = regex.exec(string);
      }
      if (!string == '') {
        retArr.push(string);
      }
      return retArr;
    },
    chop = function (string) {
      return string.substr(0, string.length - 1);
    },
    extend = function (d, s) {
      for (var n in s) {
        if (s.hasOwnProperty(n)) d[n] = s[n]
      }
    };


  EJS = function (options) {
    options = typeof options == "string" ? {
      view: options
    } : options
    this.set_options(options);
    if (options.precompiled) {
      this.template = {};
      this.template.process = options.precompiled;
      EJS.update(this.name, this);
      return;
    }
    if (options.element) {
      if (typeof options.element == 'string') {
        var name = options.element
        options.element = document.getElementById(options.element)
        if (options.element == null) throw name + 'does not exist!'
      }
      if (options.element.value) {
        this.text = options.element.value
      } else {
        this.text = options.element.innerHTML
      }
      this.name = options.element.id
      this.type = '['
    } else if (options.url) {
      console.log("--- The URL has been passed ---")
      options.url = EJS.endExt(options.url, this.extMatch);
      console.log("--- I am just passed the endExt ---");
      this.name = this.name ? this.name : options.url;
      var url = options.url
        //options.view = options.absolute_url || options.view || options.;
      var template = EJS.get(this.name /*url*/ , this.cache);
      console.log("--- I am just passed the EJS.get ---");
      if (template) return template;
      console.log("--- Template does exist: \n" + template + "\n ---");
      if (template == EJS.INVALID_PATH) return null;
      try {
        console.log("--- attempting to load the text --->");
        this.text = EJS.request(url + (this.cache ? '' : '?' + Math.random()));
        console.log("--- text is loaded: \n" + this.text + "\n --->");
      } catch (e) {
        console.log("--- attempting to load the XHR did not work ---\n" + e + "\n============================");
      }

      if (this.text == null) {
        throw ({
          type: 'EJS',
          message: 'There is no template at ' + url
        });
      }
      //this.name = url;
    }
    var template = new EJS.Compiler(this.text, this.type);

    template.compile(options, this.name);


    EJS.update(this.name, this);
    this.template = template;
  };
  /* @Prototype*/
  EJS.prototype = {
    /**
     * Renders an object with extra view helpers attached to the view.
     * @param {Object} object data to be rendered
     * @param {Object} extra_helpers an object with additonal view helpers
     * @return {String} returns the result of the string
     */
    render: function (object, extra_helpers) {
      object = object || {};
      this._extra_helpers = extra_helpers;
      var v = new EJS.Helpers(object, extra_helpers || {});
      return this.template.process.call(object, object, v);
    },
    update: function (element, options) {
      if (typeof element == 'string') {
        element = document.getElementById(element)
      }
      if (options == null) {
        _template = this;
        return function (object) {
          EJS.prototype.update.call(_template, element, object)
        }
      }
      if (typeof options == 'string') {
        params = {}
        params.url = options
        _template = this;
        params.onComplete = function (request) {
          var object = eval(request.responseText)
          EJS.prototype.update.call(_template, element, object)
        }
        EJS.ajax_request(params)
      } else {
        element.innerHTML = this.render(options)
      }
    },
    out: function () {
      return this.template.out;
    },
    /**
     * Sets options on this view to be rendered with.
     * @param {Object} options
     */
    set_options: function (options) {
      console.log('--- SETTING OPTION --->');
      this.type = options.type || EJS.type;
      this.cache = options.cache != null ? options.cache : EJS.cache;
      this.text = options.text || null;
      this.name = options.name || null;
      this.ext = options.ext || EJS.ext;
      this.extMatch = new RegExp(this.ext.replace(/\./, '\.'));
      console.log('<--- SETTING OPTION ---');
    }
  };
  EJS.endExt = function (path, match) {
    console.log("--- endExt: " + path + " --->");
    if (!path) return null;
    match.lastIndex = 0
    console.log("<--- endExt ---");
    return path + (match.test(path) ? '' : this.ext)
  }




  /* @Static*/
  EJS.Scanner = function (source, left, right) {

    extend(this, {
      left_delimiter: left + '%',
      right_delimiter: '%' + right,
      double_left: left + '%%',
      double_right: '%%' + right,
      left_equal: left + '%=',
      left_comment: left + '%#'
    })

    this.SplitRegexp = left == '[' ? /(\[%%)|(%%\])|(\[%=)|(\[%#)|(\[%)|(%\]\n)|(%\])|(\n)/ : new RegExp('(' + this.double_left + ')|(%%' + this.double_right + ')|(' + this.left_equal + ')|(' + this.left_comment + ')|(' + this.left_delimiter + ')|(' + this.right_delimiter + '\n)|(' + this.right_delimiter + ')|(\n)');

    this.source = source;
    this.stag = null;
    this.lines = 0;
  };

  EJS.Scanner.to_text = function (input) {
    if (input == null || input === undefined)
      return '';
    if (input instanceof Date)
      return input.toDateString();
    if (input.toString)
      return input.toString();
    return '';
  };

  EJS.Scanner.prototype = {
    scan: function (block) {
      scanline = this.scanline;
      regex = this.SplitRegexp;
      if (!this.source == '') {
        var source_split = rsplit(this.source, /\n/);
        for (var i = 0; i < source_split.length; i++) {
          var item = source_split[i];
          this.scanline(item, regex, block);
        }
      }
    },
    scanline: function (line, regex, block) {
      this.lines++;
      var line_split = rsplit(line, regex);
      for (var i = 0; i < line_split.length; i++) {
        var token = line_split[i];
        if (token != null) {
          try {
            block(token, this);
          } catch (e) {
            throw {
              type: 'EJS.Scanner',
              line: this.lines
            };
          }
        }
      }
    }
  };


  EJS.Buffer = function (pre_cmd, post_cmd) {
    this.line = new Array();
    this.script = "";
    this.pre_cmd = pre_cmd;
    this.post_cmd = post_cmd;
    for (var i = 0; i < this.pre_cmd.length; i++) {
      this.push(pre_cmd[i]);
    }
  };
  EJS.Buffer.prototype = {

    push: function (cmd) {
      this.line.push(cmd);
    },

    cr: function () {
      this.script = this.script + this.line.join('; ');
      this.line = new Array();
      this.script = this.script + "\n";
    },

    close: function () {
      if (this.line.length > 0) {
        for (var i = 0; i < this.post_cmd.length; i++) {
          this.push(pre_cmd[i]);
        }
        this.script = this.script + this.line.join('; ');
        line = null;
      }
    }

  };


  EJS.Compiler = function (source, left) {
    this.pre_cmd = ['var ___ViewO = [];'];
    this.post_cmd = new Array();
    this.source = ' ';
    if (source != null) {
      if (typeof source == 'string') {
        source = source.replace(/\r\n/g, "\n");
        source = source.replace(/\r/g, "\n");
        this.source = source;
      } else if (source.innerHTML) {
        this.source = source.innerHTML;
      }
      if (typeof this.source != 'string') {
        this.source = "";
      }
    }
    left = left || '<';
    var right = '>';
    switch (left) {
    case '[':
      right = ']';
      break;
    case '<':
      break;
    default:
      throw left + ' is not a supported deliminator';
      break;
    }
    this.scanner = new EJS.Scanner(this.source, left, right);
    this.out = '';
  };
  EJS.Compiler.prototype = {
    compile: function (options, name) {
      options = options || {};
      this.out = '';
      var put_cmd = "___ViewO.push(";
      var insert_cmd = put_cmd;
      var buff = new EJS.Buffer(this.pre_cmd, this.post_cmd);
      var content = '';
      var clean = function (content) {
        content = content.replace(/\\/g, '\\\\');
        content = content.replace(/\n/g, '\\n');
        content = content.replace(/"/g, '\\"');
        return content;
      };
      this.scanner.scan(function (token, scanner) {
        if (scanner.stag == null) {
          switch (token) {
          case '\n':
            content = content + "\n";
            buff.push(put_cmd + '"' + clean(content) + '");');
            buff.cr();
            content = '';
            break;
          case scanner.left_delimiter:
          case scanner.left_equal:
          case scanner.left_comment:
            scanner.stag = token;
            if (content.length > 0) {
              buff.push(put_cmd + '"' + clean(content) + '")');
            }
            content = '';
            break;
          case scanner.double_left:
            content = content + scanner.left_delimiter;
            break;
          default:
            content = content + token;
            break;
          }
        } else {
          switch (token) {
          case scanner.right_delimiter:
            switch (scanner.stag) {
            case scanner.left_delimiter:
              if (content[content.length - 1] == '\n') {
                content = chop(content);
                buff.push(content);
                buff.cr();
              } else {
                buff.push(content);
              }
              break;
            case scanner.left_equal:
              buff.push(insert_cmd + "(EJS.Scanner.to_text(" + content + ")))");
              break;
            }
            scanner.stag = null;
            content = '';
            break;
          case scanner.double_right:
            content = content + scanner.right_delimiter;
            break;
          default:
            content = content + token;
            break;
          }
        }
      });
      if (content.length > 0) {
        // Chould be content.dump in Ruby
        buff.push(put_cmd + '"' + clean(content) + '")');
      }
      buff.close();
      this.out = buff.script + ";";
      var to_be_evaled = '/*' + name + '*/this.process = function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {' + this.out + " return ___ViewO.join('');}}}catch(e){e.lineNumber=null;throw e;}};";

      try {
        eval(to_be_evaled);
      } catch (e) {
        if (typeof JSLINT != 'undefined') {
          JSLINT(this.out);
          for (var i = 0; i < JSLINT.errors.length; i++) {
            var error = JSLINT.errors[i];
            if (error.reason != "Unnecessary semicolon.") {
              error.line++;
              var e = new Error();
              e.lineNumber = error.line;
              e.message = error.reason;
              if (options.view)
                e.fileName = options.view;
              throw e;
            }
          }
        } else {
          throw e;
        }
      }
    }
  };


  //type, cache, folder
  /**
   * Sets default options for all views
   * @param {Object} options Set view with the following options
   * <table class="options">
                  <tbody><tr><th>Option</th><th>Default</th><th>Description</th></tr>
                  <tr>
                      <td>type</td>
                      <td>'<'</td>
                      <td>type of magic tags.  Options are '&lt;' or '['
                      </td>
                  </tr>
                  <tr>
                      <td>cache</td>
                      <td>true in production mode, false in other modes</td>
                      <td>true to cache template.
                      </td>
                  </tr>
      </tbody></table>
   *
   */
  EJS.config = function (options) {
    EJS.cache = options.cache != null ? options.cache : EJS.cache;
    EJS.type = options.type != null ? options.type : EJS.type;
    EJS.ext = options.ext != null ? options.ext : EJS.ext;

    var templates_directory = EJS.templates_directory || {}; //nice and private container
    EJS.templates_directory = templates_directory;
    EJS.get = function (path, cache) {
      if (cache == false) return null;
      if (templates_directory[path]) return templates_directory[path];
      return null;
    };

    EJS.update = function (path, template) {
      if (path == null) return;
      templates_directory[path] = template;
    };

    EJS.INVALID_PATH = -1;
  };
  EJS.config({
    cache: true,
    type: '<',
    ext: '.ejs'
  });



  /**
   * @constructor
   * By adding functions to EJS.Helpers.prototype, those functions will be available in the
   * views.
   * @init Creates a view helper.  This function is called internally.  You should never call it.
   * @param {Object} data The data passed to the view.  Helpers have access to it through this._data
   */
  EJS.Helpers = function (data, extras) {
    this._data = data;
    this._extras = extras;
    extend(this, extras);
  };
  /* @prototype*/
  EJS.Helpers.prototype = {
    /**
     * Renders a new view.  If data is passed in, uses that to render the view.
     * @param {Object} options standard options passed to a new view.
     * @param {optional:Object} data
     * @return {String}
     */
    view: function (options, data, helpers) {
      if (!helpers) helpers = this._extras
      if (!data) data = this._data;
      return new EJS(options).render(data, helpers);
    },
    /**
     * For a given value, tries to create a human representation.
     * @param {Object} input the value being converted.
     * @param {Object} null_text what text should be present if input == null or undefined, defaults to ''
     * @return {String}
     */
    to_text: function (input, null_text) {
      if (input == null || input === undefined) return null_text || '';
      if (input instanceof Date) return input.toDateString();
      if (input.toString) return input.toString().replace(/\n/g, '<br />').replace(/''/g, "'");
      return '';
    }
  };
  EJS.newRequest = function () {
    var factories = [function () {
      return new ActiveXObject("Msxml2.XMLHTTP");
    }, function () {
      return new XMLHttpRequest();
    }, function () {
      return new ActiveXObject("Microsoft.XMLHTTP");
    }];
    for (var i = 0; i < factories.length; i++) {
      try {
        var request = factories[i]();
        if (request != null) return request;
      } catch (e) {
        continue;
      }
    }
  }

  EJS.request = function (path) {
    var request = new EJS.newRequest()
    request.open("GET", path, false);
    console.log("--- I have opened the request ---\npath: " + path + "\n");
    try {
      request.send();
    } catch (e) {
      return null;
    }
    console.log("--- I have sent the request ---: \nreadystate: " + request.readyState + "\nstatus: " + request.status + "\n");


    if (request.status == 404 || request.status == 2 || (request.status == 0 && request.responseText == '')) return null;
    console.log("--- I am past the wonky if statement ---");
    return request.responseText
  }
  EJS.ajax_request = function (params) {
    params.method = (params.method ? params.method : 'GET')

    var request = new EJS.newRequest();
    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        if (request.status == 200) {
          params.onComplete(request)
        } else {
          params.onComplete(request)
        }
      }
    }
    request.open(params.method, params.url)
    request.send(null)
  }


})();



console.log("===========> MAIN.JS: EJS END <===========");
// EJS End
