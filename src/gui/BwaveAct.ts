module gui {
	export class WaveAction {
		public static RIGHT: number = 0;
		public static LEFT: number = 1;
		public static UP: number = 2;
		public static DOWN: number = 4;
		public type: number;
		public pth: string;
		private _view: fairygui.GComponent;
		private _c1: fairygui.Controller;
		private _tfSec: fairygui.GTextField;
		private _sound: egret.Sound;
		public constructor() {
		}


		public static make(type: number, ax: number, ay: number): WaveAction {
			let inst: WaveAction = new WaveAction();
			inst.type = type;
			inst.create(ax, ay);
			return inst;
		}

		public create(ax: number, ay: number) {
			this._view = fairygui.UIPackage.createObject("tdui1", "出怪提示").asCom;
			this._view.addEventListener(egret.TouchEvent.TOUCH_END, this.onStart, this);
			this._c1 = this._view.getController("c1");
			this._c1.selectedIndex = this.type;
			fairygui.GRoot.inst.addChild(this._view);
			this._tfSec = this._view.getChild("title").asTextField;
			this._view.x = ax;
			this._view.y = ay;

			let sound: egret.Sound = new egret.Sound();
			sound.addEventListener(egret.Event.COMPLETE, function (e: egret.Event) {
				egret.log("ok");
			}, this);
			sound.load("resource/snd/fight.mp3");
			this._sound = sound;
		}

		public close(): void {
			fairygui.GRoot.inst.removeChild(this._view);
		}

		public setSec(v: number): void {
			if (G.sWorld.started)
				this._tfSec.text = String(v);
			else
				this._tfSec.text = "开始";
		}
		private onStart(): void {
			this._sound.play(0, 1);
			if (G.sWorld.started) {
				let sec: number = Number(this._tfSec.text);
				G.gold += sec;
				observer.UIManager.send("upd_gold");
			}
			else
				G.sWorld.started = true;
			G.sWorld.pauseInterval = G.DELAY;
			this.close();
		}
	}
}