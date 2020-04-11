var State={
    circle1:1,
    circle2:2,
    circle3:3,
    throw:0, 
    die:-1 ,
};
var DIE_HEIGHT=-750;
var CIRCLE_SIZE=684;
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
        Yspeed:9999,
        Xspeed:7,
        speed:1,
        G:0.1,
        scoreAudio:{
            default:null,
            type:cc.AudioClip
        },
        circle1:{
            type:cc.Node,
            default:null
        },
        circle2:{
            type:cc.Node,
            default:null
        },
        circle3:{
            type:cc.Node,
            default:null
        }
    },
    playScoreAudio(){
        cc.audioEngine.playEffect(this.scoreAudio,false)
    },
    // LIFE-CYCLE CALLBACKS:
    runOnCircle(circle,vec){
        var circle_vec=cc.v2(circle.x,circle.y);
        var radius_vec=vec.sub(circle_vec);
        radius_vec.rotateSelf(this.speed/180*Math.PI);
        vec=circle_vec.add(radius_vec);
        this.bef_vec=this.node.position;
        this.node.setPosition(vec);
    },
    isHitCircle(){
        var vec2=this.circle2.getPosition();
        var vec3=this.circle3.getPosition();
        var dist2=this.node.position.sub(vec2).mag();
        var dist3=this.node.position.sub(vec3).mag();
        if(dist2<=this.circle2.scale*CIRCLE_SIZE/2){
            this.playScoreAudio();
            return 2;
        }
        else if(dist3<=this.circle3.scale*CIRCLE_SIZE/2){
            this.playScoreAudio();
            return 3
        }
        else{
            return false;
        }
    },
    isDie(){
        if(this.node.y<=DIE_HEIGHT){
            this.state=State.die;
        }
    },
    throw(){
        if(this.Yspeed===this.rcd_Yspeed){
            var dir_vec=this.getDirection(this.bef_vec,this.node.position);
            this.Yspeed=this.Xspeed*dir_vec.y;
            this.Xspeed=this.Xspeed*dir_vec.x;
        }
        this.bef_vec=this.node.position;
        this.node.x+=this.Xspeed;
        this.node.y+=this.Yspeed
        this.Yspeed-=this.G;
    },
    getDirection(bef_vec,now_vec){
        var dir_vec=now_vec.sub(bef_vec);
        return dir_vec;
    },
    setRotation(){
        var dir_vec=this.getDirection(this.bef_vec,this.node.position);
        var level_vec=cc.v3(1,0,0);
        var angle=level_vec.angle(dir_vec)/Math.PI*180;
        if(dir_vec.y>0){
            this.node.angle=90+angle;
        }
        else{
            this.node.angle=90-angle;
        }
    },
    onLoad () {
        cc.game.setFrameRate(30);
        this.state=State.circle1;
        this.rcd_Xspeed=this.Xspeed;
        this.rcd_Yspeed=this.Yspeed;
    },
    start () {
    },
    update (dt) {
        if(this.state===State.circle1){
            var vec=cc.v2(this.node.x,this.node.y);
            this.runOnCircle(this.circle1,vec)
        }
        if(this.state===State.circle2){
            var vec=cc.v2(this.node.x,this.node.y);
            this.runOnCircle(this.circle2,vec)
        }
        if(this.state===State.circle3){
            var vec=cc.v2(this.node.x,this.node.y);
            this.runOnCircle(this.circle3,vec)
        }
        if(this.state===State.throw){
            this.throw();
            if(this.isHitCircle()){
                this.state=this.isHitCircle();
                this.Yspeed=this.rcd_Yspeed;
                this.Xspeed=this.rcd_Xspeed;
            }
            this.isDie();
        }
        this.setRotation();
    },
});
