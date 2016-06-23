define(['readium_js_plugins', 'jquery', 'underscore'], function (Plugins, $, _) {

    Plugins.register("pageTransitions", function (api) {

        api.reader.on(ReadiumSDK.Events.CONTENT_DOCUMENT_LOADED, function ($iframe, spineItem) {
            var document = $iframe[0].contentDocument;
            $(document.documentElement).css('opacity', 0);

            api.reader.once(ReadiumSDK.Events.PAGINATION_CHANGED, function () {

                $(document.documentElement).css('opacity', 0);
                setTimeout(function(){
                    $(document.documentElement).css('transition', 'left 0.4s ease, opacity 0.5s ease');
                    $(document.documentElement).css('opacity', 1);
                }, 150);
            });
        });
    });
});
