
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
            let promise = Promise.resolve()
            for(let i of this.preloads){
                promise.then(()=>{
                    return this.loadCard(i)
                })
            }
            promise.then(()=>{
                this.loadEnd()
            })
        }
        loadCard(card){
            return new Promise((resolve,reject)=>{
                Laya.loader.load(card,Laya.Handler.create(this,()=>{
                    resolve(this.preloads)
                }))
            })
        }
        preload(path){
            path = this.path + path
            this.preloads.push(
                [{url:`${path}.sk`,type:Laya.Loader.BUFFER,name2:path},{url:`${path}.png`,type:Laya.Loader.IMAGE,name2:path}]
            )
        }
        loadEnd(){
            let promise = Promise.resolve(this)
            this.preloads.forEach(card=>{
                card = card[0]
                let path = card.name2
                let name = path.split('/').pop()
                promise.then((loader)=>{
                    return new Promise((res)=>{
                        let temp = new Laya.Templet()
                        temp.loadAni(`${path}.sk`)
                        temp.on(Laya.Event.COMPLETE, temp, function(){
                            res(loader)
                        })
                        this.templets[name] = temp
                    })
                })
            })
            let int = setInterval(()=>{
                try{
                    this.callback(this)
                    clearInterval(int)
                }
                catch{}
            },200)
        }
    }
    class Player {
        constructor(loader){
            this.skeletons = {}
            Object.keys(loader.templets).forEach(templet=>{
                let sk = this.skeletons[templet] = new Laya.Skeleton(loader.templets[templet])
                sk.x = window.innerWidth / 2 - 50
                sk.y = window.innerHeight / 2 - 50
                sk.scale(1,1)
            })
        }
        play(name,card){
            name = name.split('/').pop()
            Laya.stage.addChild(this.skeletons[name])
            this.skeletons[name].play(0)
            this.skeletons[name].on('stopped', this, ()=>{
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