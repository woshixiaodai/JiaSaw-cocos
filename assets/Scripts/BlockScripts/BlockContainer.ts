// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockContainer extends cc.Component {
    
    //方块起始位置
    startPos:[number,number,boolean][]=[];

    //绑定的地图块
    bindPos:cc.Vec2 = null;
    
    //激活边框
    hadBorder:boolean = false;

    //是否已完成移动
    moveFinished:boolean = false;
    //是否展示菜单了
    showMenuStatus:boolean = false;
    //
    canDown:boolean =false;

    start () {
        
    }

    // update (dt) {}
}
