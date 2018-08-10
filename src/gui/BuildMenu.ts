module gui {
    import GameWorld = core.GameWorld;
    export class BuildMenu extends fairygui.GComponent {
        public static url: string = "ui://y1w8mpywhi9w1j";
        public static instance: BuildMenu;
        public go: DyEngine.DyObject;
        private _c1: fairygui.Controller;
        private _t1: fairygui.Transition;
        private _t2: fairygui.Transition;
        private _mapid: string;
        private _btnWar: fairygui.GButton;
        private _btnAss: fairygui.GButton;
        private _btnMag: fairygui.GButton;
        private _btnArc: fairygui.GButton;
        private _btnUpd: fairygui.GButton;
        private _btnSell: fairygui.GButton;
        public busy: boolean = false;
        public constructor() {
            super();
        }

        protected constructFromXML(xml: any): void {
            super.constructFromXML(xml);
            this._c1 = this.getController("c1");
            this._t1 = this.getTransition("t0");
            this._t2 = this.getTransition("t1");
            this._btnWar = this.getChild("n22").asButton;
            this._btnWar.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnter, this);
            this._btnArc = this.getChild("n25").asButton;
            this._btnArc.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnter, this);
            this._btnAss = this.getChild("n23").asButton;
            this._btnAss.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnter, this);
            this._btnMag = this.getChild("n24").asButton;
            this._btnMag.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnter, this);

            this._btnUpd = this.getChild("n26").asButton;
            this._btnUpd.addEventListener(egret.TouchEvent.TOUCH_END, this.onUpd, this);
            this._btnSell = this.getChild("n27").asButton;
            this._btnSell.addEventListener(egret.TouchEvent.TOUCH_END, this.onSell, this);
        }

        public create(): void {
            this.getController('c2').selectedIndex = 0;
            let towers = core.DataMgr.towers;
            if (this.go instanceof gobjs.eTower) {
                this._c1.selectedIndex = 1;
                let td = towers[this.go.entry];
                this._btnSell.title = td.sell;
                if (td.nextlev == "NA") {
                    this._btnUpd.enabled = false;
                }
                else if (td.nextlev.indexOf(",") >= 0) {
                    this._btnUpd.enabled = false;
                }
                else {
                    let ntd = towers[td.nextlev];
                    let price: number = ntd.price;
                    let tal: number = 1;
                    if (G.talent(this.go.cid) >= 4)
                        tal = 0.8;
                    this._btnUpd.title = ntd.price;
                    if (price > G.gold)
                        this._btnUpd.enabled = false;
                    else
                        this._btnUpd.enabled = true;
                    if (G.sd.shop.indexOf(td.nextlev) == -1) {
                        this._btnUpd.enabled = false;
                    }
                }
                // this.go.showRange();
                 utils.EffectRange.make(this.go.range, this.go.x, this.go.y);
            }
            else {
                this._c1.selectedIndex = 0;
                let td = towers["zs001"];
                let tal: number = 1;
                if (G.talent("zs") >= 4)
                    tal = 0.8;
                let price: number = Math.round(td.price * tal);
                this._btnWar.title = String(price);
                if (price > G.gold)
                    this._btnWar.enabled = false;
                else
                    this._btnWar.enabled = true;
                td = towers["yx001"];
                price = td.price;
                this._btnArc.title = td.price;
                if (price > G.gold)
                    this._btnArc.enabled = false;
                else
                    this._btnArc.enabled = true;

                td = towers["ck001"];
                price = td.price;
                this._btnAss.title = td.price;
                if (price > G.gold)
                    this._btnAss.enabled = false;
                else
                    this._btnAss.enabled = true;

                td = towers["fs001"];
                price = td.price;
                this._btnMag.title = td.price;
                if (price > G.gold)
                    this._btnMag.enabled = false;
                else
                    this._btnMag.enabled = true;
            }

            this._t1.play();

        }

        public static show(src: DyEngine.DyObject, ax: number, ay: number): void {
            if (!BuildMenu.instance) {
                BuildMenu.instance = <BuildMenu>fairygui.UIPackage.createObjectFromURL(BuildMenu.url, BuildMenu);
            }
            if (BuildMenu.instance.busy)
                return
            BuildMenu.instance.x = ax;
            BuildMenu.instance.y = ay;
            BuildMenu.instance.go = src;
            BuildMenu.instance.create();
            fairygui.GRoot.inst.addChild(BuildMenu.instance);
        }


        public static hide(): void {
            if (BuildMenu.instance) {
                let go = BuildMenu.instance.go;
                // if (go instanceof gobjs.eTower)
                // go.showRange(true);
                BuildMenu.instance.close();
            }
            utils.EffectRange.hide();
        }

        public close(): void {
            this.go = null;
            this._t2.play(() => {
                fairygui.GRoot.inst.removeChild(BuildMenu.instance);
            });
        }

        public setup_afterAdd(xml: any): void {
            super.setup_afterAdd(xml);
            this._mapid = this._name.substr(1);
        }

        private onUpd(e: egret.Event): void {
            let b = this.go;
            utils.EffectRange.hide();
            let towers = core.DataMgr.towers;
            let td = towers[b.entry];
            let ntd = towers[td.nextlev];
            let price: number = ntd.price;
            if (G.gold < price) {
                return;
            }
            this.busy = true;
            if (b instanceof gobjs.eTower) {
                b.events.on("build", (b: any) => {
                    let war: gobjs.eTower = gobjs.eTower.make(ntd.ID, b.x, b.y);
                    G.sWorld.addToLayer(GameWorld.LAYER_OBJECTS, war);
                    G.sWorld.removeFromLayer(GameWorld.LAYER_OBJECTS, b);
                    G.uimgr.sendNotification("upd");
                    G.gold -= price;
                    observer.UIManager.send("upd_gold");
                    let sound: egret.Sound = new egret.Sound();
                    sound.once(egret.Event.COMPLETE, function (e: egret.Event) {
                        sound.play(0, 1);
                    }, this);
                    sound.load("resource/snd/build1.mp3");
                    this.busy = false;
                }, this);
                b.startBuild();
            }
            this.go = null;
            this._t2.play(() => {
                fairygui.GRoot.inst.removeChild(BuildMenu.instance);
            });
        }

        private onSell(e: egret.Event): void {
            if (this.go) {
                G.sWorld.removeFromLayer(GameWorld.LAYER_OBJECTS, this.go);
                G.uimgr.sendNotification("upd");
                let td: any = core.DataMgr.towers[this.go.entry];
                G.gold += DyEngine.DyMath.toNumber(td.sell);
                observer.UIManager.send("upd_gold");
                let role: gobjs.eBase = gobjs.eBase.make(this.go.x, this.go.y);
                G.sWorld.addToLayer(GameWorld.LAYER_OBJECTS, role);
            }
            BuildMenu.hide();
        }

        private onEnter(e: egret.Event): void {
            //   this._t2.play(() => {
            // fairygui.GRoot.inst.removeChild(BuildMenu.instance);
            // });
            let td: any;
            let towers = core.DataMgr.towers;
            let tal: number = 1;
            switch (e.currentTarget) {
                case this._btnWar:
                    td = towers["zs001"];
                    if (G.talent("zs") >= 4)
                        tal = 0.8;
                    utils.EffectRange.make(td.range, this.go.x, this.go.y);
                    // egret.log("warselel:",this.getController("c2").selectedIndex);
                    if (this._btnWar.selected) {
                        this.build(td, tal);
                    }
                    break;
                case this._btnArc:
                    td = towers["yx001"];
                    if (G.talent("yx") >= 4)
                        tal = 0.8;
                    utils.EffectRange.make(td.range, this.go.x, this.go.y);
                    if (this._btnArc.selected) {
                        this.build(td, tal);
                    }
                    break;
                case this._btnAss:
                    td = towers["ck001"];
                    if (G.talent("ck") >= 4)
                        tal = 0.8;
                    utils.EffectRange.make(td.range, this.go.x, this.go.y);
                    if (this._btnAss.selected) {
                        this.build(td, tal);
                    }
                    break;
                case this._btnMag:
                    td = towers["fs001"];
                    if (G.talent("fs") >= 4)
                        tal = 0.8;
                    utils.EffectRange.make(td.range, this.go.x, this.go.y);
                    if (this._btnMag.selected) {
                        this.build(td, tal);
                    }
                    break;
            }

        }

        private build(td: any, tal: number) {
            // G.sWorld.addTicker()
            let b = this.go;
            utils.EffectRange.hide();
            let price: number = Math.round(td.price * tal);
            G.gold -= td.price;
            this.busy = true;
            observer.UIManager.send("upd_gold");
            if (b instanceof gobjs.eBase) {
                b.events.on("build", (b) => {
                    let war: gobjs.eTower = gobjs.eTower.make(td.ID, b.x, b.y);
                    G.sWorld.addToLayer(GameWorld.LAYER_OBJECTS, war);
                    G.sWorld.removeFromLayer(GameWorld.LAYER_OBJECTS, b);
                    G.uimgr.sendNotification("upd");
                    this.busy = false;
                }, this);
                b.startBuild();
            }
            this.go = null;
            this._t2.play(() => {
                fairygui.GRoot.inst.removeChild(BuildMenu.instance);
            });
        }
    }
}