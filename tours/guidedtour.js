/**
 * Guided Tour to show you how to install/develop a tour
 */
( function ( window, document, jQuery, mw, guiders ) {

var gt = mw.guidedTour = mw.guidedTour || {};

guiders.currentTour = 'guidedtour';
gt.installed[guiders.currentTour] = true;

/**
 * Show overlay
 */
guiders.initGuider({
	id: "gt-guidedtour-1",
	title: 'Understanding the GuidedTours gadget',
	description: 'Guided_tours/tours/guidedtour/intro',

	// attachment
	overlay: true,
	onShow: gt.descriptionPage,

	//next: "gt-guidedtour-2",
	buttons: [
		//{ name: 'Hide Tour', onclick: gt.hideTour, classString: "plain" },
		{ name: 'End Tour', onclick: gt.endTour }
	]
});

} (window, document, jQuery, mw, guiders) );
