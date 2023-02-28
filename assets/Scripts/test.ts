// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        this.node.on(cc.Node.EventType.TOUCH_START,(e)=>{
            console.log(this.node.children);
        },this)

       // 创建边框子节点
        const borderNode = new cc.Node();
        const borderSprite = borderNode.addComponent(cc.Sprite);
        borderSprite.type = cc.Sprite.Type.SLICED;
        borderSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        borderSprite.spriteFrame = new cc.SpriteFrame();
        borderSprite.spriteFrame.insetTop = 1;
        borderSprite.spriteFrame.insetBottom = 1;
        borderSprite.spriteFrame.insetLeft = 1;
        borderSprite.spriteFrame.insetRight = 1;
        borderNode.color = cc.Color.BLACK;
        borderNode.width = this.node.width + 5; // 边框宽度为5
        borderNode.height = this.node.height + 5;
        borderNode.name = `${this.node.name}_border`;
        this.node.addChild(borderNode);



        // // 设置边框节点的位置和锚点
        // const widget = borderNode.addComponent(cc.Widget);
        // widget.isAlignTop = true;
        // widget.isAlignBottom = true;
        // widget.isAlignLeft = true;
        // widget.isAlignRight = true;
        // widget.top = widget.bottom = widget.left = widget.right = 0;
        // widget.target = this.node;
        // widget.alignMode = cc.Widget.AlignMode.ONCE;
        // const borderNode = new cc.Node(); // 创建边框节点
        // const graphics = borderNode.addComponent(cc.Graphics); // 添加 cc.Graphics 组件
        // graphics.lineWidth = 2; // 设置线宽
        // graphics.strokeColor = cc.Color.BLACK; // 设置描边颜色
        // graphics.rect(-this.node.width/2, -this.node.height/2, this.node.width, this.node.height); // 绘制矩形
        // graphics.stroke(); // 绘制边框
        
        // borderNode.color = cc.Color.BLACK; // 设置颜色为透明，不影响原节点颜色
        // borderNode.setPosition(this.node.position); // 设置位置与原节点相同
        // borderNode.parent = this.node.parent; // 将边框节点设置为原节点的子节点





    }

    // update (dt) {}
}
