class LevelLoadingScene extends BaseScene {
    private _view: fairygui.GComponent;
    private _bar: gui.DyProgressBar;
    private _mapConfig: any;
    public constructor() {
        super();

    }

    public initialize() {
        if (!this._initialized) {
            this._view = fairygui.UIPackage.createObject("pre", "000 主加载画面").asCom;
            fairygui.GRoot.inst.addChild(this._view);
            this._view.setSize(G.width * G.scale, G.height * G.scale);
            // this._view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
            this._bar = this._view.getChild("n5") as gui.DyProgressBar;
            super.initialize();
        }
    }

    public show(callback: Function = null, args: any[] = null) {
        egret.log("args", args);
        let obj = args[0];
        this._mapConfig = obj;
        this.loadResource(obj.res);
        super.show(callback, args);
    }

    private async loadResource(args: string[]) {
        try {
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.createGroup("temp", ["pkg1", "c1_json", "c1_png", "tower_json", "tower_png"], true);
            await RES.loadGroup("temp");
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            // D.init();
            // G.initTowerFactory();
            let game: core.GameWorld = new core.GameWorld();
            game.config = this._mapConfig;
            game.create();
            let engine: DyEngine.Engine = DyEngine.Engine.getInstance();
            engine.state = game;
            engine.addChild(game);
            // G.scale = 0.5
            // engine.scaleX = G.scale;
            // engine.scaleY = G.scale;
            //egret.log("aa:", engine.scaleX)

            if (this._mapConfig.id == "m001") {
                fairygui.UIPackage.addPackage("intro");
                let comp = fairygui.UIPackage.createObject("intro", "005 开场漫画").asCom;
                fairygui.GRoot.inst.addChild(comp);
                comp.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
                comp.getChild("n1").asLoader.url = "c001_png";
                let i: number = 1;
                let func = (e: egret.TouchEvent) => {
                    let ctrl = comp.getController("c1");
                    if (i == 1)
                        comp.getChild("n2").asLoader.url = "c002_png";
                    if (i == 2)
                        comp.getChild("n3").asLoader.url = "c003_png";

                    if (i == 3) {
                        comp.getChild("n2").asLoader.url = "";
                        comp.getChild("n3").asLoader.url = "";
                        comp.getChild("n1").asLoader.url = "c004_png";
                        ctrl.selectedIndex = 1;
                    }
                    if (i == 4)
                        comp.getChild("n2").asLoader.url = "c005_png";
                    if (i == 5)
                        comp.getChild("n3").asLoader.url = "c006_png";
                    if (i == 6) {
                        comp.getChild("n4").asLoader.url = "c007_png";
                        ctrl.selectedIndex = 2;
                    }
                    i++;
                    if (i > 7 && ctrl.selectedIndex == 2) {
                        fairygui.GRoot.inst.removeChild(comp);
                        comp.removeEventListener(egret.TouchEvent.TOUCH_END, func, this);
                        G.director.runWithScene(new GameScene);
                    }

                    // else
                    //     ctrl.selectedIndex++;
                };
                comp.addEventListener(egret.TouchEvent.TOUCH_END, func, this);
            }
            else
                G.director.runWithScene(new GameScene);
        }
        catch (e) {
            console.error(e);
        }
    }

    private onResourceProgress(event: RES.ResourceEvent): void {
        this._bar.value = event.itemsLoaded;
        this._bar.max = event.itemsTotal;
    }

    public hide(callback: Function = null) {
        super.hide(callback);
        fairygui.GRoot.inst.removeChild(this._view);
        // this._view = null;
    }
}