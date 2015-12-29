Trailers.Showtimes = function ( options )
{
	var me = this;

	for( var p in options )
	{
		if( options.hasOwnProperty( p ) && ["success","failure"].indexOf( p ) == -1 )
		{
			ATVUtils.log( "Setting: "+ p +" to "+ options[ p ] +" <--- ", 3 );
			this[ p ] = options[ p ];
		};
	};

	this.theatreData = [];
	this.completeShowtimesList = [];
	this.movieData = {};
	this.todaysDate = new Date();

};

Trailers.Showtimes.prototype = {

	pageId: function()
	{
		var pageId = "SHOWTIMES_"+ this.location(),
			theatreId = this.theatre_id;

		if( this.movie_id ) {
			pageId += "_MOVIEID_"+ this.movie_id +"_THEATRE_"+ theatreId;
		}

		return pageId;
	},

	// Merges the data with the Template string.
	processTemplate: function()
	{
		var results = new EJS( { "text": this.template } ).render( this ),
			doc = atv.parseXML( results );

		ATVUtils.log( "PROCESSTEMPLATE: results \n\n"+ results +"\n\n<==", 3);

		this.moveNoDataMoviesToBottom( doc );
		return doc;
	},

	sortCompleteShowtimeList: function()
	{
		var me = this;

		function sortByShowtimes( a, b ) {
			var aDate = new Date( me.date ).withShowtimeString( a.time ),
				bDate = new Date( me.date ).withShowtimeString( b.time );

			ATVUtils.log( "SORTBYSHOWTIMES: A: "+ typeof( aDate ),5 );
			ATVUtils.log( "A Value: "+ aDate.valueOf(),5 );
			ATVUtils.log( " | B: "+ typeof(bDate), 5);
			ATVUtils.log( "A Value: "+ bDate.valueOf(),5 );

			results = aDate.valueOf() - bDate.valueOf();

			ATVUtils.log( "results: "+ results, 3 );

			return results;
		};

		ATVUtils.log( " === Sorting Showtimes === "+ JSON.stringify( this.completeShowtimesList ) +" <=== ", 4 );
		this.completeShowtimesList.sort( sortByShowtimes );
	},

	saveLocation: function( value )
	{
		ATVUtils.data( "LOCATION", value );
	},

	location: function()
	{
		return ATVUtils.data( "LOCATION" );
	},

	getLocation: function( success, failure )
	{
		var me = this;

		function TextEntrySuccess( value )
		{
			var oldLocation = me.location(),
				zip = new RegExp( /^[\d]{5}$/ ),
				isValidZip = ( value.match( zip ) ) ? true : false;

			if( isValidZip )
			{
				me.saveLocation( value );
				success.call( me );
			}
			else if( oldLocation )
			{
				success.call( me );
			}
			else
			{
				failure.call( me );
			};
		};

		function TextEntryFailure()
		{
			var oldLocation = me.location();

			if( oldLocation )
			{
				success.call( me, oldLocation );
			}
			else
			{
				failure.call( me );
			};
		};

		// create the text message
		var textEntryValues =
		{
			"title": Trailers.getConfig( "LocationEntryTitle" ),
			"instructions": Trailers.getConfig( "LocationEntryInstructions" ),
			"label": Trailers.getConfig( "LocationEntryLabel" ),
			"footnote": Trailers.getConfig( "LocationEntryFootnote" ),
			"defaultValue": ATVUtils.data( "LOCATION" ),
			"onSubmit": TextEntrySuccess,
			"onCancel": TextEntryFailure
		}

		ATVUtils.loadTextEntry( textEntryValues );
	},

	getLocationFailed: function( msg )
	{
		ATVUtils.log( msg, 0 );
	},

	createBadges: function( showtime, movie )
	{
		var qualmap = Trailers.getConfig( "QUALMAP" ),
			badge = [],
			quals = movie.quals.split('|');

		if( showtime.is_bargain )
		{
			badge.push( "Bargain" );
		};

		quals.forEach( function( qual ) {
			badge.push( qualmap[ qual ] || qual );
		} );

		return badge.join( ' ' ) ;
	},

	formatDescription: function()
	{
		return this.movieData.description || "";
	},

	studioFootnote: function()
	{
		return this.movieData.studio || "";
	},

	moviePoster: function( size )
	{
		var poster,
			default_poster = Trailers.getConfig( 'DEFAULT_POSTER' );
			size = size || "";
		ATVUtils.log( "We are looking for size: --> "+ size +" <-- "+ this.movieData.posters, 5 );
		if( this.movieData.posters ) {
			ATVUtils.log( "We have posters", 3 );
			switch( size )
			{
				case 'thumbnail':
				case 'small':
				case 'medium':
					poster = this.movieData.posters.poster;
					break;
				case 'large':
					poster = this.movieData.posters.large_poster;
					break;
				case 'xlarge':
					poster = this.movieData.posters.xlarge_poster;
					break;
				default:
					poster = this.movieData.posters.large_poster || default_poster;
			};
		} else {
			poster = default_poster;
		}
		ATVUtils.log( "This is our poster: "+ poster, 3 );
		return poster;
	},

	movieInfo: function( property, movie ) {
		var movie = movie || {},
			movieDataMap = {
				"rottenRating": {
					"name": "tomatoRating",
					"decoration": "%",
					"badValues" : [ "0" ]
				},
				"runtime": {
					"name": "runtime",
					"decoration": " mins",
					"badValues" : [ "" ]
				}
			};

		if( movieDataMap.hasOwnProperty( property ) && typeof( this.movieData[ movieDataMap[ property ].name ] ) !== "undefined" )
		{
			var propertyValue = this.movieData[ movieDataMap[ property ].name ],
				decoration = ( movieDataMap[ property ].decoration ) ? movieDataMap[ property ].decoration : "",
				response = ( movieDataMap[ property ].badValues && movieDataMap[ property ].badValues.indexOf( propertyValue ) > -1 ) ? "" :  propertyValue + decoration;
		}
		else
		{
			var response = ( movie[ property ] ) ? movie[ property ] : "";
		}

		return response;
	},

	theatreAddress: function( address ) {
		var address = address || {},
			response = ( address.street ) ? address.street+", "+ address.city : "";
		return response;
	},

	theatreInfo: function( property, theatre ) {
		var theatre = theatre || {},
			response = ( theatre[ property ] ) ? theatre[ property ] : "";
		return response;
	},

	moviePosterItems: function( theatre )
	{
		theatre.movieIds = [];

		var tmplt = Trailers.getTemplate( "MOVIEPOSTERITEM" ),
			location = ATVUtils.data( "LOCATION" ),
			results = new EJS( { "text": tmplt } ).render( theatre );

		return ( results.trim() == "" ) ? null : results;
	},

	isDimmed: function( showtime )
	{
		ATVUtils.log( "Here is our showtime: "+ JSON.stringify( showtime ) +"<==", 5 );
		ATVUtils.log( "And the Date: "+ this.date.toISOString() +"<==", 5);
		var time = new Date( this.date ).withShowtimeString( showtime.time ),
			now = Date.now();

		ATVUtils.log( "Time: "+ time.valueOf() +"<==", 5);
		ATVUtils.log( "Now: "+ now +"<==", 5);

		return ( time.valueOf() < now )
	},

	// Returns the currently selected theatre data.
	selectedTheatre: function( theatres )
	{
		var	theatreId = this.theatre_id,
			theatre = [];

		ATVUtils.log( "SELECTED THEATRE: THEATRE ID: --> "+ theatreId +" <--\n\n THEATRE LIST -->\n\n"+ JSON.stringify( theatres ) +"\n\n<--\n\nTHIS THEATRES: \n\n"+ JSON.stringify( this.theatreData ) +"\n\n<--", 4 );

		function filterTheatresById( ts )
		{
			var ST = ts.filter(
				function( theatre )
				{
					return (theatre.id == theatreId);
				},
				this );
			return ST;
		};

		if( theatres )
		{
			if( theatreId )
			{
				theatre = filterTheatresById( theatres );
			}
			else
			{
				theatre.push( theatres[0] );
			};

		}
		else
		{
			ATVUtils.log( "SELECTED THEATRE: I am in the ELSE. --> "+ theatreId +" <--", 6 );
			if( !theatreId )
			{
				ATVUtils.log( "SELECTED THEATRE: NO ID "+ theatreId +" --> ", 6 );

				theatreId = this.theatre_id = this.queryParams.theatre_id = ( this.theatreData.length > 0 ) ? this.theatreData[0].id : "";

				ATVUtils.log( "SELECTED THEATRE: NO ID "+ theatreId +" <-- ", 6 );
			};

			theatre = filterTheatresById( this.theatreData );

		};

		ATVUtils.log( "SELECTED THEATRE: THEATRE: -->\n\n"+ JSON.stringify( theatre ) +"\n\n<--", 2 );
		return theatre;
	},

	// Template Function: Returns the selected movie data.
	selectedMovie: function( theatre )
	{
		var movieId = this.movie_id,
			response = [];
		ATVUtils.log( "SELECTED MOVIE: MOVIE ID: "+ movieId +" <-- ", 3 );
		ATVUtils.log( "SELECTED MOVIE: THEATRE: \n\n"+ JSON.stringify( theatre ) +"\n\n<--", 4 );

		if( theatre )
		{
			var selectedMovie = theatre.now_showing.filter(
					function( movie )
					{
						return ( movie.film_id == movieId );
					},
					this );
			ATVUtils.log( "SELECTED MOVIE: \n\n"+ JSON.stringify( selectedMovie ) +"\n\n<--", 4 );

			response = 	( this.movie_id ) ? selectedMovie : theatre.now_showing;
		}

		ATVUtils.log ( "SELECTED MOVIE RESPONSE: "+ JSON.stringify( response ) +"\n\n<--", 2 );
		return response;
	},

	// Template Function: Returns a list of nearby theatres.
	nearbyTheatres: function( selectTheatre )
	{
		ATVUtils.log( "NEARBY THEATRE: SELECTED THEATRE: \n\n"+ JSON.stringify( selectTheatre ) +"\n\n", 3 );
		var selectedTheatreId = ( selectTheatre ) ? selectTheatre.id : "",
			nearbyTheatresListIds = [],
			nearbyTheatresList = this.theatreData.filter(
				function( theatre )
				{
					var response =  ( theatre.id != selectedTheatreId && nearbyTheatresListIds.indexOf( theatre.id ) == -1 );

					if( response ) nearbyTheatresListIds.push( theatre.id );

					return response;
				}, this );

		ATVUtils.log( 'NEARBY THEATRE: NEARBY THEATRES: \n\n'+ JSON.stringify( nearbyTheatresList ) +"\n\n", 2 );
		return nearbyTheatresList;
	},

	// Template function that swaps the right label with a spinner. This indicates that the new times are loading.
	startSpinner: function()
	{
		ATVUtils.log( "START_SPINNER", 3)
		try
	    {
	        var menuItems = document.evaluateXPath( "//twoLineMenuItem[@id='MOVIE_DETAIL_LINK']" );

	        for( var i=0; i < menuItems.length; i++ )
	        {
	        	var menuItem = menuItems[ i ],
	        		accessories = menuItem.getElementByTagName( "accessories" ) || document.makeElementNamed("accessories"),
	        		rightLabel = menuItem.getElementByTagName( "rightLabel" ),
	        		spinner = document.makeElementNamed("spinner");

	        	accessories.appendChild(spinner)

        		if( rightLabel )
        		{
        			menuItem.replaceChild( rightLabel, accessories );
        		}
        		else
        		{
        			menuItem.appendChild( accessories );
        		};

	        };
	    }
	    catch(error)
	    {
	        ATVUtils.log( "Caught exception trying to toggle DOM element: " + error, 0 );
	    }
	},

	stopSpinner: function()
	{
		ATVUtils.log( "STOP_SPINNER", 3)
		try
	    {
	        var menuItems = document.evaluateXPath( "//twoLineMenuItem[@id='MOVIE_DETAIL_LINK']" );

	        for( var i=0; i < menuItems.length; i++ )
	        {
	        	var menuItem = menuItems[ i ],
	        		accessories = menuItem.getElementByTagName( "accessories" );

		        if ( accessories )
		        {
		        	accessories.removeFromParent();
		        };
	        };
	    }
	    catch(error)
	    {
	        ATVUtils.log( "Caught exception trying to toggle DOM element: " + error, 0 );
	    }
	},

	// creates the <navigationItem> elements for the individual showtime page
	dateNavigation: function( startDate )
	{
		var date = new Date( startDate ),
			dates = [],
			navigation = "";

		date.prevDay();
		dates.push( new Date( date.toISOString() ) );

		while( dates.length < 8 )
		{
			date.nextDay();
			dates.push( new Date( date.toISOString() )  );
		};

		var tmplt = new EJS( { "text": Trailers.getTemplate("MOVIEPAGENAVIGATION") } ).render( { "dates":dates } );

		console.log( "PROCESSTEMPLATE: RESULTS: ==>\n\n"+ tmplt +"\n\n<==");

		return tmplt;
	},

	// returns formated <script> tags for each of the scripts listed in "SCRIPT_URLS"
	scriptTags: function()
	{
		var scriptUrls = Trailers.getConfig( "SCRIPT_URLS"),
			scriptTags = "";

		scriptUrls.forEach(
			function( script )
			{
				scriptTags += '<script src="'+ script +'" />';
			},
			this );

		return scriptTags;
	},

	// For the Browser View: moves all movies, that don't have complete information to the bottom of the list.
	moveNoDataMoviesToBottom: function( doc ) {
		var default_poster = Trailers.getConfig( "DEFAULT_POSTER" );
		ATVUtils.log( "Checking for the default poster: "+ default_poster, 3 );
		var noDataMovies = doc.evaluateXPath( "//moviePoster[image='"+ default_poster +"']", doc );

		if( noDataMovies.length > 0 )
		{
			ATVUtils.log("We have some movies with no data: ", 3 );
			noDataMovies.forEach(
				function( movie )
				{
					var parent = movie.parent;
					movie.removeFromParent();
					parent.appendChild( movie );
				} );
		}
	},

	// Updates the current showtimes view. This function is primarily used on a location change from the Browser View
	updateShowtimes: function( elementId )
	{
		var me = this,
			location = this.location(),
			date = new Date(),
			template = this.template;

		function RunShowTimeData()
		{
			toggleSpinner( "CHANGE_LOCATION" );
			me.loadTheatreData( LoadPageSuccess, LoadPageFailure, Trailers.getConfig( 'SHOWTIME_QUERY_URL' ) + Trailers.createQueryString( { "show_date": date.toShowtimeString(), "postal_code": location } ) );
		};

		function LoadPageSuccess()
		{
			try
			{
				var doc = this.processTemplate(),
				oldPage = ( elementId ) ? document.getElementById( elementId ) : document.rootElement.getElementByTagName( 'body' ),
				newPage = ( elementId ) ? doc.getElementById( elementId ) : doc.rootElement.getElementByTagName( 'body' ),
				parent = ( elementId ) ? oldPage.parent : document.rootElement;

				newPage.removeFromParent();

				parent.replaceChild( oldPage, newPage );
			}
			catch( err )
			{
				ATVUtils.log( "updateShowtimes error: "+ JSON.stringify( err ), 0 );
				toggleSpinner( "CHANGE_LOCATION" );
			}

		};

		function LoadPageFailure( err )
		{
			ATVUtils.log( JSON.stringify( err ), 0 );
			toggleSpinner( "CHANGE_LOCATION" );
		};

		if( !location )
		{
			this.getLocation( RunShowTimeData, LoadPageFailure );
		}
		else
		{
			RunShowTimeData();
		};
	},

	// Loads the individual movie data for the movie ShowTime page.
	loadMovieShowtimeData: function( success, failure )
	{
		var me = this,
			complete = numberOfRequests = succeeded = failed = 0,
			url = Trailers.getConfig( "SHOWTIME_MOVIE_DATA_URL" ).replace( /%%MOVIEID%%/g, this.movie_id );

		ATVUtils.log( "LOAD MOVIE DATA: url: "+ url +"<--", 3 );

		function LoadSuccess( tmsId )
		{
			complete++;
			succeeded++;

			if( complete == numberOfRequests )
			{
				LoadFinished();
			};
		};

		function LoadFailure( tmsId )
		{
			ATVUtils.log( "data grab failed: "+ tmsId.url +" "+ tmsId.msg, 3 );
			complete++;
			failed++;

			if( complete == numberOfRequests && succeeded > 0 )
			{
				LoadFinished();
			}
			else
			{
				failure.call( this, tmsId );
			}
		};

		function LoadFinished()
		{
			try
			{

				if( me.theatreData )
				{
					var selectTheatre = me.selectedTheatre( me.theatreData ),
						processedTributeId = [];

					selectTheatre.forEach(
						function( theatre )
						{
							if( theatre )
							{
								var selectMovie = this.selectedMovie( theatre );

								selectMovie.forEach(
									function( movie )
									{
										if( movie && processedTributeId.indexOf( movie.tms_id ) == -1 )
										{
											processedTributeId.push( movie.tms_id );
											movie.times.forEach(
												function( showtime )
												{
													showtime.badge = this.createBadges( showtime, movie )
													this.completeShowtimesList.push( showtime );
												},
												this );
										};
									},
									this );
							};
						},
						me );
				};


				me.sortCompleteShowtimeList();

				ATVUtils.log( "HERE IS OUR SHOWTIMES LIST: \n\n"+ JSON.stringify( me.completeShowtimesList ) +"\n\n", 4 );

				if( succeeded > 0 )
				{
					success.call( me );
				}
				else
				{
					failure.call( me );
				};
			}
			catch( err )
			{
				console.error( "LoadMovieData: LoadFinished: Failed with error: "+ JSON.stringify( err ) );
			}
		};

		function loadMovieDataFromTribuneIds() {
			if( Array.isArray( me.tribune_id ) ) {
				numberOfRequests = me.tribune_id.length;
				me.tribune_id.forEach(
					function( tmsId )
					{
						var showtimeUrl = Trailers.getConfig( "SHOWTIME_QUERY_URL" ) + Trailers.createQueryString( me.queryParams ) +"&tribune_id="+ tmsId.id;
						me.loadTheatreData( LoadSuccess, LoadFailure, showtimeUrl );
					} );

			} else {
				numberOfRequests = 1;
				var showtimeUrl = Trailers.getConfig( "SHOWTIME_QUERY_URL" ) + Trailers.createQueryString( me.queryParams ) +"&tribune_id="+ me.tribune_id;
				me.loadTheatreData( LoadSuccess, LoadFailure, showtimeUrl );
			}
		}

		if( this.movie_id ) {
			var ajax = new ATVUtils.Ajax(
			{
				"url": url,
				"success": function( xhr )
				{
					ATVUtils.log( "LOADMOVIE DATA FROM ID: SUCCESS", 1 );
					try
					{
						me.movieData = JSON.parse( xhr.responseText );

						if( me.movieData.tmsIds.length == 0 ) me.movieData.tmsIds.push( { "id": me.tribune_id } );

						numberOfRequests = me.movieData.tmsIds.length;
						me.movieData.tmsIds.forEach(
							function( tmsId )
							{
								var showtimeUrl = Trailers.getConfig( "SHOWTIME_QUERY_URL" ) + Trailers.createQueryString( me.queryParams ) +"&tribune_id="+ tmsId.id;
								me.loadTheatreData( LoadSuccess, LoadFailure, showtimeUrl );
							} );
					}
					catch( error )
					{
						if( status == "404" && me.tribune_id )
						{
							ATVUtils.log( "SUCCESS: ERROR: LOADING FROM TRIBUNE.", 3 );
							loadMovieDataFromTribuneIds.call(me);
						}
						else
						{
							ATVUtils.log( "SUCCESS: ERROR: NO TRIBUNE.", 3 );
							failure.call(me, { "code":"XHR_"+xhr.status, "xhr":xhr, "msg":error } );
						}
					}

				},
				"failure": function( status, xhr )
				{
					if( status == "404" && me.tribune_id )
					{
						ATVUtils.log( "FAILURE: ERROR: LOADING FROM TRIBUNE.", 3 );
						loadMovieDataFromTribuneIds.call(me);
					}
					else
					{
						ATVUtils.log( "FAILURE: ERROR: NO TRIBUNE.", 3 );
						failure.call( me, { "code": "XHR"+status, "xhr": xhr } );
					}

				}
			});
		}
		else if( this.tribune_id )
		{
			ATVUtils.log( "LOAD MOVIE DATA: TRIBUNE ID: "+ JSON.stringify( this.tribune_id ), 3 );
			loadMovieDataFromTribuneIds.call(me);
		};

	},

	// Loads the full showtime/theatre data.
	loadTheatreData: function( success, failure, url )
	{
		this.queryParams.postal_code = this.location();

		var me = this,
			url = url || Trailers.getConfig( "SHOWTIME_QUERY_URL" ) + Trailers.createQueryString( this.queryParams );

		ATVUtils.log( "LOAD SHOWTIME DATA: URL: " + url, 3 );

		var ajax = new ATVUtils.Ajax(
			{
				"url": url,
				"success": function( xhr )
				{
					try
					{
						ATVUtils.log( "LOADTHEATREDATA: SUCCESS: START: -->\n\n"+ xhr.responseText +"\n\n<--", 4 );

						var data = JSON.parse( xhr.responseText ),
							theatreData = data[0].pages[0];

						ATVUtils.log( "LOADTHEATREDATA: SUCCESS: DATA: -->\n\n"+ JSON.stringify( theatreData ) +"\n\n<--", 4 );

						if ( theatreData ) {
							ATVUtils.log( "LOADTHEATREDATA: SUCCESS: IF: ", 3 );
							me.theatreData = me.theatreData.concat( theatreData );

							ATVUtils.log( "LOADTHEATREDATA: SUCCESS: POST CONCAT: -->\n\n"+ JSON.stringify( theatreData ) +"\n\n<--", 4 );
							me.theatreData.sort( function(a, b) {
									return ( a.distance - b.distance );
								} );

							ATVUtils.log( "LOADTHEATREDATA: SUCCESS: POST SORT: -->\n\n"+ JSON.stringify( theatreData ) +"\n\n<--", 4 );
						}

						ATVUtils.log( "LOADTHEATREDATA: SUCCESS: BEFORE SUCCESS CALL: -->\n\n"+ JSON.stringify( theatreData ) +"\n\n<--", 4 );

						success.call( me, { "xhr": xhr, "url": url } );
					}

					catch( error )
					{
						failure.call(me, { "code":"XHR_"+xhr.status, "xhr":xhr, "msg":error, "url":url } );
					}
				},
				"failure": function( status, xhr )
				{
					failure.call(me, { "code":"XHR_"+status, "xhr":xhr, "url":url } );
				}
			});
	}

};

