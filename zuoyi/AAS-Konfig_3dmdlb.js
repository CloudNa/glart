
'use strict';

window.addEventListener('load', function() {


function V3DPlayer(containerId, ctxSettings, preloader) {
    v3d.AppPuzzles.call(this, containerId, ctxSettings, preloader);
}

V3DPlayer.prototype = Object.assign(Object.create(v3d.AppPuzzles.prototype), {

    constructor: V3DPlayer,

    onLoadFinished: function(sceneLoaded, logicLoaded, editorLoaded) {
        if (sceneLoaded) {
            this.run();
            initFullScreen();
            runCode();
        }
    },

});

var app = (function() {

    var URL = '__URL__AAS-Konfig_3dmdlb.gltf.xz';
    var LOGIC = '__LOGIC__visual_logic.js';
    var PUZZLES_DIR = '../../puzzles/';

    var params = v3d.AppUtils.getPageParams();
    var url = URL.replace('__URL__', '') || params.load;
    if (!url) {
        console.log('No URL specified');
        return;
    }
    var logicURL = params.logic || '';
    if (!logicURL || !v3d.AppUtils.isXML(logicURL)) {
        logicURL = LOGIC.replace('__LOGIC__', '') || logicURL;
    }


    var app = new V3DPlayer('container', null, 
           new v3d.SimplePreloader({ container: 'container' }));

    prepareExternalInterface(app);

    if (v3d.AppUtils.isXML(logicURL)) {
        var logicJS = logicURL.match(/(.*)\.xml$/)[1] + '.js';
        app.loadSceneWithEditor(url, logicJS, PUZZLES_DIR);    
    } else if (v3d.AppUtils.isJS(logicURL)) {
        app.loadSceneWithLogic(url, logicURL);
    } else {
        app.loadScene(url);
    }

    return app;

})();



function prepareExternalInterface(app) {
    // register functions in the app.ExternalInterface to call them from Puzzles, e.g:
    // app.ExternalInterface.myJSFunction = function() {
    //     console.log('Hello, World!');
    // }

}

function runCode() {
    // add your code here, e.g. console.log('Hello, World!');

}

});
