module gui {
    export class WaittingUI {
        public static inst: WaittingUI;
        private _view: fairygui.GComponent;
        private _inited: boolean;

        public constructor() {
        }


        public static make(msg: string = "等待中..", sec: number = 3000): WaittingUI {

            if (WaittingUI.inst == null) {
                WaittingUI.inst = new WaittingUI();
            }
            WaittingUI.inst.create(msg, sec);
            return WaittingUI.inst;
        }

        public static hide() {
            if (WaittingUI.inst) {
                WaittingUI.inst.onClose();
            }
        }

        public create(msg: string = "等待中..", sec: number) {
            if (!this._inited) {
                this._view = fairygui.UIPackage.createObject("ui1", "等待面板").asCom;
                this._view.setSize(G.width, G.height);
            }
            this._view.getChild("n110").asTextField.text = msg;
            fairygui.GRoot.inst.addChild(this._view);
            egret.setTimeout(this.onClose, this, sec)
        }

        public onClose(): void {
            if (this._view.parent)
                this._view.parent.removeChild(this._view);
        }
    }
}