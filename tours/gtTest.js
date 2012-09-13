jQuery(document).ready(function($) {

guiders.initGuider({
	id: "gt-test-1",
	title: 'Testing',
	description: 'Lorem ipsum dolor sit!',

	// attachment
	overlay: true,

	next: "gt-test-2",
	buttons: [
		{ name: 'Hide Tour', onclick: guiders.mwHideTour, classString: "plain" },
		{ name: 'Start Tour', onclick: guiders.next }
	]
});

guiders.initGuider({
	id: "gt-test-2",
	title: 'Launcher',
	description: 'You clicked here to launch this tour.',

	// attachment
	//overlay: true,
	attachTo: '#t-gtsample',
	position: '3',

	//next: "gi-test-2",
	buttons: [
		{ name: 'Hide Tour', onclick: guiders.mwHideTour, classString: "plain" },
		{ name: 'End Tour', onclick: guiders.endTour }
	]
});

});

