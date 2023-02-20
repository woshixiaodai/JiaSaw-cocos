

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockControl extends cc.Component {


    holdTimeEclipse = 0;    //用来检测长按
    holdClick = false;       //用来检测点击
    // doubleTimeEclipse = 0;   //用来检测双击
    hold_one_click = 0;      //用来检测单击
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.parent.is3DNode = true;
        this.node.on(cc.Node.EventType.TOUCH_START,function(event){
            this.holdClick = true;
            this.holdTimeEclipse = 0;            
        },this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,(e)=>{
            this.move(e);
            //让该拼图离开scrollView
            this.node.parent.setParent(cc.director.getScene());
        },this)
        let self = this;
        this.node.on(cc.Node.EventType.TOUCH_END,function(event){           
            this.holdClick=false;
            if(this.holdTimeEclipse>=30)
            {                
                this.btn_status('long');       
            }
            else
            {                
                this.btn_status('short');                
            }    
            //开始记录时间
            this.holdTimeEclipse=0;
            // this.setPos(e);
            console.log(self.node.parent);

        },this);
    }

    //判断状态
    btn_status(status){
        if(status == 'short')
        {
            console.log(this.hold_one_click)
            this.hold_one_click ++;
            setTimeout(() => {
                if(this.hold_one_click == 1)
                {
                    console.log('short');
                    this.hold_one_click = 0;
                } 
                // else if(this.hold_one_click == 2)
                // {
                //     console.log('double');
                //     this.hold_one_click = 0;
                // }              
            }, 400);
            
        }
        else
        {
            this.hold_one_click = 0;
            console.log('long');
            // console.log(this.node.parent.children);
            this.show_menu();
        }
    }

    move(e){
        let location = e.getLocation();
        this.node.parent.setPosition(location);
    }

    //离开屏幕设置位置 
    setPos(e){
        
    }

    //显示才菜单
    show_menu(){
        
        let lastIndex = this.node.parent.children.length;
        let Menu = this.node.parent.children[lastIndex-1];//获取菜单节点
        console.log('show_menu');
        if(Menu.name=='Menu'){
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
                clickEventHandler.customEventData = count.toString();
                let btnEvents =  btn.getComponent(cc.Button)
                btnEvents.clickEvents[0]=clickEventHandler;
                console.log(clickEventHandler.target);
                console.log(btn.getComponent(cc.Button));
                console.log(btn);
                count++;
            }
            Menu.setParent(cc.director.getScene());
            Menu.setPosition(cc.director.getScene().x+400,cc.director.getScene().y+300);
        }
    }

    start () {
        
    }


    rotation(_,angle:string){
        // let X = this.node.parent.eulerAngles.x;
        // let Y = this.node.parent.eulerAngles.y;
        // let Z = this.node.parent.eulerAngles.z;
        // console.log('old',X,Y,Z);
        switch (angle) {
            //逆时针90
            case "0":
                // let newPos = cc.v3(X,Y,Z+=90.0)
                // let newPos = cc.v3(X,Y+=90.0,this.node.z)
                // this.node.parent.eulerAngles = newPos;
                // this.node.parent.rotation+=90.0;
                // this.node.parent.setPosition(newPos)
                // this.node.parent.angle=this.node.parent.z+=90;
                // this.node.parent.eulerAngles = cc.v3(this.node.parent.eulerAngles.x,this.node.parent.eulerAngles.y,this.node.parent.eulerAngles.z+=90);
                console.log(this.node.parent.eulerAngles.x);
                console.log(this.node.parent.x);
                this.node.parent.eulerAngles = cc.v3(this.node.parent.eulerAngles.x,this.node.parent.eulerAngles.y,this.node.parent.z+=90);
                break;
            //逆时针180
            case "1":
                // this.node.parent.eulerAngles = cc.v3(this.node.parent.eulerAngles.x,this.node.parent.eulerAngles.y,this.node.parent.eulerAngles.z+=180);
                this.node.parent.eulerAngles = cc.v3(this.node.parent.eulerAngles.x,this.node.parent.eulerAngles.y,this.node.parent.z+=180);
                break;
            //水平镜像
            case "2":
                // this.node.parent.eulerAngles = cc.v3(this.node.parent.eulerAngles.x,this.node.parent.eulerAngles.y-=180,this.node.parent.eulerAngles.z)
                this.node.parent.eulerAngles = cc.v3(this.node.parent.eulerAngles.x,this.node.parent.eulerAngles.y-=180,this.node.parent.z)
                break;
            //垂直镜像                
            case "3":
                // this.node.parent.eulerAngles = cc.v3(this.node.parent.eulerAngles.x-=180,this.node.parent.eulerAngles.y,this.node.parent.eulerAngles.z)
                this.node.parent.eulerAngles = cc.v3(this.node.parent.eulerAngles.x-=180,this.node.parent.eulerAngles.y,this.node.parent.z)
                break;                
        }
        let nX = this.node.parent.eulerAngles.x;
        let nY = this.node.parent.eulerAngles.y;
        let nZ = this.node.parent.eulerAngles.z;
        console.log('newx',nX,nY,nZ);
    }


    update (dt) {
        if(this.holdClick)
        {
            this.holdTimeEclipse++;
            if(this.holdTimeEclipse>120)//如果长按时间大于2s，则认为长按了2s
            {
                this.holdTimeEclipse=120;
            }
        }
    }
}
