// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Timer extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    // 一天24小时的秒数
    time:number = 0;
    //一秒
    speed:number = 1;

    timerInterval;
    start () {
         this.timerInterval = setInterval(() => {
            this.time += this.speed;
            this.setTime();
        }, 1000);
    }

    setTime(){
        const h = ((this.time / 3600) | 0) % 24;
        const m = ((this.time / 60) | 0) % 60;
        const s = (this.time | 0) % 60;
        const str = [h+"时", m+'分', s+'秒'].join(":");
        this.label.string = str;
    }
}
