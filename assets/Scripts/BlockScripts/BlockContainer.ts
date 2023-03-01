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
        // const borderNode = new cc.Node(); // 创建边框节点
        // borderNode.name = 'border_'+this.node.name;
        // const graphics = borderNode.addComponent(cc.Graphics); // 添加 cc.Graphics 组件
        // graphics.lineWidth = 2; // 设置线宽
        // graphics.strokeColor = cc.Color.BLACK; // 设置描边颜色
        // graphics.rect(-this.node.width/2, -this.node.height/2, this.node.width, this.node.height); // 绘制矩形
        // graphics.stroke(); // 绘制边框
        // borderNode.setPosition(cc.v2(0,0)); // 设置位置与原节点相同
        // borderNode.parent = this.node; // 将边框节点设置为原节点的子节点
    }

    // update (dt) {}
}
