class CityScene extends BaseScene {
	private _view: fairygui.GComponent;
	private _c1: fairygui.Controller;
	private _btnFight: fairygui.GButton;
	private _btn3: fairygui.GButton;
	private _btn4: fairygui.GButton;
	private _tfscore: fairygui.GTextField;
	public constructor() {
		super();

	}

	public initialize() {
		if (!this._initialized) {
			this._view = fairygui.UIPackage.createObject("ui1", "006 主城").asCom;
			fairygui.GRoot.inst.addChild(this._view);
			// this._view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
			// this._view.setSize(G.width * G.scale, G.height * G.scale);
			this._view.setSize(G.width, G.height);
			this._btnFight = this._view.getChild("btnFight").asButton;
			this._btnFight.addEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
			// this._btn3 = this._view.getChild("n49").asButton;
			// this._btn3.addEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
			// this._btn4 = this._view.getChild("n45").asButton;
			// this._btn4.addEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
			// this._btn5 = this._view.getChild("n62").asButton;
			// this._btn5.addEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);

			// this._tfscore = this._view.getChild("n52").asTextField;
			super.initialize();
		}
	}


	private onClick(e: egret.TouchEvent) {
		let ui;
		switch (e.currentTarget) {
			case this._btnFight:
				G.director.runWithCache("level",LevelScene)
				break;
			case this._btn3:
				ui = new gui.ShopUI;
				break;
			case this._btn4:
				ui = new gui.TalentUI;
				break;
		}
	}

	public show(callback: Function = null, args: any[] = null) {
		super.show(callback, args);
		if (G.bgSoundChancel)
			G.bgSoundChancel.stop();
		if (G.bgMuz)
			G.bgSoundChancel = G.bgMuz.play(0, 1);		
	}

	public hide(callback: Function = null) {
		super.hide(callback);
		fairygui.GRoot.inst.removeChild(this._view);
		this._btnFight.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
		// this._btn3.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
		// this._btn4.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
		// this._btn5.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
		// this._view = null;
	}
}