module gui {
    export class EnterUI {
        public static inst: EnterUI;
        private _view: fairygui.GComponent;
        private _c1: fairygui.Controller;
        private _c2: fairygui.Controller;
        private _tfInfo: fairygui.GTextField;
        private _tfTitle: fairygui.GTextField;
        private _tfwc: fairygui.GTextField;
        private _wxList: fairygui.GList;

        private _inited: boolean;
        public mapid: string;
        private _mapConfig: any;
        private _rec: number[];

        public constructor() {
        }


        public static make(ax: number, ay: number, mapid: string): EnterUI {

            if (EnterUI.inst == null) {
                EnterUI.inst = new EnterUI();
            }
            EnterUI.inst.mapid = mapid;
            EnterUI.inst.create(ax, ay);
            G.onceSnd("openui");
            return EnterUI.inst;
        }

        public create(ax: number, ay: number) {
            if (!this._inited) {
                this._view = fairygui.UIPackage.createObject("ui1", "005 难度选择").asCom;
                this._view.getChild("n36").asButton.addEventListener(egret.TouchEvent.TOUCH_END, this.onStart, this);
                this._view.getChild("n33").asButton.addEventListener(egret.TouchEvent.TOUCH_END, this.onClose, this);
                this._c1 = this._view.getController("c1");
                this._c1.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onChange, this)
                this._c2 = this._view.getController("c2");
                this._tfInfo = this._view.getChild("n31").asTextField;
                this._tfTitle = this._view.getChild("n11").asTextField;
                this._tfwc = this._view.getChild("n7").asTextField;
                // this._view.setSize(G.width , G.height);
                this._wxList = this._view.getChild("n37").asList;
            }
            fairygui.GRoot.inst.addChild(this._view);
            WaittingUI.make("加载地图配置...");
            RES.getResByUrl(this.mapid + "_map", (obj: any) => {
                WaittingUI.hide();
                this._c2.selectedIndex = 1;
                this._mapConfig = obj;
                this._wxList.removeChildren();
                let i: number = 0;
                let wxAry = obj.wx;
                for (i; i < wxAry.length; i++) {
                    let comp = this._wxList.addItemFromPool().asCom;
                    comp.getChild("icon").asLoader.url = this.WXURL[wxAry[i]];
                }

                this._tfTitle.text = obj.name;
                // this._tfInfo.text = obj.info;
                this._tfwc.text = "怪物波数 X "+obj.wave.length;
                // G.gold = obj.gold;
                this._c1.selectedIndex = 0;
                G.gLevel = 0;
                // this._rec = G.sd.rec[this._mapConfig.id]
                // if (this._rec == null) {
                //     this._rec = [];
                // }
            }, this, RES.ResourceItem.TYPE_JSON);
        }

        private WXURL: string[] = ["ui://lvir3vtde09m1y", "ui://lvir3vtde09m1z", "ui://lvir3vtde09m20", "ui://lvir3vtde09m1x", "ui://lvir3vtde09m21"];

        private onChange(e: egret.Event): void {

            let i = this._c1.selectedIndex;
            let btn = this._view.getChild("n45");
            if (i > 0) {
                let r = DyEngine.DyMath.toNumber(this._rec[i - 1]);
                if (r == 0) {
                    btn.visible = false;
                }
                else {
                    btn.visible = true;
                }
            }
            else
                btn.visible = true;
            G.gLevel = i;
        }


        private onClose(e: egret.TouchEvent): void {
            this._c2.selectedIndex = 0;
            fairygui.GRoot.inst.removeChild(this._view);
            G.onceSnd("close");
        }

        private onStart(): void {
            G.onceSnd("fight");
            G.director.runWithScene(new LevelLoadingScene(), [this._mapConfig]);
            fairygui.GRoot.inst.removeChild(this._view);
        }
    }
}