define(['readium_js_plugins', 'jquery', 'underscore'], function(Plugins, $, _) {


    /*
        Usage example.

        Call this before loading a book:

        ReadiumSDK.reader.plugins.injectFonts.registerFontFace({
            fontFamily: 'OpenDyslexic3',
            fontWeight: 'normal',
            fontStyle: 'normal',
            sources: {
                'truetype': 'OpenDyslexic3-Regular.ttf'
            }
        });
    */

    function generateFontFaceCss(options) {
        var fontFamilyAlter = options.fontFamily.replace(/\s/g, "");
        var sources = [];
        _.each(options.sources, function(value, key) {
            sources.push(", url('" + value + "') format('" + key + "')");
        });

        return [
            "@font-face {\n",
            "\tfont-family: \"" + options.fontFamily + "\";\n",
            "\tsrc: local('" + options.fontFamily + "'), local('" + fontFamilyAlter + "')" + sources.join('') + ";\n",
            options.fontStretch ? ("\tfont-stretch: " + options.fontStretch + ";\n") : '',
            options.fontStyle ? ("\tfont-style: " + options.fontStyle + ";\n") : '',
            options.fontVariant ? ("\tfont-variant: " + options.fontVariant + ";\n") : '',
            options.fontWeight ? ("\tfont-weight: " + options.fontWeight + ";\n") : '',
            "}\n"
        ].join('');
    }

    function buildFontFaceDeclarations(fontFaceCollection) {
        var out = [];
        _.each(fontFaceCollection, function(fontFace) {
            out.push(generateFontFaceCss(fontFace));
        });
        return out.join('\n');
    }

    Plugins.register("injectFonts", function(api) {
        var that = this;
        var fontFaceCollection = [];

        this.registerFontFace = function(fontFace) {
            fontFaceCollection.push(fontFace);
        };

        api.reader.on(ReadiumSDK.Events.CONTENT_DOCUMENT_LOADED, function($iframe, spineItem) {
            var document = $iframe[0].contentDocument;
            var $head = $('head', document.documentElement);
            var styleEl = document.createElement('style');
            styleEl.id = 'rd-inject-fonts';
            styleEl.type = 'text/css';
            styleEl.textContent = buildFontFaceDeclarations(fontFaceCollection);
            $head.append(styleEl);
        });
    });

});
