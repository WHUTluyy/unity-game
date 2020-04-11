var MAX_SCALE=0.65;
var MIN_SCALE=0.35;
var CIRCLE_SIZE=684;
var State={
    circle1:1,
    circle2:2,
    circle3:3,
    throw:0,
    die:-1, 
};
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        game:{
            type:cc.Node,
            default:null
        },
        fire:{
            type:cc.Node,
            default:null
        },
        fir_circle:{
            type:cc.Node,
            default:null
        },
        sed_circle:{
            type:cc.Node,
            default:null
        },
        tir_circle:{
            type:cc.Node,
            default:null 
        },
        ScoreNode:{
            type:cc.Label,
            default:null
        },
        defeated_label:{
            type:cc.Prefab,
            default:null
        },
        prefab_circle:{
            type:cc.Prefab,
            default:null
        },
        prefab_button:{
            type:cc.Prefab,
            default:null
        },
        bkAudio:{
            default:null,
            type:cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:
    NewCircle(){
        var scale=Math.random()*(MAX_SCALE-MIN_SCALE)+MIN_SCALE;
        this.newCircle=cc.instantiate(this.prefab_circle);
        this.game.addChild(this.newCircle,cc.macro.MIN_ZINDEX);
        this.newCircle.setPosition(this.getRamCirclePos(scale));
        this.newCircle.setScale(scale);
    },
    getRamCirclePos(scale){
        var ramY;
        var ramX;
        var R=CIRCLE_SIZE*scale/2;
        ramX=-this.game.x-this.node.x+Math.random()*(this.node.width/3*4-R-(this.node.width+R))+this.node.width+R;
        ramY=-this.node.y+Math.random()*(this.node.height/10*9-R-(this.node.height/5+R))+this.node.height/5+R;
        return cc.v2(ramX,ramY);
    },
    success(){
        this.NewCircle();
        this.game.runAction(cc.moveBy(1,cc.v2(-this.node.width/3,0)));
        this.fir_circle.destroy;
        this.fir_circle=this.sed_circle;
        this.sed_circle=this.tir_circle ;
        this.tir_circle=this.newCircle;
        this.updateFire();
        this.bef_state=this.fire.getComponent('player').state;
        this.fire.getComponent('player').state--;
    },
    updateFire(){
        var player=this.fire.getComponent('player');
        player.circle1=this.fir_circle;
        player.circle2=this.sed_circle;
        player.circle3=this.tir_circle;
    },
    onLoad () {
        cc.audioEngine.playMusic(this.bkAudio,true,0.3);
        this.node.on(cc.Node.EventType.TOUCH_START,function (e) {
            this.fire.getComponent('player').state=State.throw;
        },this);
        cc.game.setFrameRate(30);
        // this.button=cc.instantiate(this.prefab_button);
        // this.node.addChild(this.button);
        // this.button.x=0;
        // this.button.y=-400;
        // console.log(button.on);
        // this.node.on(cc.Node.EventType.TOUCH_START,function (e) {
        //    this.scheduleOnce(function(){
        //        this.success();
        //    }.bind(this),1)
        // },this);
    },
    again(){
        cc.director.loadScene('game_scene');
        cc.director.resume('game_scene');
    },
    defeated(){
        var f_label=cc.instantiate(this.defeated_label);
        this.node.addChild(f_label);
        f_label.x=0;
        f_label.y=100;
        this.button=cc.instantiate(this.prefab_button);
        this.node.addChild(this.button);
        this.button.x=0;
        this.button.y=-400;
        if(this.heart===1){
            this.button.on(cc.Node.EventType.TOUCH_START, function(event){
            this.again();
        }.bind(this));
        this.heart=0;
        }
        cc.director.pause('game_scene');
    },
    start () {
        this.heart=1
        this.score=0;
    },

    update (dt) {
        var fire_state=this.fire.getComponent('player').state;
        if(fire_state===State.circle2&&this.bef_state!==State.circle3){
            this.success();
            this.score++;
            console.log(this.score);
        }
        if(fire_state===State.circle3){
            this.success()
            this.scheduleOnce(function(){
               this.success();
           }.bind(this),0.9)
           this.score+=2;
        }
        if(fire_state===State.die){
            this.defeated();
        }
        this.ScoreNode.string='得分:'+this.score;
    },
});
