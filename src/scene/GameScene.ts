class GameScene extends BaseScene implements INotifier {
	private _view: fairygui.GComponent;
	private _elpasedTxt: fairygui.GTextField;
	private _waveTxt: fairygui.GTextField;
	private _goldTxt: fairygui.GTextField;
	private _hpTxt: fairygui.GTextField;
	private _btn: fairygui.GButton;
	private _skbtn1: fairygui.GProgressBar;
	private _skbtn2: fairygui.GProgressBar;
	public constructor() {
		super();

	}

	public initialize() {
		if (!this._initialized) {
			this._view = fairygui.UIPackage.createObject("tdui1", "003 游戏界面").asCom;
			fairygui.GRoot.inst.addChild(this._view);
			// this._view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
			// this._view.setSize(G.width * G.scale, G.height * G.scale);
			this._view.setSize(G.width, G.height);
			this._elpasedTxt = this._view.getChild("n9").asTextField;
			this._waveTxt = this._view.getChild("n8").asTextField;
			this._goldTxt = this._view.getChild("n7").asTextField;
			this._hpTxt = this._view.getChild("n6").asTextField;
			this._btn = this._view.getChild("btnp").asButton;
			this._btn.addEventListener(egret.TouchEvent.TOUCH_END, this.onPause, this);

			this._skbtn1 = this._view.getChild("nsk1").asProgress;
			this._skbtn2 = this._view.getChild("nsk2").asProgress;
			this._skbtn2.value = 0;
			this._skbtn1.addEventListener(egret.TouchEvent.TOUCH_END, this.onSkill, this);
			this._skbtn2.addEventListener(egret.TouchEvent.TOUCH_END, this.onSkill, this);
			super.initialize();
			observer.UIManager.getInstance().registerUI(this);
		}
	}

	private _lastSK: fairygui.GProgressBar;
	private onSkill(e: egret.Event) {
		let s = <fairygui.GProgressBar>e.currentTarget;
		let c = s.getController("c1");
		if (this._lastSK) {
			this._lastSK.getController("c1").selectedIndex = 0;
			this._lastSK = null;
		}
		gui.BuildMenu.hide();
		switch (s) {
			case this._skbtn1:
				// G.sWorld.cast(1);
				if (G.sWorld.cursk == 1) {
					G.sWorld.cursk = 0;
					c.selectedIndex = 0;
				}
				else {
					G.sWorld.cursk = 1;
					this._lastSK = this._skbtn1;
					c.selectedIndex = 1;
				}
				break;
			case this._skbtn2:
				if (G.sWorld.cursk == 2) {
					G.sWorld.cursk = 0;
					c.selectedIndex = 0;
				}
				else {
					G.sWorld.cursk = 2;
					c.selectedIndex = 1;
					this._lastSK = this._skbtn2;
				}
				break;
		}
	}

	private onPause(e: egret.TouchEvent) {
		DyEngine.Engine.getInstance().stop();
		let comp = fairygui.UIPackage.createObject("tdui1", "设置界面").asCom;
		fairygui.GRoot.inst.addChild(comp);
		comp.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
		let func = (e: egret.TouchEvent) => {
			fairygui.GRoot.inst.removeChild(comp);
			comp.removeEventListener(egret.TouchEvent.TOUCH_END, func, this);
			DyEngine.Engine.getInstance().start();
		};
		comp.getChild("btn1").addEventListener(egret.TouchEvent.TOUCH_END, func, this);
		let func2 = (e: egret.TouchEvent) => {
			fairygui.GRoot.inst.removeChild(comp);
			comp.removeEventListener(egret.TouchEvent.TOUCH_END, func, this);
			G.director.runWithScene(new LevelScene);
		};
		comp.getChild("btn2").addEventListener(egret.TouchEvent.TOUCH_END, func2, this);
	}

	public show(callback: Function = null, args: any[] = null) {
		// egret.log("args", args);
		super.show(callback, args);
		let engine: DyEngine.Engine = DyEngine.Engine.getInstance();
		engine.start();
		this._goldTxt.text = String(G.gold);
		this._waveTxt.text = 1 + "/" + G.sWorld.config.data.length;
		if (G.bgSoundChancel)
			G.bgSoundChancel.stop();

		var sound: egret.Sound = new egret.Sound();
		sound.addEventListener(egret.Event.COMPLETE, function (e: egret.Event) {
			G.figMuz = sound;
			G.figSndChancel = sound.play();
		}, this);
		sound.load("resource/snd/muz1.mp3");
		G.sWorld.addTicker(this.update, this);
		this._hpTxt.text = String(G.sWorld.home.health);
	}

	public hide(cb: Function = null): void {
		super.hide(cb);
		if (G.figSndChancel) {
			G.figSndChancel.stop();
		}
		this._btn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onPause, this);
		fairygui.GRoot.inst.removeChild(this._view);
		G.sWorld.clear();
		this._view = null;
		observer.UIManager.getInstance().removeUI(this.getMediatorName());

	}

	public update() {
		let cd: number = G.sWorld.cd1;
		if (cd > 0) {
			let tm = this._skbtn1;//.getChild("tm").asProgress;
			// tm.text = cd1;
			tm.value = cd;
			tm.max = 5;
		}
		cd = G.sWorld.cd2;
		if (cd > 0) {
			let tm = this._skbtn2;//.getChild("tm").asProgress;
			// tm.text = cd1;
			tm.value = cd;
			tm.max = 15;
		}
	}

	public getMediatorName(): string {
		return "GameScene";
	};

	/**
	 * List <code>INotification</code> interests.
	 *
	 * @return an <code>Array</code> of the <code>INotification</code> names this <code>IMediator</code> has an interest in.
	 */
	public listNotificationInterests(): string[] {
		return ["hurt_home", "upd_gold", "upd_wave", "elpased", "casted"];
	}

	/**
	 * Handle an <code>INotification</code>.
	 *
	 * @param notification the <code>INotification</code> to be handled
	 */
	public handleNotification(notification: observer.Notification): void {

		switch (notification.name) {
			case "hurt_home":
				// egret.log("dfdadfUIPD");
				this._hpTxt.text = notification.body;
				break;
			case "upd_gold":
				// egret.log("dfdadfUIPD");
				this._goldTxt.text = String(G.gold);
				break;
			case "upd_wave":
				let world: core.GameWorld = G.sWorld;
				this._waveTxt.text = notification.body + "/" + world.config.data.length;
				break;
			case "elpased":
				let elapsedSec: number = Math.round(notification.body);
				let sec: number = elapsedSec % 60;
				let emin: number = Math.floor(elapsedSec / 60);
				// var min:number = emin % 60;
				// var hour:Number = Math.floor(elapsedMin / 60)
				// _tfElapsed.text = G.str_pad(String(hour), 2, "0") + ":" + StringUtils.str_pad(String(min), 2, "0") + ":" + StringUtils.str_pad(sec.toString(), 2, "0");
				this._elpasedTxt.text = G.str_pad(String(emin), 2, "0") + ":" + G.str_pad(sec.toString(), 2, "0");
				break;
			case "casted":
				G.sWorld.cursk = 0;
				this._skbtn1.getController("c1").selectedIndex = 0;;
				this._skbtn2.getController("c1").selectedIndex = 0;;
				break;
		}
	}

	/**
	 * Called by the View when the Mediator is registered
	 */
	public onRegister(): void {

	}

	/**
	 * Called by the View when the Mediator is removed
	 */
	public onRemove(): void {

	}
}