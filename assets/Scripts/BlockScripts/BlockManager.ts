import BlockControl from './BlockControl'
const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockManger extends cc.Component {


    @property(cc.Prefab)
    menu:cc.Prefab=null;


    onLoad () {
        
    }

    start () {
        
        for(let blockManger of this.node.children){
            let count =0;
            for(let block of blockManger.children){
                block.addComponent(BlockControl);
                if(!block.parent.getChildByName('Menu')){
                    let Menu = cc.instantiate(this.menu);
                    block.parent.addChild(Menu);
                }
                count++;
            }
        }
    }
}