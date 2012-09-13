/**
 * Utility functions common to all guided tours.
 *
 * This was ported over from WordPress Guided Tour, customized as a MediaWiki Gadget
 * with the ability to autolaunch whatever it needs.
 *
 * @author terry chay
 */
jQuery(document).ready(function($) {

	// cookie the users when they are in the tour
	guiders.cookie = 'mw-tour';

	// good for tracking what tour we are on
	guiders.currentTour = '';

	guiders.mwHideTour = function (tour_name) {
		guiders.hideAll(); //Hide current guider
		//guiders.endTour(); //remove cookies and hide guider
		guiders.show('gt-hide'); //show future help notice
		// notify that we are dismissing the tour
		//(not sure we need this)
		//$.ajax({url:ajaxurl, data:{action:'guided_tour_hide', tour: GTL10n.tour, nonce: GTL10n.nonce }});
		// TODO: should launch a default tour element
	}

	// "Hide Tour" link should show info
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



	gt_is_path = function (uri) {
		return function() { return ( window.location.pathname == uri ); };
	}

	gt_has_query = function (query_parts, uri) {
		if ( uri && !gt_is_path( uri ) ) { return function() { return false; }; }
		var urlParams = gt_get_query();
		for (var qname in query_parts) {
			if ( typeof(urlParams[qname]) == 'undefined' )  { return function() { return false; }; }
			if ( query_parts[qname] && ( urlParams[qname] != query_parts[qname] ) ) { return function() { return false; }; }
		}
		return function() { return true; };
	}



	// STATS!
	/**
	 * Record stats of guider being shown
	 *
	 * This is a named function so you can override onShow but still record the stat.
	 */
	gt_record_stats = function(guider) {
/*
		//strip gt-
		var guiderid = guider.id.substr(3);

		// hide event
		if ( guiderid == 'gt-hide' ) {
			if ( guiders.currentTour ) {
				new Image().src = document.location.protocol+'//stats.wordpress.com/g.gif?v=wpcom-no-pv&x_guided-tour=' + guiders.currentTour + '-hide'; 
			}
			return;
		}

		var pieces = guiderid.split(/-/);
		if ( pieces.length == 1 ) { return; } // should never happen, but let's be careful
		var tourname = guiderid.substr(0, guiderid.length - pieces[pieces.length-1].length - 1);
		var append = guiderid;
		// log the tourname only (at most) once per page view
		if (guiders.currentTour != tourname) {
			append += ',' + tourname;
			guiders.currentTour = tourname;
		}
		new Image().src = document.location.protocol+'//stats.wordpress.com/g.gif?v=wpcom-no-pv&x_guided-tour=total,' + append;
*/
	};
	//guiders._defaultSettings.onShow = gt_record_stats;

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



	/*
	gt_end_tour = function (tour_name) {
		//TODO add dialog box asking if they want to end the tour permanently here
		//var r=confirm(GTL10n.confirm_end);
		//if (r) { gt_tour_complete(); }
		guiders.endTour(); //remove session cookie and hide tour
	}
	*/

	gt_tour_complete = function(tour_name) {
		$.ajax({url:ajaxurl, data:{action:'guided_tour_complete', tour: GTL10n.tour, nonce: GTL10n.nonce }});
		if ( guiders.currentTour ) {
			new Image().src = document.location.protocol+'//stats.wordpress.com/g.gif?v=wpcom-no-pv&x_guided-tour=' + guiders.currentTour + '-complete'; 
		}
		return;
	}

});
