//加载三维模块，手势控制三维模块的旋转等
module("/libs/vizengine_pano.js",function () {
    //引用vizengine框架
    var Object = com.vizengine.core.Object;
    var View = com.vizengine.view.View;
    var PanGestureDetector = com.vizengine.gesture.PanGestureDetector;
    var SweepGestureDetector = com.vizengine.gesture.SweepGestureDetector;
    var PinchGestureDetector = com.vizengine.gesture.PinchGestureDetector;
    var Animation = com.vizengine.animation.Animation;
    var DecelerateInterpolator = com.vizengine.animation.DecelerateInterpolator;


    /*
     * 目前3维引擎依赖了web的three.js库
     * 暂时只支持web版本，不支持移动端原生环境。
     */
    if(com.vizengine.core.Platform.vizengineMobile) {

    }

    //自定义动画
    var CameraMoveAnimation = Animation.extend({
        init: function (modelGestureController) {
            Animation.prototype.init.apply(this,arguments);
            this.modelGetureController = modelGestureController;
            this.fromX = 0;
            this.fromY = 0;
            this.fromZ = 0;
            this.toX = 0;
            this.toY = 0;
            this.toZ = 0;
        },
        animateFrame: function (view, progress) {
            var x = this.fromX + (this.toX - this.fromX) * progress;
            var y = this.fromY + (this.toY - this.fromY) * progress;
            var z = this.fromZ + (this.toZ - this.fromZ) * progress;
            this.modelGetureController.setCameraPosition(x, y, z);
        }
    });
    var SceneScaleAnimation = Animation.extend({
        init: function (modelGestureController) {
            Animation.prototype.init.apply(this,arguments);
            this.modelGestureController = modelGestureController;
            this.fromDistance = 0;
            this.toDistance = 0;
        },
        animateFrame: function (view, progress) {
            var distance = this.fromDistance + (this.toDistance - this.fromDistance) * progress;
            this.modelGestureController._setDistance(distance);
        }
    });
    var SceneFlyAnimation = Animation.extend({
        init: function (modelGestureController) {
            Animation.prototype.init.apply(this,arguments);
            this.modelGestureController = modelGestureController;
            this.fromHeading = 0;
            this.fromPitch = 0;
            this.toHeading = 0;
            this.toPitch = 0;
            this.fromRoll = 0;
            this.toRoll = 0;
        },
        animateFrame: function (view, progress) {
            var heading = this.fromHeading + (this.toHeading - this.fromHeading) * progress;
            this.modelGestureController._setHeading(heading);
            var pitch = this.fromPitch + (this.toPitch - this.fromPitch) * progress;
            this.modelGestureController._setPitch(pitch);
        }
    });


    //模型
    var Bound = Object.extend({
        init: function () {
            Object.prototype.init.apply(this,arguments);
            this.min = new THREE.Vector3();
            this.max = new THREE.Vector3();
        },
        getWidth: function () {
            return this.max.x - this.min.x;
        },
        getHeight: function () {
            return this.max.y - this.min.y;
        },
        getTall: function () {
            return this.max.z - this.min.z;
        },
        getCenter: function () {
            var center = new THREE.Vector3();
            center.x = (this.min.x + this.max.x) / 2;
            center.y = (this.min.y + this.max.y) / 2;
            center.z = (this.min.z + this.max.z) / 2;
            return center;
        },
        getRadius: function () {
            return this.max.distanceTo(this.min) / 2;
        }
    });

    //模型加载的层级
    var Index = function () {
        this.level = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
    };

    Index.prototype.getPath = function() {
        return this.level + "/" + this.x + "_" + this.y + "_" + this.z;
    }

    /**
     * 用于生成调试用的纹理
     */
    var createBoxTexture = function (text) {
        var width = 256;
        var height = 256;
        var element = document.createElement("canvas");
        var canvas = element.getContext("2d");
        element.width = width;
        element.height = height;

        canvas.strokeStyle = "#FF0000";
        canvas.rect(0, 0, width, height);
        canvas.lineWidth = 2;
        canvas.stroke();


        canvas.fillStyle = "#FF0000";
        canvas.font = "26px regular";
        canvas.textBaseline = "top";
        canvas.fillText(text, 10, 10);

        var image = new Image();
        image.src = element.toDataURL("image/png");
        return image;
    };

    // 用于控制并发加载模型的任务
    var LoadingQueue = function(){
        this.taskQueue = [];
        this.addTask = function(task) {
            this.taskQueue.push(task);
            this.processTask();
        };
        this.runningTaskCount = 0;
        this.maxTaskCount = 1;
        this.processTask = function() {
            if(this.taskQueue.length == 0) {
                return;
            }
            if(this.runningTaskCount >= this.maxTaskCount) {
                return;
            }
            var self = this;
            this.runningTaskCount++;
            var task = this.taskQueue.shift();
            task(function(){
                self.runningTaskCount--;
                self.processTask();
            });
        }
    };

    var loadingQueue = new LoadingQueue();


    var loadArrayBuffer = function(url,callback,method) {
        if(method == null) {
            method = "GET";
        }
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function(e) {
            if (this.status == 200) {
                // get binary data as a response
                callback(this.response);
            }
        };

        xhr.send();
    }

    var rc4decode = function(arrayBuffer,key) {
        var data = new Uint8Array(arrayBuffer);
        function str2ab(str) {
            var buf = new ArrayBuffer(str.length); // 2 bytes for each char
            var bufView = new Uint8Array(buf);
            for (var i=0, strLen=str.length; i<strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return buf;
        }
        function ab2str(buf) {
            return String.fromCharCode.apply(null, new Uint8Array(buf));
        }
        var key = new Uint8Array(str2ab(key));
        var trans = com.vizengine.Global.rc4(data,key);
        var text = ab2str(trans);
        return text;
    }

    if(window.THREE) {
        THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
    }

    //单个小模型
    var Box = Object.extend({
        init: function () {
            Object.prototype.init.apply(this,arguments);
            this.index = new Index();
            this.bound = new Bound();
            this.object = null;
            this.visible = true;
            this.loadState = 0;
            this.key = null;

        },
        getIndexPath: function (index) {
            if (index == null) {
                index = this.index;
            }
            return index.getPath();
        },
        setVisible: function (visible) {
            this.visible = visible;
            if (this.object != null) {
                this.object.visible = visible;
            }
        },
        getParentIndex: function (index) {
            if (index == null) {
                index = this.index;
            }
            if (index.level <= 0) {
                return null;
            }
            var pindex = new Index();
            pindex.level = index.level - 1;
            if(index.level == 1) {
                // 第0层和第1层一一对应
                pindex.x = index.x;
                pindex.y = index.y;
                pindex.z = index.z;
            } else {
                pindex.x = Math.floor(index.x / 2);
                pindex.y = Math.floor(index.y / 2);
                pindex.z = Math.floor(index.z / 2);
            }
            return pindex;
        },
        walkBrotherIndex: function (walker, index) {
            if (index == null) {
                index = this.index;
            }
            if(index.level == 0) {
                var cindex = new Index();
                cindex.level = 0;
                for (var x = 0; x < 2; x++) {
                    for (var y = 0; y < 2; y++) {
                        for (var z = 0; z < 2; z++) {
                            cindex.x = x;
                            cindex.y = y;
                            cindex.z = z;
                            if(this.modelView.boxiesIndex[cindex.getPath()] == null) {
                                continue;
                            }
                            if (!walker(cindex)) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
            var pindex = this.getParentIndex(index);
            return this.walkChildrenIndex(walker, pindex);
        },
        walkChildrenIndex: function (walker, index) {
            if (index == null) {
                index = this.index;
            }
            var cindex = new Index();
            cindex.level = index.level + 1;
            if(index.level == 0) {
                cindex.x = index.x;
                cindex.y = index.y;
                cindex.z = index.z;
                if(this.modelView.boxiesIndex[cindex.getPath()] == null) {
                    return true;
                }
                return walker(cindex);
            }
            for (var x = 0; x < 2; x++) {
                for (var y = 0; y < 2; y++) {
                    for (var z = 0; z < 2; z++) {
                        cindex.x = x + index.x * 2;
                        cindex.y = y + index.y * 2;
                        cindex.z = z + index.z * 2;
                        if(this.modelView.boxiesIndex[cindex.getPath()] == null) {
                            continue;
                        }
                        if (!walker(cindex)) {
                            return false;
                        }
                    }
                }
            }
            return true;
        },
        load : function(callback) {
            var self = this;
            self.loadInternal(function(obj){
                callback.call(self,obj);
            });
        },
        reset : function() {
            this.loadState = 0;
            this.object = null;
        }
        ,
        loadInternal: function (callback) {
            if (this.object != null) {
                this.loadState = 2;
                callback(this.object);
                return;
            }

            var self = this;
            this.loadState = 1;
            this.loadStartTime = new Date().getTime();



            var mtlLoader = new THREE.MTLLoader();
            // for rc4 decode
            var oldLoad = mtlLoader.load;

            mtlLoader.crossOrigin = "*";

            var loadModelSrc = this.modelSrc;
            var mtlUrl = self.modelView.formatProvider.getMtlUrl(self.index.level,self.index.x,self.index.y,self.index.z,self.fileId);
            var objUrl = self.modelView.formatProvider.getObjUrl(self.index.level,self.index.x,self.index.y,self.index.z,self.fileId);

            // 重写load方法，实现材质的解密
            mtlLoader.load = function(url, onLoad, onProgress, onError) {
                // 如果version小于3，是不用解密的，因此直接调用原先的加载方法
                if(self.modelView.formatProvider.version < 3) {
                    return oldLoad.apply(this,arguments);
                }
                url = mtlUrl;
                var scope = this;
                loadArrayBuffer(url,function(arraybuffer){
                    var text = rc4decode(arraybuffer,self.key);
                    onLoad(scope.parse(text));
                });
            };

            // 从mtlUrl里面抽取路径，是为了成功加载mtl引用的纹理图片。
            var mtlPath = mtlUrl.substring(0,mtlUrl.lastIndexOf("/")+1);
            var mtlName = mtlUrl.substring(mtlUrl.lastIndexOf("/")+1);
            mtlLoader.setPath(mtlPath);
            mtlLoader.load(mtlName, function (materials) {
                if(loadModelSrc != self.modelSrc) {
                    return;
                }
                var manager = new THREE.LoadingManager();
                manager.onProgress = function ( item, loaded, total ) {
                    if(loaded == total) {
                        if(loadModelSrc != self.modelSrc) {
                            return;
                        }
                        var objLoader = null;
                        if(self.modelView.formatProvider.version > 1) {
                            objLoader = new THREE.DRACOLoader();
                            var oldDecodeDracoFile = objLoader.decodeDracoFile;
                            objLoader.decodeDracoFile = function(arrayBuffer) {
                                if(self.modelView.formatProvider.version < 3) {
                                    return oldDecodeDracoFile.apply(this,arguments);
                                }
                                var data = new Uint8Array(arrayBuffer);
                                function str2ab(str) {
                                    var buf = new ArrayBuffer(str.length); // 2 bytes for each char
                                    var bufView = new Uint8Array(buf);
                                    for (var i=0, strLen=str.length; i<strLen; i++) {
                                        bufView[i] = str.charCodeAt(i);
                                    }
                                    return buf;
                                }
                                var key = new Uint8Array(str2ab(com.vizengine.core.Base64._utf8_encode(self.key)));
                                com.vizengine.Global.rc4(data,key);
                                return oldDecodeDracoFile.call(this,arrayBuffer);
                            }
                        } else {
                            objLoader = new THREE.OBJLoader();
                        }
                        objLoader.setMaterials(materials);
                        objLoader.crossOrigin = "*";
                        objLoader.load(objUrl, function (object) {
                            if(loadModelSrc != self.modelSrc) {
                                return;
                            }
                            if(self.modelView.debugEnable) {
                                object = self.compose(object);
                            }
                            self.loadState = 2;
                            self.object = object;
                            self.object.visible = self.visible;
                            self.loadFinishTime = new Date().getTime();
                            callback(self.object);
                        }, function (xhl) {
                        }, function () {
                            if(loadModelSrc != self.modelSrc) {
                                return;
                            }
                            self.loadState = 3;
                            self.object = null;
                            self.loadFinishTime = new Date().getTime();
                            callback(self.object);
                        });
                    }

                };
                materials.setManager(manager);
                materials.preload();
                materials.side = THREE.DoubleSide;
                for (var i in materials.materials) {
                    materials.materials[i].side = THREE.DoubleSide;
                }

            }, function () {
            }, function () {
                self.loadState = 3;
                self.object = null;
                self.loadTextureTime = self.loadFinishTime = new Date().getTime();
                callback(self.object);
            });
        },
        compose: function (obj) {
            if (obj == null) {
                return null;
            }

            var object = new THREE.Object3D();
            object.add(obj);
            var geometry = new THREE.BoxBufferGeometry(this.bound.max.x - this.bound.min.x, this.bound.max.y - this.bound.min.y, this.bound.max.z - this.bound.min.z);
            var texture = new THREE.Texture();
            texture.image = createBoxTexture(this.index.level + "(" + this.index.x + "_" + this.index.y + "_" + this.index.z + ")");
            texture.needsUpdate = true;
            var material = new THREE.MeshBasicMaterial({map: texture, transparent: true});
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = (this.bound.max.x + this.bound.min.x) / 2;
            mesh.position.y = (this.bound.max.y + this.bound.min.y) / 2;
            mesh.position.z = (this.bound.max.z + this.bound.min.z) / 2;
            object.add(mesh);
            return object;
        }
    });

    //内部模型手势
    var InternalSceneGestureController = Object.extend({
        init: function (sceneView, camera) {
            Object.prototype.init.apply(this,arguments);
            this.sceneView = sceneView;
            this.camera = camera;
            this.distance = 2;
            this.maxDistance = this.distance * 1.5;
            this.minDistance = this.distance / 2;
            this.rotation = new THREE.Euler();
            this.rotation.order = "ZXY";
            // this.rotation.z = (45 / 180) * Math.PI;
            var self = this;
            self.pinchVecX = 0;
            self.pinchVecY = 0;
            self.pinchVecZ = 0;
            var pinchGesture = new PinchGestureDetector();
            pinchGesture.callback = function (scale, reset, event) {
                if (reset) {
                    var location = new THREE.Vector3(0, 0, -2);
                    location.applyEuler(self.camera.rotation);
                    self.initPinchVec = location;
                } else {
                    scale = Math.log(scale) / Math.log(2);
                    self.pinchVecX = self.initPinchVec.x * scale;
                    self.pinchVecY = self.initPinchVec.y * scale;
                    self.pinchVecZ = self.initPinchVec.z * scale;
                }
            };
            sceneView.gestureDetectors.push(pinchGesture);


            var panGestureDetector = new PanGestureDetector();
            panGestureDetector.callback = function (translateX, translateY, event) {
                if (event.state == 0) {
                    self.sceneView.animation = null;
                    self.initPitch = self._getPitch();
                    self.initHeading = self._getHeading();
                    self.initX = self.camera.position.x;
                    self.initY = self.camera.position.y;
                    self.initZ = self.camera.position.z;
                } else {
                    if (event.touchPoints.length <= 1) {
                        var rate = self._getAngleRate();
                        var heading = self.initHeading - translateX / rate;
                        var pitch = self.initPitch - translateY / rate;
                        self._setHeading(heading);
                        self._setPitch(pitch);
                    } else {
                        var location = new THREE.Vector3(-translateX / 200, translateY / 200, 0);
                        location.applyEuler(self.camera.rotation);
                        self.initLeft = location;
                        self.camera.position.x = self.initX + self.initLeft.x + self.pinchVecX;
                        self.camera.position.y = self.initY + self.initLeft.y + self.pinchVecY;
                        self.camera.position.z = self.initZ + self.initLeft.z + self.pinchVecZ;
                    }
                }
                self.sceneView.requestDraw();
                return true;
            };
            sceneView.gestureDetectors.push(panGestureDetector);

            var sweepGesture = new SweepGestureDetector();
            sweepGesture.callback = function (vx, vy) {
                self._fly(-vx, -vy);
            };
            sweepGesture.cancelCallback = function () {
                self.sceneView.onCameraLocationChanged();
            };
            sceneView.gestureDetectors.push(sweepGesture);
        },
        _getAngleRate: function () {
            var rate = 512 / 2;
            return rate;
        },
        _calculate: function () {
            var self = this;
            $.each(self.sceneView.subViews, function (idx, view) {
                var raycaster = new THREE.Raycaster();
                var mouse = new THREE.Vector2();
                mouse.x = ( view.translateX / window.innerWidth ) * 2 - 1;
                mouse.y = -( view.translateY / window.innerHeight ) * 2 + 1;
                raycaster.setFromCamera(mouse, self.camera);
                if (self.sceneView.scene.children.length > 0) {
                    var children = new Array();
                    for (var j = 0; j < self.sceneView.scene.children.length; j++) {
                        if (j == 0) {
                            if (self.sceneView.scene.children[j].children[0]) {
                                children.push(self.sceneView.scene.children[j].children[0].children[0]);
                            }
                        }
                        else {
                            children.push(self.sceneView.scene.children[j]);
                        }

                    }
                    var intersects = raycaster.intersectObjects(children);

                    if (intersects.length <= 0) {
                        return;
                    }
                    if (intersects[0].object == view.cube) {
                        //intersects[0].object.material.color.set( 0xff0000 );
                        if (!view.visible) {
                            view.setVisible("true");
                        }
                    }
                    else {
                        if (view.visible) {
                            view.setVisible("false");
                        }
                    }
                }
            });
        }
        ,
        _fly: function (vx, vy) {
            var angleRate = this._getAngleRate();
            var self = this;
            var a = 0.0005;
            var tx = Math.abs(vx) / a;
            var sx = 0.5 * a * tx * tx * (vx > 0 ? 1 : -1);
            var anglex = -sx / angleRate;

            var ty = Math.abs(vy) / a;
            var sy = 0.5 * a * ty * ty * (vy > 0 ? 1 : -1);
            var angley = sy / angleRate;
            var timeInterplator = new DecelerateInterpolator(2);
            var duration = tx > ty ? tx : ty;
            var fromPitch = this._getPitch();
            var toPitch = fromPitch + angley;

            if (toPitch > Math.PI) {
                toPitch = Math.PI;
            } else if (toPitch < 0) {
                toPitch = 0;
            }
            var animation = new SceneFlyAnimation(this);
            animation.fromHeading = this._getHeading();
            animation.toHeading = animation.fromHeading - anglex;
            animation.fromPitch = fromPitch;
            animation.toPitch = toPitch;
            animation.duration = duration;
            animation.timeInterplator = timeInterplator;
            animation.callback = function () {
                //self._calculate();
            };
            this.sceneView.startAnimation(animation);
        }
        ,
        _apply: function () {
            this.camera.rotation.z = 1 * Math.PI + this.rotation.z;
            this.camera.rotation.x = 2 * Math.PI - this.rotation.x;
        },
        _culCameraPosition: function (center) {
            var location = new THREE.Vector3(0, 0, -this.distance);
            location.applyEuler(this.rotation);

            location.x = location.x + center.x;
            location.y = location.y + center.y;
            location.z = location.z + center.z;
            return location;
        },
        setCameraPosition: function (x, y, z) {
            this.camera.position.set(x, y, z);
            this.camera.updateProjectionMatrix();
            this.sceneView.requestDraw();
        },
        _updateDefaultDistance: function (distance) {
            this.distance = distance ;
            this._apply();
        }
        ,
        _setHeading: function (heading) {
            this.rotation.z = heading;
            this._apply();
            this.sceneView.requestDraw();
            if(this.sceneView.onHeadingChangeCallback != null) {
                this.sceneView.onHeadingChangeCallback();
            }
        },
        _setPitch: function (pitch) {
            this.rotation.x = pitch;
            this._apply();
            this.sceneView.requestDraw();
            if(this.sceneView.onPitchChangeCallback != null) {
                this.sceneView.onPitchChangeCallback();
            }
        },
        _getHeading: function () {
            return this.rotation.z;
        },
        _getPitch: function () {
            return this.rotation.x;
        }
    });

    // 从外部浏览模型时的手势控制器
    var ExternalSceneGestureController = Object.extend({
        init: function (sceneView, camera) {
            Object.prototype.init.apply(this,arguments);
            this.sceneView = sceneView;
            this.camera = camera;
            this.distance = 20;
            this.maxDistance = this.distance * 2;
            this.minDistance = this.distance / 4;
            this.rotation = new THREE.Euler();
            this.rotation.order = "ZXY";
            this.rotation.z = (45 / 180) * Math.PI;
            var self = this;
            var panGestureDetector = new PanGestureDetector();
            panGestureDetector.callback = function (translateX, translateY, event) {
                if (event.state == 0) {
                    log("stop animation...");
                    self.sceneView.startAnimation(null);
                    self.initPitch = self._getPitch();
                    self.initHeading = self._getHeading();
                    self.sceneView._userControllBegin();
                } else {
                    var rate = self._getAngleRate();
                    var heading = self.initHeading - translateX / rate;
                    var pitch = self.initPitch + translateY / rate;
                    self._setHeading(heading);
                    self._setPitch(pitch);
                }
                self.sceneView.requestDraw();
                return true;
            };
            sceneView.gestureDetectors.push(panGestureDetector);

            var sweepGesture = new SweepGestureDetector();
            sweepGesture.callback = function (vx, vy) {
                self._fly(-vx, vy);
            };
            sceneView.gestureDetectors.push(sweepGesture);

            var pinchGesture = new PinchGestureDetector();
            pinchGesture.callback = function (scale, reset) {
                if (reset) {
                    self.initDistance = self._getDistance();
                } else {
                    self._setDistance(self.initDistance / scale);
                }
            };
            sceneView.gestureDetectors.push(pinchGesture);
        },
        _getAngleRate: function () {
            var rate = (this.maxDistance * 64) / (this.distance);
            return rate;
        },
        _updateDefaultDistance: function (distance) {
            this.distance = distance * 1.6;
            this.maxDistance = this.distance * 2;
            this.minDistance = this.distance / 4;
            this._apply();
        }
        ,
        _getDistance: function () {
            return this.distance;
        },
        _setDistance: function (distance) {
            var curDistance = 0;
            if (distance < this.minDistance) {
                curDistance = this.minDistance;
            }
            else if (distance > this.maxDistance) {
                curDistance = this.maxDistance;
            }
            else {
                curDistance = distance;
            }
            this.distance = curDistance;
            this._apply();
        },
        _calculate: function () {
            var self = this;
            $.each(self.sceneView.subViews, function (idx, view) {
                var raycaster = new THREE.Raycaster();
                var mouse = new THREE.Vector2();
                mouse.x = ( view.translateX / window.innerWidth ) * 2 - 1;
                mouse.y = -( view.translateY / window.innerHeight ) * 2 + 1;
                raycaster.setFromCamera(mouse, self.camera);
                if (self.sceneView.scene.children.length > 0) {
                    var children = new Array();
                    for (var j = 0; j < self.sceneView.scene.children.length; j++) {
                        if (j == 0) {
                            if (self.sceneView.scene.children[j].children) {
                                for (var k = 0; k < self.sceneView.scene.children[j].children.length; k++)
                                    children.push(self.sceneView.scene.children[j].children[k].children[0]);
                            }
                        }
                        else {
                            children.push(self.sceneView.scene.children[j]);
                        }
                    }
                    var intersects = raycaster.intersectObjects(children);

                    if (intersects.length <= 0) {
                        return;
                    }
                    if (intersects[0].object == view.cube) {
                        //intersects[0].object.material.color.set( 0xff0000 );
                        if (!view.visible) {
                            view.setVisible("true");
                        }
                    }
                    else {
                        if (view.visible) {
                            view.setVisible("false");
                        }

                    }
                }
            });
        }
        ,
        _fly: function (vx, vy) {
            var angleRate = this._getAngleRate();
            var self = this;
            var a = 0.0005;
            var tx = Math.abs(vx) / a;
            var sx = 0.5 * a * tx * tx * (vx > 0 ? 1 : -1);
            var anglex = -sx / angleRate;

            var ty = Math.abs(vy) / a;
            var sy = 0.5 * a * ty * ty * (vy > 0 ? 1 : -1);
            var angley = sy / angleRate;
            var timeInterplator = new DecelerateInterpolator(2);
            var duration = tx > ty ? tx : ty;
            var fromPitch = this._getPitch();
            var toPitch = fromPitch + angley;

            if (toPitch > Math.PI) {
                toPitch = Math.PI;
            } else if (toPitch < 0) {
                toPitch = 0;
            }
            var animation = new SceneFlyAnimation(this);
            animation.fromHeading = this._getHeading();
            animation.toHeading = animation.fromHeading - anglex;
            animation.fromPitch = fromPitch;
            animation.toPitch = toPitch;
            animation.duration = duration;
            animation.timeInterplator = timeInterplator;
            animation.callback = function () {
                //self._calculate();
                self.sceneView._userControllEnd();
            };
            this.sceneView.startAnimation(animation);
        }
        ,
        _apply: function () {
            var boundCenter = this.sceneView.lookatLocation;
            if(boundCenter == null) {
                boundCenter = new THREE.Vector3(0,0,0);
            }

            var location = this._culCameraPosition(boundCenter);

            this.camera.position.x = location.x;
            this.camera.position.y = location.y;
            this.camera.position.z = location.z;

            if(this.sceneView.lookatLocation != null) {
                var rotateMatrix = new THREE.Matrix4();
                rotateMatrix.lookAt(location,this.sceneView.lookatLocation,new THREE.Vector3(0,0,1));

                if(this.sceneView.lookAnchor != null) {
                    var lookX = this.sceneView.frame.width * this.sceneView.lookAnchor.x;
                    var lookY = this.sceneView.frame.height * this.sceneView.lookAnchor.y;
                    var centerX = this.sceneView.frame.width / 2;
                    var centerY = this.sceneView.frame.height / 2;
                    var near = (this.sceneView.frame.height / 2) / Math.tan(this.sceneView.fov*Math.PI/360);
                    var angleX = Math.atan((lookY-centerY)/(near));
                    var angleY = Math.atan((lookX-centerX)/(near));
                    rotateMatrix.multiply(new THREE.Matrix4().makeRotationX(angleX));
                    rotateMatrix.multiply(new THREE.Matrix4().makeRotationY(angleY));
                }
                this.camera.rotation.setFromRotationMatrix(rotateMatrix);
            } else {
                this.camera.rotation.z = Math.PI + this.rotation.z;
                this.camera.rotation.x = Math.PI - this.rotation.x;
            }
        },
        _culCameraPosition: function (center) {
            var location = new THREE.Vector3(0, 0, -1 * this.distance);
            location.applyEuler(this.rotation);
            location.x = location.x + center.x;
            location.y = location.y + center.y;
            location.z = location.z + center.z;
            return location;
        }
        ,
        _setHeading: function (heading) {
            this.rotation.z = heading;
            this._apply();
            this.sceneView.requestDraw();
            if(this.sceneView.onHeadingChangeCallback != null) {
                this.sceneView.onHeadingChangeCallback();
            }
        },
        _setPitch: function (pitch) {
            var max = Math.PI*0.99;
            var min = Math.PI*0.01;
            if(pitch >= max) {
                pitch = max;
            }
            if(pitch <= min) {
                pitch = min;
            }
            this.rotation.x = pitch;
            this._apply();
            this.sceneView.requestDraw();
            if(this.sceneView.onPitchChangeCallback != null) {
                this.sceneView.onPitchChangeCallback();
            }
        },
        _getHeading: function () {
            return this.rotation.z;
        },
        _getPitch: function () {
            return this.rotation.x;
        }

    });


    // 不同版本的三维模型格式的url拼接方式不一样
    var DataFormatProvider = Object.extend({
        init : function(modelSrc) {
            this.modelSrc = modelSrc;
        },
        getObjUrl : function(level,x,y,z) {},
        getMtlUrl : function(level,x,y,z) {},
        getIndexUrl : function(level){}
    });

    /*
     * 对于meta中version==0的情况
     */
    var DataFormatProvider0 = DataFormatProvider.extend({
        init : function() {
            DataFormatProvider.prototype.init.apply(this,arguments);
            this.modelName = this._getModelNameFromUrl();
            this.version = 0;
        },
        getObjUrl : function(level,x,y,z) {
            var objpath = this.modelSrc + "/" + level + "/" + x + "_" + y + "_" + z + "/" + this.modelName  + level + "_" + x + "_" + y + "_" + z + ".obj";
            return objpath;
        },
        getMtlUrl : function(level,x,y,z) {
            var mtlpath = this.modelSrc + "/" + level + "/" + x + "_" + y + "_" + z + "/" + this.modelName  + level + "_" + x + "_" + y + "_" + z + ".mtl";
            return mtlpath;
        },
        getIndexUrl : function(level){
            var indexUrl = this.modelSrc + "/" + level + "/index.json";
            return indexUrl;
        },
        _getModelNameFromUrl : function() {
            var index = this.modelSrc.lastIndexOf("/");
            return this.modelSrc.substring(index+1);
        }
    })

    /*
     * 对于meta中version==1的情况
     */
    var DataFormatProvider1 = DataFormatProvider.extend({
        init : function() {
            DataFormatProvider.prototype.init.apply(this,arguments);
            this.version = 1;
        },
        getObjUrl : function(level,x,y,z) {
            var objpath = this.modelSrc + "/" + level + "_" + x + "_" + y + "_" + z + ".obj";
            return objpath;
        },
        getMtlUrl : function(level,x,y,z) {
            var mtlpath = this.modelSrc + "/" + level + "_" + x + "_" + y + "_" + z + ".mtl";
            return mtlpath;
        },
        getIndexUrl : function(level){
            var indexUrl = this.modelSrc + "/" + level + ".index";
            return indexUrl;
        }
    })

    /*
     * 对于meta中version==2的情况
     */
    var DataFormatProvider2 = DataFormatProvider.extend({
        init : function() {
            DataFormatProvider.prototype.init.apply(this,arguments);
            this.version = 2;
        },
        getObjUrl : function(level,x,y,z) {
            var objpath = this.modelSrc + "/" + level + "/" + x + "_" + y + "_" + z + ".obj.drc";
            return objpath;
        },
        getMtlUrl : function(level,x,y,z) {
            var mtlpath = this.modelSrc + "/" + level + "/" + x + "_" + y + "_" + z + ".mtl";
            return mtlpath;
        },
        getIndexUrl : function(level){
            var indexUrl = this.modelSrc + "/" + level + "/index.json";
            return indexUrl;
        }
    })


    /*
     * 对于meta中version==3的情况
     */
    var DataFormatProvider3 = DataFormatProvider.extend({
        init : function() {
            DataFormatProvider.prototype.init.apply(this,arguments);
            this.version = 3;
        },
        getObjUrl : function(level,x,y,z,fileId) {
            var objpath = this.modelSrc + "/" + level + "/" + fileId+".o";
            return objpath;
        },
        getMtlUrl : function(level,x,y,z,fileId) {
            var mtlpath = this.modelSrc + "/" + level + "/" + fileId + ".m";
            return mtlpath;
        },
        getIndexUrl : function(level){
            var indexUrl = this.modelSrc + "/" + level + "/index";
            return indexUrl;
        }
    })


    Object.extend("com.vizengine.view.ModelSparse",{
        init : function() {
            this.rootObject = new THREE.Object3D();
            this.boxiesIndex = {};
            this.boxies = [];
            this.modelSrc = null;
            this.isInSide = false;
            this.bound = null;
            this.formatProvider = null;
            this.formatVersion = null;
            this.modelId = null;
            this._splitRate = 0.6;
            this.bound = new Bound();
        },
        setModelSrc : function(modelSrc,callback) {
            this.clear();
            this.modelSrc = modelSrc;
            var self = this;
            this._loadMeta(function () {
                if(self.isInSide)
                {
                    var center = self.bound.getCenter();
                    var trans = new THREE.Matrix4();
                    trans.makeTranslation(-center.x, -center.y, -center.z);

                    var rotate = new THREE.Matrix4();

                    rotate.makeRotationX(-0.8 * Math.PI / 2);

                    var all = new THREE.Matrix4();
                    all.multiply(rotate);
                    all.multiply(trans);
                    self.rootObject.applyMatrix(all);
                }
                self.onCameraLocationChanged();
                if(callback) {
                    callback.call(self);
                }
            })
        },

        _loadMeta: function (callback) {
            var self = this;
            loadResource(this.modelSrc + "/meta.json",function(data){
                data = JSON.parse(data);
                /**
                 * 不同版本数据采用不同的格式
                 */
                var version = data.version != null ? data.version : 0;
                switch(version) {
                    case 0:
                        self.formatProvider = new DataFormatProvider0(self.modelSrc);
                        break;
                    case 1:
                        self.formatProvider = new DataFormatProvider1(self.modelSrc);
                        break;
                    case 2:
                        self.formatProvider = new DataFormatProvider2(self.modelSrc);
                        break;
                    case 3:
                        self.formatProvider = new DataFormatProvider3(self.modelSrc);
                        break;
                    default:
                        alert("不支持当前数据格式，请检查引擎是否为最新版本!!");
                        return;
                }
                self.formatVersion = version;

                if(data.id != null) {
                    self.modelId = data.id;
                }

                var min = new THREE.Vector3(data.bound[0], data.bound[1], data.bound[2]);
                var max = new THREE.Vector3(data.bound[3], data.bound[4], data.bound[5]);
                var levelCount = data.levelnum;
                if(self.model3dView.levelCount!=-1)
                {
                    if(self.model3dView.levelCount<levelCount)
                    {
                        levelCount=self.model3dView.levelCount;
                    }
                }
                self.bound.min = min;
                self.bound.max = max;

                var needKey = self.formatVersion >= 3;
                if(needKey) {
                    self._loadKey(function(){
                        self._loadIndex(function(){
                            callback();
                        },levelCount,min,max);
                    })
                } else {
                    self._loadIndex(function(){
                        callback();
                    },levelCount,min,max);
                }
            }) ;
        },
        _loadKey : function(callback) {
            var self = this;
            var appId = "test001";
            var appSec = "secret_test001";
            var timestamp = "1490175427373";
            var vbrId = this.modelId;

            var arr = [];
            arr[0] = "appId="+appId;
            arr[1] = "appSecret="+appSec;
            arr[2] = "id="+vbrId;
            arr[3] = "timestamp="+timestamp;

            // 排序
            arr.sort();

            var str = arr.join("&");
            var singature = com.vizengine.Global.md5(str);

            arr.splice(1,1);
            var param = arr.join("&");

            var url = "http://vbr3d.visualbusiness.cn/vbr3d-model-http-api/model/secret?"+param+"&signature="+singature;
            if(this.modelSrc.indexOf("http://test-") >= 0) {
                url = "http://test-vbr3d.visualbusiness.cn/vbr3d-model-http-api/model/secret?"+param+"&signature="+singature;
            }

            loadArrayBuffer(url,function(data){
                data = rc4decode(data,appSec);
                data = JSON.parse(data);
                if(parseInt(data.code) != 0) {
                    alert("无法解密文件,原因:"+data.msg);
                    return;
                }
                var res = com.vizengine.Global.base64Decode(data.data);
                var prefixLen = parseInt(res.substring(0,2),16);
                var postLen = parseInt(res.substring(2,4),16);
                var start = prefixLen + 4;
                var stop = res.length - postLen;
                self.key = res.substring(start,stop);

                callback();
            },"POST");
        },
        _loadIndexData : function(level,callback) {
            var self = this;
            var url = this.formatProvider.getIndexUrl(level);
            if(this.formatProvider.version < 3) {
                loadResource(url,function(data){
                    callback(data);
                });
                return;
            }
            // 版本号大于等于3需要解密
            loadArrayBuffer(url,function(arraybuffer){
                var text = rc4decode(arraybuffer,self.key);
                callback(text);
            });
        },
        _loadIndex : function(callback,levelCount,min,max) {
            /*
             * 加载索引
             * @type {number}
             */
            var level = 0;
            var self = this;
            var loadNextLevelIndex = function() {
                if(level >= levelCount) {
                    callback();
                    return;
                }
                var curretLevel = level;

                self._loadIndexData(level,function(data){
                    if(curretLevel == 0) {
                        log(data);
                    }
                    data = JSON.parse(data);
                    for(var key in data) {
                        var eles = key.split("_");
                        var level = curretLevel;
                        var x = 0;
                        var y = 0;
                        var z = 0;
                        if(eles.length > 3) {
                            x = parseInt(eles[1]);
                            y = parseInt(eles[2]);
                            z = parseInt(eles[3]);
                        } else {
                            x = parseInt(eles[0]);
                            y = parseInt(eles[1]);
                            z = parseInt(eles[2]);
                        }

                        var xCount = Math.pow(2,level==0?1:level); // 第0层为缩略图
                        var yCount = xCount;
                        var zCount = xCount;

                        var box = new Box();
                        box.key = self.key;
                        box.modelView = self;
                        box.index.level = level;
                        box.index.x = x;
                        box.index.y = y;
                        box.index.z = z;
                        if(typeof data[key] == "string") {
                            box.fileId = data[key].split(",")[0];
                        }
                        box.bound.min = new THREE.Vector3(min.x + (max.x - min.x) * x / xCount, min.y + (max.y - min.y) * y / yCount, min.z + (max.z - min.z) * z / zCount);
                        box.bound.max = new THREE.Vector3(min.x + (max.x - min.x) * (x + 1) / xCount, min.y + (max.y - min.y) * (y + 1) / yCount, min.z + (max.z - min.z) * (z + 1) / zCount);

                        self.boxies.push(box);
                        self.boxiesIndex[box.getIndexPath()] = box;
                    }

                    loadNextLevelIndex();
                });


                level++;
            }
            loadNextLevelIndex();
        },
        onCameraLocationChanged: function () {
            //this._updateBoxies();
            this._sortBoxies();
            this._markBoxies();
            this._loadMoreBoxies();
        },
        _sortBoxies: function () {
            var self = this;
            var location = self.camera.position;
            this.boxies.sort(function (left, right) {
                if (left.index.level != right.index.level) {
                    return left.index.level - right.index.level;
                }
                var leftCenter = left.bound.getCenter();
                var rightCenter = right.bound.getCenter();
                var leftDistance = leftCenter.distanceTo(location);
                var rightDistance = rightCenter.distanceTo(location);
                return leftDistance - rightDistance;
            });
        },
        _markBoxies: function () {
            var self = this;
            // 检查前8个元素是否应该显示(前8个元素是第0层的，后8个元素是第1层的)
            var level0Loaded = true;
            for(var i = 0 ; i < 8 && i < this.boxies.length; i++) {
                var box = this.boxies[i];
                box.needAdd = (box.loadState == 2 && box.object != null);
                box.walkChildrenIndex(function(index) {
                    var child = self.boxiesIndex[box.getIndexPath(index)];
                    if(child == null) {
                        return true;
                    }
                    if(child.loadState == 2) {
                        box.needAdd = false;
                    }
                    return true;
                });
                if(box.loadState < 2) {
                    level0Loaded = false;
                }
            }
            if(!level0Loaded) {
                return;
            }

            if(this.firstLoad) {
                this.firstLoad = false;
                if(this.onModelLoadedCallback != null) {
                    this.onModelLoadedCallback();
                }
            }

            // 从第8个开始，需要分层检查
            for(var i = 8; i < this.boxies.length; i++) {
                var box = this.boxies[i];
                box.needAdd = (box.loadState == 2 && box.object != null);
                box.walkBrotherIndex(function(index){
                    var child = self.boxiesIndex[box.getIndexPath(index)];
                    if (child != null) {
                        if(child.loadState < 2) {
                            box.needAdd = false;
                        }
                    }
                    return true;
                });
                if(box.needAdd) {
                    var parent = self.boxiesIndex[box.getIndexPath(box.getParentIndex())];
                    if(parent != null) {
                        parent.needAdd = false;
                    }
                }
            }
            return;
        },
        _loadMoreBoxies: function () {
            var self = this;

            if(this.loading) {
                return;
            }
            var loadedCount = 0;
            var totalCount = 0;
            for (var i = 0; i < self.boxies.length; i++) {
                var box = self.boxies[i];
                if(box.needAdd) {
                    totalCount++;
                    if(box.loadState == 2) {
                        loadedCount++;
                    }
                }
                if (!box.needAdd) {
                    this._removeBox(box);
                    continue;
                }
                if(box.needAdd) {
                    if (box.object != null) {
                        self.rootObject.add(box.object);
                        self.model3dView.requestDraw();
                    }
                }
            }

            for (var i = 0; i < self.boxies.length; i++) {
                var box = self.boxies[i];
                if (box.loadState != 0) {
                    continue;
                }

                (function () {
                    self.loading = true;
                    box.load(function () {
                        self.loading = false;
                        self.onCameraLocationChanged();
                    })
                })();
                return;
            }
        },


        _updateBoxies : function() {
            //log("updateBoxies...:"+this.camera.position.x+","+this.camera.position.y+","+this.camera.position.z);

            var rootBox = null;
            outer : for(var i = 0 ; i < 2 ; i++) {
                for(var j = 0; j < 2; j++) {
                    for(var k = 0 ; k < 2; k++) {
                        var box = this.boxiesIndex["0/"+i+"_"+j+"_"+k];
                        if(box != null) {
                            rootBox = box;
                            break outer;
                        }
                    }
                }
            }
            var output = {};
            var self = this;
            rootBox.walkBrotherIndex(function(index){
                self._updateBox(self.boxiesIndex[index.getPath()],output);
                return true;
            });

            this._loadBoxies(output);
        },
        _loadBoxies : function(output) {
            if(this.loadingBoxies != null) {
                for(var key in this.loadingBoxies) {
                    if(output[key] == null) {
                        this._removeBox(this.loadingBoxies[key]);
                    }
                }
            }
            this.loadingBoxies = output;
            var self = this;
            this.loadingArray = [];
            for(var key in this.loadingBoxies) {
                this.loadingArray.push(this.loadingBoxies[key]);
            }
            this.loadingArray.sort(function(left,right){
                return left.bound.getCenter().distanceTo(self.camera.position) - right.bound.getCenter().distanceTo(self.camera.position);
            })
            for(var key = 0 ; key < this.loadingArray.length; key++) {
                var box = this.loadingArray[key];
                if(box.loadState > 0) {
                    continue;
                }
                box.load(function(){
                    if(self.modelSrc == "") {
                        return;
                    }
                    self.rootObject.add(this.object);
                    self.onCameraLocationChanged();
                    self.model3dView.requestDraw();
                })
                return;
            }
        },
        _updateBox : function(box,output) {
            if(box == null) {
                return;
            }
            var distanceToCamera = box.bound.getCenter().distanceTo(this.camera.position);
            var r = box.bound.getRadius();
            var len = r / distanceToCamera;
            var height = 2 * Math.tan(this.fov*Math.PI/360);
            var rate = len / height;
            var splitRate = this._splitRate;

            if(rate > splitRate) {
                // 移除当前盒子，继续切分
                var self = this;
                var hasChildren = false;
                box.walkChildrenIndex(function(index){
                    hasChildren = true;
                    self._updateBox(self.boxiesIndex[index.getPath()],output);
                    return true;
                });
                if(hasChildren) {
                    this._removeBox(box);
                } else {
                    output[box.index.getPath()] = box;
                }
                self = null;
            } else {
                // 已经达到显示质量要求，无需继续切分
                output[box.index.getPath()] = box;
            }
        },
        _removeBox: function (box) {
            if (box.object == null) {
                return;
            }
            this.rootObject.remove(box.object);
            this._releaseObject3d(box.object);
            this.boxiesIndex[box.index.getPath()].reset();
            //box.object = null;
        },
        _releaseObject3d : function(obj) {
            if(obj.material!=null) {
                if(obj.material.map != null) {
                    obj.material.map.dispose();
                }
                obj.material.dispose();
            }
            if(obj.geometry!=null){
                obj.geometry.dispose();
            }
            for(var i = 0 ; i < obj.children.length; i++) {
                var child = obj.children[i];
                this._releaseObject3d(child);
            }
        },
        clear: function() {
            for(var i = 0 ; i < this.boxies.length; i++) {
                var box = this.boxies[i];
                this._removeBox(box);
            }
            this.boxies.length = 0;
            this.modelSrc = "";
        }
    });
    var ModelSparse = com.vizengine.view.ModelSparse;

    var count = 0;
    View.extend("com.vizengine.view.Model3DView",
        {
            init: function () {
                View.prototype.init.apply(this,arguments);
                this.firstLoad = true;
                this.isInSide = false;
                this.levelCount = -1;
                this.onModelLoadedCallback = null;
                this.bound = new Bound();
                this.lookatLocation = null;
                this.boxies = new Array();
                this.baseUrl = "http://cdn.visualbusiness.cn/3d/m/";
                this.formatProvider = null;
                this.modelSrc = null;
                this.modelId = null;
                this.mid = "model" + (count++);

                this.boxiesIndex = new Object();
                this._gestureController=null;
                this._backgroundColor = null;
                this._dirty = false;
                this.loading = false;
                this.debugEnable = false;
                this.autoplayLoopTime = 110000;
                // 当后台数据处理就绪之后，此处splitRate需要设置0.6, 以便于控制远处不适用小的盒子模型
                this._splitRate = 0.6;

                this.onHeadingChangeCallback = null;
                this.onPitchChangeCallback = null;

                this.onModelStilledCallback = null;
                this.userControlling = false;

                this.defaultDistanceRate = 0.5;

                this.lookAnchor = {x:0.5,y:0.5};

                this.setViewMode(false);

                this.sparses = [];
            },
            _userControllBegin : function() {
                this.userControlling = true;
            }
            ,
            setLevelCount:function (levelCount) {
                this.levelCount =  levelCount;
            },
            _userControllEnd : function() {
                this.userControlling = false;
                this.lastControlEndTime = new Date().getTime();
                if(this.onModelStilledCallback != null) {
                    this.onModelStilledCallback();
                }
                if(this.autoplayAnimation != null) {
                    var self = this;
                    setTimeout(function(){
                        var now = new Date().getTime();
                        if(now - self.lastControlEndTime < 4900) {
                            return;
                        }
                        self.setAutoplayEnable(self.autoplayEnable);
                    },5000);
                }
                this.onCameraLocationChanged();
            }
            ,
            setBackgroundColor : function(color) {
                this._backgroundColor = color;
                this.renderer.setClearColor(color,1);
            },
            requestDraw: function () {
                if(this._dirty) {
                    return;
                }
                this._dirty = true;
                var self = this;
                setTimeout(function(){
                    self._dirty = false;
                    self.onDraw();
                    self = null;
                },0);
            },
            startAnimation : function() {
                var ret = View.prototype.startAnimation.apply(this,arguments);
                log("ID:"+this.mid+" start Animation:"+arguments[0]);
                return ret;
            }
            ,
            _createNativeView: function () {
                var nativeView = View.prototype._createNativeView.apply(this,arguments);
                var container = document.createElement("div");
                container.style.position = "absolute";
                var renderer = new THREE.WebGLRenderer();
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setClearColor(0xffffff, 1.0);
                this.scene = new THREE.Scene();
                this.rootObject = new THREE.Object3D();
                this.scene.add(this.rootObject);
                //  var axes = new THREE.AxisHelper(200);
                // this.scene.add(axes);
                this.fov = 45;
                this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, 0.01, 1000);
                this.camera.position.x = 0;
                this.camera.position.y = 0;
                this.camera.position.z = 0;
                this.camera.rotation.order = "ZXY";
                this.scene.add(this.camera);
                //  var axes = new THREE.AxisHelper(220);
                // this.scene.add(axes);
                this.renderer = renderer;

                // Load the background texture
                var texture = new THREE.Texture();
                this.backgroundTexture = texture;
                var backgroundMesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(2, 2, 0),
                    new THREE.MeshBasicMaterial({
                        map: texture
                    }));

                backgroundMesh.material.depthTest = false;
                backgroundMesh.material.depthWrite = false;

                // Create your background scene
                var backgroundScene = new THREE.Scene();
                var backgroundCamera = new THREE.Camera();
                backgroundScene.add(backgroundCamera);
                backgroundScene.add(backgroundMesh);
                this.backgroundScene = backgroundScene;
                this.backgroundCamera = backgroundCamera;
                var directionalLight = new THREE.DirectionalLight(0x404040);
                directionalLight.position.set(1, 0, 1).normalize();
                this.scene.add(directionalLight);
                var light = new THREE.AmbientLight(0xffffff);
                this.scene.add(light);
                container.appendChild(this.renderer.domElement);
                nativeView.div = container;
                return nativeView;
            },
            setBackgroundTexture: function (src) {
                var self = this;
                var loader = new THREE.TextureLoader();
                loader.crossOrigin = "*";
                // load a resource
                loader.load(
                    // resource URL
                    src,
                    // Function when resource is loaded
                    function (texture) {
                        self.backgroundTexture.image = texture.image;
                        self.backgroundTexture.needsUpdate = true;
                    },
                    // Function called when download progresses
                    function (xhr) {
                        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                    },
                    // Function called when download errors
                    function (xhr) {
                        console.log('An error happened');
                    }
                );
            },
            dispatchLayout: function () {
                View.prototype.dispatchLayout.apply(this,arguments);
                this.camera.aspect = this.frame.width / this.frame.height;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(this.frame.width, this.frame.height);
                this.renderer.setViewport(0, 0, this.frame.width, this.frame.height);
                this._gestureController._apply();
                this.requestDraw();
            },
            //设置浏览模式,true为模型内部浏览，false为模型外部浏览
            setViewMode:function (value) {
                this.isInSide = View.parseBoolean(value);
                this.gestureDetectors.length = 0;
                if(this.isInSide)
                {
                    this._gestureController = new InternalSceneGestureController(this, this.camera);
                }
                else
                {
                    this._gestureController = new ExternalSceneGestureController(this, this.camera);

                }
            },
            //获取浏览模式,true为模型内部浏览，false为模型外部浏览
            getViewMode :function () {
                return this.isInSide;
            },
            setHeading: function (heading,fromUser) {
                if(fromUser == null) {
                    fromUser = true;
                }
                this.heading = heading;
                heading = parseFloat(heading);
                heading = -1 * (heading / 180) * Math.PI;
                this._gestureController._setHeading(heading);
                if(fromUser){
                    if(this.autoplayEnable) {
                        this.setAutoplayEnable(true);
                    }
                }
            },
            setPitch: function (pitch) {
                this.pitch = pitch;
                pitch = -parseFloat(pitch);
                pitch = Math.PI * (90 - pitch) / 180;

                this._gestureController._setPitch(pitch);
            },
            getHeading: function () {
                var heading = this._gestureController._getHeading();
                return -180 * heading / Math.PI;
            },
            getPitch: function () {
                var pitch = this._gestureController._getPitch();
                return (180 * pitch / Math.PI)-90;
            },
            setDebugEnable : function(enable) {
                this.debugEnable = View.parseBoolean(enable);
            }
            ,
            onDraw: function () {
                var self = this;
                self._updateOutAnnotations();
                this.renderer.autoClear = false;
                this.renderer.clear(true);
                if(this._backgroundColor == null) {
                    this.renderer.render(this.backgroundScene, this.backgroundCamera);
                }
                this.renderer.render(this.scene, this.camera);

            },
            _updateInAnnotations: function () {
                for (var i in this.subViews) {
                    var view = this.subViews[i];
                    var gLocationX = view.locationX;
                    var gLocationY = view.locationY;
                    var gLocationZ = view.locationZ;
                    var anchorPoint = new THREE.Vector3(gLocationX, gLocationY, gLocationZ);
                    anchorPoint.applyMatrix4(this.camera.matrixWorldInverse);
                    view.setVisible(anchorPoint.z < 0);
                    anchorPoint.applyMatrix4(this.camera.projectionMatrix);
                    var tx = anchorPoint.x * this.frame.width / 2 + this.frame.width / 2;
                    var ty = this.frame.height / 2 - anchorPoint.y * this.frame.height / 2;
                    view.setTranslateX(tx - view.panoAnchorX * view.frame.width);
                    view.setTranslateY(ty - view.panoAnchorY * view.frame.height);
                    view.setAnchorX(view.panoAnchorX);
                    view.setAnchorY(view.panoAnchorY);
                }
            }
            ,
            _updateOutAnnotations: function () {
                for (var i in this.subViews) {
                    var view = this.subViews[i];
                    var gLocationX = view.locationX;
                    var gLocationY = view.locationY;
                    var gLocationZ = view.locationZ;
                    var anchorPoint = new THREE.Vector3(gLocationX, gLocationY, gLocationZ);
                    anchorPoint.applyMatrix4(this.camera.matrixWorldInverse);
                    anchorPoint.applyMatrix4(this.camera.projectionMatrix);
                    var tx = anchorPoint.x * this.frame.width / 2 + this.frame.width / 2;
                    var ty = this.frame.height / 2 - anchorPoint.y * this.frame.height / 2;
                    view.setTranslateX(tx - view.anchorX * view.frame.width);
                    view.setTranslateY(ty - view.anchorY * view.frame.height);
                }
            },


            /**
             * center
             * {
             *     x : 0,
             *     y : 0,
             *     z : 0
             * }
             * @param center
             */
            setCenter : function(center) {
                this.center = center;
                if(!this.isInSide) {
                    this._gestureController._apply();
                }
            },
            setLookatLocation : function(loc) {
                this.lookatLocation = loc;
                this._gestureController._apply();
                this.requestDraw();
            },
            setLookAnchor : function(anchor) {
                this.lookAnchor = anchor;
                this._gestureController._apply();
                this.requestDraw();
            },

            setDefaultDistanceRate : function(rate) {
                this.defaultDistanceRate = rate;
                if (this.bound != null) {
                    var dis = this.bound.min.distanceTo(this.bound.max);
                    dis *= this.defaultDistanceRate;
                    if (this._gestureController != null) {
                        this._gestureController._updateDefaultDistance(dis);
                    }
                }
            },
            raycast : function(x,y) {
                var raycaster = new THREE.Raycaster();
                var mouse = new THREE.Vector2();
                mouse.x = ( x / window.innerWidth ) * 2 - 1;
                mouse.y = -( y / window.innerHeight ) * 2 + 1;
                raycaster.setFromCamera(mouse, this.camera);
                if (this.scene.children.length > 0) {
                    var children = [];
                    for (var j = 0; j < this.boxies.length; j++) {
                        var obj = this.boxies[j].object;
                        if(obj != null) {
                            children.push(obj);
                        }
                    }
                    var intersects = raycaster.intersectObjects(children,true);

                    if (intersects.length <= 0) {
                        return null;
                    }
                    return intersects[0].point;
                }
                return null;
            },
            setAutoplayLoopTime : function(loopTime) {
                this.autoplayLoopTime = View.parseFloat(loopTime);
                this.setAutoplayEnable(this.autoplayEnable);
            }
            ,
            setAutoplayEnable : function(enable) {
                this.autoplayEnable = View.parseBoolean(enable);
                if(this.autoplayEnable) {
                    this.autoplayAnimation = new Animation();
                    this.autoplayAnimation.duration = this.autoplayLoopTime;
                    this.autoplayAnimation.startHeading = this.getHeading();
                    this.autoplayAnimation.repeatCount = 0;
                    this.autoplayAnimation.animateFrame = function(view,progress) {
                        view.setHeading(this.startHeading-360*progress,false);
                    }
                    if(!this.userControlling) {
                        this.startAnimation(this.autoplayAnimation);
                    }
                } else {
                    if(this.animation == this.autoplayAnimation) {
                        this.startAnimation(null);
                        this.autoplayAnimation = null;
                    }
                }
            },
            _loadMeta : function(callback) {
                var self = this;
                loadResource(this.modelSrc + "/meta.json",function(data) {
                    data = JSON.parse(data);
                    if(data) {
                        if(data.sparse) {
                            for(var key in data.sparse) {
                                self._createSparse(key,function(){
                                    self.onCameraLocationChanged();
                                });
                            }
                        } else {
                            var sparse = new ModelSparse();
                            sparse.model3dView = self;
                            sparse.camera = self.camera;
                            self.sparses.push(sparse);
                            self.rootObject.add(sparse.rootObject);
                            sparse.setModelSrc(self.modelSrc,function(){
                                self.onCameraLocationChanged();
                            });
                        }

                    }
                    var min = new THREE.Vector3(data.bound[0], data.bound[1], data.bound[2]);
                    var max = new THREE.Vector3(data.bound[3], data.bound[4], data.bound[5]);
                    self.bound.min = min;
                    self.bound.max = max;
                    self.setDefaultDistanceRate(0.6);
                    self.lookAnchor = data.pose != null && data.pose.lookAnchor != null ? data.pose.lookAnchor : {x:0.5,y:0.5};
                    self.lookatLocation = data.pose != null && data.pose.lookatLocation != null ? data.pose.lookatLocation : self.bound.getCenter();
                    self.rootObject.matrixAutoUpdate = false;
                    self.rootObject.matrix = new THREE.Matrix4();
                    if(data.pose != null && data.pose.matrix != null) {
                        self.rootObject.matrix.elements = data.pose.matrix;
                    }

                    if(self.isInSide)
                    {
                        var heading = self.heading != null ? self.heading : 0;
                        var pitch = self.pitch != null ? self.pitch : 0;
                        if(!self._gestureController)
                        {
                            self._gestureController=new InternalSceneGestureController(self, self.camera);
                        }
                        self.setHeading(heading);
                        self.setPitch(pitch);
                    }
                    else
                    {
                        var heading = self.heading != null ? self.heading : 0;
                        var pitch = self.pitch != null ? self.pitch : 0;
                        var dis = min.distanceTo(max);
                        if(self.defaultDistanceRate!=null) {
                            dis *= self.defaultDistanceRate;
                        }
                        if(!self._gestureController)
                        {
                            self._gestureController=new ExternalSceneGestureController(self, self.camera);
                        }
                        self._gestureController._updateDefaultDistance(dis);
                        self.camera.position.set(self.bound.getCenter().x, self.bound.getCenter.y, self.bound.getCenter().z);
                        self.setHeading(heading);
                        self.setPitch(pitch);

                    }
                    // self.bound.min.x = data.bound[0];
                    // self.bound.min.y = data.bound[1];
                    // self.bound.min.z = data.bound[2];
                    // self.bound.max.x = data.bound[3];
                    // self.bound.max.y = data.bound[4];
                    // self.bound.max.z = data.bound[5];
                    // self.setDefaultDistanceRate(0.6);
                    // self.lookAnchor = data.pose != null && data.pose.lookAnchor != null ? data.pose.lookAnchor : {x:0.5,y:0.5};
                    // self.lookatLocation = data.pose != null && data.pose.lookatLocation != null ? data.pose.lookatLocation : self.bound.getCenter();
                    // self.rootObject.matrixAutoUpdate = false;
                    // self.rootObject.matrix = new THREE.Matrix4();
                    // if(data.pose != null && data.pose.matrix != null) {
                    //     self.rootObject.matrix.elements = data.pose.matrix;
                    // }
                    // self.defaultDistanceRate = data.pose != null && data.pose.defaultDistanceRate != null ?data.pose.defaultDistanceRate : 0.5;

                    if(callback) {
                        callback.call(self);
                    }
                });
            },
            _createSparse : function(name,callback) {
                var sparse = new ModelSparse();
                sparse.model3dView = this;
                sparse.camera = this.camera;
                this.sparses.push(sparse);
                this.rootObject.add(sparse.rootObject);
                sparse.setModelSrc(this.modelSrc+"/"+name,callback);
            }
            ,
            setModelSrc : function(modelSrc,callback) {
                this.clear();
                this.modelSrc = modelSrc;

                this._loadMeta(callback);
            },
            clear : function() {
                for(var i  = 0 ; i < this.sparses.length ;i++) {
                    this.sparses[i].clear();
                }
                this.sparses.length = 0;
            },
            /**
             * @depressed 请使用setModelSrc
             * @param modelId
             */
            setModelId: function (modelId) {
                this.setModelSrc(this.baseUrl + modelId);
            },
            /**
             * @depressed
             * @param url
             */
            setBaseUrl :function (url) {
                this.baseUrl=url;
            },
            /**
             * @depressed
             * @returns {string}
             */
            getBaseUrl :function () {
                return this.baseUrl;
            },
            onCameraLocationChanged: function () {
                for(var i = 0 ; i < this.sparses.length; i++) {
                    var sparse = this.sparses[i];
                    sparse.onCameraLocationChanged();
                }
            }
        });
})