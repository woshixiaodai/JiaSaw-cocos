

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

  
    
    @property(cc.Node)
    button: cc.Node = null; // 需要响应触摸事件的按钮节点

    start () {
        const maskNode = new cc.Node();
        const mask = maskNode.addComponent(cc.BlockInputEvents);
        maskNode.width = cc.winSize.width;
        maskNode.height = cc.winSize.height;
        maskNode.color = cc.Color.BLACK.setA(0);
        maskNode.setPosition(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
        this.node.parent.addChild(maskNode);
        // 添加触摸监听器
        maskNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        maskNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        maskNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    
    // 触摸开始
    private onTouchStart(event: cc.Event.EventTouch) {
        // 判断触摸点是否在按钮范围内
        const buttonBoundingBox = this.button.getBoundingBoxToWorld();
        const touchPoint = event.getLocation();
        if (buttonBoundingBox.contains(touchPoint)) {
            console.log('in button');
            // 让按钮响应触摸事件
            this.button.emit(cc.Node.EventType.TOUCH_START, event);
        }
    }
    
    // 触摸结束
    private onTouchEnd(event: cc.Event.EventTouch) {
        // 判断触摸点是否在按钮范围内
        const buttonBoundingBox = this.button.getBoundingBoxToWorld();
        const touchPoint = event.getLocation();
        if (buttonBoundingBox.contains(touchPoint)) {
            // 让按钮响应触摸事件
            this.button.emit(cc.Node.EventType.TOUCH_END, event);
        }
    }
    
    // 触摸取消
    private onTouchCancel(event: cc.Event.EventTouch) {
        // 判断触摸点是否在按钮范围内
        const buttonBoundingBox = this.button.getBoundingBoxToWorld();
        const touchPoint = event.getLocation();
        if (buttonBoundingBox.contains(touchPoint)) {
            // 让按钮响应触摸事件
            this.button.emit(cc.Node.EventType.TOUCH_CANCEL, event);
        }
    }
    restart(){
        //重新加载当前场景
        cc.director.loadScene(cc.director.getScene().name);
        this.node.active = false;
    }


    // update (dt) {}
}
