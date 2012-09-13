/**
 * Launcher for the Guided Tour using WordPress customized version of guiders.
 *
 * @author terry chay
 */
jQuery(document).ready(function($) {

	gt_get_query = function() {
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

	queryString = gt_get_query();
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
				link = mw.util.addPortletLink(
						'p-tb', '#', 'Launch Tour',
						't-gtsample', 'Open a sample guided tour ', 'm', '#t-print' );
/*
				$(link).click(function(event) {
					event.preventDefault();
					guiders.resume('gt-test-1');
				});
*/
			}
		);	
	}
});
