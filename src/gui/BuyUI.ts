module gui {
    export class BuyUI {
        public static inst: BuyUI;
        private _view: fairygui.GComponent;
        private _c1: fairygui.Controller;
        private _tfInfo: fairygui.GTextField;
        private _tferr: fairygui.GTextField;
        private _btn1: fairygui.GButton;
        private _btn2: fairygui.GButton;
        private _inited: boolean;
        public cb: Function;
        private _mapConfig: any;
        public sender:any;

        public constructor() {
        }


        public static make(msg: string, err: string, cb: Function = null,sender:any = null): BuyUI {

            if (BuyUI.inst == null) {
                BuyUI.inst = new BuyUI();
            }
            BuyUI.inst.create(msg, err);
            BuyUI.inst.cb = cb; 
            BuyUI.inst.sender = sender; 
            return BuyUI.inst;
        }

        public create(msg: string, err: string) {
            if (!this._inited) {
                this._view = fairygui.UIPackage.createObject("tdui1", "购买确认").asCom;
                this._view.getChild("n109").asButton.addEventListener(egret.TouchEvent.TOUCH_END, this.onClose, this);
                this._c1 = this._view.getController("c1");
                this._tfInfo = this._view.getChild("n112").asTextField;
                this._tferr = this._view.getChild("n114").asTextField;
                this._btn1 = this._view.getChild("b1").asButton;
                this._btn1.addEventListener(egret.TouchEvent.TOUCH_END, this.onBuy, this);
                this._btn2 = this._view.getChild("b2").asButton;
                this._btn2.addEventListener(egret.TouchEvent.TOUCH_END, this.onClose, this);
                this._view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
            }
            this._tfInfo.text = msg;
            if (err != null){
                this._c1.selectedIndex = 1;
                this._tferr.text = err;
            }
            else
                this._c1.selectedIndex = 0;
            fairygui.GRoot.inst.addChild(this._view);
        }

        private onBuy(e: egret.TouchEvent): void {
            fairygui.GRoot.inst.removeChild(this._view);
            if (this.cb != null)
                this.cb.apply(this.sender);
        }

        private onClose(e: egret.TouchEvent): void {
            fairygui.GRoot.inst.removeChild(this._view);
        }
    }
}