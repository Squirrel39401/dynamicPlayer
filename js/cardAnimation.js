
(this.dcdCardAni = this.dcdCardAni || {});
(function(dcdCardAni){
    Config.isAlpha = true
    let canvasRender = Laya.init(window.innerWidth, window.innerHeight, Laya.WebGL) || Laya.Render.canvas;
    Laya.stage.bgColor=null
    class Loader {
        constructor(path, call){
            this.path = path
            this.templets = {}
            this.preloads = []
            this.callback = call
        }
        load(){
            Laya.loader.load(this.preloads,Laya.Handler.create(this,this.loadEnd,[this.preloads],true))
        }
        preload(path){
            path = this.path + path
            this.preloads.push({url:`${path}.sk`,type:Laya.Loader.BUFFER,name2:path},{url:`${path}.png`,type:Laya.Loader.IMAGE,name2:path})
        }
        loadEnd(cardPath){
            cardPath.forEach(card=>{
                let path = card.name2
                let name = path.split('/').pop()
                let temp = new Laya.Templet()
                temp.loadAni(`${path}.sk`)
                this.templets[name] = temp
            })
            setTimeout(()=>{this.callback(this)},3000)
        }
    }
    class Player {
        constructor(loader){
            this.skeletons = {}
            Object.keys(loader.templets).forEach(templet=>{
                this.skeletons[templet] = new Laya.Skeleton(loader.templets[templet])
                let sk = this.skeletons[templet] 
                sk.x = window.innerWidth / 2 - 50
                sk.y = window.innerHeight / 2 - 50
                sk.scale(1,1)
            })
        }
        play(name,card){
            name = name.split('/').pop()
            Laya.stage.addChild(this.skeletons[name])
            this.skeletons[name].play(0)
            this.skeletons[name].on('stopped',()=>{
                Laya.stage.removeChild(this.skeletons[name])
            })
            if(card){
                let style=getComputedStyle(card),x = card.tx,y = card.ty
                x /= dpbf.game.documentZoom
                y /= dpbf.game.documentZoom
                x -= 107
                y -= 150
                Object.defineProperties(this.skeletons[name],{
                    x:{
                        get:()=>x,
                        set(v){}
                    },
                    y:{
                        get:()=>y,
                        set(v){}
                    }
                })
            }
        }
    }
    Object.assign(dcdCardAni,{
        Loader,
        Player
    })
})(dcdCardAni)