module gui {
	export class GameEnd {
		public static inst: GameEnd;
		private _view: fairygui.GComponent;
		private _inited: boolean = false;
		private _btn1: fairygui.GButton;
		private _btn2: fairygui.GButton;
		private _tfddb: fairygui.GTextField;
		private _tfelpased: fairygui.GTextField;
		private _rew: number = 0;

		public constructor() {
		}

		public static make(r: number) {
			if (GameEnd.inst == null) {
				GameEnd.inst = new GameEnd;
			}
			GameEnd.inst.create(r);
		}

		public create(r: number): void {
			if (!this._inited) {
				this._view = fairygui.UIPackage.createObject("tdui1", "关卡结算").asCom;
				this._view.setSize(G.width, G.height);
				this._btn1 = this._view.getChild("btn1").asButton;
				this._btn2 = this._view.getChild("btn2").asButton;
				this._btn1.addEventListener(egret.TouchEvent.TOUCH_END, this.onBtn, this);
				this._btn2.addEventListener(egret.TouchEvent.TOUCH_END, this.onBtn, this);
				this._tfddb = this._view.getChild("n1").asCom.getChild("n6").asTextField;
				this._tfelpased = this._view.getChild("n1").asCom.getChild("n8").asTextField;
				this._inited = true;
			}
			this._view.getController("c1").selectedIndex = r;
			if (r == 0) {
				//成功通关
				let rew = G.sWorld.config.ddb;
				if (G.gLevel == 1) {
					rew = Math.round(rew * 1.5);
				}
				else if (G.gLevel == 2)
					rew = rew * 2;
				let mid: string = G.sWorld.config.id;
				this._rew = rew;
				this._tfddb.text = String(rew);
				G.sd.ddb += rew;
				let ary: number[] = G.sd.rec[mid];
				if (ary == null) {
					ary = [0, 0, 0, 0, 0, 0];
				}
				ary[G.gLevel] += 1;
				let home = G.sWorld.home;
				let sLev: number = G.gLevel + 3;
				if (Number(ary[sLev]) == 0 && home.health == home.hpmax) {
					G.sd.star++;
					G.sd.score += 100;
					ary[sLev] = 1;
				}
				G.sd.rec[mid] = ary;
				egret.localStorage.setItem(G.SAVEKEY, JSON.stringify(G.sd));
				G.onceSnd("vic");
				G.sd.score += G.gLevel;
				this._btn1.enabled = false;
				this._btn2.enabled = false;
				this._tfddb.addEventListener(egret.Event.ENTER_FRAME, this.onAnim, this);
			}
			else {
				G.onceSnd("fail");
			}		

			let elapsedSec: number = Math.round(G.sWorld.elpased);
			let sec: number = elapsedSec % 60;
			let emin: number = Math.floor(elapsedSec / 60);
			this._tfelpased.text = G.str_pad(String(emin), 2, "0") + ":" + G.str_pad(sec.toString(), 2, "0");
			fairygui.GRoot.inst.addChild(this._view);
		}
		private _v: number = 0;
		private onAnim(e: egret.Event) {
			this._v += Math.floor((Math.random() * 8) + 1);
			if (this._v > this._rew) {
				this._v = this._rew;
				this._tfddb.removeEventListener(egret.Event.ENTER_FRAME, this.onAnim, this);
				this._btn1.enabled = true;
				this._btn2.enabled = true;
			}
			this._tfddb.text = String(Math.round(this._v));
		}

		private onBtn(e: egret.TouchEvent) {
			switch (e.currentTarget) {
				case this._btn1:
					G.gold = G.sWorld.config.gold;
					G.director.runWithScene(new LevelLoadingScene(), [G.sWorld.config]);
					this.close();
					break;
				case this._btn2:
					G.director.runWithScene(new LevelScene);
					this.close();
					break;				
			}

		}


		public close(): void {
			fairygui.GRoot.inst.removeChild(this._view);
		}
	}
}