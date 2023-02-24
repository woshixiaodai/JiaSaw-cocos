
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
    offsetVec:cc.Vec2 = null;

    isUsed:boolean = false;

     
    onLoad () {
        //开启碰撞检测
        cc.director.getCollisionManager().enabled = true;
        this.addCollider();
        this.node.parent.is3DNode = true;
        this.currentX =  this.node.parent.position.x;
        this.currentY =  this.node.parent.position.y;
        this.node.on(cc.Node.EventType.TOUCH_START,(e)=>{
            console.log('block',this.node.parent.parent.x,this.node.parent.parent.y);
            
            this.holdClick = true;
            this.holdTimeEclipse = 0;
            this.currentX =  this.node.parent.position.x;
            this.currentY =  this.node.parent.position.y;
            //将一个点转换到节点 (局部) 坐标系，并加上锚点的坐标。 也就是说返回的坐标是相对于节点包围盒左下角的坐标。 
            //将鼠标位置转换为这个父物体下得局部坐标作为偏移量
            this.offsetVec=this.node.parent.parent.convertToNodeSpaceAR(e.getLocation());
            
            
        },this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,(e)=>{
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
            this.backStartPos();
        },this);
       
    }

    //判断状态
    btn_status(e,status){
        if(status == 'short')
        {
            console.log(this.hold_one_click)
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
                    console.log('double');
                    this.hold_one_click = 0;
                    this.show_menu();
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
        // console.log('parent',this.node.parent.getPosition());
        // console.log('finger',location);
        //减去当前节点的位置，让父物体跟随鼠标
        // console.log(this.node.parent.scaleX,this.node.parent.scaleY);
        this.node.parent.parent.setPosition(location.x-this.offsetVec.x,location.y-this.offsetVec.y);
        // let res =  cc.director.getPhysicsManager().rayCast(this.node.getPosition(),cc.v2(this.node.x,this.node.y),cc.RayCastType.Closest);
        // console.log(this.node.name);
    }

    //显示变化菜单
    show_menu(){
        let Menu = cc.director.getScene().children[5].children[0];//获取菜单节点
        console.log(Menu);
        if(Menu){
            console.log(Menu);
            Menu.active=true;
            let count=0;
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
                clickEventHandler.customEventData = count+"";
                let btnEvents =  btn.getComponent(cc.Button);
                btnEvents.clickEvents[0]=clickEventHandler;
                count++;
            }
            Menu.setParent(cc.director.getScene().children[5]);
            Menu.setPosition(150,-30);
            console.log(Menu);
        }
    }
    //关闭菜单
    close_menu(){
        let Menu = cc.director.getScene().children[5].children[0];
        Menu.active = false;
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

    //检测地图
    addCollider(){
        for(let block of this.node.parent.children)
        {
            block.addComponent(cc.BoxCollider);
        }
    }

    onCollisionEnter(other){
        if(other.node.getComponent(cc.BoxCollider).tag==1){ 
            this.isUsed=true;
            console.log(other.node.children[0].children[0].getComponent(cc.Label).string);
            this.node.parent.parent.position = other.node.position; 
            
        }
    }
    //回到原点
    backStartPos(){
        let originX = this.node.parent.parent.getComponent(BlockContainer).startPos[0][0];
        let originY = this.node.parent.parent.getComponent(BlockContainer).startPos[0][1];
        this.node.parent.parent.setPosition(originX,originY);
        this.node.parent.parent.setParent(cc.director.getScene().children[2].children[1].children[0]);
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
