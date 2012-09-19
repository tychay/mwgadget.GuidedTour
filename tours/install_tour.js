/**
 * Guided Tour to show you how to install/develop a tour
 */
( function ( window, document, jQuery, mw, guiders ) {

var gt = mw.guidedTour = mw.guidedTour || {};

guiders.currentTour = 'install_tour';
gt.installed[guiders.currentTour] = true;

/**
 * Show overlay
 */
guiders.initGuider({
	id: "gt-install_tour-1",
	title: 'Using Guided Tours',
	description: 'This shows you how to use guided tours to customize a tour.',

	// attachment
	overlay: true,

	//next: "gt-test-2",
	buttons: [
		{ name: 'Hide Tour', onclick: gt.hideTour, classString: "plain" },
		{ name: 'End Tour', onclick: gt.endTour }
	]
});

} (window, document, jQuery, mw, guiders) );
