'use strict';

(function() {

// global variables/constants used by puzzles' functions

var LIST_NONE = '<none>';

var _pGlob = {};

_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.pickedObject = '';
_pGlob.hoveredObject = '';
_pGlob.mediaElements = {};
_pGlob.loadedFile = '';
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.openedFile = '';
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();
_pGlob.intervalTimers = {};

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;
_pGlob.SET_OBJ_ROT_EPS = 1e-8;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.vec3Tmp3 = new v3d.Vector3();
_pGlob.vec3Tmp4 = new v3d.Vector3();
_pGlob.eulerTmp = new v3d.Euler();
_pGlob.eulerTmp2 = new v3d.Euler();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.colorTmp = new v3d.Color();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster();

var PL = v3d.PL = v3d.PL || {};

// a more readable alias for PL (stands for "Puzzle Logic")
v3d.puzzles = PL;

PL.procedures = PL.procedures || {};







PL.execInitPuzzles = function(options) {
    // always null, should not be available in "init" puzzles
    var appInstance = null;
    // app is more conventional than appInstance (used in exec script and app templates)
    var app = null;

    var _initGlob = {};
    _initGlob.percentage = 0;
    _initGlob.output = {
        initOptions: {
            fadeAnnotations: true,
            useBkgTransp: false,
            preserveDrawBuf: false,
            useCompAssets: false,
            useFullscreen: true,
            useCustomPreloader: false,
            preloaderStartCb: function() {},
            preloaderProgressCb: function() {},
            preloaderEndCb: function() {},
        }
    }

    // provide the container's id to puzzles that need access to the container
    _initGlob.container = options !== undefined && 'container' in options
            ? options.container : "";

    

    var PROC = {
    
};


// toFixedPoint puzzle
function toFixedPoint(num, prec) {
    prec = Math.pow(10, prec);
    return Math.round(num * prec)/prec;
}



// utility functions envoked by the HTML puzzles
function getElements(ids, isParent) {
    var elems = [];
    if (Array.isArray(ids) && ids[0] != 'CONTAINER' && ids[0] != 'WINDOW' &&
        ids[0] != 'DOCUMENT' && ids[0] != 'BODY' && ids[0] != 'QUERYSELECTOR') {
        for (var i = 0; i < ids.length; i++)
            elems.push(getElement(ids[i], isParent));
    } else {
        elems.push(getElement(ids, isParent));
    }
    return elems;
}

function getElement(id, isParent) {
    var elem;
    if (Array.isArray(id) && id[0] == 'CONTAINER') {
        if (appInstance !== null) {
            elem = appInstance.container;
        } else if (typeof _initGlob !== 'undefined') {
            // if we are on the initialization stage, we still can have access
            // to the container element
            var id = _initGlob.container;
            if (isParent) {
                elem = parent.document.getElementById(id);
            } else {
                elem = document.getElementById(id);
            }
        }
    } else if (Array.isArray(id) && id[0] == 'WINDOW') {
        if (isParent)
            elem = parent;
        else
            elem = window;
    } else if (Array.isArray(id) && id[0] == 'DOCUMENT') {
        if (isParent)
            elem = parent.document;
        else
            elem = document;
    } else if (Array.isArray(id) && id[0] == 'BODY') {
        if (isParent)
            elem = parent.document.body;
        else
            elem = document.body;
    } else if (Array.isArray(id) && id[0] == 'QUERYSELECTOR') {
        if (isParent)
            elem = parent.document.querySelector(id);
        else
            elem = document.querySelector(id);
    } else {
        if (isParent)
            elem = parent.document.getElementById(id);
        else
            elem = document.getElementById(id);
    }
    return elem;
}



// setHTMLElemAttribute puzzle
function setHTMLElemAttribute(attr, value, ids, isParent) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem) continue;

        if (attr === 'style') {
            // NOTE: setting an attribute 'style' instead of a property 'style'
            // fixes IE11 worng behavior
            elem.setAttribute(attr, value);
        } else {
            elem[attr] = value;
        }
    }
}




// initSettings puzzle
_initGlob.output.initOptions.fadeAnnotations = true;
_initGlob.output.initOptions.useBkgTransp = true;
_initGlob.output.initOptions.preserveDrawBuf = true;
_initGlob.output.initOptions.useCompAssets = false;
_initGlob.output.initOptions.useFullscreen = false;


// initPreloader puzzle
_initGlob.output.initOptions.useCustomPreloader = true;
_initGlob.output.initOptions.preloaderStartCb = function() {
    _initGlob.percentage = 0;
    (function() {})();
};
_initGlob.output.initOptions.preloaderProgressCb = function(percentage) {
    _initGlob.percentage = percentage;
    (function() {
  setHTMLElemAttribute('innerHTML', String(toFixedPoint(0 + Math.round(_initGlob.percentage) * 0.686, 1)) + '%', 'preloader-text', false);
})();
};
_initGlob.output.initOptions.preloaderEndCb = function() {
    _initGlob.percentage = 100;
    (function() {
  var VARS = Object.defineProperties({}, {
    
});

  Function('app', 'v3d', 'VARS', 'PROC', (('// Built-in variables: v3d, VARS, PROC' + '\n' +
  'var imgurl=\'assets/paint/78-[i].jpg\'' + '\n' +
  'for(var i=1;i<=10;i++){' + '\n' +
  '    $("#swiperBox .swiper-wrapper .imgurl:nth-child("+i+") img").attr("src",imgurl.replace("[i]",i));' + '\n' +
  '}')))(appInstance, v3d, VARS, PROC);

})();
};

    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {

// app is more conventional than appInstance (used in exec script and app templates)
var app = appInstance;

initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}

this.procedures["myProcedures"] = myProcedures;
this.procedures["响应雷达"] = _E5_93_8D_E5_BA_94_E9_9B_B7_E8_BE_BE;
this.procedures["自动游览"] = _E8_87_AA_E5_8A_A8_E6_B8_B8_E8_A7_88;
this.procedures["鸟瞰行走切换"] = _E9_B8_9F_E7_9E_B0_E8_A1_8C_E8_B5_B0_E5_88_87_E6_8D_A2;
this.procedures["音乐开关"] = _E9_9F_B3_E4_B9_90_E5_BC_80_E5_85_B3;
this.procedures["弹出列表弹窗"] = _E5_BC_B9_E5_87_BA_E5_88_97_E8_A1_A8_E5_BC_B9_E7_AA_97;
this.procedures["隐藏列表弹窗"] = _E9_9A_90_E8_97_8F_E5_88_97_E8_A1_A8_E5_BC_B9_E7_AA_97;
this.procedures["关闭油画弹窗"] = _E5_85_B3_E9_97_AD_E6_B2_B9_E7_94_BB_E5_BC_B9_E7_AA_97;
this.procedures["替换弹框内油画信息"] = _E6_9B_BF_E6_8D_A2_E5_BC_B9_E6_A1_86_E5_86_85_E6_B2_B9_E7_94_BB_E4_BF_A1_E6_81_AF;
this.procedures["点击列表内容"] = _E7_82_B9_E5_87_BB_E5_88_97_E8_A1_A8_E5_86_85_E5_AE_B9;
this.procedures["点击按钮①时填充油画列表"] = _E7_82_B9_E5_87_BB_E6_8C_89_E9_92_AE_E2_91_A0_E6_97_B6_E5_A1_AB_E5_85_85_E6_B2_B9_E7_94_BB_E5_88_97_E8_A1_A8;
this.procedures["点击列表内语音讲按钮解"] = _E7_82_B9_E5_87_BB_E5_88_97_E8_A1_A8_E5_86_85_E8_AF_AD_E9_9F_B3_E8_AE_B2_E6_8C_89_E9_92_AE_E8_A7_A3;
this.procedures["填充画说党史列表"] = _E5_A1_AB_E5_85_85_E7_94_BB_E8_AF_B4_E5_85_9A_E5_8F_B2_E5_88_97_E8_A1_A8;
this.procedures["填充系列精神"] = _E5_A1_AB_E5_85_85_E7_B3_BB_E5_88_97_E7_B2_BE_E7_A5_9E;
this.procedures["根据射线显示弹框"] = _E6_A0_B9_E6_8D_AE_E5_B0_84_E7_BA_BF_E6_98_BE_E7_A4_BA_E5_BC_B9_E6_A1_86;
this.procedures["百年故事"] = _E7_99_BE_E5_B9_B4_E6_95_85_E4_BA_8B;
this.procedures["讲解"] = _E8_AE_B2_E8_A7_A3;
this.procedures["showSwiper"] = showSwiper;
this.procedures["查看"] = _E6_9F_A5_E7_9C_8B;
this.procedures["显示navbar"] = _E6_98_BE_E7_A4_BAnavbar;
this.procedures["隐藏Navbar"] = _E9_9A_90_E8_97_8FNavbar;

var PROC = {
    "myProcedures": myProcedures,
    "响应雷达": _E5_93_8D_E5_BA_94_E9_9B_B7_E8_BE_BE,
    "自动游览": _E8_87_AA_E5_8A_A8_E6_B8_B8_E8_A7_88,
    "鸟瞰行走切换": _E9_B8_9F_E7_9E_B0_E8_A1_8C_E8_B5_B0_E5_88_87_E6_8D_A2,
    "音乐开关": _E9_9F_B3_E4_B9_90_E5_BC_80_E5_85_B3,
    "弹出列表弹窗": _E5_BC_B9_E5_87_BA_E5_88_97_E8_A1_A8_E5_BC_B9_E7_AA_97,
    "隐藏列表弹窗": _E9_9A_90_E8_97_8F_E5_88_97_E8_A1_A8_E5_BC_B9_E7_AA_97,
    "关闭油画弹窗": _E5_85_B3_E9_97_AD_E6_B2_B9_E7_94_BB_E5_BC_B9_E7_AA_97,
    "替换弹框内油画信息": _E6_9B_BF_E6_8D_A2_E5_BC_B9_E6_A1_86_E5_86_85_E6_B2_B9_E7_94_BB_E4_BF_A1_E6_81_AF,
    "点击列表内容": _E7_82_B9_E5_87_BB_E5_88_97_E8_A1_A8_E5_86_85_E5_AE_B9,
    "点击按钮①时填充油画列表": _E7_82_B9_E5_87_BB_E6_8C_89_E9_92_AE_E2_91_A0_E6_97_B6_E5_A1_AB_E5_85_85_E6_B2_B9_E7_94_BB_E5_88_97_E8_A1_A8,
    "点击列表内语音讲按钮解": _E7_82_B9_E5_87_BB_E5_88_97_E8_A1_A8_E5_86_85_E8_AF_AD_E9_9F_B3_E8_AE_B2_E6_8C_89_E9_92_AE_E8_A7_A3,
    "填充画说党史列表": _E5_A1_AB_E5_85_85_E7_94_BB_E8_AF_B4_E5_85_9A_E5_8F_B2_E5_88_97_E8_A1_A8,
    "填充系列精神": _E5_A1_AB_E5_85_85_E7_B3_BB_E5_88_97_E7_B2_BE_E7_A5_9E,
    "根据射线显示弹框": _E6_A0_B9_E6_8D_AE_E5_B0_84_E7_BA_BF_E6_98_BE_E7_A4_BA_E5_BC_B9_E6_A1_86,
    "百年故事": _E7_99_BE_E5_B9_B4_E6_95_85_E4_BA_8B,
    "讲解": _E8_AE_B2_E8_A7_A3,
    "showSwiper": showSwiper,
    "查看": _E6_9F_A5_E7_9C_8B,
    "显示navbar": _E6_98_BE_E7_A4_BAnavbar,
    "隐藏Navbar": _E9_9A_90_E8_97_8FNavbar,
};

var DeviceInformation, cip, cname, State_guide, Story_Sounds, State_sounds, State_lay, Dict_oilpaint, PaintList, ID_PaintList, Dict_jingshen, Intersect_object, Dict_story, State_music, j, m, i, retical_position, k, paint_object, ID_Story, Province, intersections;


// getUrlData puzzle
function getUrlData(kind, isParent) {

    var targetWindow = isParent ? window.parent : window;
    switch (kind) {
    case 'URL':
        return targetWindow.location.href;
    case 'PARAMS':
        return v3d.AppUtils.getPageParams(targetWindow);
    case 'HOSTNAME':
        return targetWindow.location.hostname;
    default:
        console.error('getUrlData: option does not exists.');
        return '';
    }

}



// featureAvailable puzzle
function featureAvailable(feature) {

    var userAgent = window.navigator.userAgent;
    var platform = window.navigator.platform;

    switch (feature) {
    case 'LINUX':
        return /Linux/.test(platform);
    case 'WINDOWS':
        return ['Win32', 'Win64', 'Windows', 'WinCE'].indexOf(platform) !== -1;
    case 'MACOS':
        return (['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'].indexOf(platform) !== -1 && !v3d.Detector.checkIOS());
    case 'IOS':
        return v3d.Detector.checkIOS();
    case 'ANDROID':
        return /Android/i.test(userAgent);
    case 'MOBILE':
        return (/Android|webOS|BlackBerry/i.test(userAgent) || v3d.Detector.checkIOS());

    case 'CHROME':
        // Chromium based
        return (!!window.chrome && !/Edge/.test(navigator.userAgent));
    case 'FIREFOX':
        return /Firefox/.test(navigator.userAgent);
    case 'IE':
        return /Trident/.test(navigator.userAgent);
    case 'EDGE':
        return /Edge/.test(navigator.userAgent);
    case 'SAFARI':
        return (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent));

    case 'TOUCH':
        return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
    case 'RETINA':
        return window.devicePixelRatio >= 2;
    case 'HDR':
        return appInstance.useHDR;
    case 'WEBAUDIO':
        return v3d.Detector.checkWebAudio();
    case 'WEBGL2':
        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl2')
        return !!gl;
    case 'WOOCOMMERCE':
        var woo_fun = window.parent.v3d_woo_get_product_info || window.parent.parent.v3d_woo_get_product_info;
        return !!woo_fun;
    case 'DO_NOT_TRACK':
        if (navigator.doNotTrack == '1' || window.doNotTrack == '1')
            return true;
        else
            return false;
    default:
        return false;
    }

}



// dictGet puzzle
function dictGet(dict, key) {
    if (dict && typeof dict == 'object')
        return dict[key];
}



// convertToNumber puzzle
function toNumber(text) {
    var num = Number(text);
    if (isNaN(num))
        num = 0;
    return num;
}



function setScreenScale(factor) {
    appInstance.renderer.setPixelRatio(factor);
    // to update possible post-processing passes
    appInstance.onResize();
}



/**
 * Get a scene that contains the root of the given action.
 */
function getSceneByAction(action) {
    var root = action.getRoot();
    var scene = root.type == "Scene" ? root : null;
    root.traverseAncestors(function(ancObj) {
        if (ancObj.type == "Scene") {
            scene = ancObj;
        }
    });
    return scene;
}



/**
 * Get the current scene's framerate.
 */
function getSceneAnimFrameRate(scene) {
    if (scene && "v3d" in scene.userData && "animFrameRate" in scene.userData.v3d) {
        return scene.userData.v3d.animFrameRate;
    }
    return 24;
}



_pGlob.animMixerCallbacks = [];

var initAnimationMixer = function() {

    function onMixerFinished(e) {
        var cb = _pGlob.animMixerCallbacks;
        var found = [];
        for (var i = 0; i < cb.length; i++) {
            if (cb[i][0] == e.action) {
                cb[i][0] = null; // desactivate
                found.push(cb[i][1]);
            }
        }
        for (var i = 0; i < found.length; i++) {
            found[i]();
        }
    }

    return function initAnimationMixer() {
        if (appInstance.mixer && !appInstance.mixer.hasEventListener('finished', onMixerFinished))
            appInstance.mixer.addEventListener('finished', onMixerFinished);
    };

}();



// animation puzzles
function operateAnimation(operation, animations, from, to, loop, speed, callback, isPlayAnimCompat, rev) {
    if (!animations)
        return;
    // input can be either single obj or array of objects
    if (typeof animations == "string")
        animations = [animations];

    function processAnimation(animName) {
        var action = v3d.SceneUtils.getAnimationActionByName(appInstance, animName);
        if (!action)
            return;
        switch (operation) {
        case 'PLAY':
            if (!action.isRunning()) {
                action.reset();
                if (loop && (loop != "AUTO"))
                    action.loop = v3d[loop];
                var scene = getSceneByAction(action);
                var frameRate = getSceneAnimFrameRate(scene);

                // compatibility reasons: deprecated playAnimation puzzles don't
                // change repetitions
                if (!isPlayAnimCompat) {
                    action.repetitions = Infinity;
                }

                var timeScale = Math.abs(parseFloat(speed));
                if (rev)
                    timeScale *= -1;

                action.timeScale = timeScale;
                action.timeStart = from !== null ? from/frameRate : 0;
                if (to !== null) {
                    action.getClip().duration = to/frameRate;
                } else {
                    action.getClip().resetDuration();
                }
                action.time = timeScale >= 0 ? action.timeStart : action.getClip().duration;

                action.paused = false;
                action.play();

                // push unique callbacks only
                var callbacks = _pGlob.animMixerCallbacks;
                var found = false;

                for (var j = 0; j < callbacks.length; j++)
                    if (callbacks[j][0] == action && callbacks[j][1] == callback)
                        found = true;

                if (!found)
                    _pGlob.animMixerCallbacks.push([action, callback]);
            }
            break;
        case 'STOP':
            action.stop();

            // remove callbacks
            var callbacks = _pGlob.animMixerCallbacks;
            for (var j = 0; j < callbacks.length; j++)
                if (callbacks[j][0] == action) {
                    callbacks.splice(j, 1);
                    j--
                }

            break;
        case 'PAUSE':
            action.paused = true;
            break;
        case 'RESUME':
            action.paused = false;
            break;
        case 'SET_FRAME':
            var scene = getSceneByAction(action);
            var frameRate = getSceneAnimFrameRate(scene);
            action.time = from ? from/frameRate : 0;
            action.play();
            action.paused = true;
            break;
        }
    }

    for (var i = 0; i < animations.length; i++) {
        var animName = animations[i];
        if (animName)
            processAnimation(animName);
    }

    initAnimationMixer();
}



// utility functions envoked by the HTML puzzles
function getElements(ids, isParent) {
    var elems = [];
    if (Array.isArray(ids) && ids[0] != 'CONTAINER' && ids[0] != 'WINDOW' &&
        ids[0] != 'DOCUMENT' && ids[0] != 'BODY' && ids[0] != 'QUERYSELECTOR') {
        for (var i = 0; i < ids.length; i++)
            elems.push(getElement(ids[i], isParent));
    } else {
        elems.push(getElement(ids, isParent));
    }
    return elems;
}

function getElement(id, isParent) {
    var elem;
    if (Array.isArray(id) && id[0] == 'CONTAINER') {
        if (appInstance !== null) {
            elem = appInstance.container;
        } else if (typeof _initGlob !== 'undefined') {
            // if we are on the initialization stage, we still can have access
            // to the container element
            var id = _initGlob.container;
            if (isParent) {
                elem = parent.document.getElementById(id);
            } else {
                elem = document.getElementById(id);
            }
        }
    } else if (Array.isArray(id) && id[0] == 'WINDOW') {
        if (isParent)
            elem = parent;
        else
            elem = window;
    } else if (Array.isArray(id) && id[0] == 'DOCUMENT') {
        if (isParent)
            elem = parent.document;
        else
            elem = document;
    } else if (Array.isArray(id) && id[0] == 'BODY') {
        if (isParent)
            elem = parent.document.body;
        else
            elem = document.body;
    } else if (Array.isArray(id) && id[0] == 'QUERYSELECTOR') {
        if (isParent)
            elem = parent.document.querySelector(id);
        else
            elem = document.querySelector(id);
    } else {
        if (isParent)
            elem = parent.document.getElementById(id);
        else
            elem = document.getElementById(id);
    }
    return elem;
}



// setHTMLElemStyle puzzle
function setHTMLElemStyle(prop, value, ids, isParent) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem || !elem.style)
            continue;
        elem.style[prop] = value;
    }
}



// setTimeout puzzle
function registerSetTimeout(timeout, callback) {
    window.setTimeout(callback, 1000 * timeout);
}




// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return obj.type !== 'AmbientLight' &&
           obj.name !== '' &&
           !(obj.isMesh && obj.isMaterialGeneratedMesh) &&
           !obj.isAuxClippingMesh;
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = _pGlob !== undefined;
    objFound = runTime ? _pGlob.objCache[objName] : null;

    if (objFound && objFound.name === objName)
        return objFound;

    appInstance.scene.traverse(function(obj) {
        if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
            objFound = obj;
            if (runTime) {
                _pGlob.objCache[objName] = objFound;
            }
        }
    });
    return objFound;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames() {
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects which belong to the group
function getObjectNamesByGroupName(targetGroupName) {
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc.filter(function(name) {
        return name;
    });
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}




/**
 * Obtain a unique name from the given one. Names are tested with the given
 * callback function that should return a boolean "unique" flag. If the given
 * "name" is not considered unique, then "name2" is tested for uniqueness, then
 * "name3" and so on...
 */
function acquireUniqueName(name, isUniqueCb) {
    var uniqueName = name;

    if (isUniqueCb !== undefined) {
        while (!isUniqueCb(uniqueName)) {
            var r = uniqueName.match(/^(.*?)(\d+)$/);
            if (!r) {
                uniqueName += "2";
            } else {
                uniqueName = r[1] + (parseInt(r[2], 10) + 1);
            }
        }
    }

    return uniqueName;
}



/**
 * Check if the given material name is already used by materials on the scene.
 */
function matNameUsed(name) {
    return v3d.SceneUtils.getMaterialByName(appInstance, name) !== null;
}



// assignMaterial puzzle
function assignMat(objSelector, matName) {
    var objNames = retrieveObjectNames(objSelector);
    if (!matName)
        return;
    var mat = v3d.SceneUtils.getMaterialByName(appInstance, matName);
    if (!mat)
        return;
    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        if (!objName)
            continue;
        var obj = getObjectByName(objName);
        if (obj) {
            var firstSubmesh = obj.resolveMultiMaterial()[0];

            var hasSkinning = firstSubmesh.isSkinnedMesh;
            var influences = firstSubmesh.morphTargetInfluences;
            var hasMorphing = influences !== undefined && influences.length > 0;

            if (hasSkinning || hasMorphing) {
                var newMat = mat.clone();
                newMat.name = acquireUniqueName(mat.name, function(name) {
                    return !matNameUsed(name);
                });

                if (hasSkinning) {
                    newMat.skinning = true;
                }

                if (hasMorphing) {
                    newMat.morphTargets = true;
                    if (firstSubmesh.geometry.morphAttributes.normal !== undefined) {
                        newMat.morphNormals = true;
                    }
                }

                firstSubmesh.material = newMat;
            } else {
                firstSubmesh.material = mat;
            }
        }
    }
}




/**
 * Retrieve coordinate system from the loaded scene
 */
function getCoordSystem() {
    var scene = appInstance.scene;

    if (scene && "v3d" in scene.userData && "coordSystem" in scene.userData.v3d) {
        return scene.userData.v3d.coordSystem;
    } else {
        // COMPAT: <2.17, consider replacing to 'Y_UP_RIGHT' for scenes with unknown origin
        return 'Z_UP_RIGHT';
    }
}


/**
 * Transform coordinates from one space to another
 * Can be used with Vector3 or Euler.
 */
function coordsTransform(coords, from, to, noSignChange) {

    if (from == to)
        return coords;

    var y = coords.y, z = coords.z;

    if (from == 'Z_UP_RIGHT' && to == 'Y_UP_RIGHT') {
        coords.y = z;
        coords.z = noSignChange ? y : -y;
    } else if (from == 'Y_UP_RIGHT' && to == 'Z_UP_RIGHT') {
        coords.y = noSignChange ? z : -z;
        coords.z = y;
    } else {
        console.error('coordsTransform: Unsupported coordinate space');
    }

    return coords;
}


/**
 * Verge3D euler rotation to Blender/Max shortest.
 * 1) Convert from intrinsic rotation (v3d) to extrinsic XYZ (Blender/Max default
 *    order) via reversion: XYZ -> ZYX
 * 2) swizzle ZYX->YZX
 * 3) choose the shortest rotation to resemble Blender's behavior
 */
var eulerV3DToBlenderShortest = function() {

    var eulerTmp = new v3d.Euler();
    var eulerTmp2 = new v3d.Euler();
    var vec3Tmp = new v3d.Vector3();

    return function(euler, dest) {

        var eulerBlender = eulerTmp.copy(euler).reorder('YZX');
        var eulerBlenderAlt = eulerTmp2.copy(eulerBlender).makeAlternative();

        var len = eulerBlender.toVector3(vec3Tmp).lengthSq();
        var lenAlt = eulerBlenderAlt.toVector3(vec3Tmp).lengthSq();

        dest.copy(len < lenAlt ? eulerBlender : eulerBlenderAlt);
        return coordsTransform(dest, 'Y_UP_RIGHT', 'Z_UP_RIGHT');
    }

}();




// tweenCamera puzzle
function tweenCamera(posOrObj, targetOrObj, duration, doSlot, movementType) {
    var camera = appInstance.getCamera();

    if (Array.isArray(posOrObj)) {
        var worldPos = _pGlob.vec3Tmp.fromArray(posOrObj);
        worldPos = coordsTransform(worldPos, getCoordSystem(), 'Y_UP_RIGHT');
    } else if (posOrObj) {
        var posObj = getObjectByName(posOrObj);
        if (!posObj) return;
        var worldPos = posObj.getWorldPosition(_pGlob.vec3Tmp);
    } else {
        // empty input means: don't change the position
        var worldPos = camera.getWorldPosition(_pGlob.vec3Tmp);
    }

    if (Array.isArray(targetOrObj)) {
        var worldTarget = _pGlob.vec3Tmp2.fromArray(targetOrObj);
        worldTarget = coordsTransform(worldTarget, getCoordSystem(), 'Y_UP_RIGHT');
    } else {
        var targObj = getObjectByName(targetOrObj);
        if (!targObj) return;
        var worldTarget = targObj.getWorldPosition(_pGlob.vec3Tmp2);
    }

    duration = Math.max(0, duration);

    if (appInstance.controls && appInstance.controls.tween) {
        // orbit and flying cameras
        if (!appInstance.controls.inTween) {
            appInstance.controls.tween(worldPos, worldTarget, duration, doSlot,
                    movementType);
        }
    } else {
        // TODO: static camera, just position it for now
        if (camera.parent) {
            camera.parent.worldToLocal(worldPos);
        }
        camera.position.copy(worldPos);
        camera.lookAt(worldTarget);
        doSlot();
    }
}



// toFixedPoint puzzle
function toFixedPoint(num, prec) {
    prec = Math.pow(10, prec);
    return Math.round(num * prec)/prec;
}



// setHTMLElemAttribute puzzle
function setHTMLElemAttribute(attr, value, ids, isParent) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem) continue;

        if (attr === 'style') {
            // NOTE: setting an attribute 'style' instead of a property 'style'
            // fixes IE11 worng behavior
            elem.setAttribute(attr, value);
        } else {
            elem[attr] = value;
        }
    }
}



// appendScene puzzle
function appendScene(url, sceneName, loadCameras, loadLights, loadCb, progCb, errorCb) {
    _pGlob.percentage = 0;

    appInstance.appendScene(url, function(loadedScene) {
        loadedScene.name = sceneName;
        _pGlob.percentage = 100;
        loadCb();
    }, function(percentage) {
        _pGlob.percentage = percentage;
        progCb();
    }, errorCb, loadCameras, loadLights);
}



// dictSet puzzle
function dictSet(dict, key, value) {
    if (dict && typeof dict == 'object')
        dict[key] = value;
}



// getGPU puzzle
function getGPU(feature) {

    switch (feature) {
    case 'VENDOR':
        return v3d.Detector.getGPUVendor(appInstance.renderer);
    case 'MODEL':
        return v3d.Detector.getGPUModel(appInstance.renderer);
    }
}



function getDateTime(type, isGMT) {

    var date = new Date();

    function doubleDigits(num) {
        return (num <= 9 ? "0" + num : "" + num);
    }

    switch (type) {
        case 'FULL':
            return isGMT ? date.toUTCString() : date.toString();
        case 'TIME':
            if (isGMT)
                return doubleDigits(date.getUTCHours()) + ':' +
                       doubleDigits(date.getUTCMinutes()) + ':' +
                       doubleDigits(date.getUTCSeconds());
            else
                return doubleDigits(date.getHours()) + ':' +
                       doubleDigits(date.getMinutes()) + ':' +
                       doubleDigits(date.getSeconds());
        case 'YEAR':
            return isGMT ? date.getUTCFullYear() : date.getFullYear();
        case 'MONTH':
            return isGMT ? date.getUTCMonth()+1 : date.getMonth()+1;
        case 'DAY':
            return isGMT ? date.getUTCDate() : date.getDate();
        case 'WEEK_DAY':
            return isGMT ? date.getUTCDay()+1 : date.getDay()+1;
        case 'HOURS':
            return isGMT ? date.getUTCHours() : date.getHours();
        case 'MINUTES':
            return isGMT ? date.getUTCMinutes() : date.getMinutes();
        case 'SECONDS':
            return isGMT ? date.getUTCSeconds() : date.getSeconds();
        case 'MILLISECONDS':
            return isGMT ? date.getUTCMilliseconds() : date.getMilliseconds();
        case 'TIMEZONE':
            return isGMT ? 0 : -date.getTimezoneOffset()/60;
    }
}



// getHTMLElemAttribute puzzle
function getHTMLElemAttribute(attr, id, isParent) {
    var elem = getElement(id, isParent);
    return elem ? elem[attr]: '';
}



// callJSFunction puzzle
function getJSFunction(funcName) {
    var jsFunc = appInstance.ExternalInterface[funcName];
    if (typeof jsFunc == "function")
        return jsFunc;
    else
        return function() {};
}


// Describe this function...
function myProcedures(cip, cname) {
  registerSetTimeout(0.5, function() {
    dictSet(DeviceInformation, 'cip', cip);
    dictSet(DeviceInformation, 'cname', cname);
  });
}


// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function initObjectPicking(callback, eventType, mouseDownUseTouchStart, mouseButtons) {

    var elem = appInstance.renderer.domElement;
    elem.addEventListener(eventType, pickListener);
    if (v3d.PL.editorEventListeners)
        v3d.PL.editorEventListeners.push([elem, eventType, pickListener]);

    if (eventType == 'mousedown') {

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, pickListener);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, touchEventName, pickListener]);

    } else if (eventType == 'dblclick') {

        var prevTapTime = 0;

        function doubleTapCallback(event) {

            var now = new Date().getTime();
            var timesince = now - prevTapTime;

            if (timesince < 600 && timesince > 0) {

                pickListener(event);
                prevTapTime = 0;
                return;

            }

            prevTapTime = new Date().getTime();
        }

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, doubleTapCallback);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, touchEventName, doubleTapCallback]);
    }

    var raycaster = new v3d.Raycaster();

    function pickListener(event) {

        // to handle unload in loadScene puzzle
        if (!appInstance.getCamera())
            return;

        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            if (mouseButtons && mouseButtons.indexOf(event.button) == -1)
                return;
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
        raycaster.setFromCamera(_pGlob.screenCoords, appInstance.getCamera(true));
        var objList = [];
        appInstance.scene.traverse(function(obj){objList.push(obj);});
        var intersects = raycaster.intersectObjects(objList);
        callback(intersects, event);
    }
}

function objectsIncludeObj(objNames, testedObjName) {
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// utility function used by the whenClicked, whenHovered, whenDraggedOver, and raycast puzzles
function getPickedObjectName(obj) {
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}



/**
 * Find physics body associated with the given object and remove it.
 */
function _pFindRemovePhysicsBody(obj) {

    for (var i = 0; i < _pGlob.syncList.length; i++) {
        var syncData = _pGlob.syncList[i];

        if (syncData.obj == obj) {

            if (syncData.type == 'SOFT_BODY')
                _pGlob.world.removeSoftBody(syncData.body);
            else
                _pGlob.world.removeRigidBody(syncData.body);

            Ammo.destroy(syncData.body);
            _pGlob.syncList.splice(i, 1);
            i--;
        }
    }
}

/**
 * Find physics constraint associated with the given objects and remove it.
 */
function _pFindRemovePhysicsConstraint(obj1, obj2) {

    for (var i = 0; i < _pGlob.consList.length; i++) {

        var consData = _pGlob.consList[i];

        if (consData.obj1 == obj1 && consData.obj2 == obj2) {

            _pGlob.world.removeConstraint(consData.cons);
            Ammo.destroy(consData.cons);
            _pGlob.consList.splice(i, 1);
            i--;

        }

    }

}

/**
 * Cleanup forces and velocities
 */
function _pResetBody(body) {
    body.clearForces();

    var zeroVec = new Ammo.btVector3(0, 0, 0);

    body.setLinearVelocity(zeroVec);
    body.setAngularVelocity(zeroVec);
}

function _pSetObjToBodyTransform (obj, body) {
    var pos = obj.getWorldPosition(_pGlob.vec3Tmp);
    var quat = obj.getWorldQuaternion(_pGlob.quatTmp);

    _pGlob.transTmp.setIdentity();
    _pGlob.transTmp.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    _pGlob.transTmp.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

    body.setWorldTransform(_pGlob.transTmp);
    body.getMotionState().setWorldTransform(_pGlob.transTmp);
}



// createPhysicsBody puzzle
function createPhysicsBody(type, objSelector, shape, mass) {

    if (!window.Ammo || !_pGlob.world)
        return;

    var objNames = retrieveObjectNames(objSelector);

    objNames.forEach(function(objName) {
        if (!objName)
            return;

        var obj = getObjectByName(objName);
        if (!obj)
            return;

        _pFindRemovePhysicsBody(obj);

        switch (shape) {
        case 'BOX':
        case 'CAPSULE':
        case 'CONE':
        case 'CYLINDER':

            var box = new v3d.Box3();

            obj.resolveMultiMaterial().forEach(function(objR) {
                if (objR.geometry) {
                    if (objR.geometry.boundingBox == null)
                        objR.geometry.computeBoundingBox();

                    box.union(objR.geometry.boundingBox);
                }
            });

            var size = box.getSize(new v3d.Vector3());

            // do not allow empty-sized shapes
            size.x = size.x || 0.5;
            size.y = size.y || 0.5;
            size.z = size.z || 0.5;

            if (shape == 'BOX') {
                var geometry = new Ammo.btBoxShape(new Ammo.btVector3(
                        size.x * 0.5, size.y * 0.5, size.z * 0.5));
            } else if (shape == 'CAPSULE') {
                var radius = Math.max(size.x, size.z) * 0.5;
                var height = size.y - 2 * radius;
                var geometry = new Ammo.btCapsuleShape(radius, height);
            } else if (shape == 'CONE') {
                var radius = Math.max(size.x, size.z) * 0.5;
                var height = size.y;
                var geometry = new Ammo.btConeShape(radius, height);
            } else {
                var geometry = new Ammo.btCylinderShape(new Ammo.btVector3(
                        size.x * 0.5, size.y * 0.5, size.z * 0.5));
            }

            break;
        case 'SPHERE':

            var sphere = new v3d.Sphere();

            obj.resolveMultiMaterial().forEach(function(objR) {

                if (objR.geometry) {
                    if (objR.geometry.boundingSphere === null)
                        objR.geometry.computeBoundingSphere();

                    sphere.union(objR.geometry.boundingSphere);
                }
            });

            var geometry = new Ammo.btSphereShape(sphere.radius || 0.5);

            break;
        case 'MESH':

            var objsR = obj.resolveMultiMaterial();

            if (!objsR[0].geometry || !objsR[0].isMesh) {
                console.error('create rigid body: incorrect mesh object');
                var geometry = new Ammo.btEmptyShape();
                break;
            }

            // allow complex triangle shapes for KINEMATIC objects
            if (type == 'DYNAMIC' || type == 'GHOST') {

                var geometry = new Ammo.btConvexHullShape();

                objsR.forEach(function(objR) {
                    var positions = objR.geometry.attributes.position.array;

                    for (var i = 0; i < positions.length; i+=3) {
                        var x = positions[i];
                        var y = positions[i+1];
                        var z = positions[i+2];

                        var v = new Ammo.btVector3(x, y, z);

                        geometry.addPoint(v);

                        Ammo.destroy(v);
                    }
                });

            } else {

                var triIdxVertArray = new Ammo.btTriangleMesh();

                objsR.forEach(function(objR) {
                    var positions = objR.geometry.attributes.position.array;
                    var indices = objR.geometry.index.array;

                    for (var i = 0; i < indices.length; i+=3) {

                        var i1 = indices[i];
                        var i2 = indices[i+1];
                        var i3 = indices[i+2];

                        var v1 = new Ammo.btVector3(positions[3*i1], positions[3*i1+1], positions[3*i1+2]);
                        var v2 = new Ammo.btVector3(positions[3*i2], positions[3*i2+1], positions[3*i2+2]);
                        var v3 = new Ammo.btVector3(positions[3*i3], positions[3*i3+1], positions[3*i3+2]);

                        triIdxVertArray.addTriangle(v1, v2, v3, false);

                        Ammo.destroy(v1);
                        Ammo.destroy(v2);
                        Ammo.destroy(v3);
                    }
                });

                var geometry = new Ammo.btBvhTriangleMeshShape(triIdxVertArray, true);

            }

            break;
        case 'EMPTY':
            var geometry = new Ammo.btEmptyShape();
            break;
        }

        var pos = obj.getWorldPosition(_pGlob.vec3Tmp);
        var quat = obj.getWorldQuaternion(_pGlob.quatTmp);

        var transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        var motionState = new Ammo.btDefaultMotionState(transform);

        if (type == 'STATIC' || type == 'KINEMATIC' || type == 'GHOST')
            var bodyMass = 0;
        else
            var bodyMass = mass;

        var localInertia = new Ammo.btVector3(0, 0, 0);
        geometry.calculateLocalInertia(bodyMass, localInertia);

        var rbInfo = new Ammo.btRigidBodyConstructionInfo(bodyMass, motionState, geometry, localInertia);
        var body = new Ammo.btRigidBody(rbInfo);

        // CF_STATIC_OBJECT is set automatically

        if (type == 'KINEMATIC' || type == 'GHOST') {
            body.setCollisionFlags(body.getCollisionFlags() | CF_KINEMATIC_OBJECT);
            body.setActivationState(DISABLE_DEACTIVATION);
        }

        if (type == 'GHOST') {

            body.setCollisionFlags(body.getCollisionFlags() | CF_NO_CONTACT_RESPONSE);
            _pGlob.world.addRigidBody(body, SensorTrigger, AllFilter);

        } else {

            _pGlob.world.addRigidBody(body);

        }


        //body.setDamping(0.1, 0.1);

        _pGlob.syncList.push({
            obj: obj,
            body: body,
            type: type,
            simulated: true,
            mass: mass
        });

        // external physics interface
        if (v3d.PL) {
            v3d.PL.physics.bodies[objName] = body;
        }
    });


}



// eventHTMLElem puzzle
function eventHTMLElem(eventType, ids, isParent, callback) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem)
            continue;
        elem.addEventListener(eventType, callback);
        if (v3d.PL.editorEventListeners)
            v3d.PL.editorEventListeners.push([elem, eventType, callback]);
    }
}



// whenClicked puzzle
function registerOnClick(objSelector, xRay, doubleClick, mouseButtons, cbDo, cbIfMissedDo) {

    // for AR/VR
    _pGlob.objClickInfo = _pGlob.objClickInfo || [];

    _pGlob.objClickInfo.push({
        objSelector: objSelector,
        callbacks: [cbDo, cbIfMissedDo]
    });

    initObjectPicking(function(intersects, event) {

        var isPicked = false;

        var maxIntersects = xRay ? intersects.length : Math.min(1, intersects.length);

        for (var i = 0; i < maxIntersects; i++) {
            var obj = intersects[i].object;
            var objName = getPickedObjectName(obj);
            var objNames = retrieveObjectNames(objSelector);

            if (objectsIncludeObj(objNames, objName)) {
                // save the object for the pickedObject block
                _pGlob.pickedObject = objName;
                isPicked = true;
                cbDo(event);
            }
        }

        if (!isPicked) {
            _pGlob.pickedObject = '';
            cbIfMissedDo(event);
        }

    }, doubleClick ? 'dblclick' : 'mousedown', false, mouseButtons);
}



// getActiveCamera puzzle
function getActiveCamera() {
    var camera = appInstance.getCamera();
    return camera.name;
}




function initGetCameraDirection() {
    var coordsCallback = function(event) {
        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
    }

    var elem = appInstance.container;
    elem.addEventListener('mousemove', coordsCallback);
    elem.addEventListener('mousedown', coordsCallback);
    elem.addEventListener('mouseup', coordsCallback);
    elem.addEventListener('touchstart', coordsCallback);
    elem.addEventListener('touchend', coordsCallback);

    if (v3d.PL.editorEventListeners) {
        v3d.PL.editorEventListeners.push([elem, 'mousemove', coordsCallback]);
        v3d.PL.editorEventListeners.push([elem, 'mousedown', coordsCallback]);
        v3d.PL.editorEventListeners.push([elem, 'mouseup', coordsCallback]);
        v3d.PL.editorEventListeners.push([elem, 'touchstart', coordsCallback]);
        v3d.PL.editorEventListeners.push([elem, 'touchend', coordsCallback]);
    }

};

initGetCameraDirection();




// getCameraDirection puzzle
var getCameraDirection = function() {

    var coords = new v3d.Vector2();
    var vec = new v3d.Vector3();

    return function getCameraDirection(useMouseTouch, inverted) {
        var camera = appInstance.getCamera(true);

        if (useMouseTouch) {

            if (inverted) {
                coords.x = -_pGlob.screenCoords.x;
                coords.y = -_pGlob.screenCoords.y;
            } else {
                coords.x = _pGlob.screenCoords.x;
                coords.y = _pGlob.screenCoords.y;
            }

            _pGlob.raycasterTmp.setFromCamera(coords, camera);
            var dir = _pGlob.raycasterTmp.ray.direction;

        } else {
            var dir = camera.getWorldDirection(vec);
        }

        return coordsTransform(dir, 'Y_UP_RIGHT', getCoordSystem()).toArray();
    }
}();



// raycast puzzle
function raycast(fromPosObj, dir, intersectObjsSelector) {

    if (!fromPosObj || !dir) {
        console.error('raycast: missing input');
        return [];
    }

    if (Array.isArray(fromPosObj)) {
        var from = _pGlob.vec3Tmp.fromArray(fromPosObj);
        from = coordsTransform(from, getCoordSystem(), 'Y_UP_RIGHT');
    } else {
        var posObj = getObjectByName(fromPosObj);
        if (!posObj) {
            console.error('raycast: raycast object not found');
            return []
        }
        var from = posObj.getWorldPosition(_pGlob.vec3Tmp);
    }

    dir = _pGlob.vec3Tmp2.fromArray(dir);
    dir = coordsTransform(dir, getCoordSystem(), 'Y_UP_RIGHT');

    if (intersectObjsSelector === '' || intersectObjsSelector === LIST_NONE) {

        var objs = [appInstance.scene];

    } else {

        var objs = retrieveObjectNames(intersectObjsSelector).map(function(objName) {
            return getObjectByName(objName);
        });

    }

    if (objs.length) {
        _pGlob.raycasterTmp.set(from, dir);
        var intersects = _pGlob.raycasterTmp.intersectObjects(objs, true);

        for (var i = 0; i < intersects.length; i++) {
            var int = intersects[i];

            int.object = getPickedObjectName(int.object);
            int.point = coordsTransform(int.point, 'Y_UP_RIGHT', getCoordSystem()).toArray();

            if (int.face)
                int.normal = coordsTransform(int.face.normal, 'Y_UP_RIGHT', getCoordSystem()).toArray();

            if (int.uv)
                int.uv = int.uv.toArray();

            delete int.face;
            delete int.faceIndex;

        }

        return intersects;
    } else {
        return [];
    }
}



// show and hide puzzles
function changeVis(objSelector, bool) {
    var objNames = retrieveObjectNames(objSelector);

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i]
        if (!objName)
            continue;
        var obj = getObjectByName(objName);
        if (!obj)
            continue;
        obj.visible = bool;
    }
}



// getVectorValue puzzle
function getVectorValue(vector, value) {

    var vector = _pGlob.vec3Tmp.fromArray(vector);

    switch (value) {
    case 'X':
        return vector.x;
    case 'Y':
        return vector.y;
    case 'Z':
        return vector.z;
    case 'IS_ZERO':
        return Boolean(vector.length() <= Number.EPSILON);
    case 'LENGTH':
        return vector.length();
    case 'NEGATED':
        return [-vector.x, -vector.y, -vector.z];
    case 'NORMALIZED':
        return vector.normalize().toArray();
    default:
        console.error('get value from vector: Wrong value');
        return;
    }
};



function RotationInterface() {
    /**
     * For user manipulations use XYZ extrinsic rotations (which
     * are the same as ZYX intrinsic rotations)
     *     - Blender/Max/Maya use extrinsic rotations in the UI
     *     - XYZ is the default option, but could be set from
     *       some order hint if exported
     */
    this._userRotation = new v3d.Euler(0, 0, 0, 'ZYX');
    this._actualRotation = new v3d.Euler();
}

Object.assign(RotationInterface, {
    initObject: function(obj) {
        if (obj.userData.v3d.puzzles === undefined) {
            obj.userData.v3d.puzzles = {}
        }
        if (obj.userData.v3d.puzzles.rotationInterface === undefined) {
            obj.userData.v3d.puzzles.rotationInterface = new RotationInterface();
        }

        var rotUI = obj.userData.v3d.puzzles.rotationInterface;
        rotUI.updateFromObject(obj);
        return rotUI;
    }
});

Object.assign(RotationInterface.prototype, {

    updateFromObject: function(obj) {
        var SYNC_ROT_EPS = 1e-8;

        if (!this._actualRotation.equalsEps(obj.rotation, SYNC_ROT_EPS)) {
            this._actualRotation.copy(obj.rotation);
            this._updateUserRotFromActualRot();
        }
    },

    getActualRotation: function(euler) {
        return euler.copy(this._actualRotation);
    },

    setUserRotation: function(euler) {
        // don't copy the order, since it's fixed to ZYX for now
        this._userRotation.set(euler.x, euler.y, euler.z);
        this._updateActualRotFromUserRot();
    },

    getUserRotation: function(euler) {
        return euler.copy(this._userRotation);
    },

    _updateUserRotFromActualRot: function() {
        var order = this._userRotation.order;
        this._userRotation.copy(this._actualRotation).reorder(order);
    },

    _updateActualRotFromUserRot: function() {
        var order = this._actualRotation.order;
        this._actualRotation.copy(this._userRotation).reorder(order);
    }

});




// setObjTransform puzzle
function setObjTransform(objSelector, mode, x, y, z, offset) {

    var objNames = retrieveObjectNames(objSelector);

    function setObjProp(obj, prop, val) {
        if (!offset) {
            obj[mode][prop] = val;
        } else {
            if (mode != "scale")
                obj[mode][prop] += val;
            else
                obj[mode][prop] *= val;
        }
    }

    var inputsUsed = _pGlob.vec3Tmp.set(Number(x !== ''), Number(y !== ''),
            Number(z !== ''));
    var coords = _pGlob.vec3Tmp2.set(x || 0, y || 0, z || 0);

    if (mode === 'rotation') {
        // rotations are specified in degrees
        coords.multiplyScalar(v3d.Math.DEG2RAD);
    }

    var coordSystem = getCoordSystem();

    coordsTransform(inputsUsed, coordSystem, 'Y_UP_RIGHT', true);
    coordsTransform(coords, coordSystem, 'Y_UP_RIGHT', mode === 'scale');

    for (var i = 0; i < objNames.length; i++) {

        var objName = objNames[i];
        if (!objName) continue;

        var obj = getObjectByName(objName);
        if (!obj) continue;

        if (mode === 'rotation' && coordSystem == 'Z_UP_RIGHT') {
            // Blender/Max coordinates

            // need all the rotations for order conversions, especially if some
            // inputs are not specified
            var euler = eulerV3DToBlenderShortest(obj.rotation, _pGlob.eulerTmp);
            coordsTransform(euler, coordSystem, 'Y_UP_RIGHT');

            if (inputsUsed.x) euler.x = offset ? euler.x + coords.x : coords.x;
            if (inputsUsed.y) euler.y = offset ? euler.y + coords.y : coords.y;
            if (inputsUsed.z) euler.z = offset ? euler.z + coords.z : coords.z;

            /**
             * convert from Blender/Max default XYZ extrinsic order to v3d XYZ
             * intrinsic with reversion (XYZ -> ZYX) and axes swizzling (ZYX -> YZX)
             */
            euler.order = "YZX";
            euler.reorder(obj.rotation.order);
            obj.rotation.copy(euler);

        } else if (mode === 'rotation' && coordSystem == 'Y_UP_RIGHT') {
            // Maya coordinates

            // Use separate rotation interface to fix ambiguous rotations for Maya,
            // might as well do the same for Blender/Max.

            var rotUI = RotationInterface.initObject(obj);
            var euler = rotUI.getUserRotation(_pGlob.eulerTmp);
            // TODO(ivan): this probably needs some reasonable wrapping
            if (inputsUsed.x) euler.x = offset ? euler.x + coords.x : coords.x;
            if (inputsUsed.y) euler.y = offset ? euler.y + coords.y : coords.y;
            if (inputsUsed.z) euler.z = offset ? euler.z + coords.z : coords.z;

            rotUI.setUserRotation(euler);
            rotUI.getActualRotation(obj.rotation);
        } else {

            if (inputsUsed.x) setObjProp(obj, "x", coords.x);
            if (inputsUsed.y) setObjProp(obj, "y", coords.y);
            if (inputsUsed.z) setObjProp(obj, "z", coords.z);

        }

        obj.updateMatrixWorld(true);
    }

}



// setObjDirection puzzle
function setObjDirection(objSelector, x, y, z, isPoint, lockUp) {

    var objNames = retrieveObjectNames(objSelector);

    var coords = coordsTransform(_pGlob.vec3Tmp.set(x, y, z), getCoordSystem(), 'Y_UP_RIGHT');

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        if (!objName) continue;

        var obj = getObjectByName(objName);
        if (!obj) continue;

        if (!isPoint) {
            coords.normalize().add(obj.position);
        }

        if (lockUp) {
            // NOTE: partially copy-pasted from LockedTrackConstraint

            var targetWorldPos = new v3d.Vector3(coords.x, coords.y, coords.z);

            var lockDir = new v3d.Vector3(0, 1, 0);

            if (obj.isCamera || obj.isLight)
                var trackDir = new v3d.Vector3(0, 0, -1);
            else
                var trackDir = new v3d.Vector3(0, 0, 1);

            var projDir = new v3d.Vector3();
            var plane = _pGlob.planeTmp;

            var objWorldPos = new v3d.Vector3();
            objWorldPos.setFromMatrixPosition(obj.matrixWorld);

            plane.setFromNormalAndCoplanarPoint(lockDir, objWorldPos);
            plane.projectPoint(targetWorldPos, projDir).sub(objWorldPos);

            var sign = _pGlob.vec3Tmp2.crossVectors(trackDir, projDir).dot(lockDir) > 0 ? 1 : -1;

            obj.setRotationFromAxisAngle(plane.normal, sign * trackDir.angleTo(projDir));

            if (obj.parent) {
                obj.parent.matrixWorld.decompose(_pGlob.vec3Tmp2, _pGlob.quatTmp, _pGlob.vec3Tmp2);
                obj.quaternion.premultiply(_pGlob.quatTmp.invert());
            }

        } else {

            obj.lookAt(coords.x, coords.y, coords.z);

        }

        obj.updateMatrixWorld(true);
    }
}



// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj){
    return (obj.type !== "AmbientLight" && obj.name !== ""
            && !(obj.isMesh && obj.isMaterialGeneratedMesh));
}



// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName){
    var objFound;
    var runTime = _pGlob !== undefined;
    objFound = runTime ? _pGlob.objCache[objName] : null;

    if (objFound && objFound.name === objName)
        return objFound;

    appInstance.scene.traverse(function(obj) {
        if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
            objFound = obj;
            if (runTime) {
                _pGlob.objCache[objName] = objFound;
            }
        }
    });
    return objFound;
}



// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames(){
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}



// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function getObjectNamesByGroupName(targetGroupName){
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}



// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames){
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc;
}



function retrieveObjectNamesAcc(currObjNames, acc){
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}



// utility function used by the whenClicked2 puzzles
function initObjectPicking2(callback, eventType, mouseDownUseTouchStart, mouseButtons){
    var elem = appInstance.renderer.domElement;
    elem.addEventListener(eventType, pickListener);

    if (eventType == 'click') {

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, pickListener);

    } else if (eventType == 'dblclick') {

        var prevTapTime = 0;

        function doubleTapCallback(event) {

            var now = new Date().getTime();
            var timesince = now - prevTapTime;

            if (timesince < 600 && timesince > 0) {

                pickListener(event);
                prevTapTime = 0;
                return;

            }

            prevTapTime = new Date().getTime();
        }

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, doubleTapCallback);
    }

    var raycaster = new v3d.Raycaster();

    var timeDelta;
    appInstance.container.addEventListener('pointerdown', function(){
        timeDelta = appInstance.clock.elapsedTime;
    }, false)
    appInstance.container.addEventListener('pointerup', function(){
        timeDelta = appInstance.clock.elapsedTime - timeDelta;
    }, false)

    function pickListener(event) {
        if(timeDelta < 0.2){
            event.preventDefault();

            var xNorm = 0, yNorm = 0;
            if (event instanceof MouseEvent) {
                if (mouseButtons && mouseButtons.indexOf(event.button) == -1)
                    return;
                xNorm = event.offsetX / elem.clientWidth;
                yNorm = event.offsetY / elem.clientHeight;
            } else if (event instanceof TouchEvent) {
                var rect = elem.getBoundingClientRect();
                xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
                yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
            }

            _pGlob.screenCoords.x = xNorm * 2 - 1;
            _pGlob.screenCoords.y = -yNorm * 2 + 1;
            raycaster.setFromCamera(_pGlob.screenCoords, appInstance.camera);
            var objList = [];
            appInstance.scene.traverse(function(obj){objList.push(obj);});
            var intersects = raycaster.intersectObjects(objList);
            callback(intersects, event);
        }
    }

}



function objectsIncludeObj(objNames, testedObjName){
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}



// utility function used by the whenClicked, whenHovered, whenDraggedOver, and raycast puzzles
function getPickedObjectName(obj){
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}



// getObjDirection puzzle
function getObjDirection(objName, coord) {
    if (!objName)
        return;
    var obj = getObjectByName(objName);
    if (!obj)
        return;

    var dir = obj.getWorldDirection(_pGlob.vec3Tmp);

    var coordSystem = getCoordSystem();
    coordsTransform(dir, 'Y_UP_RIGHT', coordSystem);

    switch (coord) {
    case 'X':
        return dir.x;
    case 'Y':
        return dir.y;
    case 'Z':
        return dir.z;
    case 'XYZ':
        return dir.toArray();
    case 'HORIZONTAL':
        switch (coordSystem) {
        case 'Y_UP_RIGHT':
            dir.y = 0;
            dir.normalize();
            return [dir.x, 0, dir.z];
        default:
            dir.z = 0;
            dir.normalize();
            return [dir.x, dir.y, 0];
        }
    default:
        console.error("get object direction: Wrong coords");
        return;
    }
};



// createVector puzzle
function createVector(x, y, z) {
    return [x, y, z];
};



// vectorMath puzzle
function vectorMath(vec1, operation, vec2) {

    var vec1 = _pGlob.vec3Tmp.fromArray(vec1);
    var vec2 = _pGlob.vec3Tmp2.fromArray(vec2);

    switch (operation) {
    case 'ADD':
        return vec1.add(vec2).toArray();
    case 'SUBTRACT':
        return vec1.sub(vec2).toArray();
    case 'MULTIPLY':
        return vec1.multiply(vec2).toArray();
    case 'DIVIDE':
        return vec1.divide(vec2).toArray();
    case 'DOT':
        return vec1.dot(vec2);
    case 'CROSS':
        return vec1.cross(vec2).toArray();
    case 'ROTATE':
        var euler = _pGlob.eulerTmp;
        vec2.multiplyScalar(Math.PI/180)
        return vec1.applyEuler(euler.setFromVector3(vec2)).toArray();
    default:
        console.error('vector math: Wrong operation');
        return;
    }
};



function registerOnClick2(objNames, xRay, doubleClick, cbDo, cbIfMissedDo){
    objNames = retrieveObjectNames(objNames) || [];

    var objNamesFiltered = objNames.filter(function(name) {
        return name;
    });

    // for AR/VR
    _pGlob.objClickInfo.push({
        objNames: objNamesFiltered,
        callbacks: [cbDo, cbIfMissedDo]
    });

    initObjectPicking2(function(intersects, event) {

        var isPicked = false;

        var maxIntersects = xRay ? intersects.length : Math.min(1, intersects.length);

        for (var i = 0; i < maxIntersects; i++) {
            var obj = intersects[i].object;
            var objName = getPickedObjectName(obj);
            _pGlob.pickedPoint = intersects[i].point;
            _pGlob.pickedNormal = intersects[i].face.normal;

            if (objectsIncludeObj(objNamesFiltered, objName)) {
                // save the object for the pickedObject block
                _pGlob.pickedObject2 = objName;
                isPicked = true;
                cbDo(event);
            }

        }

        if (!isPicked) {
            _pGlob.pickedObject2 = '';
            cbIfMissedDo(event);
        }

    }, doubleClick ? 'dblclick' : 'click', false, 0);
}



// getObjTransform puzzle
function getObjTransform(objName, mode, coord) {
    if (!objName)
        return;
    var obj = getObjectByName(objName);
    if (!obj)
        return;

    var coordSystem = getCoordSystem();

    var transformVal;

    if (mode === 'rotation' && coordSystem == 'Z_UP_RIGHT') {
        transformVal = eulerV3DToBlenderShortest(obj.rotation,
                _pGlob.eulerTmp);
    } else if (mode === 'rotation' && coordSystem == 'Y_UP_RIGHT') {
        // Maya coordinates
        // Use separate rotation interface to fix ambiguous rotations for Maya,
        // might as well do the same for Blender/Max.

        var rotUI = RotationInterface.initObject(obj);
        transformVal = rotUI.getUserRotation(_pGlob.eulerTmp);
    } else {
        transformVal = coordsTransform(obj[mode].clone(), 'Y_UP_RIGHT',
                coordSystem, mode === 'scale');
    }

    if (mode === 'rotation') {
        transformVal.x = v3d.MathUtils.radToDeg(transformVal.x);
        transformVal.y = v3d.MathUtils.radToDeg(transformVal.y);
        transformVal.z = v3d.MathUtils.radToDeg(transformVal.z);
    }

    if (coord == 'xyz') {
        // remove order component for Euler vectors
        return transformVal.toArray().slice(0, 3);
    } else {
        return transformVal[coord];
    }
}



// whenMoved puzzle
function whenMoved(objSelector, velocity, cbStart, cbMove, cbStop) {

    _pGlob.objMovementInfos = _pGlob.objMovementInfos || {};

    function savePreviousCoords(objName, obj, prevIsMoving) {
        // GC optimization
        if (_pGlob.objMovementInfos[objName]) {
            var info = _pGlob.objMovementInfos[objName];

            info.prevPosX = obj.position.x;
            info.prevPosY = obj.position.y;
            info.prevPosZ = obj.position.z;
            info.prevRotX = obj.rotation.x;
            info.prevRotY = obj.rotation.y;
            info.prevRotZ = obj.rotation.z;
            info.prevScaX = obj.scale.x;
            info.prevScaY = obj.scale.y;
            info.prevScaZ = obj.scale.z;
            info.prevIsMoving = prevIsMoving;
        } else {
            var info = {
                prevPosX: obj.position.x,
                prevPosY: obj.position.y,
                prevPosZ: obj.position.z,
                prevRotX: obj.rotation.x,
                prevRotY: obj.rotation.y,
                prevRotZ: obj.rotation.z,
                prevScaX: obj.scale.x,
                prevScaY: obj.scale.y,
                prevScaZ: obj.scale.z,
                prevIsMoving: prevIsMoving
            };
            _pGlob.objMovementInfos[objName] = info;
        }

        return info;
    }

    function checkMoving(objName, obj, elapsed) {

        var info = _pGlob.objMovementInfos[objName] ||
            savePreviousCoords(objName, obj, false);

        var delta = velocity * elapsed;

        var isMoving =
            Math.abs(obj.position.x - info.prevPosX) > delta ||
            Math.abs(obj.position.y - info.prevPosY) > delta ||
            Math.abs(obj.position.z - info.prevPosZ) > delta ||
            Math.abs(obj.rotation.x - info.prevRotX) > delta ||
            Math.abs(obj.rotation.y - info.prevRotY) > delta ||
            Math.abs(obj.rotation.z - info.prevRotZ) > delta ||
            Math.abs(obj.scale.x - info.prevScaX) > delta ||
            Math.abs(obj.scale.y - info.prevScaY) > delta ||
            Math.abs(obj.scale.z - info.prevScaZ) > delta;

        if (!info.prevIsMoving && isMoving) {
            cbStart(objName);
            savePreviousCoords(objName, obj, true);
        } else if (info.prevIsMoving && isMoving) {
            cbMove(objName);
            savePreviousCoords(objName, obj, true);
        } else if (info.prevIsMoving && !isMoving) {
            cbStop(objName);
            savePreviousCoords(objName, obj, false);
        } else {
            savePreviousCoords(objName, obj, false);
        }
    }

    function addToRender(objSelector) {

        function renderCb(elapsed, timeline) {

            var objNames = retrieveObjectNames(objSelector);

            for (var i = 0; i < objNames.length; i++) {
                var objName = objNames[i];

                var obj = getObjectByName(objName);
                if (!obj)
                    return;

                checkMoving(objName, obj, elapsed);
            }
        }

        appInstance.renderCallbacks.push(renderCb);
        if (v3d.PL.editorRenderCallbacks)
            v3d.PL.editorRenderCallbacks.push([appInstance, renderCb]);

    }

    addToRender(objSelector);

}


// Describe this function...
function _E5_93_8D_E5_BA_94_E9_9B_B7_E8_BE_BE() {
  setHTMLElemStyle('top', String(100 - getObjTransform(getActiveCamera(), 'position', 'y') * 3.703703703703704) + 'px', 'radar', false);
  setHTMLElemStyle('left', String(100 + getObjTransform(getActiveCamera(), 'position', 'x') * 3.703703703703704) + 'px', 'radar', false);
  if (getObjTransform(getActiveCamera(), 'rotation', 'z') < 0) {
    setHTMLElemStyle('transform', ['rotateZ( ',getObjTransform(getActiveCamera(), 'rotation', 'z') * -1,'deg)'].join(''), 'radar', false);
  } else {
    setHTMLElemStyle('transform', ['rotateZ( ',360 - getObjTransform(getActiveCamera(), 'rotation', 'z'),'deg)'].join(''), 'radar', false);
  }
}


// setActiveCamera puzzle
function setActiveCamera(camName) {
    var camera = getObjectByName(camName);
    if (!camera || !camera.isCamera || appInstance.getCamera() == camera)
        return;
    appInstance.setCamera(camera);
}



// setTimer puzzle
function registerSetTimer(id, timeout, callback, repeat) {

    if (id in _pGlob.intervalTimers) {
        window.clearInterval(_pGlob.intervalTimers[id]);
    }

    _pGlob.intervalTimers[id] = window.setInterval(function() {
        if (repeat-- > 0) {
            callback(_pGlob.intervalTimers[id]);
        }
    }, 1000 * timeout);
}



function MediaHTML5(isVideo) {
    this.source = null;
}

Object.assign(MediaHTML5.prototype, {

    load: function(url, isVideo) {
        if (isVideo) {
            this.source = document.createElement('video');
            this.source.playsInline = true;
            this.source.preload = 'auto';
            this.source.autoload = true;
            this.source.crossOrigin = 'anonymous';
        } else {
            this.source = document.createElement('audio');
        }

        this.source.src = url;
        return this;
    },

    play: function() {
        this.source.play();
    },

    pause: function() {
        this.source.pause();
    },

    stop: function() {
        this.source.pause();
        this.source.currentTime = 0;
    },

    rewind: function() {
        this.source.currentTime = 0;
    },

    setPlaybackTime: function(time) {
        this.source.currentTime = time
    },

    getPlaybackTime: function() {
        return this.source.currentTime;
    },

    setPlaybackRate: function(rate) {
        this.source.playbackRate = rate;
    },

    isPlaying: function() {
        return this.source.duration > 0 && !this.source.paused;
    },

    setLoop: function(looped) {
        this.source.loop = looped;
    },

    setVolume: function(volume) {
        this.source.volume = volume;
    },

    setMuted: function(muted) {
        this.source.muted = muted;
    },

});



// loadMedia puzzle
function loadMedia_HTML5(url) {

    var elems = _pGlob.mediaElements;
    if (!(url in elems)) {
        elems[url] = new MediaHTML5().load(url);
    }
    return elems[url];
}



// playSound puzzle
function playSound(mediaElem, loop) {
    if (!mediaElem)
        return;
    mediaElem.setLoop(loop);
    mediaElem.play();
}



// volume puzzle
function volume(mediaElem, volume) {
    if (!mediaElem)
        return;

    volume = Number(volume);
    if (Number.isNaN(volume)) {
        return;
    }

    mediaElem.setVolume(v3d.Math.clamp(volume, 0.0, 1.0));
}



// removeTimer puzzle
function registerRemoveTimer(id) {
    if (id in _pGlob.intervalTimers) {
        window.clearInterval(_pGlob.intervalTimers[id]);
    }
}



// stopSound puzzle
function stopSound(mediaElem) {
    if (!mediaElem) {
        return;
    }
    mediaElem.stop();
}


// Describe this function...
function _E8_87_AA_E5_8A_A8_E6_B8_B8_E8_A7_88() {
  if (State_guide == false) {
    if (State_lay == 'Camera_Roll') {
      setHTMLElemStyle('display', 'block', 'Curtain', false);
      registerSetTimeout(1.5, function() {
        changeVis(['GROUP', 'top'], true);
        setActiveCamera('Camera_FPS');
        State_lay = 'Camera_FPS';
        registerSetTimeout(1.5, function() {
          setHTMLElemStyle('display', 'none', 'Curtain', false);
        });
        _E6_98_BE_E7_A4_BAnavbar();
      });
    }
    setHTMLElemStyle('display', 'block', 'Curtain', false);
    setHTMLElemStyle('display', 'none', ['QUERYSELECTOR', '.navbar'], false);
    registerSetTimeout(1.5, function() {

      operateAnimation('PLAY', 'guide', null, null, 'LoopPingPong', 0.2,
              function() {}, undefined, false);

          tweenCamera('guide', vectorMath(getObjTransform(getActiveCamera(), 'position', 'xyz'), 'ADD', vectorMath(getObjDirection(getActiveCamera(), 'HORIZONTAL'), 'ADD', createVector(0, 0, 0))), 0.01, function() {}, 0);
      registerSetTimer('myguide', 0.01, function() {
        setObjTransform('Camera_FPS', 'position', getObjTransform('guide', 'position', 'x'), getObjTransform('guide', 'position', 'y'), getObjTransform('guide', 'position', 'z'), false);
        setObjTransform('Camera_FPS', 'rotation', '', '', getObjTransform('guide', 'rotation', 'z'), false);
      }, Infinity);
      State_guide = true;
      registerSetTimeout(1.5, function() {
        setHTMLElemStyle('display', 'none', 'Curtain', false);
      });
      if (State_music == false) {
        playSound(loadMedia_HTML5('assets/music/music.mp3'), true);
        volume(loadMedia_HTML5('assets/music/music.mp3'), 1);
        State_music = true;
      }
      _E9_9A_90_E8_97_8FNavbar();
      setHTMLElemAttribute('className', 'activebtn', 'icon-1', false);
      setHTMLElemAttribute('className', 'activebtn', 'icon-3', false);
    });
  } else if (State_guide == true) {
    setHTMLElemAttribute('className', '', 'icon-1', false);
    setHTMLElemAttribute('className', '', 'icon-3', false);

    operateAnimation('STOP', 'guide', null, null, 'AUTO', 1,
            function() {}, undefined, false);

        registerRemoveTimer('myguide');
    State_guide = false;
    if (State_music == true) {
      stopSound(loadMedia_HTML5('assets/music/music.mp3'));
      State_music = false;
    }
    _E6_98_BE_E7_A4_BAnavbar();
    if (State_lay == 'Camera_Roll') {
      setHTMLElemStyle('display', 'block', 'Curtain', false);
      registerSetTimeout(1.5, function() {

        operateAnimation('STOP', 'guide', null, null, 'AUTO', 1,
                function() {}, undefined, false);

            registerRemoveTimer('myguide');
        changeVis(['GROUP', 'top'], true);
        setActiveCamera('Camera_FPS');
        setObjTransform('Camera_FPS', 'position', -19.425800323486328, 13.311790392333199, 1.8056599281027523, false);
        tweenCamera('target-camera', 'target-point', 2, function() {}, 0);
        State_lay = 'Camera_FPS';
        registerSetTimeout(1.5, function() {
          setHTMLElemStyle('display', 'none', 'Curtain', false);
        });
        _E6_98_BE_E7_A4_BAnavbar();
      });
    }
  }
}


// orbitControls set prop puzzle
function orbitControlsSetProp(option,value) {
    if (appInstance.controls && appInstance.controls instanceof v3d.OrbitControls) {
        appInstance.controls[option] = value;
    } else {
        console.error('app controls set prop: Wrong controls type');
    }
}


// Describe this function...
function _E9_B8_9F_E7_9E_B0_E8_A1_8C_E8_B5_B0_E5_88_87_E6_8D_A2() {
  if (State_lay == 'Camera_FPS') {
    setHTMLElemStyle('display', 'block', 'Curtain', false);
    setHTMLElemStyle('display', 'none', 'dialogray', false);
    registerSetTimeout(1.5, function() {
      changeVis(['GROUP', 'top'], false);
      setActiveCamera('Camera_Roll');
      setObjTransform('Camera_Rolls', 'position', 28.9677, -121.2439, 45.1909, false);
      tweenCamera(createVector(160, -82, 75), createVector(0, 0, 0), 1.5, function() {}, 1);
      State_lay = 'Camera_Roll';
      registerSetTimeout(1.5, function() {
        setHTMLElemStyle('display', 'none', 'Curtain', false);
      });
      if (State_music == true) {
        stopSound(loadMedia_HTML5('assets/music/music.mp3'));
        State_music = false;
      }
      _E9_9A_90_E8_97_8FNavbar();
      orbitControlsSetProp('rotateInertia',0.8);
      orbitControlsSetProp('panInertia',0.8);
      orbitControlsSetProp('zoomInertia',0.2);
      if (featureAvailable('MOBILE')) {
        orbitControlsSetProp('rotateInertiaTouch',0.8);
        orbitControlsSetProp('zoomInertiaTouch',0.5);
      }
      setHTMLElemAttribute('className', 'activebtn', 'icon-2', false);
    });
  } else if (State_lay == 'Camera_Roll') {
    setHTMLElemStyle('display', 'block', 'Curtain', false);
    registerSetTimeout(1.5, function() {

      operateAnimation('STOP', 'guide', null, null, 'AUTO', 1,
              function() {}, undefined, false);

          registerRemoveTimer('myguide');
      changeVis(['GROUP', 'top'], true);
      setActiveCamera('Camera_FPS');
      setObjTransform('Camera_FPS', 'position', -19.425800323486328, 13.311790392333199, 1.8056599281027523, false);
      tweenCamera('target-camera', 'target-point', 2, function() {}, 0);
      State_lay = 'Camera_FPS';
      registerSetTimeout(1.5, function() {
        setHTMLElemStyle('display', 'none', 'Curtain', false);
      });
      _E6_98_BE_E7_A4_BAnavbar();
      setHTMLElemAttribute('className', '', 'icon-2', false);
    });
  }
}

// Describe this function...
function _E9_9F_B3_E4_B9_90_E5_BC_80_E5_85_B3() {
  if (State_music == false) {
    playSound(loadMedia_HTML5('assets/music/music.mp3'), true);
    volume(loadMedia_HTML5('assets/music/music.mp3'), 1);
    State_music = true;
    setHTMLElemAttribute('className', 'activebtn', 'icon-3', false);
  } else if (State_music == true) {
    stopSound(loadMedia_HTML5('assets/music/music.mp3'));
    State_music = false;
    setHTMLElemAttribute('className', '', 'icon-3', false);
  }
}


// disableRendering puzzle
function disableRendering(enableSSAA) {
    appInstance.ssaaOnPause = enableSSAA;
    appInstance.disableRendering(1);
}


// Describe this function...
function _E5_BC_B9_E5_87_BA_E5_88_97_E8_A1_A8_E5_BC_B9_E7_AA_97() {
  disableRendering(false);
  setHTMLElemStyle('display', 'block', 'dialoglist', false);
  setHTMLElemStyle('animation', 'upshower 1.2s 0s ease 1', 'dialoglist', false);
  setHTMLElemStyle('animationFillMode', 'forwards', 'dialoglist', false);
}


// enableRendering puzzle
function enableRendering() {
    appInstance.enableRendering();
}



// setCSSRuleStyle puzzle
function setCSSRuleStyle(prop, value, id, isParent, mediaRule) {
    var styles = (isParent) ? parent.document.styleSheets : document.styleSheets;
    for (var i = 0; i < styles.length; i++) {
        /**
         * workaround for "DOMException: Failed to read the 'cssRules' property
         * from 'CSSStyleSheet': Cannot access rules"
         */
        try { var cssRules = styles[i].cssRules; }
        catch (e) { continue; }

        for (var j = 0; j < cssRules.length; j++) {
            var cssRule = cssRules[j];
            if (!mediaRule && cssRule.selectorText == id)
                cssRule.style[prop] = value;
            else if (mediaRule && cssRule.media && cssRule.media.mediaText == mediaRule) {
                var cssRulesMedia = cssRule.cssRules;
                for (var k = 0; k < cssRulesMedia.length; k++) {
                    if (cssRulesMedia[k].selectorText == id)
                        cssRulesMedia[k].style[prop] = value;
                }
            }
        }
    }
}


// Describe this function...
function _E9_9A_90_E8_97_8F_E5_88_97_E8_A1_A8_E5_BC_B9_E7_AA_97() {
  enableRendering();
  setHTMLElemStyle('display', 'block', 'dialoglist', false);
  setHTMLElemStyle('animation', 'downhideer 0.5s 0s ease 1', 'dialoglist', false);
  setHTMLElemStyle('animationFillMode', 'forwards', 'dialoglist', false);
  registerSetTimeout(0.501, function() {
    setHTMLElemStyle('display', 'none', 'dialoglist', false);
    setHTMLElemStyle('animation', '', 'dialoglist', false);
  });
  setCSSRuleStyle('cursor', 'auto', '.details-container-center-left', false, '');
}

// Describe this function...
function _E5_85_B3_E9_97_AD_E6_B2_B9_E7_94_BB_E5_BC_B9_E7_AA_97() {
  setHTMLElemStyle('display', 'block', 'dialogpaint', false);
  setHTMLElemStyle('animation', 'hideer 0.3s 0s ease 1', 'dialogpaint', false);
  setHTMLElemStyle('animationFillMode', 'forwards', 'dialogpaint', false);
  registerSetTimeout(0.301, function() {
    setHTMLElemStyle('display', 'none', 'dialogpaint', false);
    setHTMLElemStyle('animation', '', 'dialogpaint', false);
  });
}

// Describe this function...
function _E6_9B_BF_E6_8D_A2_E5_BC_B9_E6_A1_86_E5_86_85_E6_B2_B9_E7_94_BB_E4_BF_A1_E6_81_AF() {
  setHTMLElemAttribute('src', ['assets/paint/',ID_PaintList.slice(6, ID_PaintList.length),'.jpg'].join(''), 'desc-img', false);
  if (ID_PaintList.indexOf('78') >= 0) {
    setHTMLElemAttribute('innerHTML', dictGet(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'desc'), 'desc-title'), 's-desc-title', false);
    setHTMLElemAttribute('innerHTML', dictGet(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'desc'), 'desc-1'), 's-desc-1', false);
    setHTMLElemAttribute('innerHTML', dictGet(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'desc'), 'desc-2'), 's-desc-2', false);
    setHTMLElemAttribute('innerHTML', dictGet(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'desc'), 'desc-3'), 's-desc-3', false);
  } else {
    setHTMLElemAttribute('innerHTML', dictGet(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'desc'), 'desc-title'), 'desc-title', false);
    setHTMLElemAttribute('innerHTML', dictGet(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'desc'), 'desc-1'), 'desc-1', false);
    setHTMLElemAttribute('innerHTML', dictGet(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'desc'), 'desc-2'), 'desc-2', false);
    setHTMLElemAttribute('innerHTML', dictGet(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'desc'), 'desc-3'), 'desc-3', false);
  }
}


var parseDataUriRe = /^data:(.+\/.+);base64,(.*)$/;

/**
 * Check if object is a Data URI string
 */
function checkDataUri(obj) {
    return (typeof obj === 'string' && parseDataUriRe.test(obj));
}

/**
 * Check if object is a URI to a Blob object
 */
function checkBlobUri(obj) {
    return (typeof obj === 'string' && obj.indexOf('blob:') == 0);
}

/**
 * First we use encodeURIComponent to get percent-encoded UTF-8,
 * then we convert the percent encodings into raw bytes which can be fed into btoa
 * https://bit.ly/3dvpq60
 */
function base64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

/**
 * Going backwards: from bytestream, to percent-encoding, to original string
 * https://bit.ly/3dvpq60
 */
function base64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

/**
 * Convert object or string to application/json Data URI
 */
function toJSONDataUri(obj) {
    if (typeof obj !== 'string')
        obj = JSON.stringify(obj);
    return 'data:application/json;base64,' + base64EncodeUnicode(obj);
}

/**
 * Convert object or string to application/json Data URI
 */
function toTextDataUri(obj) {
    if (typeof obj !== 'string')
        obj = JSON.stringify(obj);
    return 'data:text/plain;base64,' + base64EncodeUnicode(obj);
}

/**
 * Extract text data from Data URI
 */
function extractDataUriData(str) {
    var matches = str.match(parseDataUriRe);
    return base64DecodeUnicode(matches[2]);
}



// readJSON puzzle
function readJSON(text) {
    if (checkDataUri(text)) {
        text = extractDataUriData(text);
    }

    try {
        return JSON.parse(text);
    } catch(e) {
        console.error("Read JSON Puzzle: could not interpret data.");
        return null;
    }
}



// loadFile puzzle
_pGlob.loadedFiles = {};

function loadFile(url, callback) {

    var files = _pGlob.loadedFiles;

    if (!url || (typeof url != 'string')) {
        _pGlob.loadedFile = '';
        callback();
    } else if (url in files) {
        _pGlob.loadedFile = files[url];
        callback();
    } else {
        var loader = new v3d.FileLoader();
        loader.load(url,
            function(data) {
                _pGlob.loadedFile = data;
                callback();
            },
            function() {},
            function() {
                _pGlob.loadedFile = '';
                callback();
            }
        );
    }
}



// getEventProperty puzzle
function getEventProperty(prop, event) {
    if (typeof event != "undefined") {
        switch (prop) {
            case 'target.id':
                return event.target.id;
            case 'target.value':
                return event.target.value;
            case 'touches.length':
                return event.touches ? event.touches.length : 0;
            case 'touches[0].pageX':
                return event.touches[0].pageX;
            case 'touches[0].pageY':
                return event.touches[0].pageY;
            case 'touches[1].pageX':
                return event.touches[1].pageX;
            case 'touches[1].pageY':
                return event.touches[1].pageY;
            default:
                return event[prop];
        }
    }
}


// Describe this function...
function _E7_82_B9_E5_87_BB_E5_88_97_E8_A1_A8_E5_86_85_E5_AE_B9() {
  if (getEventProperty('target.id', event).indexOf('paint-') == 0 && getEventProperty('target.id', event).indexOf('-look') > 0) {
    _E9_9A_90_E8_97_8F_E5_88_97_E8_A1_A8_E5_BC_B9_E7_AA_97();
    ID_PaintList = getEventProperty('target.id', event).slice(0, ((getEventProperty('target.id', event).indexOf('-look') - 1) + 1));
    _E6_9B_BF_E6_8D_A2_E5_BC_B9_E6_A1_86_E5_86_85_E6_B2_B9_E7_94_BB_E4_BF_A1_E6_81_AF();
    if (getEventProperty('target.id', event) == 'paint-78-look') {
      setHTMLElemStyle('visibility', 'visible', 'swiperBox', false);
      setHTMLElemStyle('opacity', '1', 'swiperBox', false);
    } else {
      setHTMLElemStyle('display', 'block', 'dialogpaint', false);
      setHTMLElemStyle('opacity', '1', 'dialogpaint', false);
    }
  } else if (getEventProperty('target.id', event).indexOf('paint-') == 0 && getEventProperty('target.id', event).indexOf('-position') > 0) {
    _E9_9A_90_E8_97_8F_E5_88_97_E8_A1_A8_E5_BC_B9_E7_AA_97();
    ID_PaintList = getEventProperty('target.id', event).slice(0, ((getEventProperty('target.id', event).indexOf('-position') - 1) + 1));
    /* 设置画作的位置以及角度 */
    setObjTransform(getActiveCamera(), 'position', getVectorValue(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'position'), 'X'), getVectorValue(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'position'), 'Y'), getVectorValue(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'position'), 'Z'), false);
    setObjTransform(getActiveCamera(), 'rotation', '', '', dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'position')[3], false);
    _E5_93_8D_E5_BA_94_E9_9B_B7_E8_BE_BE();
    /* 到达画作前，抬头 */
    tweenCamera(getObjTransform(getActiveCamera(), 'position', 'xyz'), vectorMath(getObjTransform(getActiveCamera(), 'position', 'xyz'), 'ADD', vectorMath(getObjDirection(getActiveCamera(), 'HORIZONTAL'), 'ADD', createVector(0, 0, 0))), 1, function() {}, 0);
  } else if (getEventProperty('target.id', event).indexOf('paint-') == 0 && getEventProperty('target.id', event).indexOf('-sound') > 0) {
    _E9_9A_90_E8_97_8F_E5_88_97_E8_A1_A8_E5_BC_B9_E7_AA_97();
    _E7_82_B9_E5_87_BB_E5_88_97_E8_A1_A8_E5_86_85_E8_AF_AD_E9_9F_B3_E8_AE_B2_E6_8C_89_E9_92_AE_E8_A7_A3();
    setHTMLElemStyle('display', 'none', 'navbar', false);
  } else if (getEventProperty('target.id', event).indexOf('jingshen-') == 0 && getEventProperty('target.id', event).indexOf('-position') > 0) {
    _E9_9A_90_E8_97_8F_E5_88_97_E8_A1_A8_E5_BC_B9_E7_AA_97();
    ID_PaintList = getEventProperty('target.id', event).slice(0, ((getEventProperty('target.id', event).indexOf('-position') - 1) + 1));
    setObjTransform(getActiveCamera(), 'position', getVectorValue(dictGet(dictGet(Dict_jingshen, ID_PaintList), 'position'), 'X'), getVectorValue(dictGet(dictGet(Dict_jingshen, ID_PaintList), 'position'), 'Y'), getVectorValue(dictGet(dictGet(Dict_jingshen, ID_PaintList), 'position'), 'Z'), false);
    setObjTransform(getActiveCamera(), 'rotation', '', '', dictGet(dictGet(Dict_jingshen, ID_PaintList), 'position')[3], false);
    _E5_93_8D_E5_BA_94_E9_9B_B7_E8_BE_BE();
    tweenCamera(getObjTransform(getActiveCamera(), 'position', 'xyz'), vectorMath(getObjTransform(getActiveCamera(), 'position', 'xyz'), 'ADD', vectorMath(getObjDirection(getActiveCamera(), 'HORIZONTAL'), 'ADD', createVector(0, 0, 0))), 1, function() {}, 0);
  } else if (getEventProperty('target.id', event).indexOf('story-') == 0 && getEventProperty('target.id', event).indexOf('button') > 0) {
    _E9_9A_90_E8_97_8F_E5_88_97_E8_A1_A8_E5_BC_B9_E7_AA_97();
    setObjTransform(getActiveCamera(), 'position', -22.529191183219407, -10.25912483969574, 1.8056600223657782, false);
    setObjTransform(getActiveCamera(), 'rotation', '', '', 90, false);
    _E5_93_8D_E5_BA_94_E9_9B_B7_E8_BE_BE();
    tweenCamera(getObjTransform(getActiveCamera(), 'position', 'xyz'), vectorMath(getObjTransform(getActiveCamera(), 'position', 'xyz'), 'ADD', vectorMath(getObjDirection(getActiveCamera(), 'HORIZONTAL'), 'ADD', createVector(0, 0, 0))), 1, function() {}, 0);
    ID_Story = getEventProperty('target.id', event).slice(0, ((getEventProperty('target.id', event).indexOf('-button') - 1) + 1));
    Province = dictGet(dictGet(Dict_story, ID_Story), 'province');
    changeVis(Province, true);

    operateAnimation('PLAY', Province, null, null, 'LoopRepeat', 1,
            function() {}, undefined, false);

        if (Story_Sounds == false) {
      playSound(loadMedia_HTML5(dictGet(dictGet(Dict_story, ID_Story), 'sound')), false);
      Story_Sounds = true;
      setHTMLElemStyle('display', 'block', 'paint-story-container', false);
      setHTMLElemAttribute('innerHTML', dictGet(dictGet(Dict_story, ID_Story), 'desc'), 'paint-story-text', false);
    }
  }
}

// Describe this function...
function _E7_82_B9_E5_87_BB_E6_8C_89_E9_92_AE_E2_91_A0_E6_97_B6_E5_A1_AB_E5_85_85_E6_B2_B9_E7_94_BB_E5_88_97_E8_A1_A8() {
  PaintList = '';
  var j_list = typeof Dict_oilpaint == 'object' ? Object.keys(Dict_oilpaint) : [];
  for (var j_index in j_list) {
    j = j_list[j_index];
    PaintList = String(PaintList) + String(String(String(['<div class="details-container"><div class="details-container-center"><div class="details-container-center-left"><div class="details-container-container"><p id="',['',j,'-title'].join(''),'">'].join('')) + String(String(dictGet(dictGet(Dict_oilpaint, j), 'title')))) + String(String('</p>               </div>               <div class="details-container-container" style="display: flex;justify-content: flex-start;flex-direction: row;">                 <div id="' + String(j)) + String('-look" class="list-box-button">                   <img src="media/listbox.png" alt="" draggable="false"/>                   <p>查看油画</p>                 </div>                 <div id="' + String(String(j) + String('-position" class="list-box-button">                   <img src="media/listbox.png" alt="" draggable="false"/>                   <p>位置</p>                 </div>               </div>             </div>             <div class="details-container-center-right">               <div class="details-container-center-right-paint">                 <img src="assets/simg/' + String(String(j.slice(6, j.length)) + '.jpg" alt="" draggable="false"/>               </div>             </div>           </div>           <hr/>         </div>'))))));
  }
  setHTMLElemAttribute('innerHTML', PaintList, 'card', false);
}

// Describe this function...
function _E7_82_B9_E5_87_BB_E5_88_97_E8_A1_A8_E5_86_85_E8_AF_AD_E9_9F_B3_E8_AE_B2_E6_8C_89_E9_92_AE_E8_A7_A3() {
  ID_PaintList = getEventProperty('target.id', event).slice(0, ((getEventProperty('target.id', event).indexOf('-sound') - 1) + 1));
  setObjTransform(getActiveCamera(), 'position', getVectorValue(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'position'), 'X'), getVectorValue(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'position'), 'Y'), getVectorValue(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'position'), 'Z'), false);
  setObjTransform(getActiveCamera(), 'rotation', '', '', dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'position')[3], false);
  _E5_93_8D_E5_BA_94_E9_9B_B7_E8_BE_BE();
  setHTMLElemStyle('display', 'block', 'paint-sounds-container', false);
  tweenCamera(vectorMath(getObjTransform(getActiveCamera(), 'position', 'xyz'), 'ADD', createVector(0, 0, 0.1)), vectorMath(getObjTransform(getActiveCamera(), 'position', 'xyz'), 'ADD', vectorMath(getObjDirection(getActiveCamera(), 'HORIZONTAL'), 'ADD', createVector(0, 0, 0))), 1, function() {}, 0);
  setHTMLElemAttribute('innerHTML', dictGet(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'explain'), 'text'), 'paint-jiangjie-text', false);
  if (dictGet(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'explain'), 'sound').length == 0) {
    setHTMLElemStyle('display', 'none', 'paint-jiangjie-container', false);
  } else {
    setHTMLElemStyle('display', 'block', 'paint-jiangjie-container', false);
    playSound(loadMedia_HTML5(dictGet(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'explain'), 'sound')), false);
    volume(loadMedia_HTML5(dictGet(dictGet(dictGet(Dict_oilpaint, ID_PaintList), 'explain'), 'sound')), 0.2);
    State_sounds = true;
    _E9_9A_90_E8_97_8FNavbar();
  }
}

// Describe this function...
function _E5_A1_AB_E5_85_85_E7_94_BB_E8_AF_B4_E5_85_9A_E5_8F_B2_E5_88_97_E8_A1_A8() {
  PaintList = '';
  var m_list = typeof Dict_oilpaint == 'object' ? Object.keys(Dict_oilpaint) : [];
  for (var m_index in m_list) {
    m = m_list[m_index];
    if (dictGet(dictGet(dictGet(Dict_oilpaint, m), 'explain'), 'sound').length == 0) {
      continue;
    }
    PaintList = String(PaintList) + String(String(String(['<div class="details-container"><div class="details-container-center"><div class="details-container-center-left"><div class="details-container-container"><p id="',['',m,'-title'].join(''),'">'].join('')) + String(String(dictGet(dictGet(Dict_oilpaint, m), 'title')))) + String(String('</p>               </div>               <div class="details-container-container" style="display: flex;justify-content: flex-start;flex-direction: row;">                 <div id="' + String(m)) + String('-sound" class="list-box-button">                   <img src="media/listbox.png" alt="" draggable="false"/>                   <p>语音讲解</p>                 </div>                 <div id="' + String(String(m) + String('-position" class="list-box-button">                   <img src="media/listbox.png" alt="" draggable="false"/>                   <p>位置</p>                 </div>               </div>             </div>             <div class="details-container-center-right">               <div class="details-container-center-right-paint">                 <img src="assets/simg/' + String(String(m.slice(6, m.length)) + '.jpg" alt="" draggable="false"/>               </div>             </div>           </div>           <hr/>         </div>'))))));
  }
  setHTMLElemAttribute('innerHTML', PaintList, 'card', false);
}

// Describe this function...
function _E5_A1_AB_E5_85_85_E7_B3_BB_E5_88_97_E7_B2_BE_E7_A5_9E() {
  PaintList = '';
  var i_list = typeof Dict_jingshen == 'object' ? Object.keys(Dict_jingshen) : [];
  for (var i_index in i_list) {
    i = i_list[i_index];
    PaintList = String(PaintList) + String(String(String(String(String('<div class="details-container">           <div class="details-container-center">             <div class="details-container-center-left"' + String(' id="' + String(i))) + String(String('-position' + '"') + '>               <div class="details-container-container" style="height: 30%">                 <p >')) + String(String(dictGet(dictGet(Dict_jingshen, i), 'title')) + '</p>               </div>               <div class="details-container-container" style="height: 15%;display:flex;flex-direction:column;flex-wrap:nowrap;">                 <p class="jingshen-p">')) + String([String(dictGet(dictGet(Dict_jingshen, i), 'desc')[0]) + '</p>                 <p class="jingshen-p">',String(dictGet(dictGet(Dict_jingshen, i), 'desc')[1]) + '</p>                 <p class="jingshen-p">',String(dictGet(dictGet(Dict_jingshen, i), 'desc')[2]) + '</p>                 <p class="jingshen-p">',String(dictGet(dictGet(Dict_jingshen, i), 'desc')[3]) + '</p>               </div>             </div>             <div class="details-container-center-right">               <div class="details-container-center-right-paint">                 <img src="'].join(''))) + String(String('' + String(dictGet(dictGet(Dict_jingshen, i), 'img'))) + String('' + '" alt="" draggable="false"/>               </div>             </div>           </div>           <hr/>         </div>')));
  }
  setHTMLElemAttribute('innerHTML', PaintList, 'card', false);
  setCSSRuleStyle('cursor', 'pointer', '.details-container-center-left', false, '');
}


// distanceBetweenObjects puzzle
function getDistanceBetweenObjects(objName1, objName2) {
    if (!objName1 || !objName2)
        return;
    var obj1 = getObjectByName(objName1);
    var obj2 = getObjectByName(objName2);
    if (!obj1 || !obj2)
        return;
    return obj1.getWorldPosition(_pGlob.vec3Tmp).distanceTo(obj2.getWorldPosition(_pGlob.vec3Tmp2));
}



// pauseSound puzzle
function pauseSound(mediaElem) {
    if (!mediaElem)
        return;
    mediaElem.pause();
}


// Describe this function...
function _E6_A0_B9_E6_8D_AE_E5_B0_84_E7_BA_BF_E6_98_BE_E7_A4_BA_E5_BC_B9_E6_A1_86() {
  Intersect_object = dictGet(raycast(getActiveCamera(), getCameraDirection(false, false), ['ALL_OBJECTS'])[0], 'object');
  if (Intersect_object.indexOf('paint') == 0 && getDistanceBetweenObjects(getActiveCamera(), Intersect_object) <= 6) {
    setHTMLElemStyle('display', 'block', 'dialogray', false);
    /* 检测sound是否有内容 */
    if (dictGet(dictGet(dictGet(Dict_oilpaint, Intersect_object), 'explain'), 'sound').length == 0) {
      setHTMLElemStyle('display', 'none', 'paint-jiangjie', false);
    } else {
      setHTMLElemStyle('display', 'block', 'paint-jiangjie', false);
    }
    paint_object = Intersect_object;
    ID_PaintList = Intersect_object;
  } else {
    setHTMLElemStyle('display', 'none', 'dialogray', false);
    setHTMLElemStyle('display', 'none', 'paint-jiangjie-container', false);
    if (State_sounds == true) {
      pauseSound(loadMedia_HTML5(dictGet(dictGet(dictGet(Dict_oilpaint, paint_object), 'explain'), 'sound')));
      State_sounds = false;
    }
  }
  if (Intersect_object.indexOf('Map') == 0 && getDistanceBetweenObjects(getActiveCamera(), Intersect_object) <= 8) {
    /* 检测sound是否有内容 */
  } else {
    if (Story_Sounds == true) {
      for (k = 1; k <= 100; k++) {

        operateAnimation('STOP', dictGet(dictGet(Dict_story, 'story-' + String(k)), 'province'), null, null, 'AUTO', 1,
                function() {}, undefined, false);

            changeVis(dictGet(dictGet(Dict_story, 'story-' + String(k)), 'province'), false);
      }
      stopSound(loadMedia_HTML5(dictGet(dictGet(Dict_story, ID_Story), 'sound')));
      setHTMLElemStyle('display', 'none', 'paint-story-container', false);
      Story_Sounds = false;
    }
  }
}

// Describe this function...
function _E7_99_BE_E5_B9_B4_E6_95_85_E4_BA_8B() {
  PaintList = '';
  var i_list2 = typeof Dict_story == 'object' ? Object.keys(Dict_story) : [];
  for (var i_index2 in i_list2) {
    i = i_list2[i_index2];
    PaintList = String(PaintList) + String(String(String(String(String('         <div class="details-container">           <div class="details-container-center">             <div class="details-container-center-left" ' + String(' id="' + String(i))) + String(String('-button' + '"') + '>               <div class="details-container-container" style="height: 50%">                 <p >')) + String(String(String(dictGet(dictGet(Dict_story, i), 'year')) + '&nbsp;') + String(String(dictGet(dictGet(Dict_story, i), 'province')) + '</p>               </div>               <div class="details-container-container" style="height: 30%;display:flex;flex-direction:column;flex-wrap:nowrap;margin-left: 10px;">                 <p class="jingshen-p" style="line-height: 18px;">'))) + String([String(dictGet(dictGet(Dict_story, i), 'desc').slice(0, 48)) + '...','</p>               </div>             </div>             <div class="details-container-center-right">               <div class="details-container-center-right-paint">                 <img src="' + 'assets/story/',String(dictGet(dictGet(Dict_story, i), 'province')) + '.png','" alt="" draggable="false"/>               </div>             </div>           </div>           <hr/>         </div>' + ''].join(''))) + String(String('' + '') + String('' + '')));
  }
  setHTMLElemAttribute('innerHTML', PaintList, 'card', false);
  setCSSRuleStyle('cursor', 'pointer', '.details-container-center-left', false, '');
}

// Describe this function...
function _E8_AE_B2_E8_A7_A3() {
  if (State_sounds == false) {
    setHTMLElemStyle('display', 'block', 'paint-jiangjie-container', false);
    setHTMLElemAttribute('innerHTML', dictGet(dictGet(dictGet(Dict_oilpaint, Intersect_object), 'explain'), 'text'), 'paint-jiangjie-text', false);
    playSound(loadMedia_HTML5(dictGet(dictGet(dictGet(Dict_oilpaint, Intersect_object), 'explain'), 'sound')), false);
    volume(loadMedia_HTML5(dictGet(dictGet(dictGet(Dict_oilpaint, Intersect_object), 'explain'), 'sound')), 0.2);
    State_sounds = true;
    _E9_9A_90_E8_97_8FNavbar();
  } else if (State_sounds == true) {
    setHTMLElemStyle('display', 'none', 'paint-jiangjie-container', false);
    pauseSound(loadMedia_HTML5(dictGet(dictGet(dictGet(Dict_oilpaint, Intersect_object), 'explain'), 'sound')));
    State_sounds = false;
    _E6_98_BE_E7_A4_BAnavbar();
  }
}

// Describe this function...
function showSwiper() {
  setHTMLElemStyle('animation', 'shower 0.3s 0s ease 1', 'swiperBox', false);
  setHTMLElemStyle('visibility', 'visible', 'swiperBox', false);
  setHTMLElemStyle('animationFillMode', 'forwards', 'swiperBox', false);
  registerSetTimeout(0.301, function() {
    setHTMLElemStyle('animation', '', 'swiperBox', false);
  });
  _E6_9B_BF_E6_8D_A2_E5_BC_B9_E6_A1_86_E5_86_85_E6_B2_B9_E7_94_BB_E4_BF_A1_E6_81_AF();
}

// Describe this function...
function _E6_9F_A5_E7_9C_8B() {
  setHTMLElemStyle('display', 'block', 'dialogpaint', false);
  setHTMLElemStyle('animation', 'shower 0.3s 0s ease 1', 'dialogpaint', false);
  setHTMLElemStyle('animationFillMode', 'forwards', 'dialogpaint', false);
  registerSetTimeout(0.301, function() {
    setHTMLElemStyle('animation', '', 'dialogpaint', false);
  });
  _E6_9B_BF_E6_8D_A2_E5_BC_B9_E6_A1_86_E5_86_85_E6_B2_B9_E7_94_BB_E4_BF_A1_E6_81_AF();
}

// Describe this function...
function _E6_98_BE_E7_A4_BAnavbar() {
  setHTMLElemStyle('display', 'block', ['QUERYSELECTOR', '.navbar'], false);
  setHTMLElemStyle('display', 'flex', ['QUERYSELECTOR', '.navbar'], false);
  setHTMLElemStyle('animation', 'shower 1s 0s ease 1', ['QUERYSELECTOR', '.navbar'], false);
  setHTMLElemStyle('animationFillMode', 'forwards', ['QUERYSELECTOR', '.navbar'], false);
  registerSetTimeout(1, function() {
    setHTMLElemStyle('animation', '', ['QUERYSELECTOR', '.navbar'], false);
  });
}

// Describe this function...
function _E9_9A_90_E8_97_8FNavbar() {
  setHTMLElemStyle('display', 'none', ['QUERYSELECTOR', '.navbar'], false);
}


if ((typeof getUrlData('PARAMS', false) == 'object' && getUrlData('PARAMS', false).hasOwnProperty('scale')) == true) {
  if (featureAvailable('MACOS') || featureAvailable('MOBILE')) {
    setScreenScale(toNumber(dictGet(getUrlData('PARAMS', false), 'scale')) * 2);
  } else {
    setScreenScale(toNumber(dictGet(getUrlData('PARAMS', false), 'scale')));
  }
} else {
  if (featureAvailable('MACOS') || featureAvailable('MOBILE')) {
    setScreenScale(2);
  } else {
    setScreenScale(1);
  }
}
if (featureAvailable('ANDROID') || featureAvailable('IE')) {

  operateAnimation('SET_FRAME', 'Light', 2, null, 'AUTO', 1,
          function() {}, undefined, false);

      } else {

  operateAnimation('SET_FRAME', 'Light', 1, null, 'AUTO', 1,
          function() {}, undefined, false);

      }
appendScene('model/map/map.gltf.xz', 'model/map/map.gltf.xz', false, false, function() {
  setHTMLElemStyle('animation', ['hideer ','0.6','s 0s linear 1'].join(''), 'simple-preloader-background', false);
  setHTMLElemStyle('animationFillMode', 'forwards', 'simple-preloader-background', false);
  registerSetTimeout(1, function() {
    setHTMLElemStyle('display', 'none', 'simple-preloader-background', false);
  });
  assignMat('Map', 'collision_ground');
  tweenCamera('target-camera', 'target-point', 3, function() {}, 0);
}, function() {
  setHTMLElemAttribute('innerHTML', String(toFixedPoint(68 + Math.round(_pGlob.percentage) * 0.32, 1)) + '%', 'preloader-text', false);
}, function() {});

appendScene('model/wall.gltf', 'model/wall.gltf', false, false, function() {
    setHTMLElemStyle('animation', ['hideer ','0.6','s 0s linear 1'].join(''), 'simple-preloader-background', false);
    setHTMLElemStyle('animationFillMode', 'forwards', 'simple-preloader-background', false);
    registerSetTimeout(1, function() {
      setHTMLElemStyle('display', 'none', 'simple-preloader-background', false);
    });
    assignMat('Map', 'collision_ground');
    tweenCamera('target-camera', 'target-point', 3, function() {}, 0);
  }, function() {
    setHTMLElemAttribute('innerHTML', String(toFixedPoint(68 + Math.round(_pGlob.percentage) * 0.32, 1)) + '%', 'preloader-text', false);
  }, function() {});

DeviceInformation = {};
if (featureAvailable('CHROME')) {
  dictSet(DeviceInformation, 'Internet Explorer', 'flase');
} else if (featureAvailable('FIREFOX')) {
  dictSet(DeviceInformation, 'Internet Explorer', 'flase');
} else if (featureAvailable('IE')) {
  dictSet(DeviceInformation, 'Internet Explorer', 'true');
} else if (featureAvailable('EDGE')) {
  dictSet(DeviceInformation, 'Internet Explorer', 'flase');
} else if (featureAvailable('SAFARI')) {
  dictSet(DeviceInformation, 'Internet Explorer', 'flase');
}
if (featureAvailable('TOUCH')) {
  dictSet(DeviceInformation, 'Touch Screen', 'True');
} else {
  dictSet(DeviceInformation, 'Touch Screen', 'False');
}
if (featureAvailable('RETINA')) {
  dictSet(DeviceInformation, 'Retina Display(HiDPI)', 'True');
} else {
  dictSet(DeviceInformation, 'Retina Display(HiDPI)', 'False');
}
if (featureAvailable('HDR')) {
  dictSet(DeviceInformation, 'High Dynamic Range(HDR)', 'True');
} else {
  dictSet(DeviceInformation, 'High Dynamic Range(HDR)', 'False');
}
if (featureAvailable('WEBAUDIO')) {
  dictSet(DeviceInformation, 'Web Audio API', 'True');
} else {
  dictSet(DeviceInformation, 'Web Audio API', 'False');
}
if (featureAvailable('WEBGL2')) {
  dictSet(DeviceInformation, 'WebGL 2.0', 'True');
} else {
  dictSet(DeviceInformation, 'WebGL 2.0', 'False');
}
dictSet(DeviceInformation, 'vendor', getGPU('VENDOR'));
dictSet(DeviceInformation, 'model', getGPU('MODEL'));
dictSet(DeviceInformation, 'time', getDateTime('FULL', true));
dictSet(DeviceInformation, 'item', getHTMLElemAttribute('innerHTML', 'itemID', false));
dictSet(DeviceInformation, 'product', dictGet(getUrlData('PARAMS', false), 'product'));
registerSetTimeout(0.5, function() {
  dictSet(DeviceInformation, 'UserAgent', getJSFunction('ua')());
});

registerSetTimeout(0.6, function() {});


// createPhysicsWorld puzzle

// TEMPORARY MEASURE TO PREVENT CRASH [TODO]
if (window.Ammo) {

var CF_STATIC_OBJECT = 1;
var CF_KINEMATIC_OBJECT = 2;
var CF_NO_CONTACT_RESPONSE = 4;

var ACTIVE_TAG = 1;
var ISLAND_SLEEPING = 2;
var DISABLE_DEACTIVATION = 4;
var DISABLE_SIMULATION = 5;

var RO_XYZ = 0;

// collision filter groups
var DefaultFilter = 1;
var StaticFilter = 2;
var KinematicFilter = 4;
var DebrisFilter = 8;
var SensorTrigger = 16;
var CharacterFilter = 32;
var AllFilter = -1;

if (false) {

    _pGlob.collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
    _pGlob.dispatcher = new Ammo.btCollisionDispatcher(_pGlob.collisionConfiguration);
    _pGlob.broadphase = new Ammo.btDbvtBroadphase();
    _pGlob.solver = new Ammo.btSequentialImpulseConstraintSolver();
    _pGlob.softBodySolver = new Ammo.btDefaultSoftBodySolver();
    _pGlob.world = new Ammo.btSoftRigidDynamicsWorld(_pGlob.dispatcher, _pGlob.broadphase,
            _pGlob.solver, _pGlob.collisionConfiguration, _pGlob.softBodySolver);
    _pGlob.world.getWorldInfo().set_m_gravity(new Ammo.btVector3(0, -9.8, 0));

    _pGlob.softBodyHelpers = new Ammo.btSoftBodyHelpers();

} else {

    _pGlob.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    _pGlob.dispatcher = new Ammo.btCollisionDispatcher(_pGlob.collisionConfiguration);
    _pGlob.broadphase = new Ammo.btDbvtBroadphase();
    _pGlob.solver = new Ammo.btSequentialImpulseConstraintSolver();
    _pGlob.world = new Ammo.btDiscreteDynamicsWorld(_pGlob.dispatcher, _pGlob.broadphase,
            _pGlob.solver, _pGlob.collisionConfiguration);

}

_pGlob.syncList = [];
_pGlob.consList = [];

// internal info
_pGlob.collisionData = [];

// goes to collision callback
_pGlob.collisionInfo = {
    objectA: '',
    objectB: '',
    distance: 0,
    positionOnA: [0, 0, 0],
    positionOnB: [0, 0, 0],
    normalOnB: [0, 0, 0]
};

_pGlob.fps = 60;
_pGlob.transTmp = new Ammo.btTransform();
_pGlob.transTmp2 = new Ammo.btTransform();

_pGlob.world.setGravity( new Ammo.btVector3( 0, -9.8, 0 ) );

// external physics interface
if (v3d.PL) {
    v3d.PL.physics = v3d.PL.physics || {};
    v3d.PL.physics.world = _pGlob.world;
    v3d.PL.physics.bodies = {};
    v3d.PL.physics.constraints = {};
    v3d.PL.physics.addToSyncList = function(obj, body, type) {
        _pGlob.syncList.push({
            obj: obj,
            body: body,
            type: type,
            simulated: true,
            mass: (body.getInvMass() !==0) ? 1.0/body.getInvMass() : 0
        });
        v3d.PL.physics.bodies[obj.name] = body;
    }
    v3d.PL.physics.removeFromSyncList = function(obj, body) {
        _pFindRemovePhysicsBody(obj);
        delete v3d.PL.physics.bodies[obj.name];
    }
}

function tick(dt) {

    var DISTANCE_EPSILON = 0.000001;

    if (_pGlob.collisionData.length) {

        var numManifolds = _pGlob.world.getDispatcher().getNumManifolds();

        for (var i = 0; i < numManifolds; i++) {
            var contactManifold = _pGlob.world.getDispatcher().getManifoldByIndexInternal(i);

            var bodyA = Ammo.castObject(contactManifold.getBody0(), Ammo.btRigidBody);
            var bodyB = Ammo.castObject(contactManifold.getBody1(), Ammo.btRigidBody);

            var collDataMatch = null;
            var objsSwapped = false;

            for (var j = 0; j < _pGlob.collisionData.length; j++) {
                var cd = _pGlob.collisionData[j];

                if (cd.bodyA == bodyA && cd.bodyB == bodyB) {
                    collDataMatch = cd;
                    break;
                }

                if (cd.bodyA == bodyB && cd.bodyB == bodyA) {
                    collDataMatch = cd;
                    objsSwapped = true;
                    break;
                }
            }

            if (!collDataMatch)
                continue;

            var numContacts = contactManifold.getNumContacts();

            for (var j = 0; j < numContacts; j++) {
                var pt = contactManifold.getContactPoint(j);

                if (pt.getDistance() < DISTANCE_EPSILON) {
                    var ptA = pt.getPositionWorldOnA();
                    var ptB = pt.getPositionWorldOnB();
                    var noB = pt.get_m_normalWorldOnB();

                    _pGlob.collisionInfo.objectA = collDataMatch.objA ? getPickedObjectName(collDataMatch.objA) : '';
                    _pGlob.collisionInfo.objectB = collDataMatch.objB ? getPickedObjectName(collDataMatch.objB) : '';

                    _pGlob.collisionInfo.distance = pt.getDistance();

                    if (!objsSwapped) {
                        _pGlob.collisionInfo.positionOnA[0] = ptA.x();
                        _pGlob.collisionInfo.positionOnA[1] = ptA.y();
                        _pGlob.collisionInfo.positionOnA[2] = ptA.z();

                        _pGlob.collisionInfo.positionOnB[0] = ptB.x();
                        _pGlob.collisionInfo.positionOnB[1] = ptB.y();
                        _pGlob.collisionInfo.positionOnB[2] = ptB.z();

                        _pGlob.collisionInfo.normalOnB[0] = noB.x();
                        _pGlob.collisionInfo.normalOnB[1] = noB.y();
                        _pGlob.collisionInfo.normalOnB[2] = noB.z();
                    } else {
                        _pGlob.collisionInfo.positionOnA[0] = ptB.x();
                        _pGlob.collisionInfo.positionOnA[1] = ptB.y();
                        _pGlob.collisionInfo.positionOnA[2] = ptB.z();

                        _pGlob.collisionInfo.positionOnB[0] = ptA.x();
                        _pGlob.collisionInfo.positionOnB[1] = ptA.y();
                        _pGlob.collisionInfo.positionOnB[2] = ptA.z();

                        _pGlob.collisionInfo.normalOnB[0] = -noB.x();
                        _pGlob.collisionInfo.normalOnB[1] = -noB.y();
                        _pGlob.collisionInfo.normalOnB[2] = -noB.z();
                    }

                    collDataMatch.collideCb();

                    // mark as collided all collision data from the same exec instance
                    for (var k = 0; k < _pGlob.collisionData.length; k++) {
                        var cd = _pGlob.collisionData[k];
                        if (cd.execInstanceID == collDataMatch.execInstanceID) {
                            cd.collideFlag = true;
                        }
                    }
                }
            }
        }

        for (var i = 0; i < _pGlob.collisionData.length; i++) {
            var cd = _pGlob.collisionData[i];

            if (!cd.collideFlag) {
                _pGlob.collisionInfo.objectA = '';
                _pGlob.collisionInfo.objectB = '';

                _pGlob.collisionInfo.distance = 0;

                _pGlob.collisionInfo.positionOnA[0] = 0;
                _pGlob.collisionInfo.positionOnA[1] = 0;
                _pGlob.collisionInfo.positionOnA[2] = 0;

                _pGlob.collisionInfo.positionOnB[0] = 0;
                _pGlob.collisionInfo.positionOnB[1] = 0;
                _pGlob.collisionInfo.positionOnB[2] = 0;

                _pGlob.collisionInfo.normalOnB[0] = 0;
                _pGlob.collisionInfo.normalOnB[1] = 0;
                _pGlob.collisionInfo.normalOnB[2] = 0;

                cd.noCollideCb();

                // no need to process other collision data from the same exec instance
                for (var j = i+1; j < _pGlob.collisionData.length; j++) {
                    var cdj = _pGlob.collisionData[j];
                    if (cdj.execInstanceID == cd.execInstanceID) {
                        cdj.collideFlag = true;
                    }
                }
            }

            cd.collideFlag = false;
        }
    }

    _pGlob.world.stepSimulation(dt, 10, 1/60);

    // sync physics and graphics

    for (var i = 0; i < _pGlob.syncList.length; i++) {
        var syncData = _pGlob.syncList[i];
        if (!syncData.simulated)
            continue;

        var body = syncData.body;

        if (syncData.type == 'SOFT_BODY') {

            var geometry = syncData.obj.geometry;
            var volumePositions = geometry.attributes.position.array;
            var volumeNormals = geometry.ammoNeedNormals ? geometry.attributes.normal.array : null;

            var association = geometry.ammoIndexAssociation;
            var numVerts = association.length;
            var nodes = body.get_m_nodes();

            for (var j = 0; j < numVerts; j++) {

                var node = nodes.at(j);

                var nodePos = node.get_m_x();
                var x = nodePos.x();
                var y = nodePos.y();
                var z = nodePos.z();

                if (volumeNormals) {
                    var nodeNormal = node.get_m_n();
                    var nx = nodeNormal.x();
                    var ny = nodeNormal.y();
                    var nz = nodeNormal.z();
                }

                var assocVertex = association[j];

                for (var k = 0, kl = assocVertex.length; k < kl; k++) {

                    var indexVertex = assocVertex[k];
                    volumePositions[indexVertex] = x;
                    if (volumeNormals)
                        volumeNormals[indexVertex] = nx;

                    indexVertex++;
                    volumePositions[indexVertex] = y;
                    if (volumeNormals)
                        volumeNormals[indexVertex] = ny;

                    indexVertex++;
                    volumePositions[indexVertex] = z;
                    if (volumeNormals)
                        volumeNormals[indexVertex] = nz;

                }

            }

            geometry.attributes.position.needsUpdate = true;
            if (volumeNormals)
                geometry.attributes.normal.needsUpdate = true;

            if (geometry.attributes.previous) {
                v3d.MeshLine.updateAttributes(geometry);
            }

        } else if (!body.isStaticOrKinematicObject()) {
            var ms = body.getMotionState();
            if (ms) {
                ms.getWorldTransform(_pGlob.transTmp);
                var p = _pGlob.transTmp.getOrigin();
                var q = _pGlob.transTmp.getRotation();
                // dynamic objects can't be parented to something
                syncData.obj.position.set(p.x(), p.y(), p.z());
                syncData.obj.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }

        } else if (body.isKinematicObject()) {

            var pos = syncData.obj.getWorldPosition(_pGlob.vec3Tmp);
            var quat = syncData.obj.getWorldQuaternion(_pGlob.quatTmp);

            _pGlob.transTmp.setIdentity();
            _pGlob.transTmp.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
            _pGlob.transTmp.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

            body.setWorldTransform(_pGlob.transTmp);

            // needed to calculate interpolated velocity
            body.getMotionState().setWorldTransform(_pGlob.transTmp);

        }
    }

}

appInstance.renderCallbacks.push(tick);
if (v3d.PL.editorRenderCallbacks)
    v3d.PL.editorRenderCallbacks.push([appInstance, tick]);

// END OF TEMPORARY MEASURE TO PREVENT CRASH [TODO]
}


/* 设置地面-用于碰撞 */
createPhysicsBody('STATIC', 'Collision_Ground', 'MESH', 0);
/* 设置胶囊体-用于碰撞 */
createPhysicsBody('DYNAMIC', 'Collision_Body', 'CAPSULE', 1);
/* 用来抵消teleport插件的冲突 */
eventHTMLElem('click', '', false, function(event) {});
registerOnClick('<none>', false, false, [0,1,2], function() {}, function() {});
/* reticle的悬浮状态 */
/* 导入reticle体，获取相机射线与地面的相交点，并将reticle绑定到相交点上 */
eventHTMLElem('pointermove', ['DOCUMENT'], false, function(event) {
  intersections = raycast(getActiveCamera(), getCameraDirection(true, false), 'Collision_Ground');
  if (intersections.length > 0) {
    changeVis('Reticle', true);
    retical_position = dictGet(intersections[0], 'point');
    setObjTransform('Reticle', 'position', getVectorValue(retical_position, 'X'), getVectorValue(retical_position, 'Y'), getVectorValue(retical_position, 'Z') + 0.05, false);
    setObjDirection('Reticle', 0, 0, 0, false, false);
  } else {
    changeVis('Reticle', false);
  }
});
/* 点击reticle或地面，移动后进行视角校正（抬头） */
registerOnClick2(['Reticle', 'Collision_Ground', 'Collision_Ground_Water'], false, false, function() {
  if (String(getActiveCamera()) == 'Camera_FPS') {
    registerSetTimeout(0, function() {
      tweenCamera(retical_position, vectorMath(retical_position, 'ADD', vectorMath(getObjDirection(getActiveCamera(), 'HORIZONTAL'), 'ADD', createVector(0, 0, 0))), 1, function() {}, 0);
    });
  }
}, function() {});

registerOnClick2(['GROUP', 'hua'], false, false, function() {
  if (String(getActiveCamera()) == 'Camera_FPS') {
    registerSetTimeout(0, function() {
      tweenCamera(createVector(dictGet(dictGet(Dict_oilpaint, _pGlob.pickedObject), 'position')[0], dictGet(dictGet(Dict_oilpaint, _pGlob.pickedObject), 'position')[1], dictGet(dictGet(Dict_oilpaint, _pGlob.pickedObject), 'position')[2]), _pGlob.pickedObject, 1, function() {
        console.log(getObjTransform('Camera_FPS', 'position', 'z'));
      }, 0);
    });
  }
}, function() {});
registerOnClick(['ALL_OBJECTS'], false, false, [0,1,2], function() {
  console.log(_pGlob.pickedObject);
}, function() {});

whenMoved(getActiveCamera(), 0.01, function() {}, function() {
  _E5_93_8D_E5_BA_94_E9_9B_B7_E8_BE_BE();
  _E6_A0_B9_E6_8D_AE_E5_B0_84_E7_BA_BF_E6_98_BE_E7_A4_BA_E5_BC_B9_E6_A1_86();
}, function() {
  console.log(getObjTransform(getActiveCamera(), 'position', 'xyz'));
  console.log(getObjTransform(getActiveCamera(), 'rotation', 'z'));
});

State_guide = false;
State_lay = 'Camera_FPS';
State_music = false;
eventHTMLElem('click', 'icon-1', false, function(event) {
  _E8_87_AA_E5_8A_A8_E6_B8_B8_E8_A7_88();
});
eventHTMLElem('click', 'icon-2', false, function(event) {
  _E9_B8_9F_E7_9E_B0_E8_A1_8C_E8_B5_B0_E5_88_87_E6_8D_A2();
});
eventHTMLElem('click', 'icon-3', false, function(event) {
  _E9_9F_B3_E4_B9_90_E5_BC_80_E5_85_B3();
});
eventHTMLElem('click', 'icon-4', false, function(event) {
  setHTMLElemAttribute('className', 'activebtn', 'icon-4', false);
  setHTMLElemStyle('display', 'block', 'dialoginfo', false);
  setHTMLElemStyle('animation', 'shower 0.5s 0s ease 1', 'dialoginfo', false);
  setHTMLElemStyle('animationFillMode', 'forwards', 'dialoginfo', false);
  eventHTMLElem('click', 'dialoginfoexit', false, function(event) {
    setHTMLElemStyle('animation', 'hideer 0.5s 0s ease 1', 'dialoginfo', false);
    setHTMLElemStyle('animationFillMode', 'forwards', 'dialoginfo', false);
    registerSetTimeout(0.5, function() {
      setHTMLElemStyle('display', 'none', 'dialoginfo', false);
      setHTMLElemStyle('animation', '', 'dialoginfo', false);
    });
  });
});

eventHTMLElem('click', 'dialogpaintexit1', false, function(event) {
  setHTMLElemStyle('visibility', 'visible', 'swiperBox', false);
  setHTMLElemStyle('animation', 'hideer 0.3s 0s ease 1', 'swiperBox', false);
  setHTMLElemStyle('animationFillMode', 'forwards', 'swiperBox', false);
  registerSetTimeout(0.301, function() {
    setHTMLElemStyle('visibility', 'hidden', 'swiperBox', false);
    setHTMLElemStyle('animation', '', 'swiperBox', false);
  });
});

eventHTMLElem('click', 'closelist', false, function(event) {
  _E9_9A_90_E8_97_8F_E5_88_97_E8_A1_A8_E5_BC_B9_E7_AA_97();
});
eventHTMLElem('click', 'icon-1-list', false, function(event) {
  _E5_BC_B9_E5_87_BA_E5_88_97_E8_A1_A8_E5_BC_B9_E7_AA_97();
  _E7_82_B9_E5_87_BB_E6_8C_89_E9_92_AE_E2_91_A0_E6_97_B6_E5_A1_AB_E5_85_85_E6_B2_B9_E7_94_BB_E5_88_97_E8_A1_A8();
});
eventHTMLElem('click', 'icon-2-list', false, function(event) {
  _E5_BC_B9_E5_87_BA_E5_88_97_E8_A1_A8_E5_BC_B9_E7_AA_97();
  _E5_A1_AB_E5_85_85_E7_94_BB_E8_AF_B4_E5_85_9A_E5_8F_B2_E5_88_97_E8_A1_A8();
});
eventHTMLElem('click', 'icon-3-list', false, function(event) {
  _E5_BC_B9_E5_87_BA_E5_88_97_E8_A1_A8_E5_BC_B9_E7_AA_97();
  _E5_A1_AB_E5_85_85_E7_B3_BB_E5_88_97_E7_B2_BE_E7_A5_9E();
});
eventHTMLElem('click', 'icon-4-list', false, function(event) {
  _E5_BC_B9_E5_87_BA_E5_88_97_E8_A1_A8_E5_BC_B9_E7_AA_97();
  _E7_99_BE_E5_B9_B4_E6_95_85_E4_BA_8B();
});
/* 关闭油画弹窗 */
eventHTMLElem('click', 'dialogpaintexit', false, function(event) {
  _E5_85_B3_E9_97_AD_E6_B2_B9_E7_94_BB_E5_BC_B9_E7_AA_97();
});
eventHTMLElem('click', 'dialoglist', false, function(event) {
  _E7_82_B9_E5_87_BB_E5_88_97_E8_A1_A8_E5_86_85_E5_AE_B9();
});
eventHTMLElem('click', 'paint-jiangjie', false, function(event) {
  _E8_AE_B2_E8_A7_A3();
});
eventHTMLElem('click', 'paint-chakan', false, function(event) {
  if (paint_object == 'paint-78') {
    showSwiper();
  } else {
    _E6_9F_A5_E7_9C_8B();
  }
});

loadFile('media/oilpaint.json', function() {
  Dict_oilpaint = readJSON(_pGlob.loadedFile);
});

loadFile('media/jingshen.json', function() {
  Dict_jingshen = readJSON(_pGlob.loadedFile);
});

loadFile('media/story.json', function() {
  Dict_story = readJSON(_pGlob.loadedFile);
});

Story_Sounds = false;

State_sounds = false;



} // end of PL.init function

})(); // end of closure

/* ================================ end of code ============================= */
