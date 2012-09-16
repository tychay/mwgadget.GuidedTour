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
	description: 'This is a test of the description. You can include <b>HTML</b> like bold. Lorem ipsum dolor sit!',

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
	title: 'Test callouts',
	description: 'This is the community portal page.',

	// attachment
	//overlay: true,
	attachTo: '#n-portal a',
	position: '3',

	next: "gt-test-3",
	buttons: [
		{ name: 'Hide Tour', onclick: gt.hideTour, classString: "plain" },
		{ name: 'Next', onclick: guiders.next }
	]
});

/**
 * Test out mediawiki parsing
 */
guiders.initGuider({
	id: "gt-test-3",
	title: 'Test mediawiki parse',
	description: 'Your guider can contain wikitext using onShow. Use it to create an in-wiki link to the [[Guided tours]]. Or an external link [https://github.com/tychay/mwgadget.GuidedTour to github], for instance',

	// attachment
	//overlay: true,
	attachTo: '#searchInput',
	position: '6',
	onShow: gt.parseDescription,

	//next: "gt-test-2",
	buttons: [
		{ name: 'Hide Tour', onclick: gt.hideTour, classString: "plain" },
		{ name: 'End Tour', onclick: gt.endTour }
	]
});


} (window, document, jQuery, mw, guiders) );
