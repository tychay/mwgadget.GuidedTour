/**
 * Guided Tour to test guided tour features.
 */
( function ( window, document, jQuery, mw, guiders ) {


var gt = mw.guidedTour = mw.guidedTour || {};

guiders.currentTour = 'test';

/**
 * Show overlay
 */
guiders.initGuider({
	id: "gt-test-1",
	title: 'Testing',
	description: 'Lorem ipsum dolor sit!',

	// attachment
	overlay: true,

	next: "gt-test-2",
	buttons: [
		{ name: 'Hide Tour', onclick: gt.hideTour, classString: "plain" },
		{ name: 'Start Tour', onclick: guiders.next }
	]
});

/**
 * Callout of left menu
 */
guiders.initGuider({
	id: "gt-test-2",
	title: 'Community portal',
	description: 'This is the community portal page.',

	// attachment
	//overlay: true,
	attachTo: '#n-portal a',
	position: '3',

	//next: "gi-test-2",
	buttons: [
		{ name: 'Hide Tour', onclick: gt.hideTour, classString: "plain" },
		{ name: 'End Tour', onclick: gt.endTour }
	]
});


} (window, document, jQuery, mw, guiders) );
