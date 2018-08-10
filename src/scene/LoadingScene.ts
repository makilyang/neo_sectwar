class LoadingScene extends BaseScene {
	private _view: fairygui.GComponent;
	private _bar: gui.DyProgressBar;
	public constructor() {
		super();

	}

	public initialize() {
		if (!this._initialized) {
			this._view = fairygui.UIPackage.createObject("pre", "000 主加载画面").asCom;
			fairygui.GRoot.inst.addChild(this._view);
			this._view.setSize(G.width, G.height);
			this._bar = this._view.getChild("n5") as gui.DyProgressBar;
			super.initialize();
		}
	}

	public show(callback: Function = null, args: any[] = null) {
		egret.log("args", args);
		this.loadResource(args);
		super.show(callback, args);

	}

	private async loadResource(args: any[]) {
		try {
			await RES.loadGroup("ui1", 0, this._bar);
			fairygui.UIPackage.addPackage("ui1");
			// fairygui.UIObjectFactory.setPackageItemExtension(gui.LevelPort.url, gui.LevelPort);
			// fairygui.UIObjectFactory.setPackageItemExtension(gui.BuildMenu.url, gui.BuildMenu);
			// fairygui.UIObjectFactory.setPackageItemExtension(gui.shopCell.url, gui.shopCell);
			D.initmap();
			fairygui.UIObjectFactory.setPackageItemExtension(gui.LevelPort.url, gui.LevelPort);
			// D.initmap();
			console.log("loading args:", args);
			G.director.runWithCache("city", CityScene);
			// core.DataMgr.init();
		}
		catch (e) {
			console.error(e);
		}
	}

	public hide(callback: Function = null) {
		super.hide(callback);
		fairygui.GRoot.inst.removeChild(this._view);
		// this._view = null;
	}
}