

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,()=>{
            this.move;
        })
        this.node.on(cc.Node.EventType.MOUSE_DOWN,()=>{
            console.log('rrrr');
        })
    }

    move(e){
        console.log(e);
        this.node.x = e.getLocation();
    }



    // update (dt) {}
}
