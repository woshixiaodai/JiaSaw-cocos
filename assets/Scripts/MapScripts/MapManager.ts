import MapControl from "./MapControl";

import Timer from "../TimerScripts/Timer";
const {ccclass, property} = cc._decorator;

@ccclass
export default class MapManager extends cc.Component {

    //生成时间地图块预制件
    @property(cc.Prefab)
    MapObj:cc.Prefab = null; 

    //获取背景
    @property(cc.Node)
    bg:cc.Node = null;

    //获取定时器
    @property(cc.Node)
    time: cc.Node = null;

    //获取胜利遮罩
    @property(cc.Node)
    winMask:cc.Node= null;

    //所有时间地图块
    MapObjList:cc.Node[] =[];  

    //当前时间
    NowDate:string = "";

    //date
    DateInfo:string[] =[
        "拼图","周1","周2","周3","1月","2月","3月","4月",
        "周4","周5","周6","周7","5月","6月","7月","8月",
        "1日","2日","3日","4日","9月","10月","11月","12月",
        "5日","6日","7日","8日","9日","10日","11日","12日",
        "13日","14日","15日","16日","17日","18日","19日","20日",
        "21日","22日","23日","24日","25日","26日","27日","28日",
        "29日","30日","31日"
    ];


    //存储生成的时间
    checkText:string[] = new Array(56);

    //纵向个数
    VerticalMapNumber:number = 8;
    //横向个数
    HorizontalMap:number= 7;
    //生成地图块的起始点位
    startPos:number[] = [180,1100]

    start () {
        this.NowDate = this.getNowDate();
        console.log(this.NowDate);
        this.generateMap();
    }


    //获取当前时间
    getNowDate():string{
        let DateTime:Date = new Date(); 
        //获取当前月份
        let Month:number=  DateTime.getMonth()+1; //获取当前月份(0-11,0代表1月) 
        //获取当前日
        let Day:number= DateTime.getDate(); //获取当前日(1-31)
        //获取当前星期几
        let week:number = DateTime.getDay();//获取当前星期X(0-6,0代表星期天)
        if(week==0){
            week=7;
        }
        let now :string = Month+"月"+Day+"日"+"周"+week;
        return now;
    }
    //生成地图
    generateMap(){
        let currentIndex = 0;
        for(let x=0;x<this.HorizontalMap;x++)
        {  
            let currentX = x;
            for(let y=0;y<this.VerticalMapNumber;y++)
            {
                 //最后几个不生成
                 if (x == 6 && y > 2)
                {
                    this.MapObjList[x * this.VerticalMapNumber + y] = null;
                    break;
                }
                let mapBlock = cc.instantiate(this.MapObj);
                //设置地图name
                mapBlock.name =x+"_"+y;
                
                //设置父对象
                mapBlock.parent = this.bg;
                //指定生成位置
                if(x==0)
                {
                    //设置第一排
                    mapBlock.position =cc.v3(this.startPos[0]+(y*50),this.startPos[1],0); 
                    mapBlock.children[0].children[0].getComponent(cc.Label).string = this.DateInfo[currentIndex];
                }
                else
                {
                    //之后的每一排
                    if(x==currentX)
                    {
                        mapBlock.position =cc.v3(this.startPos[0]+(y*50),this.startPos[1]-(currentX*50),0);
                        mapBlock.children[0].children[0].getComponent(cc.Label).string = this.DateInfo[currentIndex];    
                    }
                }
                currentIndex++;
                //添加地图块对象
                this.MapObjList[x * this.VerticalMapNumber + y] = mapBlock;
                if(mapBlock.name=='6_0'){
                    console.log(mapBlock.position);
                    console.log(mapBlock.children[0].children[0].getComponent(cc.Label).string);
                    console.log(mapBlock);
                }
                mapBlock.addComponent(MapControl);
            }
        }
      
    }
    update (dt) {
        // // this.checkWin();
        // console.log(this.checkWeek());
        
    }

    //检测是否通关
    checkWin(){
        let winDate  =  
        this.checkMonth()+
        this.checkDayOne()+
        this.checkDayTwo()+
        this.checkDayThree()+
        this.checkWeek();
        if(winDate == this.NowDate)
        {
             //重新加载游戏时，将上一个场景的定时器清除
            clearInterval(this.time.getComponent(Timer).timerInterval)
            this.winMask.active = true;
            console.log('you win!');
        }
        console.log(winDate);


    }
    checkWeek()
    {
        let col = 4;
        let row = 2;
        for (let i = 0; i != row; i++)
        {
            for (let j = 0; j != col; j++)
            {
                // console.log(i * this.VerticalMapNumber + j);
                if (i == 0 && j == 0)
                {
                    this.checkText[i * this.VerticalMapNumber + j] = "";
                }
                else
                {
                if (this.MapObjList[i] != null &&  this.MapObjList[i *  this.VerticalMapNumber + j].getComponent(MapControl).isUsed == false)
                    {
                        let winWeek  = this.MapObjList[i * this.VerticalMapNumber + j].children[0].children[0].getComponent(cc.Label).string;
                        return winWeek;
                    }
                }
            }
        }
        return "";
    }

    checkMonth()
    {
        let col = 8;
        let row = 3;
        
        for (let i = 0; i < row; i++)
        {
            for (let j = 4; j < col; j++)
            {
                if (this.MapObjList[i] != null &&  this.MapObjList[i *  this.VerticalMapNumber + j].getComponent(MapControl).isUsed == false)
                {
                    let winMonth  = this.MapObjList[i * this.VerticalMapNumber + j].children[0].children[0].getComponent(cc.Label).string;
                    return winMonth;
                }
            }
        }
        return"" ;
    }

    checkDayOne()
    {
        let col = 4;
        let row = 3;
        for (let i = 2; i < row; i++)
        {
            for (let j = 0; j < col; j++)
            {
                if (this.MapObjList[i] != null &&  this.MapObjList[i *  this.VerticalMapNumber + j].getComponent(MapControl).isUsed == false)
                {
                    let winDay  = this.MapObjList[i * this.VerticalMapNumber + j].children[0].children[0].getComponent(cc.Label).string;
                    return winDay;
                }
                   
            }
        }
        return "";
    }

    checkDayTwo()
    {
        let row = 6;
        let col = 8;
        for (let i = 3; i < row; i++)
        {
            for (let j = 0; j < col; j++)
            {
                if (this.MapObjList[i] != null &&  this.MapObjList[i *  this.VerticalMapNumber + j].getComponent(MapControl).isUsed == false)
                {
                    let winDay  = this.MapObjList[i * this.VerticalMapNumber + j].children[0].children[0].getComponent(cc.Label).string;
                    return winDay;
                }
                  
            }
        }
        return"";
    }

    checkDayThree()
    {
        let row = 7;
        let col = 3;
        for (let i = 6; i < row; i++)
        {
            for (let j = 0; j < col; j++)
            {
                if (this.MapObjList[i] != null &&  this.MapObjList[i *  this.VerticalMapNumber + j].getComponent(MapControl).isUsed == false)
                {

                    let winDay  = this.MapObjList[i * this.VerticalMapNumber + j].children[0].children[0].getComponent(cc.Label).string;
                    return winDay;
                }
            }
        }
        return "";
    }






    
}
