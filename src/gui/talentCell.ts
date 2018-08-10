module gui {
    import DyMath = DyEngine.DyMath;
    export class talentCell extends fairygui.GComponent {
        public static url: string = "ui://y1w8mpywp8vx1u";
        private static URLS: any = { "0": "ui://y1w8mpywp8vx1p", "1": "ui://y1w8mpywp8vx1o", "2": "ui://y1w8mpywp8vx1q", "3": "ui://y1w8mpywp8vx1n" };

        private _img: fairygui.GLoader;
        private _cid: string;

        public constructor() {
            super();
        }

        protected constructFromXML(xml: any): void {
            super.constructFromXML(xml);
            this._img = this.getChild("icon").asLoader;
        }

        public setup_afterAdd(xml: any): void {
            super.setup_afterAdd(xml);
            let n = this._name.substr(-1, 1);
            this._cid = this._name.substr(0, 2);
            this._img.url = talentCell.URLS[n];
            let cfg = G.TALENT[this._name];
            this.getController("c1").selectedIndex = cfg.g - 1;
            this.getChild("title").asTextField.text = cfg.title;
            let talObj: any = G.sd.tal;
            if (talObj == null || talObj.length == 0)
                talObj = {};
            let v: number = DyMath.toNumber(talObj[this._cid]);
            if (DyMath.toNumber(n) < v) {
                this.getController("c2").selectedIndex = 1;
            }
            else {
                this.getController("c2").selectedIndex = 0;

                this.addEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
            }
        }

        private onClick(e: egret.TouchEvent) {
            let talObj: any = G.sd.tal;
            if (talObj == null || talObj.length == 0)
                talObj = {};
            let cfg = G.TALENT[this._name];
            let n = DyMath.toNumber(this._name.substr(-1, 1));
            let v: number = DyMath.toNumber(talObj[this._cid]);
            let ary: string[] = talObj;
            let reqc: number = cfg.req;
            if (reqc != v) {
                egret.log("请先购买前置等级!");
                BuyUI.make("要花费" + cfg.g + "星激活这个天赋。", "请先激活前置等级!");
                return;
            }
            if (G.sd.star < cfg.g) {
                BuyUI.make("要花费" + cfg.g + "星激活这个天赋。", "没有足够的星星!");
                return;
            }

            BuyUI.make("要花费" + cfg.g + "星激活这个天赋。", null, () => {
                G.sd.star -= cfg.g;
                egret.log("start:", G.sd.star);
                this.getController("c2").selectedIndex = 1;
                talObj[this._cid] = n + 1;
                	G.sd.score += 100;
                G.sd.tal = talObj;
                observer.UIManager.send("upd_talnet");
                this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
                egret.localStorage.setItem(G.SAVEKEY, JSON.stringify(G.sd));
            }, this);

        }

    }
}