/**
 * Utility functions common to all guided tours (that are dependent on guiders.js).
 *
 * This was ported over from WordPress Guided Tour, customized as a MediaWiki Gadget.
 *
 * @author terry chay
 * @package    mwgadget.GuidedTour
 * @author     terry chay <tychay@mediawiki.org>
 * @version    $Id$
 */
( function ( window, document, jQuery, mw, guiders ) {

	var gt = mw.guidedTour = mw.guidedTour || {};

	// List of tours currently loaded
	if (!gt.installed) { gt.installed = {}; }


	// cookie the users when they are in the tour
	guiders.cookie = 'mw-tour';
	// add x button to top right
	guiders._defaultSettings.xButton = true;

	// good for tracking what tour we are on
	guiders.currentTour = '';

	/**
	 * onClose(): log hidden event before hiding
	 *
	 * Old version:shows an info guide before closing. Note: the info guide also
	 * generates an event.
	 *
	 * Not onHide() becase that is called even if tour end.
	 */
	guiders.onClose = function (tour_name) {
		// interstial hiding...
		//guiders.hideAll(); //Hide current guider
		//guiders.show('gt-hide'); //show future help notice
		// TODO: should launch a default tour element

		// notify that we are dismissing the tour
		if ( guiders.currentTour ) {
			var guider = guiders._guiderById(guiders._lastCreatedGuiderID);
			gt.pingServer( guider, guiders.currentTour, 'hide' );
		}
		guiders.endTour(); //remove cookies and hide guider
	}
	/*
	guiders.initGuider({
		id: "gt-hide",
		title: 'Remember!',
		description: 'You can always start the tour again… If you know how :-D',

		// attachment
		overlay: true,
		//attachTo: 'a#contextual-help-link',
		//position: '6',
		//offset: { top: -20, left: -170 },

		buttons: [
			{ name: 'Close', onclick: function() { guiders.endTour(); } }
		]
	});
	/* */

	// STATS!
	/**
	 * Record stats of guider being shown
	 *
	 * This is a named function so you can override onShow but still record the stat.
	 */
	gt.recordStats = function(guider) {
		//strip gt-
		var guiderid = guider.id.substr(3);

		// hide event
		if ( guiderid == 'gt-hide' ) {
			if ( guiders.currentTour ) {
				gt.pingServer(guider, guiders.currentTour, 'hide');
			}
			return;
		}

		var pieces = guiderid.split(/-/);

		if ( pieces.length == 1 ) { return; } // should never happen, but let's be careful
		var tourname = guiderid.substr(0, guiderid.length - pieces[pieces.length-1].length - 1);
		gt.pingServer(guider, tourname, pieces[pieces.length-1]);
	};
	gt.pingServer = function(guider, tour,step) {
		var eventObj = {
			event_id: 'guidedtour-'+tour+'-'+step,
			tour: tour,
			step: step,
			last_id: guider.id
		};
		if ( mw.e3 ) {
			mw.e3.track( eventObj );
		}
		mw.log( eventObj );
	}
	guiders._defaultSettings.onShow = gt.recordStats;

	/**
	 * endTour(): When you close the tour (complete) (step=end)
	 */
	gt.endTour = function() {
		if ( guiders.currentTour ) {
			var guider = guiders._guiderById(guiders._lastCreatedGuiderID);
			gt.pingServer( guider, guiders.currentTour, 'end' );
		}
		guiders.endTour(); //remove session cookie and hide tour
	}


	//
	// ONSHOW BINDINGS
	//
	/**
	 * + parseDescription(): Add to onShow to parse description as wikitext
	 */
	gt.parseDescription = function(guider) {
		// don't parse if already done
		if (guider.isParsed) { gt.recordStats(guider); return; }

		// parse (make synchronous API request)
		data = JSON.parse(
			$.ajax({
				async: false,
				type: 'POST',
				url: mw.util.wikiScript('api'),
				data: {
					action: 'parse',
					format: 'json',
					text: guider.description,
				}
			}).responseText
		);
		guider.description = data.parse.text['*'],
		guider.isParsed = true;
		// guider html is already "live" so edit it
		guider.elem.find(".guider_description").html(guider.description);

		// we override default onShow
		gt.recordStats(guider);
	}
	/**
	 * + descriptionPage(): Add to onshow to make the description as a wikipage reference
	 * to pull content from
	 */
	gt.descriptionPage = function(guider) {
		// don't parse if already done
		if (guider.isParsed) { gt.recordStats(guider); return; }

		// parse (make synchronous API request)
		data = JSON.parse(
			$.ajax({
				async: false,
				type: 'POST',
				url: mw.util.wikiScript('api'),
				data: {
					action: 'parse',
					format: 'json',
					page: guider.description,
				}
			}).responseText
		);
		guider.description = data.parse.text['*'],
		guider.isParsed = true;
		// guider html is already "live" so edit it
		guider.elem.find(".guider_description").html(guider.description);

		// we override default onShow
		gt.recordStats(guider);
	}


	//
	// SHOULDSKIP BINDINGS
	//
	/**
	 * isPage(): skip if on a particular wiki page
	 */
	gt.isPage = function(pageName) {
		return function() {
		   return (	mw.config.get( 'wgPageName' ) == pageName );
		};
	}
	/**
	 * hasQuery(): skip if has query string (object) and path
	 */
	gt.hasQuery = function (query_parts, pageName) {
		if ( pageName && (mw.config.get( 'wgPageName' ) == pageName) ) { return function() { return false; }; }

		// TODO: could use mw.util.getParamValue( qname ) here?
		var urlParams = gt.getQuery();
		for (var qname in query_parts) {
			if ( typeof(urlParams[qname]) == 'undefined' )  { return function() { return false; }; }
			if ( query_parts[qname] && ( urlParams[qname] != query_parts[qname] ) ) { return function() { return false; }; }
		}
		return function() { return true; };
	}




	/**
	 * Bind this to onshow for submenus elements in the admin menu
	 *
	 * To use this for a submenu guider
	 *
	 * 1. onShow should be this
	 * 2. prev should be set to the the guide to backtrack to
	 */
	gt_onshow_check_submenu_shown = function(guider) {
		// shouldn't really need this first line.
		var attach_obj = ( typeof(guider.attachTo)=='string' ) ? $(guider.attachTo) : guider.attachTo;
		    
		if ( attach_obj.is(':hidden') ) {
			return guiders.show(guider.prev);
		}

		// default behavior
		gt_record_stats(guider);
	};  


	gt_force_expand_menu = function( menu_item ) {
		var submenu = $( menu_item + ' .wp-submenu');
		if ( !submenu.is(':visible') ) {
			adminMenu.toggle( submenu );
		}
	}

	gt_submenu_is_visible = function( menu_item ) {
		return $( menu_item + ' .wp-submenu').is(':visible');
	}

	gt_get_step = function() {
		var qs = document.location.search;
		var has_step = qs.indexOf('step=');
		return (has_step > 0)? parseInt(qs.substring(has_step+5, has_step+7)) : 0;
	}



	gt_launch_tour = function (tour_name) {
	    var step = gt_get_step();
		guiders.failStep = 'gt-' + tour_name + '-fail'; //bind failure step
		if ( (step == 0) && ($.cookie(guiders.cookie)) ) {
			// start from cookie position
			if ( guiders.resume() )
				return;
		}

		if (step == 0) step = 1;
		// start from step specified
		guiders.resume('gt-' + tour_name + '-' + step);
	}




} ( window, document, jQuery, mw, guiders ) );
