let dynamic_play={};
dynamic_play.throttle = function (func, timeout, context) {
    var args;
    var timer;
    var previous;
    return function () {
        if (timer)
            clearTimeout(timer);

        if (previous == null)
            previous = performance.now();

        args = arguments;
        var timestamp = performance.now() - previous;
        if (timestamp >= timeout) {
            timer = null;
            previous = null;
            func.apply(context, args);
        } else {
            timer = setTimeout(function () {
                timer = null;
                previous = null;
                func.apply(context, args);
            }, timeout - timestamp);
        }
    }
};

dynamic_play.observeSize = (function () {
    if (!self.ResizeObserver)
        return null;

    var observer = new ResizeObserver(function (entries) {
        var rect;
        var callback;
        for (var i = 0; i < entries.length; i++) {
            callback = observer.callbacks[entries[i].target.observeId];
            if (callback == null)
                continue;

            rect = entries[i].contentRect;
            callback({ width: rect.width, height: rect.height });
        }
    });

    observer.observeId = 0;
    observer.callbacks = {};
    return function (target, callback) {
        var obs = observer;
        target.observeId = obs.observeId++;
        obs.observe(target);
        obs.callbacks[target.observeId] = callback;
    }
})();

dynamic_play.lerp = function (min, max, fraction) {
    return (max - min) * fraction + min;
};

dynamic_play.ease = function (fraction) {
    if (!dynamic_play.b3ease) dynamic_play.b3ease = new dynamic_play.CubicBezierEase(0.25, 0.1, 0.25, 1);
    return dynamic_play.b3ease.ease(fraction);
},

    dynamic_play.CubicBezierEase = (function () {
        function CubicBezierEase(p1x, p1y, p2x, p2y) {
            this.cX = 3 * p1x;
            this.bX = 3 * (p2x - p1x) - this.cX;
            this.aX = 1 - this.cX - this.bX;

            this.cY = 3 * p1y;
            this.bY = 3 * (p2y - p1y) - this.cY;
            this.aY = 1 - this.cY - this.bY;
        };

        CubicBezierEase.prototype.getX = function (t) {
            return t * (this.cX + t * (this.bX + t * this.aX));
        };

        CubicBezierEase.prototype.getXDerivative = function (t) {
            return this.cX + t * (2 * this.bX + 3 * this.aX * t);
        };

        CubicBezierEase.prototype.ease = function (x) {
            var prev,
                t = x;
            do {
                prev = t;
                t = t - ((this.getX(t) - x) / this.getXDerivative(t));
            } while (Math.abs(t - prev) > 1e-4);


            return t * (this.cY + t * (this.bY + t * this.aY));
        };

        return CubicBezierEase;
    })();

dynamic_play.TimeStep = (function () {
    function TimeStep(initParam) {
        this.start = initParam.start;
        this.current = initParam.start;
        this.end = initParam.end;
        this.time = 0;
        this.percent = 0;
        this.duration = initParam.duration;
        this.completed = false;
    };

    TimeStep.prototype.update = function (delta) {
        this.time += delta;
        this.percent = dynamic_play.ease(Math.min(this.time / this.duration, 1));

        var start, end;
        var isArray = false;
        if (Array.isArray(this.start)) {
            isArray = true;
            start = this.start;
        } else {
            start = [this.start, 0];
        }

        if (Array.isArray(this.end)) {
            isArray = true;
            end = this.end;
        } else {
            end = [this.end, 0];
        }

        if (isArray) {
            this.current = [dynamic_play.lerp(start[0], end[0], this.percent), dynamic_play.lerp(start[1], end[1], this.percent)];
        } else {
            this.current = dynamic_play.lerp(start[0], end[0], this.percent);
        }

        if (this.time >= this.duration) this.completed = true;
    };

    return TimeStep;
})();
dynamic_play.APNode = (function () {
    function APNode(initParam) {
        if (initParam == undefined) initParam = {};
        this.id = undefined;								// 内部属性，不可更改
        this.x = initParam.x;
        this.y = initParam.y;
        this.height = initParam.height;
        this.width = initParam.width;
        this.angle = initParam.angle;
        this.scale = initParam.scale;
        this.opacity = initParam.opacity;
        this.clip = initParam.clip;
        this.hideSlots = initParam.hideSlots;
        this.clipSlots = initParam.clipSlots;
        this.disableMask = initParam.disableMask;
        this.renderX = undefined;							// 内部属性，不可更改
        this.renderY = undefined;							// 内部属性，不可更改
        this.renderAngle = undefined;						// 内部属性，不可更改
        this.renderScale = undefined;						// 内部属性，不可更改
        this.renderOpacity = undefined;						// 内部属性，不可更改
        this.renderClip = undefined;						// 内部属性，不可更改
        this.mvp = new spine.webgl.Matrix4();				// 内部属性，不可更改
        this.skeleton = initParam.skeleton;					// 内部属性，不可更改
        this.name = initParam.name;							// 内部属性，不可更改
        this.action = initParam.action;						// 内部属性，不可更改
        this.loop = initParam.loop;
        this.loopCount = initParam.loopCount;
        this.speed = initParam.speed;
        this.onupdate = initParam.onupdate;
        this.oncomplete = initParam.oncomplete;
        this.completed = true;								// 内部属性，不可更改
        this.referNode = initParam.referNode;
        this.referFollow = initParam.referFollow;
        this.referBounds = undefined;						// 内部属性，不可更改
        this.timestepMap = {};								// 内部属性，不可更改
        this.flipX = initParam.flipX;
        this.flipY = initParam.flipY;
        this.player = initParam.player;
    };

    APNode.prototype.fadeTo = function (opacity, duration) {
        if (opacity != undefined) {
            // this.updateTimeStep('opacity', (this.opacity == undefined ? 1 : this.opacity), opacity, duration);
            this.opacity = opacity;
        }

        return this;
    }

    APNode.prototype.moveTo = function (x, y, duration) {
        if (x != undefined) {
            this.updateTimeStep('x', (this.x == undefined ? [0, 0.5] : this.x), x, duration);
            this.x = x;
        }

        if (y != undefined) {
            this.updateTimeStep('y', (this.y == undefined ? [0, 0.5] : this.y), y, duration);
            this.y = y;
        }

        return this;
    };

    APNode.prototype.scaleTo = function (scale, duration) {
        if (scale != undefined) {
            this.updateTimeStep('scale', (this.scale == undefined ? 1 : this.scale), scale, duration);
            this.scale = scale;
        }

        return this;
    };

    APNode.prototype.rotateTo = function (angle, duration) {
        if (angle != undefined) {
            this.updateTimeStep('angle', (this.angle == undefined ? 0 : this.angle), angle, duration);
            this.angle = angle;
        }

        return this;
    };

    APNode.prototype.update = function (e) {
        function calc(value, refer, dpr) {
            if (Array.isArray(value)) {
                return value[0] * dpr + value[1] * refer;
            } else {
                return value * dpr;
            }
        }

        var domX, domY, domDefaultX, domDefaultY;
        var dpr = e.dpr;
        var referSize = { width: e.canvas.width, height: e.canvas.height };
        var domNode = this.referNode instanceof HTMLElement ? this.referNode : undefined;
        if (domNode) {
            if (this.referFollow || !this.referBounds) {
                var rect = domNode.getBoundingClientRect();
                this.referBounds = {
                    x: rect.left,
                    y: {
                        height:document.body.clientHeight,
                        width:document.body.clientWidth,
                        updated:true
                    }.height - rect.bottom,
                    width: rect.width,
                    height: rect.height,
                };
            }

            referSize.height = this.referBounds.height * dpr;
            referSize.width = this.referBounds.width * dpr;
        }

        var timestep, percent;
        var renderX, renderY, renderScale, renderScaleX, renderScaleY;
        var skeletonSize = this.skeleton.bounds.size;

        timestep = this.timestepMap.x;
        if (timestep != undefined && !timestep.completed) {
            timestep.update(e.delta);
            renderX = calc(timestep.current, referSize.width, dpr);
        } else if (this.x != undefined) {
            renderX = calc(this.x, referSize.width, dpr);
        }

        timestep = this.timestepMap.y;
        if (timestep != undefined && !timestep.completed) {
            timestep.update(e.delta);
            renderY = calc(timestep.current, referSize.height, dpr);
        } else if (this.y != undefined) {
            renderY = calc(this.y, referSize.height, dpr);
        }

        if (this.width != undefined) renderScaleX = calc(this.width, referSize.width, dpr) / skeletonSize.x;
        if (this.height != undefined) renderScaleY = calc(this.height, referSize.height, dpr) / skeletonSize.y;

        if (domNode) {
            if (renderX == undefined) {
                renderX = (this.referBounds.x + this.referBounds.width / 2) * dpr;
            } else {
                renderX += this.referBounds.x * dpr;
            }

            if (renderY == undefined) {
                renderY = (this.referBounds.y + this.referBounds.height / 2) * dpr;
            } else {
                renderY += this.referBounds.y * dpr;
            }
        }

        this.mvp.ortho2d(0, 0, e.canvas.width, e.canvas.height);
        if (renderX != void 0 && renderY == void 0) {
            this.mvp.translate(renderX, 0, 0);
            this.mvp.setY(0);
        } else if (renderX == void 0 && renderY != void 0) {
            this.mvp.translate(0, renderY, 0);
            this.mvp.setX(0);
        } else if (renderX != void 0 && renderY != void 0) {
            this.mvp.translate(renderX, renderY, 0);
        } else {
            this.mvp.setPos2D(0, 0);
        }

        timestep = this.timestepMap.scale;
        if (timestep != undefined && !timestep.completed) {
            timestep.update(e.delta);
            renderScale = timestep.current;
        } else {
            renderScale = (this.scale == undefined ? 1 : this.scale);
        }

        if (renderScaleX && !renderScaleY) {
            renderScale *= renderScaleX;
        } else if (!renderScaleX && renderScaleY) {
            renderScale *= renderScaleY;
        } else if (renderScaleX && renderScaleY) {
            renderScale *= Math.min(renderScaleX, renderScaleY);
        } else {
            renderScale *= dpr;
        }

        if (renderScale != 1) {
            this.mvp.scale(renderScale, renderScale, 0);
        }

        timestep = this.timestepMap.angle;
        if (timestep != undefined && !timestep.completed) {
            timestep.update(e.delta);
            this.renderAngle = timestep.current;
        } else {
            this.renderAngle = this.angle;
        }

        if (this.renderAngle) {
            this.mvp.rotate(this.renderAngle, 0, 0, 1);
        }

        timestep = this.timestepMap.opacity;
        if (timestep != undefined && !timestep.completed) {
            timestep.update(e.delta);
            this.renderOpacity = timestep.current;
        } else {
            this.renderOpacity = this.opacity;
        }

        this.renderX = renderX; this.renderY = renderY; this.renderScale = renderScale;
        if (this.clip) {
            this.renderClip = {
                x: calc(this.clip.x, e.canvas.width, dpr),
                y: calc(this.clip.y, e.canvas.height, dpr),
                width: calc(this.clip.width, e.canvas.width, dpr),
                height: calc(this.clip.height, e.canvas.height, dpr)
            };
        }

        if (this.onupdate) this.onupdate();
    };

    APNode.prototype.setAction = function (action, transtion) {
        if (this.skeleton && this.skeleton.node == this) {
            if (this.skeleton.data.findAnimation(action) == null) return console.error('setAction: 未找到对应骨骼动作');
            transtion = transtion == undefined ? 0 : transtion / 1000;
            var entry = this.skeleton.state.setAnimation(0, action, this.loop);
            entry.mixDuration = transtion;
        } else {
            console.error('setAction: 节点失去关联');
        }
    };

    APNode.prototype.resetAction = function (transtion) {
        if (this.skeleton && this.skeleton.node == this) {
            transtion = transtion == undefined ? 0 : transtion / 1000;
            var entry = this.skeleton.state.setAnimation(0, this.skeleton.defaultAction, this.loop);
            entry.mixDuration = transtion;
        } else {
            console.error('resetAction: 节点失去关联');
        }
    };

    APNode.prototype.complete = function () {
        if (!this.oncomplete)
            return;

        if (typeof this.oncomplete == 'string') {
            var code = this.oncomplete;
            var a = code.indexOf('{');
            var b = code.lastIndexOf('}');
            if (a == -1 || b == -1) {
                this.oncomplete = undefined;
                return console.error(this.name + ' 的oncomplete函数语法错误');
            }

            this.oncomplete = new Function(code.substring(a + 1, b));
        }


        if (typeof this.oncomplete == 'function')
            this.oncomplete();
    };

    APNode.prototype.updateTimeStep = function (key, start, end, duration) {
        if (duration == undefined || duration == 0)
            return;

        var timestep = this.timestepMap[key];
        if (timestep) {
            timestep.start = timestep.completed ? start : timestep.current;
            timestep.end = end;
            timestep.time = 0;
            timestep.percent = 0;
            timestep.completed = false;
            timestep.duration = duration;
        } else {
            timestep = this.timestepMap[key] = new dynamic_play.TimeStep({
                start: start,
                end: end,
                duration: duration,
            });
        }

        return timestep;
    }

    return APNode;
})()
dynamic_play.AnimationPlayer = (function(){
    function AnimationPlayer (pathPrefix, parentNode, elementId) {
        if (!window.spine) return console.error('spine 未定义.');
        this.pathPrefix = pathPrefix
        var canvas;
        if (parentNode === 'offscreen') {
            canvas = elementId
            this.offscreen = true;
        } else {
            canvas = document.createElement('canvas');
            canvas.className = 'animation-player-dpbf';
            if (elementId != undefined) canvas.id = elementId;
            if (parentNode != undefined) parentNode.appendChild(canvas); 
        }
        
        var config = { alpha: true };
        var gl = canvas.getContext('webgl2', config);
        if (gl == undefined) {
            gl = canvas.getContext('webgl', config) || canvas.getContext('experimental-webgl', config);
        } else {
            gl.isWebgl2 = true;
        }
        
        if (gl) {
            this.spine = {
                shader: spine.webgl.Shader.newTwoColoredTextured(gl),
                batcher: new spine.webgl.PolygonBatcher(gl),
                skeletonRenderer: new spine.webgl.SkeletonRenderer(gl),
                assetManager: new spine.webgl.AssetManager(gl, pathPrefix),
                assets: {},
                skeletons: [],
            }
        } else {
            this.spine = { assets: {} };
            console.error('当前设备不支持 WebGL.');
        }
        
        this.gl = gl;
        this.canvas = canvas;
        this.$canvas = canvas;
        this.frameTime = undefined;
        this.running = false;
        this.resized = false;
        this.dpr = 1.2;
        this.nodes = [];
        this.BUILT_ID = 0;
        this._dprAdaptive = false;
        
        Object.defineProperties(this, {
            dprAdaptive: {
                get:function(){
                    return this._dprAdaptive;
                },
                set:function(value){
                    if (this._dprAdaptive == value) return;
                    this._dprAdaptive = value;
                    this.resized = false;
                },
            },
            useMipMaps: {
                get:function(){
                    if (!gl) return;
                    return this.gl.useMipMaps;
                },
                set:function(value){
                    if (!gl) return;
                    this.gl.useMipMaps = value;
                },
            }
        });
        
        if (!this.offscreen) {
            this.canvas.width = canvas.clientWidth;
            this.canvas.height = canvas.clientHeight;
        }
        
        this.check = function () {
            if (!this.gl) {
                function empty(){};
                var key;
                for (key in this.__proto__) {
                    if (typeof this.__proto__[key] == 'function') {
                        this.__proto__[key] = empty;
                    }
                }
                
                for (key in this) {
                    if (typeof this[key] == 'function' && key != 'check') {
                        this[key] = empty;
                    }
                }
                
            }
        };
        
        this.check();
    };
    
    AnimationPlayer.prototype.createTextureRegion = function (image, name) {
        var page = new spine.TextureAtlasPage();
        page.name = name;
        page.uWrap = spine.TextureWrap.ClampToEdge;
        page.vWrap = spine.TextureWrap.ClampToEdge;
        page.texture = this.spine.assetManager.textureLoader(image);
        page.texture.setWraps(page.uWrap, page.vWrap);
        page.width = page.texture.getImage().width;
        page.height = page.texture.getImage().height;
        
        
        
        var region = new spine.TextureAtlasRegion();
        region.page = page;
        region.rotate = false;
        region.width = page.width;
        region.height = page.height;
        region.x = 0;
        region.y = 0;
        region.u = region.x / page.width;
        region.v = region.y / page.height;
        if (region.rotate) {
            region.u2 = (region.x + region.height) / page.width;
            region.v2 = (region.y + region.width) / page.height;
        }
        else {
            region.u2 = (region.x + region.width) / page.width;
            region.v2 = (region.y + region.height) / page.height;
        }
        
        region.originalWidth = page.width;
        region.originalHeight = page.height;
        region.index = -1;
        region.texture = page.texture;
        region.renderObject = region;
        
        return region;
    };
    
    AnimationPlayer.prototype.hasSpine = function (filename) {
        return this.spine.assets[filename] != undefined;
    };
    
    AnimationPlayer.prototype.loadSpine = function (filename, skelType, onload, onerror) {
        skelType = skelType == undefined ? 'skel' : skelType.toLowerCase();
        var thisAnim = this;
        var reader = {
            name: filename,
            filename: filename,
            skelType: skelType,
            onsuccess: onload,
            onfailed: onerror,
            loaded: 0,
            errors: 0,
            toLoad: 2,
            onerror:function(path, msg){
                var _this = reader;
                _this.toLoad--;
                _this.errors++;
                if (_this.toLoad == 0) {
                    console.error('loadSpine: [' + _this.filename + '] 加载失败.');
                    if (_this.onfailed) _this.onfailed();
                }
            },
            onload:function(path, data){
                var _this = reader;
                _this.toLoad--;
                _this.loaded++;
                if (_this.toLoad == 0) {
                    if (_this.errors > 1) {
                        console.error('loadSpine: [' + _this.filename + '] 加载失败.');
                        if (_this.onfailed) _this.onfailed();
                    } else {
                        thisAnim.spine.assets[_this.filename] = { name: _this.filename, skelType: _this.skelType };
                        if (_this.onsuccess) _this.onsuccess();
                    }
                }
            },
            ontextLoad:function(path, data){
                var _this = reader;
                var imageName = null;
                var atlasReader = new spine.TextureAtlasReader(data);
                var prefix = '';
                var a = _this.name.lastIndexOf('/');
                var b = _this.name.lastIndexOf('\\');
                if (a != -1 || b != -1) {
                    if (a > b)
                        prefix = _this.name.substring(0, a + 1);
                    else
                        prefix = _this.name.substring(0, b + 1);
                }
                
                while (true) {
                    var line = atlasReader.readLine();
                    if (line == null) break;
                    line = line.trim();
                    
                    if (line.length == 0) {
                        imageName = null;
                    } else if (!imageName) {
                        imageName = line;
                        _this.toLoad++;
                        thisAnim.spine.assetManager.loadTexture(prefix + imageName,
                            _this.onload, _this.onerror);
                    } else {
                        continue;
                    }
                }
                
                _this.onload(path, data);
            },
        };
        
        if (skelType == 'json') {
            thisAnim.spine.assetManager.loadText(filename + '.json',
                reader.onload, reader.onerror);
        } else {
            thisAnim.spine.assetManager.loadBinary(filename + '.skel',
                reader.onload, reader.onerror);
        }
        thisAnim.spine.assetManager.loadText(filename + '.atlas',
            reader.ontextLoad, reader.onerror);
    };
    
    AnimationPlayer.prototype.prepSpine = function (filename, autoLoad) {
        var _this = this;
        var spineAssets = _this.spine.assets;
        if (!spineAssets[filename]) {
            if (autoLoad) {
                _this.loadSpine(filename, 'skel', function(){
                    _this.prepSpine(filename);
                });
                return 'loading';
            }
            return console.error('prepSpine: [' + filename + '] 骨骼没有加载');;
        }
        
        var skeleton;
        var skeletons = _this.spine.skeletons;
        for (var i = 0; i < skeletons.length; i++) {
            skeleton = skeletons[i];
            if (skeleton.name == filename && skeleton.completed) return skeleton;
        }
        
        var asset = spineAssets[filename];
        var manager = _this.spine.assetManager;
        var skelRawData = asset.skelRawData;
        if (!skelRawData) {
            var prefix = '';
            var a = filename.lastIndexOf('/');
            var b = filename.lastIndexOf('\\');
            if (a != -1 || b != -1) {
                if (a > b)
                    prefix = filename.substring(0, a + 1);
                else
                    prefix = filename.substring(0, b + 1);
            }
            var atlas = new spine.TextureAtlas(manager.get(filename + '.atlas'), function(path){
                return manager.get(prefix + path);
            });
            
            var atlasLoader = new spine.AtlasAttachmentLoader(atlas);
            if (asset.skelType.toLowerCase() == 'json') {
                skelRawData = new spine.SkeletonJson(atlasLoader);
            } else {
                skelRawData = new spine.SkeletonBinary(atlasLoader);
            }
            
            spineAssets[filename].skelRawData = skelRawData;
            spineAssets[filename].ready = true;
        }
        
        var data = skelRawData.readSkeletonData(manager.get(filename + '.' + asset.skelType));
        skeleton = new spine.Skeleton(data);
        
        skeleton.name = filename;
        skeleton.completed = true;
        skeleton.setSkinByName('default');
        skeleton.setToSetupPose();
        skeleton.updateWorldTransform();
        skeleton.state = new spine.AnimationState(new spine.AnimationStateData(skeleton.data));
        skeleton.state.addListener({
            complete:function(track){
                var node = skeleton.node;
                if (node) {
                    track.loop = (node.loop == undefined ? false : node.loop);
                    if (track.loop && node.loopCount > 0) {
                        node.loopCount--;
                        if (node.loopCount == 0) track.loop = false;
                    }
                    skeleton.completed = node.completed = !track.loop;
                    if (node.complete) node.complete();
                } else {
                    skeleton.completed = !track.loop;
                    console.error('skeleton complete: 超出预期的错误');
                }
            }
        });
        skeleton.bounds = { offset: new spine.Vector2(), size: new spine.Vector2() };
        skeleton.getBounds(skeleton.bounds.offset, skeleton.bounds.size, []);
        skeleton.defaultAction = data.animations[0].name;
        skeleton.node = undefined;
        skeletons.push(skeleton);
        return skeleton;
    };
    
    AnimationPlayer.prototype.playSpine = function (sprite, position){
        if (sprite == undefined) return console.error('playSpine: parameter undefined');
        if (typeof sprite == 'string') sprite = { name: sprite };
        if (!this.hasSpine(sprite.name)) return console.error('playSpine: [' + sprite.name + '] 骨骼没有加载');
        
        var skeletons = this.spine.skeletons;
        var skeleton;
        
        if (!(sprite instanceof dynamic_play.APNode && sprite.skeleton.completed)) {
            for (var i = 0; i < skeletons.length; i++) {
                skeleton = skeletons[i];
                if (skeleton.name == sprite.name && skeleton.completed) break;
                skeleton = null;
            }; if (!skeleton) skeleton = this.prepSpine(sprite.name);
            
            if (!(sprite instanceof dynamic_play.APNode)) {
                var param = sprite;
                sprite = new dynamic_play.APNode(sprite);
                sprite.id = param.id == undefined ? this.BUILT_ID++ : param.id;
                this.nodes.push(sprite);
                
            }
            
            sprite.skeleton = skeleton;
            skeleton.node = sprite;
        }
        
        sprite.completed = false;
        skeleton.completed = false;
        
        if (position != undefined) {
            sprite.x = position.x;
            sprite.y = position.y;
            sprite.height = position.height;
            sprite.width = position.width;
            sprite.scale = position.scale;
            sprite.angle = position.angle;
            sprite.referNode = position.parent;
            sprite.referFollow = position.follow;
        }
        
        var entry = skeleton.state.setAnimation(0, sprite.action ? sprite.action : skeleton.defaultAction, sprite.loop);
        entry.mixDuration = 0;
        if (this.requestId == undefined) {
            this.running = true;
            if (!this.offscreen) this.canvas.style.visibility = 'visible';
            this.requestId = requestAnimationFrame(this.render.bind(this));
        }
        
        sprite.referBounds = undefined;
        return sprite;
    };
    
    AnimationPlayer.prototype.loopSpine = function (sprite, position) {
        if (typeof sprite == 'string') {
            sprite = {
                name: sprite,
                loop: true,
            }
        } else {
            sprite.loop = true;
        }
        
        return this.playSpine(sprite, position);
    };
    
    AnimationPlayer.prototype.stopSpine = function (sprite) {
        var nodes = this.nodes;
        var id = sprite.id == undefined ? sprite : sprite.id;
        for (var i = 0; i < nodes.length; i++) {
            sprite = nodes[i];
            if (sprite.id == id) {
                if (!sprite.completed) {
                    sprite.completed = true;
                    sprite.skeleton.state.setEmptyAnimation(0);
                }
                return sprite;
            }
        }
        
        return null;
    };
    
    AnimationPlayer.prototype.stopSpineAll = function () {
        var sprite;
        var nodes = this.nodes;
        for (var i = 0; i < nodes.length; i++) {
            sprite = nodes[i];
            if (!sprite.completed) {
                sprite.completed = true;
                sprite.skeleton.state.setEmptyAnimation(0);
            }
        }
    };
    AnimationPlayer.prototype.changeSkin = function(paths, sprite, onload = ()=>{
        this.nodes = []
        let dynamic=this.playSpine(sprite)
        var animation = dynamic.skeleton.data.findAnimation("ChuChang");
        if (animation) {
            try {
                dynamic.skeleton.state.addAnimation(0,"DaiJi",true,-0.01);
            } catch (error) {
                dynamic.skeleton.state.addAnimation(0,"BeiJing",true,-0.01);
            }
        }
    }){
        let i = 0
        paths.forEach(path=>{
            sprite.name = path
            this.loadSpine(path, 'skel', onload)
        })
    }
    AnimationPlayer.prototype.getSpineActions = function (filename) {
        if (!this.hasSpine(filename)) return console.error('getSpineActions: [' + filename + '] 骨骼没有加载');;
        
        var skeleton;
        var skeletons = this.spine.skeletons;
        for (var i = 0; i < skeletons.length; i++) {
            skeleton = skeletons[i];
            if (skeleton.name == filename) break;
            skeleton = undefined;
        }
        
        if (skeleton == undefined) skeleton = this.prepSpine(filename);
        var actions = skeleton.data.animations;
        var result = new Array(actions.length);
        for (var i = 0; i < actions.length; i++) result[i] = { name: actions[i].name, duration: actions[i].duration };
        return result;
    };
    
    AnimationPlayer.prototype.getSpineBounds = function (filename) {
        if (!this.hasSpine(filename)) return console.error('getSpineBounds: [' + filename + '] 骨骼没有加载');;
        
        if (!this.resized) {
            var dpr = 1;
            if (this.dprAdaptive == true)
                dpr = Math.max(window.devicePixelRatio * (window.documentZoom ? window.documentZoom : 1), 1);
            
            canvas.elementHeight = canvas.clientHeight;
            canvas.elementWidth = canvas.clientWidth;
            canvas.height = canvas.elementHeight * dpr;
            canvas.width = canvas.elementWidth * dpr;
        }
        
        var skeleton;
        var skeletons = this.spine.skeletons;
        for (var i = 0; i < skeletons.length; i++) {
            skeleton = skeletons[i];
            if (skeleton.name == filename) break;
            skeleton = undefined;
        }
        
        if (skeleton == undefined) skeleton = this.prepSpine(filename);
        return skeleton.bounds;
    };
    
    AnimationPlayer.prototype.render = function (timestamp) {
        var canvas = this.canvas;
        var offscreen = this.offscreen;
        var dpr = 1;
        if (this.dprAdaptive) {
            if (offscreen)
                dpr = this.dpr != undefined ? this.dpr : 1;
            else
                dpr = Math.max(window.devicePixelRatio * (window.documentZoom ? window.documentZoom : 1), 1);
        }
        var delta = timestamp - ((this.frameTime == undefined) ? timestamp : this.frameTime);
        this.frameTime = timestamp;
        
        var erase = true;
        var resize = !this.resized || canvas.width == 0 || canvas.height == 0;
        if (resize) {
            this.resized = true;
            if (!offscreen) {
                canvas.width  = dpr * canvas.clientWidth;
                canvas.height = dpr * canvas.clientHeight;
                erase = false;
            } else {
                if (this.width)  {
                    canvas.width  = dpr * this.width;
                    erase = false;
                }
                if (this.height) {
                    canvas.height = dpr * this.height;
                    erase = false;
                }
            }
        }
        
        var ea = {
            dpr: dpr,
            delta: delta,
            canvas: canvas,
            frameTime: timestamp,
        };
        
        var nodes = this.nodes;
        for (var i = 0; i < nodes.length; i++) {
            if (!nodes[i].completed) {
                nodes[i].update(ea);
            } else {
                nodes.remove(nodes[i]);i--;
            }
        }
        
        var gl = this.gl;
        gl.viewport(0, 0, canvas.width, canvas.height);
        if (erase) {
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
        
        if (nodes.length == 0) {
            this.frameTime = void 0;
            this.requestId = void 0;
            this.running = false;
            if (!offscreen) this.canvas.style.visibility = 'hidden';
            return;
        }
        
        var sprite, state, skeleton;
        var shader = this.spine.shader;
        var batcher = this.spine.batcher;
        var renderer = this.spine.skeletonRenderer;
        
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(0, 0, canvas.width, canvas.height);
        
        if (this.bindShader == undefined) {
            this.bindShader = shader;
            shader.bind();
            shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
        }
        
        var speed;
        for (var i = 0; i < nodes.length; i++) {
            sprite = nodes[i];
            if (sprite.renderClip != undefined) {
                gl.clipping = sprite.renderClip;
                gl.scissor(gl.clipping.x, gl.clipping.y, gl.clipping.width, gl.clipping.height);
            }
            
            skeleton = sprite.skeleton;
            state = skeleton.state;
            speed = sprite.speed == undefined ? 1 : sprite.speed;
            skeleton.flipX = sprite.flipX;
            skeleton.flipY = sprite.flipY
            skeleton.opacity = (sprite.renderOpacity == undefined ? 1 : sprite.renderOpacity);
            state.hideSlots = sprite.hideSlots;
            state.update(delta / 1000 * speed);
            state.apply(skeleton);
            skeleton.updateWorldTransform();
            
            shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, sprite.mvp.values);
            batcher.begin(shader);
            renderer.premultipliedAlpha = sprite.premultipliedAlpha;
            renderer.outcropMask = this.outcropMask;
            if (renderer.outcropMask) {
                renderer.outcropX = sprite.renderX;
                renderer.outcropY = sprite.renderY;
                renderer.outcropScale = sprite.renderScale;
                renderer.outcropAngle = sprite.renderAngle;
                renderer.clipSlots = sprite.clipSlots;
            }
            
            renderer.hideSlots = sprite.hideSlots;
            renderer.disableMask = sprite.disableMask;
            renderer.draw(batcher, skeleton);
            batcher.end();
            
            if (gl.clipping) {
                gl.clipping = undefined;
                gl.scissor(0, 0, canvas.width, canvas.height);
            }
        }
        
        gl.disable(gl.SCISSOR_TEST);
        
        this.requestId = requestAnimationFrame(this.render.bind(this));
    };
    
    
    return AnimationPlayer;
})();

dynamic_play.AnimationPlayerPool = (function(){
    function AnimationPlayerPool(size, pathPrefix, thisName){
        if (!self.spine) return console.error('spine 未定义.');
        
        this.name = thisName;
        this.animations = new Array(size ? size : 1);
        for (var i = 0; i < this.animations.length; i++) {this.animations[i] = new dynamic_play.AnimationPlayer(pathPrefix);this.animations[i].canvas.classList.add('anicap')}
        
    };
    
    AnimationPlayerPool.prototype.loadSpine = function (filename, skelType, onload, onerror) {
        var thisAnim = this;
        thisAnim.animations[0].loadSpine(filename, skelType, function(){
            var ap;
            var aps = thisAnim.animations;
            for (var i = 1; i < aps.length; i++) {
                ap = aps[i];
                ap.loadSpine(filename ,skelType,onload,onerror)
            }
            
            if (onload) onload(filename, skelType ,onload ,onerror);
        }, onerror);
    };
    
    AnimationPlayerPool.prototype.playSpineTo = function (element, animation, position) {
        var animations = this.animations;
        if (position && position.parent) {
            position.parent = undefined;
            console.log('playSpineTo: position.parent 参数已忽略');
        }
        if (element._ap && element._ap.canvas.parentNode == element) {
            element._ap.playSpine(animation, position);
            return;
        }
        
        for (var i = 0; i < animations.length; i++) {
            if (!animations[i].running) {
                if (animations[i].canvas.parentNode != element) {
                    element._ap = animations[i];
                    element.appendChild(animations[i].canvas);
                }
                animations[i].playSpine(animation, position);
                return;
            }
        }
        
        console.error('spine:' + (this.name != null ? this.name : '' + '可用动画播放组件不足'));
        
    };
    
    return AnimationPlayerPool;
})();

dynamic_play.BUILT_ID = 0;
dynamic_play.DynamicWorkers = new Array(2);
dynamic_play.DynamicPlayer = (function(){
    function DynamicPlayer(pathPrefix){
        if(pathPrefix.indexOf('../')<0)pathPrefix='../'+pathPrefix
        this.id = dynamic_play.BUILT_ID++;
        this.dpr = 1;
        this.width = 120;
        this.height = 210;
        this.dprAdaptive = false;
        this.BUILT_ID = 0;
        if(lib.config['extension_十周年UI_newDecadeStyle'] == 'on'){
        }
        var offscreen = self.OffscreenCanvas != undefined;
        if (offscreen) {
            offscreen = false;
            var workers = dynamic_play.DynamicWorkers;
            for (var i = 0; i < workers.length; i++) {
                if (workers[i] == undefined) {
                    workers[i] = new Worker(dpbf.path+'js/dynamicSkinWorker.js');
                    workers[i].capacity = 0;
                } else if (workers[i].capacity >= 4) {
                    continue;
                }
                
                this.renderer = workers[i];
                this.canvas = document.createElement('canvas');
                this.canvas.className = 'animation-player-dpbf dynamicPlayer';
                dynamic_play.observeSize(this.canvas, dynamic_play.throttle(function(newSize){
                    this.height = Math.round(newSize.height);
                    this.width  = Math.round(newSize.width);
                    this.update();
                }, 100, this));
                
                var canvas = this.canvas.transferControlToOffscreen();
                workers[i].postMessage({
                    message: 'CREATE',
                    id: this.id,
                    canvas: canvas,
                    pathPrefix: pathPrefix,
                }, [canvas]);
                
                workers[i].capacity++;
                this.offscreen = offscreen = true;
                break;
            }
        }
        
        if (!offscreen) {
            var renderer = new dynamic_play.AnimationPlayer(dpbf.path + pathPrefix);
            this.canvas = renderer.canvas;
            this.renderer = renderer;
        }
    }
    DynamicPlayer.prototype.createDynamicbackground = function(sprite){
        Object.assign(sprite.dynamicBackground,{
            x:sprite.x,
            y:sprite.y,
            scale:sprite.scale
        })
        if(lib.config['extension_十周年UI_newDecadeStyle'] == 'on'){
        }
        this.renderer.postMessage({
            id:this.id,
            dynamicId:this.BUILT_ID++,
            message:'CREATEDYNAMICBACKGROUND',
            sprite:sprite.dynamicBackground,
        })
        sprite.dynamicBackground.id = this.BUILT_ID
        return sprite.dynamicBackground
    }
    DynamicPlayer.prototype.play = function (sprite, deputy = false) {
        var sprite = (typeof sprite == 'string') ? { name: sprite } : sprite;
        sprite.id = this.BUILT_ID++;
        sprite.loop = true;
        this.style = sprite
        if(sprite.background&&!sprite.dynamicBackground){
            let bg=document.createElement('div')
            bg.classList.add('bg-dpbf')
            bg.style.backgroundImage="url("+"'"+dpbf.path+"images/dynamic_bg/"+sprite.background+"')"
            this.parentNode.appendChild(bg)
        }
        else if(sprite.dynamicBackground){
            // let dynamic = new dynamic_play.DynamicPlayer('images/dynamicBackground/')
            // dynamic.play(sprite.dynamicBackground)
            // dynamic.canvas.classList.add('dynamicBackground')
            // this.parentNode.appendChild(dynamic.canvas)
            // this.parentNode.dynamic_bg = dynamic
            
        }
        if (this.offscreen) {
            if (!this.initialized) {
                this.initialized = true;
                this.dpr = Math.max(window.devicePixelRatio * (window.documentZoom ? window.documentZoom : 1), 1);
                this.height = this.canvas.clientHeight;
                this.width = this.canvas.clientWidth;
            }
            
            if (typeof sprite.oncomplete == 'function')
                sprite.oncomplete = sprite.oncomplete.toString();
            
            this.renderer.postMessage({
                message: 'PLAY',
                id: this.id,
                dpr: this.dpr,
                dprAdaptive: this.dprAdaptive,
                outcropMask: true,
                useMipMaps: this.useMipMaps,
                width: this.width,
                height: this.height,
                sprite: sprite,
            });
        } else {
            var dynamic = this.renderer;
            dynamic.useMipMaps = this.useMipMaps;
            dynamic.dprAdaptive = this.dprAdaptive;
            dynamic.outcropMask = this.outcropMask;
            var run = function () {
                var t = dynamic.playSpine(sprite);
                t.opacity = 0;
                t.fadeTo(1, 600);
            };
            
            if (dynamic.hasSpine(sprite.name)) {
                run();
            } else {
                dynamic.loadSpine(sprite.name, 'skel', run);
            }
        }
        return sprite
    };
    
    DynamicPlayer.prototype.stop = function (sprite) {
        if (this.offscreen) {
            this.renderer.postMessage({
                message: 'STOP',
                id: this.id,
                sprite: sprite,
            });
            return;
        }
        
        this.renderer.stopSpine(sprite);
    };
    
    DynamicPlayer.prototype.setDyAction = function (sprite) {
        var dynamic = this.renderer;
    }
    
    DynamicPlayer.prototype.stopAll = function () {
        if (this.offscreen) {
            this.renderer.postMessage({
                message: 'STOPALL',
                id: this.id
            });
            return;
        }
        
        this.renderer.stopSpineAll();
    };
    
    DynamicPlayer.prototype.update = function (force) {
        if (!this.offscreen) {
            this.renderer.resized = false;
            this.renderer.useMipMaps = this.useMipMaps;
            this.renderer.dprAdaptive = this.dprAdaptive;
            this.renderer.outcropMask = this.outcropMask;
            return;
        }
        
        this.dpr = Math.max(window.devicePixelRatio * (window.documentZoom ? window.documentZoom : 1), 1);
        if (force === false)
            return;
        
        this.renderer.postMessage({
            message: 'UPDATE',
            id: this.id,
            dpr: this.dpr,
            dprAdaptive: this.dprAdaptive,
            outcropMask: this.outcropMask,
            useMipMaps: this.useMipMaps,
            width: this.width,
            height: this.height,
        });
    }
    
    return DynamicPlayer;
})();
