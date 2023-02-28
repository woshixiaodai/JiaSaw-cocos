import BlockControl from './BlockControl'
import BlockContainer from './BlockContainer'
const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockManager extends cc.Component {


    
    onLoad () {
        
    }
    start () {
        for(let blockManger of this.node.children){
            //存储初始点位 
            blockManger.addComponent(BlockContainer);
            //保存到每个拼图的原始点位
            blockManger.getComponent(BlockContainer).startPos.push([blockManger.position.x,blockManger.position.y,true]);
            for(let blockContainer of blockManger.children){
                for(let block of blockContainer.children){
                    block.addComponent(BlockControl);
                }
            }
        }
    }
}