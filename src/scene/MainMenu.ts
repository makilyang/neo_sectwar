class MainMenu extends BaseScene {
	private _view: fairygui.GComponent;
	public constructor() {
		super();

	}

	public initialize() {
		if (!this._initialized) {
			this._view = fairygui.UIPackage.createObject("pre", "001 封面").asCom;
			fairygui.GRoot.inst.addChild(this._view);
			// this._view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
			// this._view.setSize(G.width * G.scale, G.height * G.scale);
			this._view.setSize(G.width, G.height);
			super.initialize();
			var btn: fairygui.GButton = this._view.getChild("n2").asButton;
			btn.addClickListener(this.onStart, this);
			var btn1: fairygui.GButton = this._view.getChild("n3").asButton;
			btn1.addClickListener(this.onTuorial, this);

			// var btn3: fairygui.GButton = this._view.getChild("n46").asButton;
			// btn3.addClickListener(this.onRank, this);		
		}
	}

	private onTuorial(e: egret.Event): void {
		let comp = fairygui.UIPackage.createObject("pre", "002 服务器选择").asCom;
		fairygui.GRoot.inst.addChild(comp);
		comp.setSize(G.width, G.height);
		let func = (e: egret.TouchEvent) => {
			fairygui.GRoot.inst.removeChild(comp);
			comp.getChild("n3").asButton.removeEventListener(egret.TouchEvent.TOUCH_END, func, this);
		};
		comp.getChild("n3").asButton.addEventListener(egret.TouchEvent.TOUCH_END, func, this);
		G.onceSnd("openui");
	}

	private onStart(e: egret.Event): void {	
		if (!G.userInfo) {
			window["BlackCat"].Main.viewMgr.mainView.show();
			window["BlackCat"].loginCb = (res) => { 
				console.log("logincb",res);
				G.userInfo = res;
			};
			return;
		}
		if (G.bgMuz && G.bgSoundChancel == null)
			G.bgSoundChancel = G.bgMuz.play(0, 1);
		G.onceSnd("close");
		G.director.runWithScene(new LoadingScene, ["main"]);

	}
	public show(callback: Function = null, args: any[] = null) {
		super.show(callback, args);
		if (G.bgSoundChancel) {
			G.bgSoundChancel.stop();
			G.bgMuz = null;
			G.bgSoundChancel = null;
		}
		var sound: egret.Sound = new egret.Sound();
		sound.addEventListener(egret.Event.COMPLETE, function (e: egret.Event) {
			G.bgMuz = sound;
		}, this);
		// sound.load("resource/snd/muz.mp3");

		if (!G.resLoaded) {
			// this.loadResource();
		}
		else {
			this._view.getChild("n3").visible = true;
		}

		// let loader:fairygui.GLoader = this._view.getChild("n41").asLoader;
		// loader.url = "resource/assets/avatar.png";
	}

	private async loadResource() {
		try {
			// const progressbar = new ProgressBarUI();
			// // await RES.loadConfig("resource/default.res.json", "resource/");
			// await RES.loadGroup("res", 0, progressbar);
			// progressbar.close();
			// G.resLoaded = true;
			// this._view.getChild("n3").visible = true;
			RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
			RES.createGroup("temp", ["level1_png"]);
			await RES.loadGroup("temp");
			let result = new egret.Bitmap();
			let texture: egret.Texture = RES.getRes("level1_png");
			result.texture = texture;
			fairygui.GRoot.inst.displayListContainer.addChild(result);
			//egret.log("ss:", RES.getGroupByName("temp").length, RES.getRes("level1_png"));
			await RES.destroyRes("temp");
			//egret.log("eng:", RES.getGroupByName("temp").length, RES.getRes("level1_png"));
			// let cre = RES.createGroup("temp", ["level1_png"], true);

		}
		catch (e) {
			console.error(e);
		}
	}

	private onResourceProgress(event: RES.ResourceEvent): void {
		egret.log(event.data, event.itemsLoaded, "/", event.itemsTotal);
	}


	public hide(callback: Function = null) {
		super.hide(callback);
		fairygui.GRoot.inst.removeChild(this._view);
		// this._view = null;
	}
}