

const {ccclass, property} = cc._decorator;

@ccclass
export default class MapControl extends cc.Component {

    
   
    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(e)=>{
            // console.log('block',this.node.x,'--',this.node.y);
            console.log('block-wPos',this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).x,'--',this.node.convertToWorldSpaceAR(cc.Vec2.ZERO).y);
            console.log('mousePos',e.getLocation().x,'--',e.getLocation().y);
        },this);
    }


    update (dt) {
        
    }
}
