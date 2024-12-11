/* eslint-disable */

/**
 * Generated by Verge3D Puzzles v.4.8.0
 * Wed, 11 Dec 2024 12:23:57 GMT
 * Prefer not editing this file as your changes may get overridden once Puzzles are saved.
 * Check out https://www.soft8soft.com/docs/manual/en/introduction/Using-JavaScript.html
 * for the information on how to add your own JavaScript to Verge3D apps.
 */
function createPL(v3d = window.v3d) {

// global variables used in the init tab
const _initGlob = {
    percentage: 0,
    output: {
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
        },
    },
};


// global variables/constants used by puzzles' functions
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
_pGlob.openedFileMeta = {};
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();
_pGlob.intervalTimers = {};
_pGlob.customEvents = new v3d.EventDispatcher();
_pGlob.eventListeners = [];
_pGlob.htmlElements = new Set();
_pGlob.materialsCache = new Map();

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
_pGlob.raycasterTmp = new v3d.Raycaster(); // always check visibility

const createPzLib = ({ v3d=null, appInstance=null }) => {
    function getElement(id, isParent=false) {
        let elem;
        if (Array.isArray(id) && id[0] === 'CONTAINER') {
            if (appInstance !== null) {
                elem = appInstance.container;
            } else if (typeof _initGlob !== 'undefined') {
                // if we are on the initialization stage, we still can have access
                // to the container element
                const contId = _initGlob.container;
                elem = isParent ? parent.document.getElementById(contId)
                        : document.getElementById(contId);
            }
        } else if (Array.isArray(id) && id[0] === 'WINDOW') {
            elem = isParent ? parent : window;
        } else if (Array.isArray(id) && id[0] === 'DOCUMENT') {
            elem = isParent ? parent.document : document;
        } else if (Array.isArray(id) && id[0] === 'BODY') {
            elem = isParent ? parent.document.body : document.body;
        } else if (Array.isArray(id) && id[0] === 'QUERYSELECTOR') {
            elem = isParent ? parent.document.querySelector(id)
                    : document.querySelector(id);
        } else {
            elem = isParent ? parent.document.getElementById(id)
                    : document.getElementById(id);
        }
        return elem;
    }
        
    function transformCoordsSpace(coords, spaceFrom, spaceTo, noSignChange=false) {
    
        if (spaceFrom === spaceTo) {
            return coords;
        }
    
        const y = coords.y;
        const z = coords.z;
    
        if (spaceFrom === 'Z_UP_RIGHT' && spaceTo === 'Y_UP_RIGHT') {
            coords.y = z;
            coords.z = noSignChange ? y : -y;
        } else if (spaceFrom === 'Y_UP_RIGHT' && spaceTo === 'Z_UP_RIGHT') {
            coords.y = noSignChange ? z : -z;
            coords.z = y;
        } else {
            console.error('transformCoordsSpace: Unsupported coordinate space');
        }
    
        return coords;
    }
        
    const transformEulerV3dToBlenderShortest = function() {
        const eulerTmp = new v3d.Euler();
        const eulerTmp2 = new v3d.Euler();
        const vec3Tmp = new v3d.Vector3();
    
        return function(euler, dest) {
            const eulerBlender = eulerTmp.copy(euler).reorder('YZX');
            const eulerBlenderAlt = eulerTmp2.copy(eulerBlender).makeAlternative();
    
            const len = vec3Tmp.setFromEuler(eulerBlender).lengthSq();
            const lenAlt = vec3Tmp.setFromEuler(eulerBlenderAlt).lengthSq();
    
            dest.copy(len < lenAlt ? eulerBlender : eulerBlenderAlt);
            return transformCoordsSpace(dest, 'Y_UP_RIGHT', 'Z_UP_RIGHT');
        }
    }();
        
    function getSceneCoordSystem() {
        const scene = appInstance.scene;
        if (scene && 'coordSystem' in scene.userData) {
            return scene.userData.coordSystem;
        }
    
        return 'Y_UP_RIGHT';
    }
        
    function isObjectWorthProcessing(obj) {
        return obj.type !== 'AmbientLight' && obj.name !== '' &&
                !(obj.isMesh && obj.isMaterialGeneratedMesh) &&
                !obj.isAuxClippingMesh;
    }
        
    function getObjectByName(objName) {
        let objFound = null;
    
        const pGlobAvailable = _pGlob !== undefined;
        if (pGlobAvailable && objName in _pGlob.objCache) {
            objFound = _pGlob.objCache[objName] || null;
        }
    
        if (objFound && objFound.name === objName) {
            return objFound;
        }
    
        if (appInstance.scene) {
            appInstance.scene.traverse(obj => {
                if (!objFound && isObjectWorthProcessing(obj) && (obj.name === objName)) {
                    objFound = obj;
                    if (pGlobAvailable) {
                        _pGlob.objCache[objName] = objFound;
                    }
                }
            });
        }
        return objFound;
    }
        
    function getObjectNamesByGroupName(groupName) {
        const objNameList = [];
        appInstance.scene.traverse(obj => {
            if (isObjectWorthProcessing(obj)) {
                const objGroupNames = obj.groupNames;
                if (!objGroupNames) {
                    return;
                }
    
                for (let i = 0; i < objGroupNames.length; i++) {
                    const objGroupName = objGroupNames[i];
                    if (objGroupName === groupName) {
                        objNameList.push(obj.name);
                    }
                }
            }
        });
        return objNameList;
    }
        
    function getAllObjectNames() {
        const objNameList = [];
        appInstance.scene.traverse(obj => {
            if (isObjectWorthProcessing(obj)) {
                objNameList.push(obj.name);
            }
        });
        return objNameList;
    }
        
    function retrieveObjectNamesAccum(currObjNames, namesAccum) {
        if (typeof currObjNames === 'string') {
            namesAccum.push(currObjNames);
        } else if (Array.isArray(currObjNames) && currObjNames[0] === 'GROUP') {
            const newObjNames = getObjectNamesByGroupName(currObjNames[1]);
            for (let i = 0; i < newObjNames.length; i++) {
                namesAccum.push(newObjNames[i]);
            }
        } else if (Array.isArray(currObjNames) && currObjNames[0] === 'ALL_OBJECTS') {
            const newObjNames = getAllObjectNames();
            for (let i = 0; i < newObjNames.length; i++) {
                namesAccum.push(newObjNames[i]);
            }
        } else if (Array.isArray(currObjNames)) {
            for (let i = 0; i < currObjNames.length; i++) {
                retrieveObjectNamesAccum(currObjNames[i], namesAccum);
            }
        }
    }
        
    function retrieveObjectNames(objNames) {
        const accum = [];
        retrieveObjectNamesAccum(objNames, accum);
        return accum.filter(name => name !== '');
    }
        
    function RotationInterface() {
        /**
         * @ignore
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
            if (obj.userData.puzzles === undefined) {
                obj.userData.puzzles = {}
            }
            if (obj.userData.puzzles.rotationInterface === undefined) {
                obj.userData.puzzles.rotationInterface = new RotationInterface();
            }
    
            const rotUI = obj.userData.puzzles.rotationInterface;
            rotUI.updateFromObject(obj);
            return rotUI;
        },
    });
    
    Object.assign(RotationInterface.prototype, {
        updateFromObject: function(obj) {
            const SYNC_ROT_EPS = 1e-8;
    
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
            const order = this._userRotation.order;
            this._userRotation.copy(this._actualRotation).reorder(order);
        },
    
        _updateActualRotFromUserRot: function() {
            const order = this._actualRotation.order;
            this._actualRotation.copy(this._userRotation).reorder(order);
        },
    });
        
    function areListenersSame(target0, type0, listener0, optionsOrUseCapture0,
            target1, type1, listener1, optionsOrUseCapture1) {
        const capture0 = Boolean(optionsOrUseCapture0 instanceof Object
                ? optionsOrUseCapture0.capture : optionsOrUseCapture0);
        const capture1 = Boolean(optionsOrUseCapture1 instanceof Object
                ? optionsOrUseCapture1.capture : optionsOrUseCapture1);
        return target0 === target1 && type0 === type1 && listener0 === listener1
                && capture0 === capture1;
    }
        
    function bindListener(target, type, listener, optionsOrUseCapture) {
        const alreadyExists = _pGlob.eventListeners.some(elem => {
            return areListenersSame(elem.target, elem.type, elem.listener,
                    elem.optionsOrUseCapture, target, type, listener,
                    optionsOrUseCapture);
        });
    
        if (!alreadyExists) {
            target.addEventListener(type, listener, optionsOrUseCapture);
            _pGlob.eventListeners.push({ target, type, listener,
                    optionsOrUseCapture });
        }
    }
        
    function getMaterialEditableTextures(matName, collectSameNameMats=false) {
        let mats = [];
        if (collectSameNameMats) {
            mats = v3d.SceneUtils.getMaterialsByName(appInstance, matName);
        } else {
            const firstMat = v3d.SceneUtils.getMaterialByName(appInstance, matName);
            if (firstMat !== null) {
                mats = [firstMat];
            }
        }
    
        const textures = mats.reduce((texArray, mat) => {
            let matTextures = [];
            switch (mat.type) {
                case 'MeshNodeMaterial':
                    matTextures = Object.values(mat.nodeTextures);
                    break;
    
                case 'MeshStandardMaterial':
                    matTextures = [
                        mat.map, mat.lightMap, mat.aoMap, mat.emissiveMap,
                        mat.bumpMap, mat.normalMap, mat.displacementMap,
                        mat.roughnessMap, mat.metalnessMap, mat.alphaMap, mat.envMap
                    ];
                    break;
    
                default:
                    console.error('getMaterialEditableTextures: Unknown material type '
                            + mat.type);
                    break;
            }
    
            Array.prototype.push.apply(texArray, matTextures);
            return texArray;
        }, []);
    
        return textures.filter(elem => {
            // check Texture type exactly
            return elem && (elem.constructor === v3d.Texture
                    || elem.constructor === v3d.CompressedTexture
                    || elem.constructor === v3d.DataTexture
                    || elem.constructor === v3d.CanvasTexture
                    || elem.constructor === v3d.VideoTexture);
        });
    }
        
    function replaceMaterialEditableTexture(mat, oldTex, newTex) {
        if (v3d.MaterialUtils.replaceTexture) {
            v3d.MaterialUtils.replaceTexture(mat, oldTex, newTex);
            return;
        }
    
        // COMPAT: <4.8, had no replaceTexture() method
        switch (mat.type) {
            case 'MeshNodeMaterial':
                // NOTE: replace in node graph as well since it's possible to texture get lost
                // after updateNodeGraph()
                mat.traverseNodes(node => {
                    if (node.originData.texture === oldTex)
                        node.originData.texture = newTex;
                });
    
                for (const name in mat.nodeTextures) {
                    if (mat.nodeTextures[name] === oldTex) {
                        mat.nodeTextures[name] = newTex;
                    }
                }
                break;
    
            case 'MeshStandardMaterial':
                const texNames = ['map', 'lightMap', 'aoMap', 'emissiveMap',
                        'bumpMap', 'normalMap', 'displacementMap', 'roughnessMap',
                        'metalnessMap', 'alphaMap', 'envMap'];
    
                texNames.forEach(name => {
                    if (mat[name] === oldTex) {
                        mat[name] = newTex;
                    }
                });
                break;
    
            default:
                console.error('replaceMaterialEditableTexture: Unsupported material type '
                        + mat.type);
                break;
        }
    
        // inherit some save params
        newTex.encoding = oldTex.encoding;
        newTex.wrapS = oldTex.wrapS;
        newTex.wrapT = oldTex.wrapT;
    }

    return {
        getElement, transformCoordsSpace, transformEulerV3dToBlenderShortest, getSceneCoordSystem,
        getObjectByName, retrieveObjectNames, RotationInterface, bindListener,
        getMaterialEditableTextures, replaceMaterialEditableTexture,
    };
};

var PL = {};



// backward compatibility
if (v3d[Symbol.toStringTag] !== 'Module') {
    v3d.PL = v3d.puzzles = PL;
}

PL.procedures = PL.procedures || {};




PL.execInitPuzzles = function(options) {
    // always null, should not be available in "init" puzzles
    var appInstance = null;
    // app is more conventional than appInstance (used in exec script and app templates)
    var app = null;

    const PzLib = createPzLib({ v3d });

    // provide the container's id to puzzles that need access to the container
    _initGlob.container = options !== undefined && 'container' in options
            ? options.container : "";

    

    
    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {

// app is more conventional than appInstance (used in exec script and app templates)
var app = appInstance;

const PzLib = createPzLib({ v3d, appInstance });

initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}



var PROC = {
    
};

var VARS = Object.defineProperties({}, {
    'RX': { get: function() { return RX; }, set: function(val) { RX = val; } },
    'RZ': { get: function() { return RZ; }, set: function(val) { RZ = val; } },
    'X': { get: function() { return X; }, set: function(val) { X = val; } },
    'Y': { get: function() { return Y; }, set: function(val) { Y = val; } },
});

var RX, RZ, X, Y;

function setScreenScale(factor) {

    // already have maximum pixel ratio in HiDPI mode
    if (!appInstance.useHiDPIRenderPass)
        appInstance.renderer.setPixelRatio(factor);

    if (appInstance.postprocessing)
        appInstance.postprocessing.composer.setPixelRatio(factor);

    // to update possible post-processing passes
    appInstance.onResize();
}

// addHTMLElement puzzle
function addHTMLElement(elemType, id, mode, targetId, isParent) {
    const win = isParent ? window.parent : window;

    const elem = win.document.createElement(elemType);
    if (id !== '')
        elem.id = id;

    const targetElem = PzLib.getElement(targetId, isParent);
    if (targetElem instanceof win.Element) {
        switch (mode) {
            case 'TO':
                targetElem.appendChild(elem);
                break;
            case 'BEFORE':
                targetElem.insertAdjacentElement('beforebegin', elem);
                break;
            case 'AFTER':
                targetElem.insertAdjacentElement('afterend', elem);
                break;
        }

        _pGlob.htmlElements.add(elem);
    }
}

// setObjTransform puzzle
function setObjTransform(objSelector, isWorldSpace, mode, vector, offset){
    var x = vector[0];
      var y = vector[1];
      var z = vector[2];

    var objNames = PzLib.retrieveObjectNames(objSelector);

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
        coords.multiplyScalar(v3d.MathUtils.DEG2RAD);
    }

    var coordSystem = PzLib.getSceneCoordSystem();

    PzLib.transformCoordsSpace(inputsUsed, coordSystem, 'Y_UP_RIGHT', true);
    PzLib.transformCoordsSpace(coords, coordSystem, 'Y_UP_RIGHT', mode === 'scale');

    for (var i = 0; i < objNames.length; i++) {

        var objName = objNames[i];
        if (!objName) continue;

        var obj = PzLib.getObjectByName(objName);
        if (!obj) continue;

        if (isWorldSpace && obj.parent) {
            obj.matrixWorld.decomposeE(obj.position, obj.rotation, obj.scale);

            if (inputsUsed.x) setObjProp(obj, "x", coords.x);
            if (inputsUsed.y) setObjProp(obj, "y", coords.y);
            if (inputsUsed.z) setObjProp(obj, "z", coords.z);

            obj.matrixWorld.composeE(obj.position, obj.rotation, obj.scale);
            obj.matrix.multiplyMatrices(_pGlob.mat4Tmp.copy(obj.parent.matrixWorld).invert(), obj.matrixWorld);
            obj.matrix.decompose(obj.position, obj.quaternion, obj.scale);

        } else if (mode === 'rotation' && coordSystem == 'Z_UP_RIGHT') {
            // Blender/Max coordinates

            // need all the rotations for order conversions, especially if some
            // inputs are not specified
            var euler = PzLib.transformEulerV3dToBlenderShortest(obj.rotation,
                    _pGlob.eulerTmp);
            PzLib.transformCoordsSpace(euler, coordSystem, 'Y_UP_RIGHT');

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

            var rotUI = PzLib.RotationInterface.initObject(obj);
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

// applyObjLocalTransform puzzle
function applyObjLocalTransform(objSelector, mode, vector) {

    var objNames = PzLib.retrieveObjectNames(objSelector);
    var x = vector[0] || 0;
      var y = vector[1] || 0;
      var z = vector[2] || 0;

    var defValue = mode == "scale" ? 1 : 0;
    if (typeof x != "number") x = defValue;
    if (typeof y != "number") y = defValue;
    if (typeof z != "number") z = defValue;

    var coords = PzLib.transformCoordsSpace(_pGlob.vec3Tmp.set(x, y, z),
            PzLib.getSceneCoordSystem(), 'Y_UP_RIGHT', mode == 'scale');

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        if (!objName) continue;

        var obj = PzLib.getObjectByName(objName);
        if (!obj) continue;

        // don't transform values for cameras, their local space happens
        // to be the same as for Blender/Max cameras, bcz their different
        // rest orientation balances difference in coordinate systems
        var useTransformed = !obj.isCamera;
        var xVal = useTransformed ? coords.x : x;
        var yVal = useTransformed ? coords.y : y;
        var zVal = useTransformed ? coords.z : z;

        switch (mode) {
        case "position":
            if (_pGlob.xrSessionAcquired && obj.isCamera) {
                v3d.WebXRUtils.translateVRCamera(obj, _pGlob.AXIS_X, xVal);
                v3d.WebXRUtils.translateVRCamera(obj, _pGlob.AXIS_Y, yVal);
                v3d.WebXRUtils.translateVRCamera(obj, _pGlob.AXIS_Z, zVal);
            } else {
                obj.translateX(xVal);
                obj.translateY(yVal);
                obj.translateZ(zVal);
            }
            break;
        case "rotation":
            if (_pGlob.xrSessionAcquired && obj.isCamera) {
                v3d.WebXRUtils.rotateVRCamera(obj, _pGlob.AXIS_X, v3d.MathUtils.degToRad(xVal));
                v3d.WebXRUtils.rotateVRCamera(obj, _pGlob.AXIS_Y, v3d.MathUtils.degToRad(yVal));
                v3d.WebXRUtils.rotateVRCamera(obj, _pGlob.AXIS_Z, v3d.MathUtils.degToRad(zVal));
            } else {
                obj.rotateX(v3d.MathUtils.degToRad(xVal));
                obj.rotateY(v3d.MathUtils.degToRad(yVal));
                obj.rotateZ(v3d.MathUtils.degToRad(zVal));
            }
            break;
        case "scale":
            obj.scale.x *= xVal;
            obj.scale.y *= yVal;
            obj.scale.z *= zVal;
            break;
        }

        obj.updateMatrixWorld(true);
    }
}

// everyFrame puzzle
function registerEveryFrame(callback) {
    if (typeof callback == 'function') {
        appInstance.renderCallbacks.push(callback);
        if (PL.editorRenderCallbacks)
            PL.editorRenderCallbacks.push([appInstance, callback]);
    }
}

// replaceTexture puzzle
function replaceTexture(matName, texName, texUrlOrElem, doCb) {

    const textures = PzLib.getMaterialEditableTextures(matName, true).filter(function(elem) {
        return elem.name == texName;
    });

    if (!textures.length)
        return;

    const mats = v3d.SceneUtils.getMaterialsByName(appInstance, matName);

    if (texUrlOrElem instanceof Promise) {

        texUrlOrElem.then(function(response) {
           processImageUrl(response);
        }, function(error) {});

    } else if (typeof texUrlOrElem == 'string') {

        processImageUrl(texUrlOrElem);

    /**
     * NOTE: not checking for the PzLib.MediaHTML5 constructor, because otherwise this
     * puzzle would always provide the code that's not needed most of the time
     */
    } else if (texUrlOrElem instanceof Object && texUrlOrElem.source
            instanceof HTMLVideoElement) {

        processVideo(texUrlOrElem.source);

    } else if (texUrlOrElem instanceof HTMLCanvasElement) {

        processCanvas(texUrlOrElem);

    } else {

        return;

    }

    function processImageUrl(url) {

        const isHDR = (url.search(/\.hdr$/) > 0);
        const isComp = (url.search(/\.ktx2/) > 0);

        let isCompOld = false;
        let isVideoOld = false;
        textures.forEach(function(elem) {
            if (elem.isCompressedTexture)
                isCompOld = true;
            if (elem.isVideoTexture)
                isVideoOld = true;
        });

        let loader;

        if (!isHDR && !isComp && !isCompOld && !isVideoOld) {
            loader = new v3d.ImageLoader();
            loader.setCrossOrigin('Anonymous');
        } else if (isComp) {
            loader = appInstance.loader.ktx2Loader;
            loader.setCrossOrigin('Anonymous');
        } else if (isCompOld || isVideoOld) {
            loader = new v3d.TextureLoader();
            loader.setCrossOrigin('Anonymous');
        } else {
            loader = new v3d.FileLoader();
            loader.setResponseType('arraybuffer');
        }

        loader.load(url, function(loadedData) {

            textures.forEach(function(elem) {

                elem.dispose();

                if (!isHDR && !isComp && !isCompOld && !isVideoOld) {

                    elem.image = loadedData;

                } else if (isComp || isCompOld || isVideoOld) {

                    mats.forEach(function(mat) {
                        loadedData.flipY = false;
                        loadedData.name = texName;
                        PzLib.replaceMaterialEditableTexture(mat, elem, loadedData);
                        mat.needsUpdate = true;
                    });

                } else {

                    // parse loaded HDR buffer
                    var rgbeLoader = new v3d.RGBELoader();
                    var texData = rgbeLoader.parse(loadedData);

                    elem.image = {
                        data: texData.data,
                        width: texData.width,
                        height: texData.height
                    }

                    elem.magFilter = v3d.LinearFilter;
                    elem.minFilter = v3d.LinearFilter;
                    elem.generateMipmaps = false;
                    elem.isDataTexture = true;
                }

                // update world material if it is using this texture
                if (appInstance.scene !== null && appInstance.scene.worldMaterial !== null) {
                    var wMat = appInstance.scene.worldMaterial;
                    for (let texName in wMat.nodeTextures) {
                        if (wMat.nodeTextures[texName] == elem) {
                            appInstance.updateEnvironment(wMat);
                        }
                    }
                }
            });

            // exec once
            doCb();

        });
    }

    function processVideo(elem) {
        const videoTex = new v3d.VideoTexture(elem);
        videoTex.flipY = false;
        videoTex.name = texName;

        let videoAssigned = false;

        var mats = v3d.SceneUtils.getMaterialsByName(appInstance, matName);
        mats.forEach(function(mat) {

            textures.forEach(function(tex) {
                PzLib.replaceMaterialEditableTexture(mat, tex, videoTex);
            });

            mat.needsUpdate = true;
            // HACK: to assign new encoding in nodes, workaround for https://crbug.com/1256340
            // HACK: preserve links to uniform arrays which got replaced in updateNodeGraph()
            if (mat.isMeshNodeMaterial) {
                const nodeRGBArrSave = mat.nodeRGBArr;
                const nodeValueSave = mat.nodeValue;
                mat.updateNodeGraph();
                mat.nodeRGBArr = nodeRGBArrSave;
                mat.nodeValue = nodeValueSave;
            }

            videoAssigned = true;
        });

        if (videoAssigned) {
            if (elem.readyState < 1) {
                PzLib.bindListener(elem, 'loadedmetadata', doCb);
            } else {
                doCb();
            }
        }

    }

    function processCanvas(elem) {
        const canvasTex = new v3d.CanvasTexture(elem);
        canvasTex.flipY = false;
        canvasTex.name = texName;

        let canvasAssigned = false;

        var mats = v3d.SceneUtils.getMaterialsByName(appInstance, matName);
        mats.forEach(function(mat) {

            textures.forEach(function(tex) {
                PzLib.replaceMaterialEditableTexture(mat, tex, canvasTex);
            });

            mat.needsUpdate = true;
            canvasAssigned = true;
        });

        if (canvasAssigned) {

            if (PL) {
                PL.canvasTextures = PL.canvasTextures || {};
                PL.canvasTextures[canvasTex.image.id] = canvasTex;
            }

            doCb();
        }

    }
}

// loadScene puzzle
function loadScene(url, sceneName, loadCb, progCb, errorCb) {

    appInstance.unload();

    // clean object cache
    _pGlob.objCache = {};

    _pGlob.percentage = 0;
    appInstance.loadScene(url, function(loadedScene) {
        appInstance.enableControls();
        loadedScene.name = sceneName;

        _pGlob.percentage = 100;
        loadCb();
    }, function(percentage) {
        _pGlob.percentage = percentage;
        progCb();
    }, errorCb);
}


setScreenScale(window.devicePixelRatio);
addHTMLElement('div', 'joystick-left', 'TO', ['CONTAINER'], false);
addHTMLElement('div', 'joystick-right', 'TO', ['CONTAINER'], false);

Function('app', 'v3d', 'puzzles', 'VARS', 'PROC', (('// 定义速度因子' + '\n' +
'var speed = 1;' + '\n' +
'' + '\n' +
'// 定义弹簧系统参数' + '\n' +
'var springConfig = {' + '\n' +
'    stiffness: 0.01,  // 弹簧刚度' + '\n' +
'    damping: 0.1,     // 阻尼系数' + '\n' +
'};' + '\n' +
'' + '\n' +
'// 定义当前状态和目标状态' + '\n' +
'var currentState = {' + '\n' +
'    moveX: 0,' + '\n' +
'    moveY: 0,' + '\n' +
'    moveDirectionX: 0,' + '\n' +
'    moveDirectionZ: 0' + '\n' +
'};' + '\n' +
'' + '\n' +
'var targetState = {' + '\n' +
'    moveX: 0,' + '\n' +
'    moveY: 0,' + '\n' +
'    moveDirectionX: 0,' + '\n' +
'    moveDirectionZ: 0' + '\n' +
'};' + '\n' +
'' + '\n' +
'// 创建左侧操控器' + '\n' +
'var joystickLeft = nipplejs.create({' + '\n' +
'    zone: document.getElementById(\'joystick-left\'),' + '\n' +
'    mode: \'static\',' + '\n' +
'    position: { bottom: \'100px\',left:\'100px\'},' + '\n' +
'    color: \'white\',' + '\n' +
'    size: 150' + '\n' +
'});' + '\n' +
'' + '\n' +
'' + '\n' +
'// 控制移动的方向' + '\n' +
'joystickLeft.on(\'move\', function(evt, data) {' + '\n' +
'    var angle = data.angle.radian;' + '\n' +
'    targetState.moveX = Math.cos(angle) * speed;' + '\n' +
'    targetState.moveY = -Math.sin(angle) * speed;' + '\n' +
'});' + '\n' +
'' + '\n' +
'joystickLeft.on(\'end\', function() {' + '\n' +
'    targetState.moveX = 0;' + '\n' +
'    targetState.moveY = 0;' + '\n' +
'});' + '\n' +
'' + '\n' +
'' + '\n' +
'' + '\n' +
'' + '\n' +
'// 弹簧阻尼系统更新函数' + '\n' +
'function updateSpringDamper() {' + '\n' +
'    // 更新移动状态' + '\n' +
'    currentState.moveX += (targetState.moveX - currentState.moveX) * springConfig.stiffness;' + '\n' +
'    currentState.moveY += (targetState.moveY - currentState.moveY) * springConfig.stiffness;' + '\n' +
'' + '\n' +
'    ' + '\n' +
'    // 应用阻尼' + '\n' +
'    currentState.moveX *= (1 - springConfig.damping);' + '\n' +
'    currentState.moveY *= (1 - springConfig.damping);' + '\n' +
'' + '\n' +
'    ' + '\n' +
'    // 更新全局变量' + '\n' +
'    window.moveX = currentState.moveX;' + '\n' +
'    window.moveY = currentState.moveY;' + '\n' +
'' + '\n' +
'    ' + '\n' +
'    // 继续下一帧更新' + '\n' +
'    requestAnimationFrame(updateSpringDamper);' + '\n' +
'}' + '\n' +
'' + '\n' +
'// 启动弹簧阻尼系统' + '\n' +
'updateSpringDamper();' + '\n' +
'')))(appInstance, v3d, PL, VARS, PROC);

registerEveryFrame(function() {

  Function('app', 'v3d', 'puzzles', 'VARS', 'PROC', (('VARS[\'X\'] = window.moveX;' + '\n' +
  'VARS[\'Y\'] = window.moveY;' + '\n' +
  'VARS[\'RZ\'] = window.moveDirectionZ;' + '\n' +
  'VARS[\'RX\'] = window.moveDirectionX;')))(appInstance, v3d, PL, VARS, PROC);

  setObjTransform('Camera', false, 'rotation', [RX, '', RZ], true);
  applyObjLocalTransform('Camera', 'position', [X, '', Y]);
  setObjTransform('Camera', false, 'position', ['', '', 1.8], false);
});

loadScene('meishuguan.glb.xz', 'meishuguan.glb.xz', function() {
  replaceTexture('collones_mtl', 'collones_difuse_l.jpg', 'hight/collones_difuse_h.jpg', function() {});
  replaceTexture('pictures_mtl', 'pictures_difuse_l.jpg', 'hight/pictures_difuse_h.jpg', function() {});
  replaceTexture('collones_walls_mtl', 'collones_walls_difuse_l.jpg', 'hight/collones_walls_difuse_h.jpg', function() {});
  replaceTexture('conc_long_mat', 'conc_long_mesh_l.jpg', 'hight/conc_long_mesh_h.jpg', function() {});
  replaceTexture('concsmall_mat', 'concsmall_difuse_l.jpg', 'hight/concsmall_difuse_h.jpg', function() {});
  replaceTexture('door_mat.001', 'door_difuse_l.jpg.001', 'hight/door_difuse_h.jpg', function() {});
  replaceTexture('door+proem_mat.001', 'door_proev_difuse_l.jpg.001', 'hight/door_proev_difuse_h.jpg', function() {});
  replaceTexture('floor_mtl', 'floor_low_difuse_l.jpg', 'hight/floor_low_difuse_h.jpg', function() {});
  replaceTexture('in_walls_mtl', 'walls_in_difuse_l.jpg', 'hight/walls_in_difuse_h.jpg', function() {});
  replaceTexture('switcher_mat', 'offer_difudse_l.jpg', 'hight/offer_difudse_h.jpg', function() {});
  replaceTexture('opening_mtl', 'opening_difuse_l.jpg', 'hight/opening_difuse_h.jpg', function() {});
  replaceTexture('plintus_floor_mtl', 'plintus_difuse_l.jpg', 'hight/plintus_difuse_h.jpg', function() {});
  replaceTexture('plint_up_mat', 'plint_up_difuse_l.jpg', 'hight/plint_up_difuse_h.jpg', function() {});
  replaceTexture('radiator_mtl', 'radiator_low_difuse_l.jpg', 'hight/radiator_low_difuse_h.jpg', function() {});
  replaceTexture('windows_rama_mat.001', 'windows_rama_difuse_l.jpg.001', 'hight/windows_rama_difuse_h.jpg', function() {});
  replaceTexture('podokon_mat.001', 'windows_pod_difuse_l.jpg.001', 'hight/windows_pod_difuse_h.jpg', function() {});
  replaceTexture('open_win_mesh.001', 'open_win_ difuse_l.jpg.001', 'hight/open_win_ difuse_h.jpg', function() {});
}, function() {}, function() {});



} // end of PL.init function

PL.disposeListeners = function() {
    if (_pGlob) {
        _pGlob.eventListeners.forEach(({ target, type, listener, optionsOrUseCapture }) => {
            target.removeEventListener(type, listener, optionsOrUseCapture);
        });
        _pGlob.eventListeners.length = 0;
    }
}

PL.disposeHTMLElements = function() {
    if (_pGlob) {
        _pGlob.htmlElements.forEach(elem => {
            elem.remove();
        });
        _pGlob.htmlElements.clear();
    }
}

PL.disposeMaterialsCache = function() {
    if (_pGlob) {
        for (const mat of _pGlob.materialsCache.values()) {
            mat.dispose();
        }
        _pGlob.materialsCache.clear();
    }
}

PL.dispose = function() {
    PL.disposeListeners();
    PL.disposeHTMLElements();
    PL.disposeMaterialsCache();
    _pGlob = null;
    // backward compatibility
    if (v3d[Symbol.toStringTag] !== 'Module') {
        delete v3d.PL;
        delete v3d.puzzles;
    }
}



return PL;

}

export { createPL };
