

game.import("extension", function (lib, game, ui, get, ai, _status) {
    HTMLCanvasElement.prototype.getWebGL = function () {
        var gl = this.getContext('webgl2');
        if (gl == undefined) {
            gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        }
        return gl
    }
    window.dpbf = {
        status: _status,
        path: lib.assetURL + 'extension/动皮播放/',
        ui: ui,
        lib: lib,
        game: game,
        default: {},
        cardData: {},
        logSkill:lib.element.player.logSkill,
        isSkill:function (name) {
            let info = lib.skill[name]
            return info && game.expandSkills(this.skills).contains(name)
        },
        inits: {
            initSvg() {
                let SVG_NS = 'http://www.w3.org/2000/svg';
                let svg = document.body.appendChild(document.createElementNS(SVG_NS, 'svg'));
                let defs = svg.appendChild(document.createElementNS(SVG_NS, 'defs'));
                let dskin = defs.appendChild(document.createElementNS(SVG_NS, 'clipPath'));
                let dskinPath = dskin.appendChild(document.createElementNS(SVG_NS, 'path'));
                dskin.id = 'dskin-clip-dpbf'
                dskinPath.setAttribute('d', "M 0 0 l 120,0 l 0,20 l -8,0 q 8,0 8,8 l 0,164 q 0,8 -8,8 l -104,0 q -8,0 -8,-8 v -164 q 0,-8 8,-8 h -8 v -20")
            },
            initFunc() {
                let app = PIXI_dpbf.app
                if (dpbf.default.line_data) {
                    lib.element.player.line = function (target, config) {
                        if (!dpbf.default.shouji_data) return;
                        if (get.itemtype(target) == 'players') {
                            let targets = target.concat()
                            targets.remove(this)
                            this.playLineAnimate(targets, dpbf.default.line_data, dpbf.default.shouji_data)
                        }
                        else if (get.itemtype(target) == 'player' && target != this) {
                            this.playLineAnimate([targets], dpbf.default.line_data, dpbf.default.shouji_data)
                        }
                    }
                }
                Object.assign(lib.element.player,{
                    playDynamic_skel:function (skin) {
                        let player = this
                        if(!player.node.dpbf_huanfu){
                            let huanfu = ui.create.div(`.dpbf-huanfu${player == game.me ? '-me' : ''}`, player, () => {
                                let skins = player.dpbf_datas, skins_box = ui.create.div('.skins-box', ui.window, () => {
                                    skins_box.remove()
                                }), skins_border = ui.create.div('.skins-border', skins_box)
                                skins.forEach((item, index) => {
                                    let item_skin = ui.create.div('.huanfu-item', `动皮${get.cnNumber(index + 1, true)}`, skins_border, () => {
                                        player.toggleDynamic(item_skin.index)
                                    })
                                    let skin = item[6]
                                    if (dpbf.dynamicBase[skin.name]) item_skin.style.backgroundImage = `url(${dpbf.dynamicBase[skin.name]})`
                                    item_skin.index = index
                                })
                            })
                            player.node.dpbf_huanfu = huanfu
                        }
                        if (dpbf.dynamicBase[skin.name]) player.node.avatar.style.backgroundImage = `url(${dpbf.dynamicBase[skin.name]})`
                        player.doing = true
                        if (player == game.me) {
                            let jingF = () => {
                                dpbf.ani.cap.playSpineTo(player, 'huanfu', player)
                                let _this = jing
                                _this.pl.doing = false
                                _this.pl.dynamic_skel.forEach(item => item.canvas.remove())
                                _this.remove()
                                _this.pl.node.avatar.classList.remove('dy_avatar')
                                ui.window.appendChild(dong)
                            }
                            let dongF = () => {
                                dpbf.ani.cap.playSpineTo(player, 'huanfu', player)
                                dong.classList.remove('useDong')
                                dong.classList.add('useJing')
                                setTimeout(() => {
                                    let _this = dong
                                    _this.classList.remove('useJing')
                                    _this.classList.add('useDong')
                                    _this.pl.doing = true
                                    _this.pl.node.border && _this.pl.appendChild(_this.pl.node.border)
                                    _this.pl.dynamic_skel.forEach(item => _this.pl.appendChild(item.canvas))
                                    _this.remove()
                                    _this.pl.node.avatar.classList.add('dy_avatar')
                                    ui.window.appendChild(jing)
                                }, 1000)
                            }
                            let jing = ui.create.div('.useJing', ui.window)
                            jing.pl = player
                            let dong = ui.create.div('.useDong')
                            dong.pl = player
                            jing.addEventListener('click', jingF)
                            dong.addEventListener('click', dongF)
                            jing.addEventListener('touchend', jingF)
                            dong.addEventListener('touchend', dongF)
                        }
                        let app = player.dynamic_skel ? player.dynamic_skel[0].app : false
                        let daiji = new LayaDynamic.DynamicPlayer_skel(`${dpbf.path}${skin.name}daiji.${skin.type || 'skel'}`, player, false, app)
                        daiji.play(skin)
                        let beijing
                        setTimeout(() => {
                            beijing = new LayaDynamic.DynamicPlayer_skel(`${dpbf.path}${skin.name}beijing.${skin.type || 'skel'}`, player, true, daiji.app)
                            beijing.play(skin, true)
                            player.dynamic_skel = [daiji, beijing]
                        }, 0)
                        let border = ui.create.div('.headBorder', player)
                        border.setAttribute(`border-${player.group}`, player.group)
                        if (!(['qun', 'wei', 'shu', 'wu', 'ye', 'jin', 'shen'].includes(player.group))) border.setAttribute(`border-${'qun'}`, player.group)
                        player.node.border = border
                        player.node.avatar.classList.add('dy_avatar')
                    },
                    playLineAnimate : function (targets, linedata, shoujidata) {
                        for (let target of targets) {
                            let skeleton = new PIXI_dpbf.spine.Spine(linedata.spineData)
                            let style = getComputedStyle(target), style1 = getComputedStyle(this)
                            skeleton.x = parseInt(style.left) + 90
                            skeleton.y = parseInt(style.top) + 150
                            let angle = this.getAngle.call({ left: parseInt(style1.left), top: parseInt(style1.top) }, target)
                            skeleton.angle = angle
                            skeleton.state.setAnimation(0, 'play')
                            app.stage.addChild(skeleton)
                            setTimeout(() => {
                                let shouji = new PIXI_dpbf.spine.Spine(shoujidata.spineData)
                                shouji.state.setAnimation(0, 'play')
                                shouji.x = skeleton.x
                                shouji.y = skeleton.y + 10
                                shouji.scale.set(0.75)
                                app.stage.addChild(shouji)
                                skeleton.destroy()
                                setTimeout(() => { shouji.destroy() }, shouji.spineData.findAnimation('play').duration * 1000)
                            }, skeleton.spineData.findAnimation('play').duration * 1000)
                        }
                    },
                    getAngle : function (target) {
                        let style1 = getComputedStyle(target);
                        let style2 = this;
                        let left1 = parseInt(style1.left);
                        let left2 = parseInt(style2.left);
                        let top1 = parseInt(style1.top);
                        let top2 = parseInt(style2.top);
                        let radian = Math.atan2(top1 - top2, left1 - left2); // 返回来的是弧度
                        return 180 / Math.PI * radian
                    },
                    getSkills : function (arg2, arg3, arg4) {
                        var skills = this.skills.slice(0);
                        var es = [];
                        var i, j;
                        if (arg3 !== false) {
                            for (i = 0; i < this.node.equips.childElementCount; i++) {
                                if (!this.node.equips.childNodes[i].classList.contains('removing')) {
                                    var equipskills = get.info(this.node.equips.childNodes[i], false).skills;
                                    if (equipskills) {
                                        es.addArray(equipskills);
                                    }
                                }
                            }
                            if (arg2 == 'e') {
                                return es;
                            }
                        }
                        for (var i in this.additionalSkills) {
                            if (Array.isArray(this.additionalSkills[i]) && (arg2 || i.indexOf('hidden:') !== 0)) {
                                for (j = 0; j < this.additionalSkills[i].length; j++) {
                                    if (this.additionalSkills[i][j]) {
                                        skills.add(this.additionalSkills[i][j]);
                                    }
                                }
                            }
                            else if (this.additionalSkills[i] && typeof this.additionalSkills[i] == 'string') {
                                skills.add(this.additionalSkills[i]);
                            }
                        }
                        for (var i in this.tempSkills) {
                            skills.add(i);
                        }
                        if (arg2) skills.addArray(this.hiddenSkills);
                        if (arg3 !== false) skills.addArray(es);
                        for (var i in this.forbiddenSkills) {
                            skills.remove(i);
                        }
                        if (arg4 !== false) {
                            skills = game.filterSkills(skills, this, es);
                        }
                        if (dpbf.dynamicSkills[this.name] && (this.dynamic_skel || this.dpbf_dynamics || this.dynamic_dpbf || this.$dynamicWrap)) skills.add(dpbf.dynamicSkills[this.name].name)
                        return skills;
                    },
                    logSkill : function(name, targets, nature, logv) {
                        dpbf.logSkill.apply(this, arguments)
                        let isSkill = function (name) {
                            let info = lib.skill[name]
                            return info && game.expandSkills(this.skills).contains(name)
                        }
                        if (dpbf.isSkill.call(this, name)) {
                            let res
                            if (this.dynamic_dpbf) res = dpbf.checkCanBeAction(this)
                            this.dynamic_dpbf && this.dynamic_dpbf.renderer.postMessage({
                                message: 'ACTION',
                                id: this.dynamic_dpbf.id,
                                action: 'TeShu',
                                skinID: res.dynamic.id
                            })
                            this.dynamic_skel && this.dynamic_skel[0].source && this.dynamic_skel[0].chuchang(game.me == this)
                            this.spine_source && this.playDpbf_dynamic(null, 'jineng')
                        }
                    },
                    toggleDynamic : function (number) {
                        let player = this
                        let skin = dpbf.dynamicSkins[this.name][number]
                        let dynamics = this.dynamic_skel
                        let datas = this.dpbf_datas[number]
                        let [daiji, beijing, chuchang_data, chuchang_single_data, line_single_data, shouji_single_data] = datas
                        let app = dynamics[0].app
                        app.stage.removeChild(dynamics[0].skeleton)
                        app.stage.addChild(daiji)
                        dynamics[0].skeleton = daiji
                        app.stage.removeChild(dynamics[1].skeleton)
                        app.stage.addChild(beijing)
                        dynamics[1].skeleton = beijing
                        dynamics[0].sprite = skin
                        //特效方面 
                        {
                            dynamics[0].source = chuchang_data
                            dynamics[0].chuchang_source = chuchang_single_data
                            this.line_single = line_single_data
                            this.shouji_single = shouji_single_data
                        } setTimeout(() => {
                            daiji.state.setAnimation(0, 'play', true)
                            beijing.state.setAnimation(0, 'play', true)
                        }, 100)
                        setTimeout(() => {
                            if (!dpbf.dynamicBase[skin.name]) dowland(dynamics[0].canvas, () => {
                                player.node.avatar.style.backgroundImage = `url(${dpbf.dynamicBase[skin.name]})`
                            })
                            else player.node.avatar.style.backgroundImage = `url(${dpbf.dynamicBase[skin.name]})`
                        }, 200)
                        dpbf.dynamicIndex[player.name] = number
                        async function dowland(canvas, callback) {
                            let name = skin.name
                            dpbf.dynamicBase[name] = `${dpbf.path}${name}daijiSkin.png`
                            let bases = JSON.stringify(dpbf.dynamicBase, null, '\t')
                            dpbf.writeFile(bases, dpbf.path + 'js/', 'base64.json')
                            dpbf.writeImg(canvas, `${dpbf.path}${name}`, 'daijiSkin.png', callback)
                        }
                    },
                    playDynamic_dpbf : function (sprite, deputy) {
                        let width = this.doubleAvatar ? [0, 0.5] : [0, 1]
                        function clip(sprite, back) {
                            let height = lib.config['extension_十周年UI_newDecadeStyle'] == 'on' ? [back ? 180 : 200, 0] : [0, 1]
                            if (deputy) {
                                sprite.x = sprite.x ? [sprite.x[0], sprite.x[1] + 0.25] : [0, 0.75]
                                sprite.clip = {
                                    x: [0, 0.5],
                                    y: [0, 0],
                                    height,
                                    width
                                }
                            }
                            else {
                                sprite.x = sprite.x ? [sprite.x[0], sprite.x[1] - 0.25] : [0, 0.75]
                                sprite.clip = {
                                    x: [0, 0],
                                    y: [0, 0],
                                    height,
                                    width
                                }
                            }
                        }
                        this.doubleAvatar && clip(sprite)
                        sprite.dynamicBackground && clip(sprite.dynamicBackground, true)
                        let osprite = JSON.parse(JSON.stringify(sprite))
                        let dynamic = this.dynamic_dpbf ? this.dynamic_dpbf : new dynamic_play.DynamicPlayer('images/dynamicSkins/')
                        !deputy && dynamic.renderer.postMessage({
                            message: 'CLEAN',
                            id: dynamic.id
                        })
                        if (lib.config['extension_十周年UI_newDecadeStyle'] == 'on' && sprite.x) sprite.x[1] += 0.1
                        dynamic.parentNode = sprite.background ? this.node.avatar : lib.config['extension_十周年UI_newDecadeStyle'] == 'on' ? ui.create.div('.dynmaic-wrap-dpbf', this) : this
                        let avatar = dynamic.play(sprite, deputy)
                        !deputy ? dynamic.avatar = avatar : dynamic.primary = avatar
                        this.dpbf = this.dpbf || {}
                        this.dpbf.dynamic = dynamic
                        this.dpbf.canvas = dynamic.canvas
                        this.appendChild(dynamic.canvas)
                        this.node[deputy ? 'avatar2' : 'avatar'].classList.add('dy_avatar')
                        this.dynamic_dpbf = dynamic
                        this.dynamic_dpbf[deputy ? 'primary' : 'avatar'].style = osprite
                        let dpbf_path = this.dynamic_dpbf[deputy ? 'primary' : 'avatar']['path'] = '../dynamicSkins/' + sprite.name
                        this.dynamic_dpbf[deputy ? 'primary' : 'avatar']['dynamicBackground'] = dynamic.createDynamicbackground(sprite)
                        if (sprite.image) {
                            this.node[deputy ? 'avatar2' : 'avatar'].style.backgroundImage = `url(${dpbf.path}images/skin/skins/${sprite.image})`
                        }
                        dpbf.ani.loadSpine(dpbf_path, 'skel', () => {
                            let sk = dpbf.ani.playSpine(dpbf_path);
                            dpbf.ani.nodes.remove(sk)
                            let animation = sk.skeleton.data.animations.filter(item => item.name == 'GongJi')[0]
                            if (!animation) {
                                delete this.dynamic_dpbf[deputy ? 'primary' : 'avatar']['path']
                            }
                            else{
                                this.dynamic_dpbf[deputy ? 'primary' : 'avatar'].gongji.time = animation.duration * 1000
                            }
                        })
                        return sprite
                    },
                    playDpbf_dynamic : function (position, action) {
                        let x = getComputedStyle(this).left, y = getComputedStyle(this).top
                        x = parseInt(x)
                        y = parseInt(y)
                        this != game.me ? y += 300 : y = y
                        if (action == 'jineng') {
                            let skeleton = new PIXI_dpbf.spine.Spine(this.spine_source.spineData)
                            skeleton.scale.set(0.7)
                            skeleton.x = x
                            skeleton.y = y
                            app.stage.addChild(skeleton)
                            if (skeleton.spineData.animations.filter(item => item.name == 'jineng')[0]) {
                                skeleton.state.setAnimation(0, 'jineng')
                                setTimeout(() => {
                                    skeleton.destroy()
                                }, skeleton.spineData.animations.filter(item => item.name == 'jineng')[0].duration * 1000)
                            }
                        }
                        if (action == 'chuchang') {
                            let skeleton = new PIXI_dpbf.spine.Spine(this.chuchang_source.spineData)
                            skeleton.x = x
                            skeleton.y = y
                            app.stage.addChild(skeleton)
                            skeleton.scale.set(0.8)
                            if (skeleton.spineData.animations.filter(item => item.name == 'play')[0]) {
                                skeleton.state.setAnimation(0, 'play')
                                setTimeout(() => {
                                    skeleton.destroy()
                                }, skeleton.spineData.animations.filter(item => item.name == 'play')[0].duration * 1000)
                            }
                        }
                        if (action == 'line') {
                            for (let target of position.targets) {
                                function getDistance(sk, target) {
                                    let style = getComputedStyle(target)
                                    let x1 = sk.left
                                    let y1 = sk.top
                                    let x2 = parseInt(style.left) / game.documentZoom
                                    let y2 = parseInt(style.top) / game.documentZoom
                                    return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2))
                                }
                                let sk = position.sk
                                let skeleton = new PIXI_dpbf.spine.Spine(this.line_single.spineData)
                                skeleton.x = parseInt(target.offsetLeft) + (target.offsetWidth * game.documentZoom / 2) + 15
                                skeleton.y = parseInt(target.offsetTop) + 50 + (target.offsetHeight * game.documentZoom / 2)
                                let style = { left: sk.left, top: sk.top }
                                let angle = this.getAngle.call(style, target)
                                skeleton.angle = angle
                                skeleton.state.setAnimation(0, 'play')
                                skeleton.width = getDistance(sk, target)
                                app.stage.addChild(skeleton)
                                setTimeout(() => {
                                    let shouji = new PIXI_dpbf.spine.Spine(this.shouji_single.spineData)
                                    shouji.state.setAnimation(0, 'play')
                                    shouji.x = skeleton.x
                                    shouji.y = skeleton.y + 10
                                    shouji.scale.set(0.75)
                                    app.stage.addChild(shouji)
                                    skeleton.destroy()
                                    setTimeout(() => { shouji.destroy() }, shouji.spineData.findAnimation('play').duration * 1000)
                                }, skeleton.spineData.findAnimation('play').duration * 1000)
        
                            }
                        }
                        if (action == 'gongji') {
                            let skeleton = new PIXI_dpbf.spine.Spine(this.spine_source.spineData)
                            skeleton.x = x
                            skeleton.y = y
                            app.stage.addChild(skeleton)
                            skeleton.scale.set(0.8)
                            skeleton.zIndex = 2
                            if (skeleton.spineData.animations.filter(item => item.name == 'gongji')[0]) {
                                skeleton.state.setAnimation(0, 'gongji')
                                this.line_single && skeleton.state.addListener({
                                    event: () => {
                                        this.playDpbf_dynamic(position, 'line')
                                    }
                                })
                                setTimeout(() => {
                                    skeleton.destroy()
                                }, skeleton.spineData.animations.filter(item => item.name == 'gongji')[0].duration * 1000)
                            }
                        }
                    }
                })
            },
            initSkills() {
                Object.assign(lib.skill,{
                    _dpbf_init_ani : {
                        trigger: {
                            player: 'initEnd'
                        },
                        direct: true,
                        forecd: true,
                        silent: true,
                        filter: function (evt, pl) {
                            dpbf.default.shouji_data && !(dpbf.dynamicSkins[evt.character] && dpbf.dynamicSkins[evt.character][0].line_single) ? pl.line = function (target, config) {
                                if (!dpbf.default.shouji_data) return;
                                if (get.itemtype(target) == 'players') {
                                    let targets = target.concat()
                                    targets.remove(this)
                                    this.playLineAnimate(targets, dpbf.default.line_data, dpbf.default.shouji_data)
                                }
                                else if (get.itemtype(target) == 'player' && target != this) {
                                    console.log(target);
                                    this.playLineAnimate([target], dpbf.default.line_data, dpbf.default.shouji_data)
                                }
                            } : void 0
                            return dpbf.dynamicAnimation_character[evt.character]
                        },
                        content() {
                            if (dpbf.dynamicAnimation_character[trigger.character]) {
                                let loader = PIXI_dpbf.Assets.loader
                                dpbf.dynamicAnimation_character[trigger.character]['line_single'] && Object.assign(player, { line: lib.element.player.line })
                                dpbf.dynamicAnimation_character[trigger.character]['line_single'] && loader.load(dpbf.path + dpbf.dynamicAnimation_character[trigger.character]['line_single'] + 'shouji2.json').then(data => player.line_single = data)
                                dpbf.dynamicAnimation_character[trigger.character]['line_single'] && loader.load(dpbf.path + dpbf.dynamicAnimation_character[trigger.character]['line_single'] + 'shouji.json').then(data => player.shouji_single = data)
                                dpbf.dynamicAnimation_character[trigger.character]['path'] && loader.load(dpbf.path + dpbf.dynamicAnimation_character[trigger.character]['path'] + '.skel').then(source => { player.spine_source = source })
                                dpbf.dynamicAnimation_character[trigger.character]['chuchangSingle'] && loader.load(dpbf.path + dpbf.dynamicAnimation_character[trigger.character]['chuchangSingle'] + '.json').then(source => { player.chuchang_source = source })
                            }
                        }
                    },
                    _dpbf_init : {
                        trigger: {
                            player: 'initEnd'
                        },
                        direct: true,
                        forecd: true,
                        silent: true,
                        filter: function (evt, pl) {
                            pl.node.avatar.classList.remove('dy_avatar')
                            if (pl.querySelectorAll('.animation-player-dpbf-skel').length) {
                                let canvases = pl.querySelectorAll('.animation-player-dpbf-skel')
                                canvases.forEach(element => {
                                    element.remove()
                                });
                            }
                            return dpbf.dynamicSkins[evt.character]
                        },
                        content: function () {
                            let logSkill = player.logSkill
                            player.logSkill = function (name, targets, nature, logv) {
                                logSkill.apply(this, arguments)
                                let isSkill = function (name) {
                                    let info = lib.skill[name]
                                    return info && game.expandSkills(this.skills).contains(name)
                                }
                                if (isSkill.call(this, name)) {
                                    let res
                                    if (this.dynamic_dpbf) res = dpbf.checkCanBeAction(this)
                                    this.dynamic_dpbf && this.dynamic_dpbf.renderer.postMessage({
                                        message: 'ACTION',
                                        id: this.dynamic_dpbf.id,
                                        action: 'TeShu',
                                        skinID: res.dynamic.id
                                    })
                                    this.dynamic_skel && this.dynamic_skel[0].source && this.dynamic_skel[0].chuchang(game.me == this)
                                    this.spine_source && this.playDpbf_dynamic(null, 'jineng')
                                }
                            }
                            if (dpbf.dynamicSkills[player.name] && (player.dynamic_skel || player.dpbf_dynamics || player.dynamic_dpbf || player.$dynamicWrap)) player.addSkill(dpbf.dynamicSkills[player.name].name, false)
                            if (player.dynamic_dpbf) {
                                player.dpbf.canvas.remove()
                                player.dynamic_dpbf.stopAll()
                            }
                            player.dpbf_datas = []
                            dpbf.dynamicSkins[trigger.character].forEach(skin => {
                                if (skin.ten) {
                                    dpbf.getTenSkeleton(skin, player)
                                }
                            })
                            let oriskin = dpbf.dynamicSkins[trigger.character][dpbf.dynamicIndex[trigger.character]]
                            skin = Object.assign(oriskin, {})
                            let getSkeleton = function (data) {
                                let spine = PIXI_dpbf.spine.Spine
                                let skel = new spine(data.spineData)
                                let { x, y, scale, angle } = skin
                                x = x || 0
                                y = y || 0
                                skel.x = x * 120 + 60
                                skel.y = y * 190 + 90
                                skel.scale.set(scale || 1)
                                return skel
                            }
                            skin.data ? skin.skeleton = getSkeleton(skin.data) : void 0
                            skin.bgdata ? skin.bgSkeleton = getSkeleton(skin.bgdata) : void 0
                            if (skin.ten == 'skel') {
                                player.playDynamic_skel(skin)
                            }
                            else {
                                let style = {
                                    name: skin.name,
                                    action: skin.action,
                                    loop: true,
                                    speed: skin.speed,
                                    loopCount: -1,
                                    filpY: undefined,
                                    filpX: undefined,
                                    x: skin.x,
                                    opacity: undefined,
                                    y: skin.y,
                                    scale: skin.scale,
                                    angle: skin.angle,
                                    hideSlots: skin.hideSlots,
                                    clipSlots: skin.clipSlots,
                                    dynamicBackground: skin.dynamicBackground,
                                    background: skin.background,
                                    gongji: skin.gongji,
                                    image: skin.imagePath,
                                    audio: skin.audio,
                                }
                                player.playDynamic_dpbf(style)
                                if (trigger.character2) {
                                    let originskin = dpbf.dynamicSkins[trigger.character2][dpbf.dynamicIndex[trigger.character2]]
                                    skin2 = Object.assign(originskin, {})
                                    let style2 = {
                                        name: skin2.name,
                                        action: skin2.action,
                                        loop: true,
                                        speed: skin2.speed,
                                        loopCount: -1,
                                        filpY: undefined,
                                        filpX: undefined,
                                        x: skin.x,
                                        opacity: undefined,
                                        y: skin.y,
                                        scale: skin2.scale,
                                        angle: skin2.angle,
                                        hideSlots: skin2.hideSlots,
                                        clipSlots: skin2.clipSlots,
                                        dynamicBackground: skin2.dynamicBackground,
                                        background: skin2.background,
                                        gongji: skin2.gongji,
                                        image: skin2.imagePath,
                                        audio: skin2.audio,
                                    }
                                    player.playDynamic_dpbf(style2, true)
                                }
        
                                let border = ui.create.div('.headBorder', player)
                                border.setAttribute(`border-${player.group}`, player.group)
                                if (!(['qun', 'wei', 'shu', 'wu', 'ye', 'jin', 'shen'].includes(player.group))) border.setAttribute(`border-${'qun'}`, player.group)
                                player.node.border = border
                            }
                            player.numberOfDynamic = 0
                            game.delay(3)
                        }
                    },
                    _dpbf_die_skel : {
                        trigger: {
                            player: 'dieBegin'
                        },
                        forced: true,
                        silent: true,
                        direct: true,
                        filter: (evt, pl) => pl.dynamic_skel,
                        content: function () {
                            for (let i of player.dynamic_skel) {
                                i.app.view.style.filter = 'grayscale(100%)'
                            }
                            player.dynamic_skel[0].sprite.audio && game.playAudio('..', `extension/audio/${player.dynamic_skel[0].sprite.audio}${player.name}.mp3`)
                        }
                    },
                    _phaseSingle_skel : {
                        trigger: {
                            player: 'phaseBegin'
                        },
                        filter: function (event, player) {
                            if (player.isUnseen()) return false;
                            if (!player.dynamic_skel) return false;
                            if (!dpbf.dynamicSkins[player.name][dpbf.dynamicIndex[player.name]].chuchangSingle) return false;
                            if (!player.dynamic_skel[0].chuchang_source) return false;
                            return true
                        },
                        forced: true,
                        silent: true,
                        direct: true,
                        content: function () {
                            player.dynamic_skel[0].chuchangSingle(game.me == player)
                        }
                    },
                    _phaseSingle_skel_ani : {
                        trigger: {
                            player: 'phaseBegin'
                        },
                        filter: function (event, player) {
                            if (player.isUnseen()) return false;
                            if (!player.chuchang_source) return false;
                            return true
                        },
                        forced: true,
                        silent: true,
                        direct: true,
                        content: function () {
                            player.playDpbf_dynamic(null, 'chuchang')
                        }
                    },
                    _useCardSingle_skel_ani : {
                        trigger: {
                            player: 'useCardBefore'
                        },
                        filter: function (event, player) {
                            if (player.isUnseen()) return false;
                            if (_status.currentPhase != player) return false;
                            if (!player.spine_source) return false;
                            if (event.card.name == "huogong") return false;
                            let type = get.type(event.card);
                            return ((type == 'basic' || type == 'trick') && get.tag(event.card, 'damage') > 0);
                        },
                        forced: true,
                        silent: true,
                        direct: true,
                        content() {
                            let targets = trigger.targets.concat()
                            targets.remove(player)
                            player.playDpbf_dynamic({
                                targets,
                            }, 'gongji')
                        }
                    },
                    _useCardSingle_skel : {
                        trigger: {
                            player: 'useCardBefore'
                        },
                        filter: function (event, player) {
                            if (player.isUnseen()) return false;
                            if (!player.dynamic_skel) return false;
                            if (!dpbf.dynamicSkins[player.name][player.numberOfDynamic].chuchang) return;
                            if (_status.currentPhase != player) return false;
                            if (event.card.name == "huogong") return false;
                            let type = get.type(event.card);
                            return ((type == 'basic' || type == 'trick') && get.tag(event.card, 'damage') > 0);
                        },
                        forced: true,
                        silent: true,
                        direct: true,
                        content() {
                            let targets = trigger.targets.concat()
                            targets.remove(player)
                            player.dynamic_skel[0].gongji({ targets: targets })
                        }
                    },
                    _useCardSingle_card : {
                        trigger: {
                            player: 'useCardBefore'
                        },
                        filter: function (event, player) {
                            if (player.isUnseen()) return false;
                            if (!dpbf.dynamicAnimation_card[event.card.name]) return;
                            if (_status.currentPhase != player) return false;
                            if (event.card.name == "huogong") return false;
                            return true
                        },
                        forced: true,
                        silent: true,
                        direct: true,
                        content() {
                            let name = trigger.card.name
                            if (trigger.card.name == 'sha') {
                                let color = get.color(trigger.card)
                                switch (color) {
                                    case 'red': name = 'HongSha'
                                    case 'black': name = 'HeiSha'
                                    default: name = 'sha'
                                }
                            }
                            //dpbf.player.play(dpbf.dynamicAnimation_card[name].name,trigger.cards?trigger.cards[0]:void 0)
                        }
                    },
                    useSkill_single : {
                        trigger: {
                            player: 'useSkillBefore'
                        },
                        filter: (evt, pl) => pl.dynamic_dpbf,
                        forced: true,
                        silent: true,
                        direct: true,
                        content() {
                            let res = dpbf.checkCanBeAction(player)
                            player.dynamic_dpbf.renderer.postMessage({
                                message: 'ACTION',
                                id: player.dynamic_dpbf.id,
                                action: "TeShu",
                                isDouble: true,
                                skinID: res.dynamic.id
                            })
                        }
                    },
                    _useCardSingle : {
                        trigger: {
                            player: 'useCardBefore'
                        },
                        filter: function (event, player) {
                            if (player.isUnseen()) return false;
                            if (!player.dynamic_dpbf) return false;
                            if (_status.currentPhase != player) return false;
                            if (event.card.name == "huogong") return false;
                            let type = get.type(event.card);
                            return ((type == 'basic' || type == 'trick') && get.tag(event.card, 'damage') > 0) && ((player.dynamic_dpbf.primary && player.dynamic_dpbf.primary.path) || (player.dynamic_dpbf.avatar && player.dynamic_dpbf.avatar.path));
                        },
                        forced: true,
                        silent: true,
                        direct: true,
                        content() {
                            if (player.dynamic_dpbf.avatar && player.dynamic_dpbf.avatar.path) {
                                let style = JSON.parse(JSON.stringify(player.dynamic_dpbf.avatar.gongji || {}))
                                style.gongjiaudio && game.playAudio('../extension/动皮播放/audio', style.gongjiaudio)
                                style.x = style.x || [0, 0.5]
                                style.y = style.y || [0, 0.5]
                                if (!style.auto) {
                                    let x = getComputedStyle(player).left, y = getComputedStyle(player).top
                                    x = parseInt(x)
                                    y = parseInt(y)
                                    player != game.me ? y = window.innerHeight - y - 400 : y -= 300
                                    style.x = [x, 0]
                                    style.y = [y, 0]
                                    style.scale = style.scale || 0.5
                                }
                                player.dynamic_dpbf.renderer.postMessage({
                                    message:'HIDEFORTIME',
                                    id:player.dynamic_dpbf.id,
                                    skinID:player.dynamic_dpbf.avatar.id,
                                    time:style.time
                                })
                                lib.config['extension_十周年UI_newDecadeStyle'] == 'on' ? style.y[1] += 0.2 : void 0;
                                dpbf.ani.playSpine({
                                    action: 'GongJi',
                                    name: player.dynamic_dpbf.avatar.path,
                                    scale: style.scale
                                }, style)
                            }
                            if (player.dynamic_dpbf.primary && player.dynamic_dpbf.primary.path) {
                                let style = JSON.parse(JSON.stringify(player.dynamic_dpbf.primary.gongji || {}))
                                style.gongjiaudio && game.playAudio('../extension/动皮播放/audio', style.gongjiaudio)
                                style.x = style.x || [0, 0.5]
                                style.y = style.y || [0, 0.5]
                                if (!style.auto) {
                                    let x = getComputedStyle(player).left, y = getComputedStyle(player).top
                                    x = parseInt(x)
                                    y = parseInt(y)
                                    player != game.me ? y = window.innerHeight - y - 400 : y -= 300
                                    style.x = [x, 0]
                                    style.y = [y, 0]
                                    style.scale = style.scale || 0.5
                                }
                                player.dynamic_dpbf.renderer.postMessage({
                                    message:'HIDEFORTIME',
                                    id:player.dynamic_dpbf.id,
                                    skinID:player.dynamic_dpbf.primary.id,
                                    time:style.time
                                })
                                lib.config['extension_十周年UI_newDecadeStyle'] == 'on' ? style.y[1] += 0.2 : void 0;
                                dpbf.ani.playSpine({
                                    action: 'GongJi',
                                    name: player.dynamic_dpbf.primary.path,
                                    scale: style.scale
                                }, style)
                            }
                        },
                    }
                })
            }
        },
        init() {
            Object.values(this.inits).forEach(func => func())
        },
        getTenSkeleton(skin, player) {
            let { name, x, y, ten, scale, chuchang, chuchangSingle, line_single } = skin
            let { left, top } = dpbf.dynamicSkins.default.position
            let daiji, beijing, chuchang_data, chuchang_single_data, line_single_data, shouji_single_data
            if (ten != 'skel') return;
            let loader = PIXI_dpbf.Assets.loader
            loader.load(`${dpbf.path}${name}daiji.${skin.type == 'json' ? 'json' : 'skel'}`).then(source => {
                let skeleton = new PIXI_dpbf.spine.Spine(source.spineData)
                skeleton.x = x * 120 + 60
                skeleton.y = y * 190 + 90
                skeleton.scale.set(scale || 1)
                if (lib.config['extension_十周年UI_newDecadeStyle'] == "off") {
                    skeleton.x -= 6
                }
                daiji = skeleton
            })
            loader.load(`${dpbf.path}${name}beijing.${skin.type == 'json' ? 'json' : 'skel'}`).then(source => {
                let skeleton = new PIXI_dpbf.spine.Spine(source.spineData)
                skeleton.x = x * 120 + 60
                skeleton.y = y * 190 + 90
                skeleton.scale.set(scale || 1)
                if (lib.config['extension_十周年UI_newDecadeStyle'] == "off") {
                    skeleton.x -= 6
                }
                if (lib.config['extension_十周年UI_newDecadeStyle'] == "on") {
                    let mask = new PIXI_dpbf.Graphics();
                    mask.beginFill(0x66CCFF);
                    mask.drawRoundedRect(left * 120 + 66, top * 190 + 90, 123, 200, 16);
                    mask.endFill();
                    skeleton.mask = mask
                }
                skeleton.zIndex--
                beijing = skeleton
            })
            skin.chuchangSingle && loader.load(dpbf.path + chuchangSingle).then(source => { chuchang_single_data = source })
            skin.chuchang && loader.load(dpbf.path + chuchang).then(source => { chuchang_data = source })
            skin.line_single && loader.load(dpbf.path + line_single + 'shouji.json').then(source => { shouji_single_data = source })
            skin.line_single && loader.load(dpbf.path + line_single + 'shouji2.json').then(source => { line_single_data = source })
            setTimeout(() => {
                player.dpbf_datas.push([daiji, beijing, chuchang_data, chuchang_single_data, line_single_data, shouji_single_data, skin])
            }, 4000)
        },
        cardPath: lib.assetURL + 'extension/动皮播放/images/card/',
        clone: function (obj) {
            let newObj = {}
            if (Array.isArray(obj)) return obj.concat()
            for (let i in obj) {
                newObj[i] = typeof obj[i] == 'object' ? dpbf.clone(obj[i]) : obj[i]
            }
            return newObj
        },
        /**
         * 
         * @param {String} data 
         * @param {String} path 
         * @param {String} filename 
         * @param {Function} callback 
         */
        async writeFile(data, path, filename, callback = () => { }) {
            try {
                if (typeof window.require == 'function') {
                    lib.node.fs.writeFile(`${__dirname}/${path}${filename}`, data, {
                        flag: 'w+'
                    }, (err) => {
                        if (err) throw err
                        callback()
                    })
                }
                else {
                    game.writeFile(data, path, filename, callback)
                }
                return true
            }
            catch {
                return false
            }
        },
        /**
         * 
         * @param {HTMLCanvasElement} image canvas或image
         * @param {String} path 路径
         * @param {String} filename 文件名
         * @param {Function} callback 方法 可不写
         */
        async writeImg(image, path, filename, callback = () => { }) { 
            let canvas
            if(image instanceof HTMLCanvasElement){
                canvas = image
            }
            else{
                canvas = document.createElement('canvas')
                canvas.width = image.offsetWidth
                canvas.height = image.offsetHeight
                canvas.getContext('2d').drawImage(image, 0, 0)
            }
            canvas.toBlob((data)=>{
                const r = new FileReader()
                r.onloadend = function(){
                    dpbf.writeFile(new Uint8Array(r.result), path, filename, callback)
                }
                r.readAsArrayBuffer(data)
            })
            
        },
        dynamicSkills: {
            shen_guojia: {
                name: 'dy_shen_guojia',
                trigger: {
                    player: 'xintianyiEnd'
                },
                group: 'dy_shen_guojia_audio',
                direct: true,
                forced: true,
                popup: false,
                slient: true,
                filter: (evt, pl) => !pl.changed,
                content() {
                    player.changed = true
                    let deputy = player.name2 == 'shen_guojia',skinIDs = [player.dynamic_dpbf.BUILT_ID++, player.dynamic_dpbf.BUILT_ID++]
                    player.dynamic_dpbf.renderer.postMessage({
                        message: 'CHANGESKIN',
                        id: player.dynamic_dpbf.id,
                        paths: ['shen_g/sg', '../dynamicBackground/shen_g/BeiJing_c'],
                        sprite: player.dynamic_dpbf[deputy ? 'primary' : 'avatar'].style,
                        lutou: lib.config['extension_十周年UI_newDecadeStyle'] == 'on',
                        ids : [player.dynamic_dpbf[deputy ? 'primary' : 'avatar'].id,player.dynamic_dpbf[deputy ? 'primary' : 'avatar'].dynamicBackground.id],
                        skinIDs
                    })
                    dpbf.ani.loadSpine('../dynamicSkins/shen_g/sg', 'skel', () => {
                        player.dynamic_dpbf[deputy ? 'primary' : 'avatar'].path = '../dynamicSkins/shen_g/sg'
                    })
                    player.dynamic_dpbf[deputy ? 'primary' : 'avatar'].id = skinIDs[0]
                    player.dynamic_dpbf[deputy ? 'primary' : 'avatar'].dynamicBackground.id = skinIDs[1]
                    player.dpbf.dynamic.style.audio = 'shen_g/a/'
                    player.dpbf.dynamic.style.gongjiaudio = 'shen_g/gongji1.mp3'
                },
                subSkill: {
                    audio: {
                        trigger: {
                            player: 'useCardBefore'
                        },
                        direct: true,
                        forced: true,
                        popup: false,
                        slient: true,
                        filter: function (evt) {
                            return ['basic', 'trick'].includes(get.type(evt.card, 'trick'))
                        },
                        content() {
                            try {
                                game.playAudio('../extension', `动皮播放/audio/shen_g/SKILL_22002_${trigger.card.name}_1${trigger.card.nature ? '_' + trigger.card.nature : ''}.mp3`)
                                trigger.audio = false
                            }
                            catch (e) {
                                console.log(e);
                            }
                        }
                    }
                }
            },
            caochun: {
                name: 'dy_caochun',
                trigger: {
                    player: 'changeHp'
                },
                direct: true,
                forced: true,
                popup: false,
                slient: true,
                filter: (evt, pl) => pl.hp <= 2 && !pl.changed,
                content() {
                    player.changed = true
                    player.dynamic_skel[0].sprite.audio = 'caochun/a/'
                    PIXI_dpbf.Assets.loader.load(dpbf.path + 'images/animations/caochun/a/shouji2.json').then((resource) => {
                        player.line_single = resource
                    })
                    PIXI_dpbf.Assets.loader.load(dpbf.path + 'images/animations/caochun/a/shouji.json').then((resource) => {
                        player.shouji_single = resource
                    })
                    PIXI_dpbf.Assets.loader.load(dpbf.path + 'images/ten/caochun/1/chuchang2.skel').then((resource) => {
                        player.dynamic_skel[0].source = resource
                    })
                    PIXI_dpbf.Assets.loader.load(dpbf.path + 'images/ten/caochun/1/chuchang.json').then((resource) => {
                        player.dynamic_skel[0].chuchang_source = resource
                    })
                    PIXI_dpbf.Assets.loader.load(dpbf.path + 'images/ten/caochun/1/daiji.skel').then((resource) => {
                        let skeleton = new PIXI_dpbf.spine.Spine(resource.spineData)
                        skeleton.x = player.dynamic_skel[0].sprite.skillafter.x * 120
                        skeleton.y = player.dynamic_skel[0].sprite.skillafter.y * 180
                        skeleton.scale.set(player.dynamic_skel[0].sprite.skillafter.scale)
                        player.dynamic_skel[0].skeleton.destroy()
                        player.dynamic_skel[0].app.stage.addChild(skeleton)
                        player.dynamic_skel[0].skeleton = skeleton
                        player.dynamic_skel[0].playAction('play2')
                    })
                    PIXI_dpbf.Assets.loader.load(dpbf.path + 'images/ten/caochun/1/beijing.skel').then((resource) => {
                        let skeleton = new PIXI_dpbf.spine.Spine(resource.spineData)
                        skeleton.x = player.dynamic_skel[1].sprite.skillafter.x * 120
                        skeleton.y = player.dynamic_skel[1].sprite.skillafter.y * 180
                        skeleton.scale.set(player.dynamic_skel[1].sprite.skillafter.scale)
                        player.dynamic_skel[1].skeleton.destroy()
                        player.dynamic_skel[1].app.stage.addChild(skeleton)
                        player.dynamic_skel[1].skeleton = skeleton
                        player.dynamic_skel[1].playAction('play2')
                    })
                }
            }
        },
        checkCanBeAction: function (player) {
            let isPrimary = player.dynamic_dpbf.avatar;
            let res = {
                isDouble: false,
                deputy: false,
                needHide: false
            }
            if (player.doubleAvatar) {
                res.isDouble = true;
                let isDeputy = player.dynamic_dpbf.primary;
                let unseen = player.isUnseen(0);
                let unseen2 = player.isUnseen(1);
                if (isPrimary && !unseen) {
                    res.dynamic = isPrimary;
                } else if (isDeputy && !unseen2) {
                    res.dynamic = isDeputy;
                    res.deputy = true;
                } else {
                    return false;
                }
                if (isPrimary && isDeputy) {
                    if (!unseen && !unseen2) {
                        res.needHide = isDeputy.id;
                    }
                }
            } else {
                res.dynamic = isPrimary;
            }
            return res;
        },
    }
    let dpbf_extension = {
        name: "动皮播放",
        content: function (config, pack) {
            (function () {
                let loader = dpbf.loader = new dcdCardAni.Loader(dpbf.cardPath, loader => { dpbf.player = new dcdCardAni.Player(loader) })
                Object.keys(dpbf.dynamicAnimation_card).forEach(card => {
                    loader.preload(dpbf.dynamicAnimation_card[card].name)
                })
                loader.load()
            })()
            if (dpbf.dynamicAnimation_character.default) {
                let loader = PIXI_dpbf.Assets.loader
                dpbf.dynamicAnimation_character.default.line_single && loader.load(dpbf.path + dpbf.dynamicAnimation_character.default['line_single'] + 'shouji2.json').then(r => {
                    dpbf.default.line_data = r
                })
                dpbf.dynamicAnimation_character.default.line_single && loader.load(dpbf.path + dpbf.dynamicAnimation_character.default['line_single'] + 'shouji.json').then(r => {
                    dpbf.default.shouji_data = r
                })
            }
            game.dpbf_audios = {};
            (function () {
                let files = [
                    { name: 'huanfu', follow: true }
                ]
                let ani = new dynamic_play.AnimationPlayer(dpbf.path + 'images/dpbf/', document.body, 'dpbf-ani-canvas')
                ani.cap = new dynamic_play.AnimationPlayerPool(1, dpbf.path + 'images/dpbf/', 'dpbf-ani-canvasb');
                dpbf.ani = ani
                window.addEventListener('resize', () => {
                    dpbf.ani.canvas.width = window.innerWidth
                    dpbf.ani.canvas.height = window.innerHeight
                })
                document.addEventListener('visibilitychange', () => {
                    let data = JSON.stringify(dpbf.dynamicIndex, null, '\t')
                    dpbf.writeFile(data, dpbf.path + 'js/', 'dynamic.json')
                })
                ani.cap.animations.forEach(c => Object.assign(c.canvas.style, {
                    position: 'absolute',
                    zIndex: 999
                }))
                files.forEach(item => { !item.follow ? ani.loadSpine(item.name, item.type) : ani.cap.loadSpine(item.name, item.type) })
            })()
            function getFile(url) {
                return new Promise((reslove, reject) => {
                    let xhr = new XMLHttpRequest()
                    xhr.open('GET', url, true)
                    xhr.send()
                    xhr.onload = function () {
                        reslove(xhr.responseText)
                    }
                    xhr.onerror = function (err) {
                        reject(err)
                    }
                })
            }
            let getaudiolist = dpbf.getaudiolist = function (skill) {
                let info = lib.skill[skill]
                if (!info || !info.audio || !['string', 'number'].includes(typeof info.audio)) return;
                if (info.direct) return;
                if (typeof info.audio == 'number') return [0, 0, info.audio]
                let audioname = info.audio.split(':')
                if (audioname.length == 1) audioname = getaudiolist(audioname)
                return audioname
            }
            let getaudioname = dpbf.getaudioname = function (skill) {
                let name = getaudiolist(skill)
                if (!name) return;
                let number = parseInt(name[2])
                number = Math.ceil(Math.random() * number)
                return skill + number
            }
            let getparent = dpbf.getParent = function (skill, info, pl) {
                if (!info) return
                if (typeof info.audio == 'string') {
                    let audioname = info.audio.split(':')
                    if (audioname.length == 1 && !pl.hasSkill(skill)) skill = getparent(audioname[0], get.info(audioname[0]))
                }
                return skill
            }
            let audio = game.trySkillAudio
            dpbf.oriaudio = audio
            function trySkillAudio(skill, player, directaudio) {
                let info = get.info(skill)
                if (!info || !info.audio) return;
                skill = getparent(skill, info, player)
                if (game.dpbf_audios[player.playerid]) {
                    let style = (player.dpbf && player.dpbf.dynamic.style) || player.dynamic_skel[0].sprite
                    game.playAudio('../extension/动皮播放/images/skin/audio', style.audio + getaudioname(skill) + '.mp3')
                }
                else if ((player.dynamic_dpbf || player.dynamic_skel) && game.dpbf_audios[player] !== false) {
                    let style = (player.dpbf && player.dpbf.dynamic.style) || player.dynamic_skel[0].sprite
                    if (style.audio) {
                        let xhr = new XMLHttpRequest()
                        xhr.open('GET', dpbf.path + 'images/skin/audio/' + style.audio + getaudioname(skill) + '.mp3')
                        xhr.onload = function () {
                            game.dpbf_audios[player.playerid] = true
                            game.playAudio('../extension/动皮播放/images/skin/audio', style.audio + getaudioname(skill) + '.mp3')
                        }
                        xhr.onerror = function () {
                            game.dpbf_audios[player.playerid] = false
                            audio.apply(this, arguments)
                        }
                        xhr.send()
                    }
                    else {
                        audio.apply(this, arguments)
                    }
                }
                else {
                    audio.apply(this, arguments)
                }
            }
            game.trySkillAudio = trySkillAudio
            Object.defineProperty(game, 'trySkillAudio', {
                configurable: true,
                enumerable: true,
                set(v) { },
                get() { return trySkillAudio }
            })
            let app = PIXI_dpbf.app = new PIXI_dpbf.Application({
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundAlpha: 0,
                resizeTo: window,
                resolution: 1
            })
            document.body.appendChild(app.view)
            Object.assign(app.view.style, {
                position: 'absolute',
                left: '0',
                top: '0',
                zIndex: '99999999999999999999999999',
                pointerEvents: 'none'
            })
            setTimeout(() => {
                //改init
                for (let i of game.players) {
                    i.init = dpbf_init
                    Object.defineProperty(i, 'init', {
                        get: function () { return dpbf_init },
                        set: (value) => { }
                    })
                    Object.freeze(i.init)
                }
                let init = lib.element.player.init
                Object.defineProperty(lib.element.player, 'init', {
                    get: function () { return dpbf_init },
                    set: function (value) {
                        this.value = value
                    },
                    enumerable: true,
                    configurable: true,
                })
                function dpbf_init(character, character2, skill) {
                    let next = game.createEvent('init')
                    next.player = this
                    next.character = character
                    next.character2 = character2
                    next.skill = skill
                    next.setContent('emptyEvent')
                    init.apply(this, arguments)
                }
                lib.element.player.init = dpbf_init
            }, 100)
            //特效
            //预加载
            // for (let i in dpbf.dynamicSkins) {
            //     let skin = dpbf.dynamicSkins[i]
            //     if (skin.preloading === true && skin.ten=='skel' && skin.type=='json') {
            //         let loader = PIXI_dpbf.Assets.loader,spine=PIXI_dpbf.spine.Spine
            //         loader.load(dpbf.path + skin.name +'daiji.json').then(r=>{
            //             skin.data = r
            //         })
            //         loader.load(dpbf.path + skin.name +'beijing.json').then(r=>{
            //             skin.bgdata = r
            //         })
            //     }
            // }
            dpbf.init();
        },
        precontent: function () {
            //技能
            for (let character in dpbf.dynamicSkills) {
                let skill = dpbf.dynamicSkills[character]
                if (!skill.name) continue;
                lib.skill[skill.name] = skill
            }
            //加载文件
            let css = ['style', `style_${lib.config['extension_十周年UI_newDecadeStyle'] == "on" ? 'ten' : 'mobile'}`], js = ['js/animation.js', 'js/spine.js', 'pixi/pixi.js'], p
            lib.init.js(dpbf.path + 'libs/laya.core.js')
            for (let link of css) {
                lib.init.css(dpbf.path + 'css', link)
            }
            for (let script of js) {

                lib.init.js(dpbf.path + script)
            }
            fetch(dpbf.path + 'js/dynamic.json').then(data => {
                data.text().then(txt => {
                    let data = JSON.parse(txt)
                    dpbf.dynamicIndex = data
                    //xhr.open('GET',dpbf.path+'js/dynamicSkin.json')
                    let xhr = new XMLHttpRequest()
                    xhr.open('GET', dpbf.path + 'js/dynamicSkin.json')
                    xhr.send()
                    xhr.onload = () => {
                        let data = xhr.responseText
                        data = JSON.parse(data)
                        window.dpbf.dynamicSkins = {}
                        Object.keys(data).forEach(character => {
                            if (Array.isArray(data[character])) window.dpbf.dynamicSkins[character] = data[character]
                            else if (data[character].noArray) window.dpbf.dynamicSkins[character] = data[character]
                            else window.dpbf.dynamicSkins[character] = [data[character]]
                            if (!dpbf.dynamicIndex[character]) dpbf.dynamicIndex[character] = 0
                        })
                    }
                    xhr.onerror = (err) => {
                        throw err
                    }
                })
            })

            let xhr1 = new XMLHttpRequest()
            xhr1.open('GET', dpbf.path + 'js/dynamicAnimation.json')
            xhr1.send()
            xhr1.onload = () => {
                let data = xhr1.responseText
                data = JSON.parse(data)
                window.dpbf.dynamicAnimation_character = data.character
                window.dpbf.dynamicAnimation_card = data.card
                Object.keys(data.card).forEach(card => {
                    let sprite = data.card[card]
                })
            }
            xhr1.onerror = (err) => {
                throw err
            }
            fetch(dpbf.path + 'js/base64.json').then(data => {
                data.text().then(txt => {
                    let data = JSON.parse(txt)
                    dpbf.dynamicBase = data
                })
            })
        },
        config: {},
        help: {},
        package: {
            character: {
                character: {
                },
                translate: {
                },
            },
            card: {
                card: {
                },
                translate: {
                },
                list: [],
            },
            skill: {
                skill: {
                },
                translate: {
                },
            },
            intro: "",
            author: "牛马",
            diskURL: "",
            forumURL: "",
            version: "1.0",
        }, files: { "character": [], "card": [], "skill": [] }
    }
    return dpbf_extension
})