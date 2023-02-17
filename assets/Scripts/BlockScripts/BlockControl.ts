

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // console.log('ffsfss');
        // this.node.on(cc.Node.EventType.TOUCH_START,this.checkEvent);
        
        this.node.on(cc.Node.EventType.TOUCH_START,()=>{
            console.log('rrrr');
            this.rotation();
        },this)
        console.log(this.node);
        
    }

    checkEvent(e){
        console.log(e);
        if(e.getButton() == cc.Event.EventMouse.BUTTON_LEFT){
            console.debug('left up');
        }if(cc.Event.EventMouse.BUTTON_RIGHT ==e.getButton()){
            console.debug('right up');
        }
    }
    //旋转
    rotation(){
        console.log(this.node.rotation);
        this.node.angle
    }
    // update (dt) {}
}
