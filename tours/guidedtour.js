/**
 * Guided Tour to show you how to install/develop a tour
 */
( function ( window, document, jQuery, mw, guiders ) {

var gt = mw.guidedTour = mw.guidedTour || {};

guiders.currentTour = 'guidedtour';
gt.installed[guiders.currentTour] = true;

guiders.initGuider({
	id: "gt-guidedtour-1",
	title: 'Understanding the GuidedTours gadget',
	description: 'Guided_tours/tours/guidedtour/intro',

	// attachment
	overlay: true,
	onShow: gt.descriptionPage,

	next: "gt-guidedtour-mypreferences",
	buttons: [
		{ name: 'Start Tour', onclick: guiders.next }
	]
});
guiders.initGuider({
	id: "gt-guidedtour-mypreferences",
	title: 'Go to Preferences',
	description: 'Guided_tours/tours/guidedtour/mypreferences',

	// attachment
	onShow: gt.descriptionPage,
	shouldSkip: gt.isPage('Special::Preferences'),
	attachTo: '#pt-preferences',
	position: 'bottomRight', //5'oclock

	//next: "gt-guidedtour-gadgetpane",
	next: "gt-guidedtour-starttour",
	buttons: [
		{ name: 'Go to gadget preferences', onclick: function() { window.location="/wiki/Special:Preferences#mw-prefsection-gadgets"; } },
		{ name: 'Next →', onclick: guiders.next }
	]
});
/*
guiders.initGuider({
	id: "gt-guidedtour-gadgetpane",
	title: 'Go to the Gadgets Pane',
	description: 'Guided_tours/tours/guidedtour/gadgetpane',

	// attachment
	overlay: true,
	//onShow: gt.descriptionPage,
	attachTo: '#mw-prefsection-gadgets',
	position: 'bottomRight', //5'oclock
	//preftab-gadgets

	next: "gt-guidedtour-4",
	buttons: [
		//{ name: 'Hide Tour', onclick: gt.hideTour, classString: "plain" },
		{ name: 'End Tour', onclick: gt.endTour }
	]
});
/* */
guiders.initGuider({
	id: "gt-guidedtour-starttour",
	title: 'Starting a tour',
	description: 'Guided_tours/tours/guidedtour/starttour',

	// attachment
	overlay: true,
	onShow: gt.descriptionPage,
	attachTo: '#mw-prefsection-gadgets',
	position: 'bottomRight', //5'oclock
	//preftab-gadgets

	prev: "gt-guidedtour-mypreferences",
	next: "gt-guidedtour-4",
	buttons: [
		//{ name: 'Hide Tour', onclick: gt.hideTour, classString: "plain" },
		{ name: 'End Tour', onclick: gt.endTour }
	]
});

} (window, document, jQuery, mw, guiders) );
