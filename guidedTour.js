 /**
  * Gadget for Guided Tour for MediaWiki
  *
  * Uses a WordPress.com customized version of Optimize.ly's Guiders.js file.
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

	gt.gadgetUrl = 'https://www.mediawiki.org/w/index.php?title=User:Tychay/guidedTour/';
	gt.tourUrl   = 'https://www.mediawiki.org/w/index.php?title=User:Tychay/tours/';
	//stuff to tack on to the end to get the raw file. Remember to the & or ? in the start
	// depends on the URL above.
	gt.rawJs = '&action=raw&ctype=text/javascript';
	gt.rawCss = '&action=raw&ctype=text/css';

	gt.getQuery = function() {
		var urlParams = {};
		(function () {
			var e,
				a = /\+/g,  // Regex for replacing addition symbol with a space
				r = /([^&=]+)=?([^&]*)/g,
				d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
				q = window.location.search.substring(1);

				while (e = r.exec(q))
					urlParams[d(e[1])] = d(e[2]);
		})();
		return urlParams;
	}

	// tour is either in get string or cookie (prefer get string)
	var queryString = gt.getQuery();
	var tourName = queryString.tour;
	var tourId;
	if (tourName) {
		tourName = tourName.replace(/^(?:\.\.\/)+/, ''); //clean out path variables
	}
	if (tourName) {
		var step = queryString.step;
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
				//step = pieces[pieces.length-1];
			}
		}
	}

	// Don't bother loading any more code if there isn't a tour going on
	if ( !tourId || !tourName ) { return; }
	// First load guiders and then load the stuff that depends on it, then launch
	// the tour.
	$("<link/>", {
	   rel: "stylesheet",
	   type: "text/css",
	   href: gt.gadgetUrl + 'guiders.css' + gt.rawCss,
	}).appendTo("head");
	$.getScript(
		gt.gadgetUrl + 'guiders.js' + gt.rawJs,
		function() {
			//$.getStylesheet( gt.gadgetUrl + 'guiders.css' + gt.rawCss ),
			$.getScript(
				gt.gadgetUrl + 'utils.js' + gt.rawJs,
				function() {
					$.getScript(
						gt.tourUrl + tourName + '.js' + gt.rawJs,
						function() {
							guiders.resume(tourId);
						});
				});
		}
	);
} ( window, document, jQuery, mw ) );
