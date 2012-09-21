 /**
  * Gadget for Guided Tour for MediaWiki
  *
  * Based on a WordPress.com customized version of Optimize.ly's Guiders.js file.
  *
  * To use, add this, the guidedTour/* contents, and tours to mediawiki and edit the URL's
  * to point to the right path, then include as a user script (for now).
  *
  * If moved or testing self, please edit the gadgetUrl and tourUrl params;
  *
  * @package    mwgadget.GuidedTour
  * @author     terry chay <tychay@mediawiki.org>
  * @version    $Id$
*/
( function ( window, document, jQuery, mw ) {
	'use strict';

	var gt = mw.guidedTour = mw.guidedTour || {};

	// These can be overridden outside
	if (!gt.gadgetUrl) {
		gt.gadgetUrl = '//www.mediawiki.org/w/index.php?title=MediaWiki:GuidedTour/';
	}
	if (!gt.tourUrl) {
		gt.tourUrl   = 'https://www.mediawiki.org/w/index.php?title=MediaWiki:Tours/';
	}
	//stuff to tack on to the end to get the raw file. Remember to the & or ? in the start
	// depends on the URL above.
	if (!gt.rawJs) {
		gt.rawJs = '&action=raw&ctype=text/javascript';
	}
	if (!gt.rawCss) {
		gt.rawCss = '&action=raw&ctype=text/css';
	}

	/**
	 * clean out path variables and the like in tour names
	 */
	gt.cleanTourName = function(tourName) {
		return mw.util.rawurlencode( tourName.replace(/^(?:\.\.\/)+/, '') );
	}

	// tour is either in get string or cookie (prefer get string)
	var tourName = mw.util.getParamValue( 'tour' );
	var tourId;
	//clean out path variables
	if (tourName) { tourName = gt.cleanTourName( tourName ); }
	if (tourName) {
		var step = mw.util.getParamValue( 'step' );
		if (!step) { step = '1'; }
		tourId = 'gt-'+tourName+'-'+step;
	} else {
		tourId = $.cookie('mw-tour');
		if (tourId) {
			var guiderid = tourId.substr(3); //strip off 'gt-'
			var pieces = guiderid.split(/-/);
			// should always happen, but let's be careful
			if ( pieces.length != 1 ) { 
				tourName = guiderid.substr(0, guiderid.length - pieces[pieces.length-1].length - 1);
				tourName = gt.cleanTourName( tourName );
				//var step = pieces[pieces.length-1];
			}
		}
	}

	// Don't bother loading any more code if there isn't a tour going on
	if ( !tourId || !tourName ) { return; }

	/**
	 * mw.guidedTour.launchTour(): Load a tour javascript and launch a tour
	 */
	gt.launchTour = function(tourName, tourId) {
		if ( !tourId ) {
			tourId = 'gt-'+tourName+'-1';
		}
		// prevent double loading of tour script
		if ( gt.installed[tourName] ) {
			guiders.currentTour = tourName;
			guiders.resume(tourId);
		} else {
			$.getScript(
				gt.tourUrl + tourName + '.js' + gt.rawJs,
				function() {
					guiders.resume(tourId);
				}
			);
		}
	}

	// First load guiders and then load the stuff that depends on it, then
	// 	launch the tour.
	mw.loader.implement(
		'jquery.guiders',
		[ gt.gadgetUrl+'guiders.js'+gt.rawJs ],
		{ 'all' : [ gt.gadgetUrl+'guiders.css'+gt.rawCss ] },
		{}
	);
	mw.loader.using( 'jquery.guiders', function() {
		mw.loader.implement(
			'mw.guidedTour.utils',
			[ gt.gadgetUrl+'utils.js'+gt.rawJs ],
			{ 'all' : [ gt.gadgetUrl+'custom.css'+gt.rawCss ] },
			{}
		);
		mw.loader.using( 'mw.guidedTour.utils', function() {
			gt.launchTour(tourName, tourId);
		});
	});
} ( window, document, jQuery, mw ) );
