import BlockControl from "../BlockScripts/BlockControl";


const {ccclass, property} = cc._decorator;

@ccclass
export default class MapControl extends cc.Component {

    CurrentDate:string =''; 

    isUsed:boolean = false;

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,(e)=>{
            console.log(this.isUsed);
        },this)
    }

    onCollisionEnter(other){
        // if(other.node.getComponent(cc.BoxCollider).tag ==2){
        //     other.node.getComponent(BlockControl).isUsed = true;
        // }
    }

    onCollisionStay(other){
        if(other.node.getComponent(cc.BoxCollider).tag==2)
        {
            this.isUsed =true;
        }
    }

    onCollisionExit(other){
        this.isUsed =false;
    }
    
    protected update(dt: number): void {
        // let count = 0;
        // for(let mapObj of this.node.parent.children)
        //     {
        //         for(let mapSquare of mapObj.children)
        //         {
        //             for(let label of mapSquare.children){
        //                 if(mapObj.getComponent(MapControl).isUsed){
        //                     count++;
        //                     continue;
        //                 }else{
        //                     let labelString =  label.getComponent(cc.Label).string;
        //                     this.CurrentDate +=labelString;
                            
        //                 }
        //             }
        //         }
        //     }
    }


    
}
