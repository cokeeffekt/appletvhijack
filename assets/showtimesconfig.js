
// Setups the Trailers object for use.
Trailers.init(
{
	"RESOLUTION": atv.sessionStorage['RESOLUTION'],

	// Set of base URLs that are used as a reference point for the other paths.
	"IMAGE_BASE_URL": atv.sessionStorage['IMAGE_BASE_URL'],
	"TRAILER_BASE_URL":atv.sessionStorage['TRAILER_BASE_URL'],

	// I have added a default poster for those trailers that we don't have a poster for.
	"DEFAULT_POSTER": atv.sessionStorage['DEFAULT_POSTER'],

	// See the note above
	"QUALMAP": atv.sessionStorage['QUALMAP'],

	// List of Javascript files to include on each file.
	"SCRIPT_URLS": atv.sessionStorage['SCRIPT_URLS'],

	// Main Query URL to retrieve showtimes from
	"SHOWTIME_QUERY_URL": atv.sessionStorage['SHOWTIME_QUERY_URL'],

	// URL to get an individual movie details.
	"SHOWTIME_MOVIE_DATA_URL": atv.sessionStorage['SHOWTIME_MOVIE_DATA_URL'],

	// Location Entry strings
	"LocationEntryTitle": atv.sessionStorage['LocationEntryTitle'],
	"LocationEntryInstructions": atv.sessionStorage['LocationEntryInstructions'],
	"LocationEntryLabel": atv.sessionStorage['LocationEntryLabel'],
	"LocationEntryFootnote": atv.sessionStorage['LocationEntryFootnote'] || "",

} );

// Register Callbacks and event handlers
Trailers.registerCallbackEvent( "DEFAULT_NAVIGATION_HANDLER", defaultNavigationHandler );
Trailers.registerCallbackEvent( "LoadShowtimes", loadShowtimesNavigationHandler );
Trailers.registerCallbackEvent( "MovieShowtimesNavigationHandler", movieShowtimesNavigationHandler);
Trailers.registerCallbackEvent( "PromptForLocation", promptForLocation );
Trailers.registerCallbackEvent( "LOAD_MOVIE_SHOWTIMES", loadShowtimesForMovie );


// Handles the navigation of the main navigation bar if a specific navigation callback hasn't been setup.
function defaultNavigationHandler( event )
{
	ATVUtils.log("DEFAULT_NAVIGATION_HANDLER: "+ JSON.stringify( event ), 3 );
	var navId = event.navigationItemId,
		navItem = document.getElementById( navId ),
		url = navItem.getElementByTagName( "url" ).textContent;

	ATVUtils.log( 'DEFAULT_NAVIGATION_HANDLER: URL: '+ url, 3 );
	var ajax = new ATVUtils.Ajax(
		{
			"url": url,
			"success": function( xhr ) {
				var doc = xhr.responseXML;
				event.success( doc );
			},
			"failure": function( status, xhr ) {
				event.failure( "Unable to load requested page." );
			}
		});
}

/**
 * Navigation Handler for the Showtimes Browser page.
 * This method is fired from the Trailers.handleOnNavigate method.
 */
function loadShowtimesNavigationHandler( event )
{

	var d = new Date(),

		LocalShowtimes = new Trailers.Showtimes(
		{
			"template": Trailers.getTemplate( "SHOWTIMES" ),
			"queryParams": {
				"show_date": d.toShowtimeString()
			},
			"date": d
		} );

	function success()
	{
		try{
			var doc = this.processTemplate();
			event.success( doc );
		}
		catch( err )
		{
			ATVUtils.log("LoadShowtimes callback: Success Error: "+ JSON.stringify( err ), 0 )
		}
	};

	function failure( err )
	{
		ATVUtils.log( "Error loading showtime data: "+ JSON.stringify( err ), 0 );
		event.failure( JSON.stringify( err ) );
	};

	function StartLoadingData()
	{
		ATVUtils.log( "LOAD SHOWTIMES: STARTLOADINGDATA: <eom>", 3 );
		LocalShowtimes.loadTheatreData( success, failure )
	};

	if( LocalShowtimes.location() )
	{
		StartLoadingData();
	}
	else
	{
		LocalShowtimes.getLocation( StartLoadingData, success );
	};

}

/**
 * This method prompts the user to enter a new zip code and then updates the page.
 */
function promptForLocation()
{
	var d = new Date();

	LocalShowtimes = new Trailers.Showtimes(
	{
		"template": Trailers.getTemplate( "SHOWTIMES" ),
		"queryParams": {
			"show_date": d.toShowtimeString()
		},
		"date": d,
	} );

	function failure( err )
	{
		ATVUtils.log( "Error loading showtime data: "+ JSON.stringify( err ), 0 );
		event.failure( JSON.stringify( err ) );
	};

	LocalShowtimes.getLocation( LocalShowtimes.updateShowtimes, failure );

}


/**
 * This method loads the individual movie showtimes page.
 * This is called when a movie is selected.
 * We will also use this option to load showtimes from the
 * trailer detail page.
 */
function loadShowtimesForMovie( options )
{
	var d = new Date(),
		proxy = new atv.ProxyDocument,
		isNewTheatre = ( options.new_theatre == "YES" ),
		location = options.url.postal_code || ATVUtils.data( "LOCATION" ),
		show_date = options.url.show_date || d.toShowtimeString(),
		showtimes = new Trailers.Showtimes(
		{
			"template": Trailers.getTemplate( "MOVIEPAGE" ),
			"queryParams":
			{
				"show_date": show_date,
				"postal_code": location
			},
			"tribune_id": options.url.tribune_id,
			"theatre_id": options.theatre_id,
			"date": d,
			"movie_id": options.movie_id,
			"navigationItemId": options.navigationItemId || "DATE_"+ d.toISOString()
		} );

	proxy.show();

	function success()
	{
		try
		{
			ATVUtils.log( "LOAD_MOVIE_SHOWTIMES: SUCCESS: Processing the Movie Showtime Template", 3  );
			var doc = this.processTemplate();

			ATVUtils.log( "LOAD_MOVIE_SHOWTIMES: THIS IS IMPORTANT: isNewTheatre = "+ isNewTheatre +" | options: \n\n "+ JSON.stringify( options ), 3 );

			if( isNewTheatre )
			{
				ATVUtils.log( "LOAD_MOVIE_SHOWTIMES: WE ARE SWITCHING THEATRES", 3 );
				proxy.loadXML( doc, function(success) {
					console.log( "LOAD_MOVIE_SHOWTIMES: WE HAVE LOADED THE NEW THEATRE PAGE. TIME TO UNLOAD THE OLD ONE.", 3);
					if ( success ) {
						atv.unloadPage();
					}
				});
			}
			else
			{
				ATVUtils.log( "LOAD_MOVIE_SHOWTIMES: WE ARE LOADING A FRESH THEATRE", 3 );
				proxy.loadXML( doc );
			};
		}
		catch( err )
		{
			failure( err );
		};
	};

	function failure( err )
	{
		console.error("LOAD_MOVIE_SHOWTIMES: FAILURE: Error loading template data: "+ JSON.stringify( err ) );
		proxy.cancel();
	};

	function StartLoadingData()
	{
		ATVUtils.log( "LOAD_MOVIE_SHOWTIMES: STARTLOADINGDATA: Loading Movie Data", 3 );
		showtimes.loadMovieShowtimeData( success, failure )
	};

	if( showtimes.location() )
	{
		ATVUtils.log( "LOAD_MOVIE_SHOWTIMES: We have a location", 3 );
		StartLoadingData();
	}
	else
	{
		showtimes.getLocation( StartLoadingData, failure );
	};

}

// Handles the navigation on Individual Movie Showtimes page
function movieShowtimesNavigationHandler( event )
{

	function success()
	{
		try
		{
			ATVUtils.log( "MOVIE_SHOWTIMES_HANDLER: SUCCESS: Processing the Movie Showtime Template", 3  );
			var doc = this.processTemplate(),
				oldPage = document.getElementById( elementId ),
				newPage = doc.getElementById( elementId ),
				parent = oldPage.parent;

			newPage.removeFromParent();

			parent.replaceChild( oldPage, newPage );

			movieShowtimes.stopSpinner();
		}
		catch( err )
		{
			failure( err );
		}
	};

	function failure( err )
	{
		console.error("Error loading template data: "+ JSON.stringify( err ) );
		movieShowtimes.stopSpinner();
	};

	ATVUtils.Ajax.cancelAllActiveRequests();

	var elementId = "SHOWTIMES_ITEMS",
		navId = event.navigationItemId,
		navItem = document.getElementById( navId ),
		show_date = navItem.getElementByTagName( "url" ).textContent,
		timestamp = new Date( navItem.getElementByTagName( 'stash' ).getElementByTagName( 'dateTimeStamp' ).textContent ),

		location = ATVUtils.data( "LOCATION" ),
		movieProperties = JSON.parse( document.rootElement.getElementByTagName( "movieDetailProperties" ).textContent ),
		movieData = JSON.parse( unescape( document.rootElement.getElementByTagName( "movieData" ).textContent ) ),
		movieShowtimes = Trailers.getConfig( "MOVIE_SHOWTIMES" );

	if( !movieShowtimes )
	{
		movieShowtimes = new Trailers.Showtimes(
		{
			"template": Trailers.getTemplate( "MOVIEPAGE" ),
			"queryParams":
			{
				"show_date": show_date,
				"postal_code": location
			},
			"tribune_id": movieProperties.tribune_id,
			"theatre_id": event.theatre_id || movieProperties.theatre_id,
			"movie_id": movieProperties.movie_id
		});
	}

	movieShowtimes.queryParams.show_date = show_date;
	ATVUtils.log( " == SETTING MOVIESHOWTIME DATE TO: "+ timestamp + " <== ", 5);
	movieShowtimes.date = timestamp;
	movieShowtimes.navigationItemId = navId;
	movieShowtimes.movieData = movieData;

	movieShowtimes.startSpinner();
	movieShowtimes.loadMovieShowtimeData( success, failure )
}





