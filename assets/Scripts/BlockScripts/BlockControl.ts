
const {ccclass, property} = cc._decorator;
import BlockManager from './BlockManager'
import MapControl from '../MapScripts/MapControl'
import BlockContainer from './BlockContainer';
@ccclass
export default class BlockControl extends cc.Component {


    holdTimeEclipse = 0;    //用来检测长按
    holdClick = false;       //用来检测点击
    // doubleTimeEclipse = 0;   //用来检测双击
    hold_one_click = 0;      //用来检测单击
    
    isMoving = false;   //检测是否在移动中

    //记录初始位置
    currentX:number = 0;
    currentY:number = 0;
    //鼠标位置和移动拼图的偏移量
    offsetVec:cc.Vec2 = null;

    //用于检测当前拼图是否使用并且在地图上
    isUsed:boolean = false;
    //获取背景节点
    bg:cc.Node =null;
    //获取滚动框节点
    scrollView:cc.Node = null;
    //获取这两个节点让用户点击时都关闭框

    onLoad () {
        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;
        this.addCollider();
        this.node.parent.is3DNode = true;
        this.currentX =  this.node.parent.position.x;
        this.currentY =  this.node.parent.position.y;
        this.node.on(cc.Node.EventType.TOUCH_START,(e)=>{
            
            this.holdClick = true;
            this.holdTimeEclipse = 0;
            this.currentX =  this.node.parent.position.x;
            this.currentY =  this.node.parent.position.y;
            //将一个点转换到节点 (局部) 坐标系，并加上锚点的坐标。 也就是说返回的坐标是相对于节点包围盒左下角的坐标。 
            //将鼠标位置转换为这个父物体下得局部坐标作为偏移量
            this.offsetVec=this.node.parent.parent.convertToNodeSpaceAR(e.getLocation());
        },this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,(e)=>{
            this.node.parent.parent.getComponent(BlockContainer).bindPos=null;
            this.isMoving = true;
            this.move(e);
        },this)

        this.node.on(cc.Node.EventType.TOUCH_END,(e)=>{
            this.holdClick=false;
            //这里检测是没有移动还是移动了位置,再由下一个判断是否进入长按
            if(this.node.parent.position.x!=this.currentX&&this.node.parent.position.y!=this.currentY){
                console.log('moved');
                this.isMoving=true;           
            }
            //没有移动位置则不进入长按状态
            if(this.holdTimeEclipse>=30 && !this.isMoving)
            {                
                this.btn_status(e,'long');       
            }
            else
            {                
                this.btn_status(e,'short'); 
            }    
            //开始记录时间
            this.holdTimeEclipse=0;
            this.isMoving = false;
            //检测是否能放下
            for(let block of this.node.parent.children){
                if(!block.getComponent(BlockControl).isUsed){
                    this.node.parent.parent.getComponent(BlockContainer).canDown = false;
                    break;
                }else{
                    this.node.parent.parent.getComponent(BlockContainer).canDown = true;
                }
            }
            //如果有绑定的点位并且能放下，则放下
            if(this.node.parent.parent.getComponent(BlockContainer).bindPos!=null && this.node.parent.parent.getComponent(BlockContainer).canDown){
                this.node.parent.parent.setPosition(this.node.parent.parent.getComponent(BlockContainer).bindPos);
                this.node.parent.parent.getComponent(BlockContainer).moveFinished = true;
                this.node.parent.parent.getComponent(BlockContainer).bindPos=null;
                let label = this.findNodeInChildren(cc.director.getScene(),'stepCount');
                label.getComponent(cc.Label).string = (parseInt(label.getComponent(cc.Label).string)+1)+"";
            }else{
                let label = this.findNodeInChildren(cc.director.getScene(),'stepCount');
                label.getComponent(cc.Label).string = (parseInt(label.getComponent(cc.Label).string)+1)+"";
                this.backStartPos();
            }
        },this);

        this.bg = this.findNodeInChildren(cc.director.getScene(),'bg');
        this.scrollView = this.findNodeInChildren(cc.director.getScene(),'scrollview');
        //点击bg任意位置关闭菜单和边框
        this.bg.on(cc.Node.EventType.TOUCH_START,(e)=>{
            this.close_menu()
        },this)

        //两种方案，点击滚动框关闭菜单
        // this.node.parent.parent.parent.parent.parent.on(cc.Node.EventType.TOUCH_START,(e)=>{
        //     this.close_menu()
        // },this)
        this.scrollView.on(cc.Node.EventType.TOUCH_START,(e)=>{
            this.close_menu()
        },this)
    }

    //判断状态
    btn_status(e,status){
        if(status == 'short')
        {
            this.hold_one_click ++;
            setTimeout(() => {
                //单击&双击都关闭菜单
                if(this.hold_one_click == 1)
                {
                    console.log('short');
                    this.hold_one_click = 0;
                    this.close_menu()
                } 
                else if(this.hold_one_click == 2)
                {
                    this.close_menu();
                    console.log('double');
                    this.hold_one_click = 0;
                    if(this.node.parent.parent.getComponent(BlockContainer).showMenuStatus){
                        this.close_menu();
                    }else{
                        this.show_menu();
                    }
                }              
            }, 400);
        }
        else
        {
            this.hold_one_click = 0;
            console.log('long');
            this.show_menu();
        }
    }

    total = 0;
    move(e){
        //移动的时候让拼图块离开scrollView
        this.node.parent.parent.setParent(cc.director.getScene());
        let location = e.getLocation();
        //减去当前节点的位置，让父物体跟随鼠标
        this.node.parent.parent.setPosition(location.x-this.offsetVec.x,location.y-this.offsetVec.y);
    }

    //显示变化菜单
    show_menu(){
        // this.node.parent.parent.setPosition(this.node.parent.parent.convertToWorldSpaceAR(cc.Vec2.ZERO));
        // this.node.parent.parent.setParent(cc.director.getScene());
        this.node.parent.parent.getComponent(BlockContainer).showMenuStatus = true;
        let Menu = cc.director.getScene().children[5].children[0];//获取菜单节点
        if(Menu){
            Menu.active=true;
            let rotationMode=0;    //用于控制旋转
            for(let btn of Menu.children){
                var clickEventHandler = new cc.Component.EventHandler();
                //这个 node 节点是你的事件处理代码组件所属的节点
                clickEventHandler.target = this.node;
                // clickEventHandler.target = btn;
                //节点指定组件
                clickEventHandler.component = "BlockControl";
                //指定执行函数
                clickEventHandler.handler = "rotation";
                //这里传递自定义的参数
                clickEventHandler.customEventData = rotationMode+"";
                let btnEvents =  btn.getComponent(cc.Button);
                btnEvents.clickEvents[0]=clickEventHandler;
                rotationMode++;
            }
            Menu.setParent(cc.director.getScene().children[5]);
            Menu.setPosition(150,-30);
            if(!this.node.parent.parent.getComponent(BlockContainer).hadBorder){
                 // 创建边框节点
                for(let block  of this.node.parent.children){
                    const borderNode = new cc.Node(); // 创建边框节点
                    borderNode.name = 'border_'+block.name;
                    const graphics = borderNode.addComponent(cc.Graphics); // 添加 cc.Graphics 组件
                    graphics.lineWidth = 2; // 设置线宽
                    graphics.strokeColor = cc.Color.BLACK; // 设置描边颜色
                    graphics.rect(-block.width/2, -block.height/2, block.width, block.height); // 绘制矩形
                    graphics.stroke(); // 绘制边框
                    borderNode.setPosition(cc.v2(0,0)); // 设置位置与原节点相同
                    borderNode.parent = block; // 将边框节点设置为原节点的子节点
                    this.node.parent.parent.getComponent(BlockContainer).hadBorder = true;
                    // const borderNode = new cc.Node();
                    // const borderSprite = borderNode.addComponent(cc.Sprite);
                    // borderSprite.type = cc.Sprite.Type.SLICED;
                    // borderSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                    // borderSprite.spriteFrame = new cc.SpriteFrame();
                    // borderSprite.spriteFrame.insetTop = 1;
                    // borderSprite.spriteFrame.insetBottom = 1;
                    // borderSprite.spriteFrame.insetLeft = 1;
                    // borderSprite.spriteFrame.insetRight = 1;
                    // borderNode.color = cc.Color.BLACK;
                    // borderNode.width = block.width + 5; // 边框宽度为5
                    // borderNode.height = block.height + 5;
                    // borderNode.name = `${block.name}_border`;
                    // borderNode.setPosition(cc.v2(0,0));
                    // borderNode.parent= block;
                }
            }else{
                for(let block of this.node.parent.children){
                    for(let border of block.children){
                        border.active= true;
                    }
                }
                console.log('showBorder');
            }
        }
    }
    //关闭菜单
    close_menu(){
        this.node.parent.parent.getComponent(BlockContainer).showMenuStatus= false;
        let Menu = cc.director.getScene().children[5].children[0];
        Menu.active = false;
        // for(let block of this.node.parent.children){
        //     for(let border of block.children){
        //         border.active= false;
        //     }
        // }
        // for(let blockContainer of this.node.parent.parent.parent.children){
        //     for(let block of blockContainer.children){
        //         for(let square of block.children)
        //         {
        //             for(let border of square.children)
        //             {
        //                 border.active= false;
        //             }
        //         }
        //     }
        // }
        for(let i=1;i<13;i++){
            // console.log(`block${i}Container`);
            // const blockContainer = cc.find(`block${i}Container`);
            //在整个场景下查找指定节点，来关闭边框
            //传入对应的拼图容器名称
            let blockContainer = this.findNodeInChildren(cc.director.getScene(),`block${i}Container`);
            // console.log(blockContainer);
            for(let block of blockContainer.children){
                for(let square of block.children)
                {
                    for(let border of square.children)
                    {
                        border.active= false;
                    }
                }
            }
        }
    }
    // 递归查找节点
    findNodeInChildren(node: cc.Node, name: string): cc.Node {
        //如果找到了直接返回
        if (node.name === name) {
        return node;
        } else {
        const children = node.children;
        //在这个节点中一直往下找
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const result = this.findNodeInChildren(child, name);
            if (result) {
            return result;
            }
        }
        return null;
        }
    }


    //旋转物体
    rotation(_,angle:string){
        //通过子组件操作父组件旋转翻转
        switch (angle) {
            //逆时针90
            case "0":
                this.node.parent.angle+=90.0;
                break;
            //逆时针180
            case "1":
                this.node.parent.angle+=180.0;
                break;
            //水平镜像
            case "2":
                if(this.node.parent.angle%180==0 || this.node.parent.angle==0)
                {
                    this.node.parent.scaleX = - this.node.parent.scaleX;
                }
                else
                {
                    this.node.parent.scaleY = - this.node.parent.scaleY;
                }
                break;
            //垂直镜像                
            case "3":
                // this.node.parent.eulerAngles = cc.v3(this.node.parent.eulerAngles.x-=180,this.node.parent.eulerAngles.y,this.node.parent.eulerAngles.z)
                if(this.node.parent.angle%180==0 || this.node.parent.angle==0)
                {
                    this.node.parent.scaleY = - this.node.parent.scaleY;
                }
                else
                {
                    this.node.parent.scaleX = - this.node.parent.scaleX;
                }
                break;                
        }
    }

    //检测地图++
    addCollider(){
        this.node.addComponent(cc.BoxCollider);
        let boxCollider = this.node.getComponent(cc.BoxCollider);
        boxCollider.size= cc.size(40,40);
        boxCollider.tag=2;
        boxCollider.offset=cc.v2(0,0);
    }

    onCollisionEnter(other){
    }

    onCollisionStay(other){
         //判断是否在背景上
        if(other.node.getComponent(cc.BoxCollider).tag == 3){
            this.isUsed=false;
        }
        //判断是否是地图
        if(other.node.getComponent(cc.BoxCollider).tag==1){
            this.isUsed = true;
            if(this.node.name == '1'){
                const worldPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
                if(other.node.position.x-worldPos.x>=-25&&other.node.position.x-worldPos.x<=25&&other.node.position.y-worldPos.y>=-25&&other.node.position.x-worldPos.y<=25){
                    //得到第一个方块与中心的偏移量，在将第一个子节点碰撞到的地图的位置进行相加得到最终父节点所在的位置
                    let offsetX =  this.node.parent.parent.x-worldPos.x;
                    let offsetY =  this.node.parent.parent.y-worldPos.y;
                    this.node.parent.parent.getComponent(BlockContainer).bindPos = 
                    cc.v2(other.node.convertToWorldSpaceAR(cc.Vec2.ZERO).x+offsetX,other.node.convertToWorldSpaceAR(cc.Vec2.ZERO).y+offsetY);
                }
            }
        }
        //判断是否是拼图
        if(other.node.getComponent(cc.BoxCollider).tag == 2){
            for(let block of this.node.parent.children){
                block.getComponent(BlockControl).isUsed = false;
            }
            this.node.parent.parent.getComponent(BlockContainer).canDown =false;
        }
    }
    onCollisionExit(other){
    }

    //回到原点
    backStartPos(){
        let originX = this.node.parent.parent.getComponent(BlockContainer).startPos[0][0];
        let originY = this.node.parent.parent.getComponent(BlockContainer).startPos[0][1];
        this.node.parent.parent.setPosition(originX,originY);
        this.node.parent.parent.setParent(cc.director.getScene().children[2].children[1].children[0]);
        this.node.parent.parent.getComponent(BlockContainer).moveFinished = false;
        //回到原点重置拼块状态
        for(let block of  this.node.parent.children){
            block.getComponent(BlockControl).isUsed = false;
        }
    }

    start () {
        
    }

    update (dt) {
        //检测点击
        if(this.holdClick)
        {
            this.holdTimeEclipse++;
            if(this.holdTimeEclipse>60)//如果长按时间大于2s，则认为长按了2s
            {
                this.holdTimeEclipse=60;
            }
        }
    }
}
