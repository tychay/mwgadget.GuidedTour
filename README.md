mwgadget.GuidedTour
===================

MediaWiki gadget that allows the creation of [Guided Tours](http://www.mediawiki.org/wiki/Guided_tours) using a variant of [Optimize.ly's Guiders](https://github.com/jeff-optimizely/Guiders-JS).

[Open tasks here](https://trello.com/board/mediawiki-guided-tours-gadget/).

To enable as a gadget:

1. Copy the files to the MediaWiki namespace
2. Edit the Gadget-guidedtour.js so the URLs point to the ones you want to use.
3. add the line `* GuidedTour[ResourceLoader]|guidedtour.js` to your Gadget-definition page.