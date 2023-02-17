import BlockControl from './BlockControl'
const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockManger extends cc.Component {

    onLoad () {
        
    }

    start () {
        for(let block of this.node.children){
            block.addComponent(BlockControl);
            console.log(block);
        }
    }
}