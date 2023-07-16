
(function () {
  let canvas = Laya.init(window.innerWidth, window.innerHeight, Laya.WebGL);
  let index=0
  canvas.remove();
  let ctx = Laya.Browser.context;
  let LayaDynamic = {};
  LayaDynamic.DynamicPlayer = (function () {
    let DynamicPlayer = function (path, isBackground) {
      this.canvas=document.createElement('canvas')
      let canvas=this.canvas
      canvas.width=120
      canvas.height=isBackground?180:190
      canvas.pos=index++
      this.path=path
      this.skeleton=new Laya.Skeleton()
      this.stage=new Laya.Stage()
      let {stage,skeleton}=this
      stage.addChild(skeleton)
      stage.size(canvas.width,canvas.height)
      stage.pos(canvas.pos*120+60,0)
      Laya.stage.addChild(stage)
    };
    DynamicPlayer.prototype.play = function (sprite) {
      
    };
    return DynamicPlayer;
  })();
  window.LayaDynamic=LayaDynamic
})()