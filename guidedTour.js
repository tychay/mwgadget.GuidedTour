 /**
  * Gadget for Guided Tour for MediaWiki
  *
  * Uses a WordPress.com customized version of Optimize.ly's Guiders.js file.
  *
  * To use, add this, the guidedTour/* contents, and tours to mediawiki and edit the URL's
  * to point to the right path, then include as a user script (for now).
  *
  * @package    mwgadget.GuidedTour
  * @author     terry chay <tychay@mediawiki.org>
  * @version    $Id$
*/
( function ( window, document, jQuery, mw ) {
	'use strict';

	var gt = mw.guidedTour = mw.guidedTour || {};

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

	var queryString = gt.getQuery();
	//console.log(queryString);
	if ( queryString.tour ) {
		$.getScript(
			'https://www.mediawiki.org/w/index.php?title=User:Tychay/guidedTour/guiders.js&action=raw&type=text/javascript',
			function() {
				importScript('User:Tychay/guidedTour/utils.js');
				importStylesheet('User:Tychay/guidedTour/guiders.css');
				$.getScript(
					'https://www.mediawiki.org/w/index.php?title=User:Tychay/tours/'+queryString.tour+'.js&action=raw&type=text/javascript',
					function() {
						guiders.resume('gt-'+queryString.tour+'-1');
				});
			}
		);	
	}
} ( window, document, jQuery, mw ) );
