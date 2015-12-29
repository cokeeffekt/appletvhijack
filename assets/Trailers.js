var Trailers = ( function() {
	var config = {},
		callbacks = {},
		templates = {};

	function setConfig( property, value ) {
		ATVUtils.log( " ===> Setting: "+ property +" = "+ value +" <=== ", 3 );
		config[ property ] = value;
	};

	function getConfig( property ) {
		var value = config[ property ];
		return ( value ) ? value: null;
	};

	function saveTemplate( property, value ) {
		ATVUtils.log( " ===> Setting: "+ property +" = "+ value +" <=== ", 5 );
		templates[ property ] = value;
	};

	function getTemplate( property ) {
		var value = templates[ property ];
		return ( value ) ? value: null;
	};

	function registerCallbackEvent( name, callback ) {
		ATVUtils.log( " ---- Registering Callback: " + name + " with callback type: " + typeof( callback ), 3 );
		if ( typeof callback === "function" ) {
			callbacks[ name ] = callback;
		} else {
			console.error( "registerCallbackEvent: callback (type of function) is required." );
		}
	};

	function fireCallbackEvent( name, parameters, scope ) {
		var scope = scope || this,
		parameters = parameters || {};

		if ( callbacks[ name ] && typeof callbacks[ name ] === "function" ) {
			callbacks[ name ].call( scope, parameters )
		} else {
			ATVUtils.log( "No callback by that name "+ name, 0 );
		};
	};

	function isRegisteredCallback( name ) {
		return callbacks.hasOwnProperty( name );
	};

	function handleOnNavigate( event, handlerName ) {
		ATVUtils.log( "Navigation handler: "+ JSON.stringify( event ), 3 );
		var eventHandler = "Load"+ event.navigationItemId;
		if( isRegisteredCallback( eventHandler ) )
		{
			fireCallbackEvent( eventHandler, event );
		}
		else if( handlerName )
		{
			fireCallbackEvent( handlerName, event );
		}
		else
		{
			fireCallbackEvent( "DEFAULT_NAVIGATION_HANDLER", event );
		}
	};

	function createQueryString( options ) {
		ATVUtils.log( "Making the query String"+ JSON.stringify( options ), 3 );
		var queryString = "";

		for( var p in options ) {
			if( options.hasOwnProperty( p ) ) {
				queryString += "&"+ p +"="+ options[ p ];
			};
		};

		return queryString;
	};


	// expanded functions
	function getTrailerImage( show ) {
		var baseImageUrl = ( getConfig( "IMAGE_BASE_URL" ) && show.poster ) ? getConfig( "IMAGE_BASE_URL" ) : getConfig( "BASE_URL" ),
			imagePath = ( show.poster ) ? baseImageUrl + show.poster : getConfig( "DEFAULT_POSTER" );
		return imagePath;
	};

	function getTrailerUrl( show ) {
		var baseUrl = getConfig( "TRAILER_BASE_URL" ),
			trailerPath = ( typeof( show ) === "string" ) ? show.replace( /trailers/, "studios" ) : ( show.trailer_url ) ? show.trailer_url.replace( /trailers/, "studios" ) : "studios/"+show.title.toLowerCase().replace( /\s/g, "" ),
			trailerUrl = baseUrl + trailerPath +"videos/trailer"+ getConfig( "RESOLUTION" );
		return trailerUrl;
	};

	function getDetailsUrl( show )
	{
		var baseUrl = getConfig( "TRAILER_BASE_URL" ),
			trailerPath = show.replace( /trailers/, "studios" ),
			trailerUrl = baseUrl + trailerPath + "index"+ getConfig( "RESOLUTION" );
		return trailerUrl;
	};

	function getShowtimeUrl( show, theatre, show_date ) {
		var showtimeObject = '{"postal_code":"'+ ATVUtils.data( "LOCATION" ) +'","theatre_id":"'+ theatre +'","tribune_id":"'+ show.tms_id +'","show_date":"'+ show_date +'"}';
		return showtimeObject;
	};

	function initialize( options ) {
		if ( typeof options == "object" ) {
			for ( var p in options ) {
				if ( options.hasOwnProperty( p ) ) {
					setConfig( p, options[ p ] );
				};
			};
		};

		var tmps = JSON.parse( atv.localStorage.getItem( "TEMPLATES" ) );
		if ( typeof tmps == "object" ) {
			for ( var p in tmps ) {
				if ( tmps.hasOwnProperty( p ) ) {
					saveTemplate( p, tmps[ p ] );
				};
			};
		};

	};

	return {
		"setConfig": setConfig,
		"getConfig": getConfig,
		"saveTemplate": saveTemplate,
		"getTemplate": getTemplate,

		"registerCallbackEvent": registerCallbackEvent,
		"fireCallbackEvent": fireCallbackEvent,
		"isRegisteredCallback": isRegisteredCallback,

		"handleOnNavigate": handleOnNavigate,
		"createQueryString": createQueryString,

		"getTrailerImage": getTrailerImage,
		"getShowtimeUrl": getShowtimeUrl,
		"getTrailerUrl": getTrailerUrl,
		"getDetailsUrl": getDetailsUrl,

		"init": initialize
	};

} )();
