// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockContainer extends cc.Component {
    
    startPos:[number,number,boolean][]=[];

    bindPos:cc.Vec2 = null;
    
    start () {
        console.log(this.startPos);

    }

    // update (dt) {}
}
