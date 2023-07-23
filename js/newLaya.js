
(function () {
  let LayaDynamic = {};
  // Config.isAlpha=true
  // let canvasRender = Laya.init(window.innerWidth, window.innerHeight, Laya.WebGL) || Laya.Render.canvas;
  // let index = 0, ctxs = [], dynamics = [] ,time
  // Laya.stage.frameRate = Laya.Stage.FRAME_SLOW
  // function animate(){
  //   if(new Date().getTime()-time<1000/30)return requestAnimationFrame(animate);
  //   time=new Date().getTime()
  //   for (let i of ctxs) {
  //     //drawImage 参数 画布 起始位置x 起始位置y 宽度 长度 放置位置 被画的图片大小
  //     let ctx=i.getContext('2d')
  //     ctx.clearRect(0,0,190,120)
  //     ctx.drawImage(canvasRender, ...i.styles, 0, 0, 120, 190)
  //   }
  //   requestAnimationFrame(animate)
  // }
  // animate()
  // canvasRender.remove();
  // Laya.stage.size(15000, 1200)
  // Laya.stage.bgColor=null
  // let ctx = Laya.Browser.context;
  // LayaDynamic.ctxs=ctxs
  // LayaDynamic.DynamicPlayer = (function () {
  //   let DynamicPlayer = function (path, isBackground, parent) {
  //     this.canvas = document.createElement('canvas')
  //     let canvas = this.canvas
  //     canvas.classList.add('dynamicCanvas')
  //     canvas.height = isBackground?180:190
  //     if(isBackground)canvas.classList.add('dynamicCanvas-bg')
  //     canvas.width = 120
  //     canvas.pos = index++
  //     this.path = path
  //     this.parent = parent
  //     this.skeleton = new Laya.Skeleton()
  //     this.stage = new Laya.Box()
  //     let { stage, skeleton } = this
  //     dynamics.push(this)
  //     stage.addChild(skeleton)
  //     stage.zOrder = isBackground?-1:1
  //   };
  //   DynamicPlayer.prototype.play = function (sprite) {
  //     this.canvas.scaleX = sprite.scaleX || 1
  //     this.canvas.scaleY = sprite.scaleY || 1
  //     let canvas = this.canvas
  //     this.skeleton.load(this.path)
  //     Laya.stage.addChild(this.stage)
  //     this.parent && this.parent.appendChild(this.canvas)
  //     this.canvas.x = sprite.x || 0
  //     this.canvas.y = sprite.y || 0
  //     this.skeleton.scale(0.8, 0.8)
  //     if (sprite.isBackground) this.skeleton.zOrder--
  //     this.stage.pos(this.canvas.pos * 1600 + 600, 300)
  //     if(sprite.skeletonY)this.skeleton.pos(0,sprite.skeletonY*300)
  //     if (sprite.isBackground === true && !sprite.notbeijing) {
  //       this.skeleton.scaleX = sprite.scaleX || 1.3
  //       this.skeleton.scaleY = sprite.scaleY || 1.3
  //     }
  //     this.canvas.styles = [(canvas.pos * 1600 + canvas.x * 600), (canvas.y * 600), (120 / canvas.scaleX), (190 / canvas.scaleY)]
  //     ctxs.push(this.canvas)
  //   };
  //   DynamicPlayer.prototype.stop = function () {
  //     if (this.canvas.pos == index - 1) {
  //       index--
  //     }
  //     this.canvas.remove()
  //     let a = this.stage._children[0]
  //     let b = this.stage._children[1]
  //     this.stage.removeChild(a)
  //     this.stage.removeChild(b)
  //     Laya.stage.removeChild(this.stage)
  //     ctxs.remove(this.canvas)
  //   }
  //   return DynamicPlayer;
  // })();
  // LayaDynamic.Skeleton = class Skeleton{
  //   constructor(sprite){

  //   }
  // }
  LayaDynamic.DynamicPlayer_skel = class DynamicPlayer_skel{
    constructor(path, parent, background, parentapp) {
        this.app = parentapp || new PIXI_dpbf.Application({
          view: document.createElement('canvas'),
          width: 120,
          height: background ? 180 : 190,
          transparent: true,
          backgroundAlpha:0,
          resolution:2,
          preserveDrawingBuffer: true
        })
        this.app.stage.children = []
        this.path = path
        this.parent = parent
        this.canvas = this.app.view
        this.app.stage.sortableChildren = true
        
    }
    play(sprite, background = false,loadOtherFile=false) {
      let skel = background?sprite.bgSkeleton:sprite.skeleton
      if(skel){
        this.app.stage.addChild(skel)
        console.log('isPreloading');
        this.skeleton = skel
        this.sprite = sprite
        let loader = PIXI_dpbf.Assets.loader
        let _this=this
        sprite.chuchangSingle&&loader.load(dpbf.path+sprite.chuchangSingle).then(source=>{_this.chuchang_source=source})
        sprite.line_single&&loader.load(dpbf.path+sprite.line_single + 'shouji2.json').then(source=>{_this.parent.line_source=source})
        sprite.line_single&&loader.load(dpbf.path+sprite.line_single + 'shouji.json').then(source=>{_this.parent.shouji_source=source})
        sprite.chuchang&&loader.load(dpbf.path+sprite.chuchang).then(source=>{_this.source=source})
        this.canvas.classList.add('animation-player-dpbf-skel')
        if (this.parent) {
          !sprite.onlyChuchang&&this.parent.appendChild(this.app.view)
        }
        this.playAction('play2')
        return;
      }
      if (this.parent) {
        !sprite.onlyChuchang&&this.parent.appendChild(this.app.view)
      }
      this.sprite=sprite
      let loader = PIXI_dpbf.Assets.loader
      let _this=this
      sprite.line_single&&loader.load(dpbf.path + sprite.line_single + 'shouji2.json').then(source=>{_this.parent.line_single=source})
      sprite.line_single&&loader.load(dpbf.path + sprite.line_single + 'shouji.json').then(source=>{_this.parent.shouji_single=source})
      sprite.chuchangSingle&&loader.load(dpbf.path+sprite.chuchangSingle).then(source=>{_this.chuchang_source=source})
      sprite.chuchang&&loader.load(dpbf.path+sprite.chuchang).then(source=>{_this.source=source})
      sprite.otherFile&&loadOtherFile&&sprite.otherFile.forEach(file=>{
        loader.load(dpbf.path + file).then(res=>{
          let skeleton = new PIXI_dpbf.spine.Spine(res.spineData)
          skeleton.state.setAnimation(0,'play2',0)
          skeleton.state.addAnimation(0,'play',0,0)
          this.app.stage.addChild(skeleton)
          let { x, y, scale, angle } = sprite
          x = x || 0
          y = y || 0
          skeleton.x = x * 120 + 60
          skeleton.y = y * 190 + 90
          skeleton.scale.set(scale || 1)
        })
      })
      loader.load(this.path).then(source => {
        let skeleton = new PIXI_dpbf.spine.Spine(source.spineData)
        this.skeleton = skeleton
        this.playAction('play2')
        this.app.stage.addChild(skeleton)
        let { x, y, scale, angle} = sprite
        let {left,top} = dpbf.dynamicSkins.default.position
        x = x || 0
        y = y || 0
        skeleton.x = x * 120 + 60
        skeleton.y = y * 190 + 90
        skeleton.scale.set(scale || 1)
        skeleton.angle = angle || 0
        if(sprite.height&&!background){
          this.canvas.height=sprite.height
          this.canvas.style.height=sprite.height+'px'
        }
        if(lib.config['extension_十周年UI_newDecadeStyle'] == "off"){
          skeleton.x -= 6
          if(background){
            this.app.stage.width *= (120/106)
          }
        }
        if (background) {
          skeleton.zIndex--
          if(lib.config['extension_十周年UI_newDecadeStyle'] == "on")
          {
            let mask = new PIXI_dpbf.Graphics();
            mask.beginFill(0x66CCFF);
            mask.drawRoundedRect(left * 120 + 66, top * 190 + 90, 123, 200, 16);
            mask.endFill();
            skeleton.mask = mask
          }
        }
        this.canvas.classList.add('animation-player-dpbf-skel')
      })
    }
    playAction(aniName) {
      if(this.doing||!this.skeleton)return;
      this.doing=true
      let ani = this.findAnimation(aniName)
      if (!ani) return this.skeleton.state.setAnimation(0, 'play',true);
      this.skeleton.state.setAnimation(0, aniName)
      setTimeout(() => {
         this.skeleton.state.setAnimation(0, 'play', true) 
         this.doing=false
         this.finally&&this.finally()
         delete this.finally
      }, ani.duration * 1000)
      return ani
    }
    gongji(position){
      if(!this.sprite.chuchang)return;
      let skel = this.skeleton
      let app=PIXI_dpbf.app,source=this.source
      let x=getComputedStyle(this.parent).left,y=getComputedStyle(this.parent).top
      x=parseInt(x)
      y=parseInt(y)
      this.parent!=dpbf.game.me?y+=300:y=y
      skel.visible = false
      let skeleton = new PIXI_dpbf.spine.Spine(source.spineData)
      skeleton.scale.set(0.7)
      skeleton.x=x
      skeleton.y=y
      app.stage.addChild(skeleton)
      if(position.targets.length == 1){
        let angle = this.parent.getAngle.call({left:skeleton.x,top:skeleton.y},position.targets[0])
        if((angle>0&&angle<90)||(angle<0&&angle>-90)){
          skeleton.scale.x*=-1
          x -= 300
          y -= 200
        }
      }
      this.parent.line_single&&skeleton.state.addListener({
        event:()=>{this.parent.playDpbf_dynamic(Object.assign(position,{
          sk:{
            left:x,
            top:y
          }
        }),'line')}
      })
      if(skeleton.spineData.animations.filter(item => item.name == 'gongji')[0]){
        skeleton.state.setAnimation(0,'gongji')
        setTimeout(()=>{
          skeleton.destroy()
          if(this.parent&&!this.sprite.onlyChuchang&&this.parent.doing)skel.visible = true
        },skeleton.spineData.animations.filter(item => item.name == 'gongji')[0].duration * 1000)
      }
    }
    chuchang(isMe){
      if(!this.sprite.chuchang)return false;
      let skel = this.skeleton
      let app=PIXI_dpbf.app,source=this.source
      let x=getComputedStyle(this.parent).left,y=getComputedStyle(this.parent).top
      x=parseInt(x)
      y=parseInt(y)
      this.parent!=dpbf.game.me?y+=300:y=y
      skel.visible = false
      let skeleton = new PIXI_dpbf.spine.Spine(source.spineData)
      skeleton.scale.set(0.7)
      skeleton.x=x
      skeleton.y=y
      app.stage.addChild(skeleton)
      if(skeleton.spineData.animations.filter(item => item.name == 'jineng')[0]){
        skeleton.state.setAnimation(0,'jineng')
        setTimeout(()=>{
          skeleton.destroy()
          if(this.parent&&!this.sprite.onlyChuchang&&this.parent.doing)skel.visible = true
        },skeleton.spineData.animations.filter(item => item.name == 'jineng')[0].duration * 1000)
      }
      return true;
    }
    chuchangSingle(isMe){
      if(!this.sprite.chuchangSingle)return false;
      let skel = this.skeleton
      let app=PIXI_dpbf.app,source=this.chuchang_source
      let x=getComputedStyle(this.parent).left,y=getComputedStyle(this.parent).top
      x=parseInt(x)
      y=parseInt(y)
      this.parent!=dpbf.game.me?y+=300:y=y
      skel.visible = false
      let skeleton = new PIXI_dpbf.spine.Spine(source.spineData)
      skeleton.scale.set(0.7)
      skeleton.x=x
      skeleton.y=y
      app.stage.addChild(skeleton)
      if(skeleton.spineData.animations.filter(item => item.name == 'play')[0]){
        skeleton.state.setAnimation(0,'play')
        setTimeout(()=>{
          skeleton.destroy()
          if(this.parent&&!this.sprite.onlyChuchang&&this.parent.doing)skel.visible = true
        },skeleton.spineData.animations.filter(item => item.name == 'play')[0].duration * 1000)
      }
      return true;
    }
    findAnimation(aniName) {
      let ani = this.skeleton.spineData.animations.filter(item => item.name == aniName)[0]
      if(!ani){
      }
      return ani || false
    }
    getSkeleton(name){
      if(!!!name)return;
      let app=this.app
      let sks=app.stage.children[0].children,skeletons=[]
      sks.forEach(sk=>{skeletons.push(sk.children[0])})
      skeletons=skeletons.filter((item)=>{
        item&&item.attachment.name==name
      })
      return skeletons[0]
    }
  }
  window.LayaDynamic = LayaDynamic
})()