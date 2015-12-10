define(['readium_js_plugins', 'jquery', 'underscore', 'hammerjs2'], function (Plugins, $, _, Hammer) {
    var EDGE_TAP_AREA_WIDTH = 0.13; // as percent

    Plugins.register("pageSwipe", function (api) {

        function handleGestureEvent(edgeTapAreaWidth) {
            return function (e) {
                var document = e.target.ownerDocument;
                switch (e.type) {
                    case 'swipeleft':
                        api.reader.openPageRight();
                        break;

                    case 'swiperight':
                        api.reader.openPageLeft();
                        break;

                    case 'tap':
                        if (e.target.nodeName.toUpperCase() === 'A') {
                            return;
                        }

                        var tapX = e.pointers[0].clientX;
                        var screenWidth = document.documentElement.clientWidth;
                        var tapAreaWidth = screenWidth * edgeTapAreaWidth;

                        if (tapX < tapAreaWidth) {
                            api.reader.openPageLeft();
                        } else if (tapX > (screenWidth - tapAreaWidth)) {
                            api.reader.openPageRight();
                        }
                        break;
                }
            };
        }

        var outerHammer = new Hammer(document.documentElement);
        outerHammer.on('swipeleft swiperight tap', handleGestureEvent(0.4));

        api.reader.on(ReadiumSDK.Events.CONTENT_DOCUMENT_LOADED, function ($iframe, spineItem) {
            var document = $iframe[0].contentDocument;
            var innerHammer = new Hammer(document.documentElement);
            innerHammer.on('swipeleft swiperight tap', handleGestureEvent(EDGE_TAP_AREA_WIDTH));
        });
    });
});
