module core {
	import DyMath = DyEngine.DyMath;
	import BasicUnit = go.BasicUnit;
	import eHome = go.eHome;
	import eBase = go.eBase;
	import eTower = go.eTower
	export class GameWorld extends egret.DisplayObjectContainer {
		public static LAYER_OBJECTS: number = 1;
		public static LAYER_FRONTS: number = 2;
		private _bgContainer: egret.DisplayObjectContainer;
		private _bg: egret.Bitmap;
		private _objectsLayer: egret.DisplayObjectContainer;
		private _background: egret.DisplayObjectContainer;
		private _foreLayer: egret.DisplayObjectContainer;
		// public camera: core.Camera;
		private _gameObjects: DyEngine.DyObject[];
		private _foreObjects: DyEngine.DyObject[];
		private _elpased: number = 0;
		private _prevAltitude: number = 0;;
		private _dist: number = 3000;
		private _sndJump: egret.Sound;
		private _sndCoins: egret.Sound;
		private _sndPig: egret.Sound;
		private _jumptimes: number = 0;
		public config: any;
		public eventUpdate: DyEngine.DyEvent;
		public waveArray: any[] = [];
		public pauseInterval: number = 0;
		protected _waiting: boolean = true;
		private _actUI: gui.WaveAction[] = [];
		private _tm: DyEngine.DyTaskManager;
		private _taskzero: boolean = false;
		private _creeps: number = 0;
		public elpased: number = 0;
		public cd1: number = 0;
		public cd2: number = 0;
		// private _tmlist: DyEngine.DyTaskManager[];
		public home: eHome;
		public started: boolean = false;

		public constructor() {
			super();
			// this.camera = new core.Camera();
			this._gameObjects = [];
			this._foreObjects = [];
			this.eventUpdate = new DyEngine.DyEvent();
			// this._tmlist = [];
			this._tm = new DyEngine.DyTaskManager();
		}

		public create() {

			// this._bgLayer = new DyEngine.DyTileMap(this._bgContainer);
			// this._bgLayer.setSize(1, 6);
			// this._bgLayer.makeTils();

			// let door = new egret.Bitmap();
			// door.texture = RES.getRes("bottom_jpg");
			// door.y = G.height - door.height;
			// this.addChild(door);
			G.sWorld = this;

			this._bg = new egret.Bitmap();
			let bgtexture: egret.Texture = RES.getRes(this.config.bg);
			this._bg.texture = bgtexture;
			this._bg.y = 0;
			this._bg.width = G.width;
			this._bg.height = G.height;
			this.addChild(this._bg);

			this._bgContainer = new egret.DisplayObjectContainer();
			this.addChild(this._bgContainer);

			this._background = new egret.DisplayObjectContainer();
			this.addChild(this._background);
			this._objectsLayer = new egret.DisplayObjectContainer;
			this.addChild(this._objectsLayer);
			this._foreLayer = new egret.DisplayObjectContainer;
			this.addChild(this._foreLayer);

			let baseList: any[] = this.config.tdb;
			let i: number = 0;
			let cObj: any;
			for (i; i < baseList.length; i++) {
				cObj = baseList[i];
				let role: eBase = eBase.make(cObj.x, cObj.y);
				this.addToLayer(GameWorld.LAYER_OBJECTS, role);
			}

			this.home = eHome.make(this.config.home.x, this.config.home.y);
			// egret.log("lev", G.gLevel);
			if (G.gLevel == 2) {
				this.home.hpmax = 5;
			}
			else if (G.gLevel == 1) {
				this.home.hpmax = 10;
			}
			else
				this.home.hpmax = 20;
			this.home.health = this.home.hpmax;
			this.addToLayer(GameWorld.LAYER_FRONTS, this.home);

			let waveCfg: any[] = this.config.data;
			let wave: any;
			let j: number;
			let waveData: any;
			let waveList: any[];

			for (i = 0; i < waveCfg.length; i++) {
				wave = waveCfg[i];//{path:xx}
				this._tm.addTask(this.beforeWave, [wave.cfg, i], this);
				this._tm.addTask(this.waitNextWave, [], this);
				this._tm.addTask(this.afterWait, [i], this);
				this._tm.addTask(this.respawnEnemy, [wave.list], this);
				this._tm.waitChilds();//等待子任务全部完成
				this._tm.addPause(5);
			}

			this._tm.onComplete = () => {
				egret.log("task complete!", this);
				this._taskzero = true;
			};

			let engine: DyEngine.Engine = DyEngine.Engine.getInstance();
			engine.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
			engine.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
			// engine.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onCast, this);
			engine.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
		}

		private beforeWave(cfg: any[], wavec: number): boolean {
			let i;
			let p;
			for (i = 0; i < cfg.length; i++) {
				p = cfg[i];
				let g = gui.WaveAction.make(p.t, p.x, p.y);
				g.pth = i;
				g.setSec(G.DELAY);
				this._actUI.push(g);
			}
			return true;
		}
		private waitNextWave(): boolean {
			if (!this.started)
				return false;
			let pt = this.pauseInterval;
			pt = pt + 2 * G.elapsed;
			this.pauseInterval = pt;
			let i;
			let uiArr = this._actUI;
			let sec = Math.ceil(G.DELAY - pt);
			if (sec < 0)
				sec = 0;
			for (i = 0; i < uiArr.length; i++) {
				let g = uiArr[i];
				g.setSec(sec);
			}
			if (pt >= G.DELAY) {
				this.pauseInterval = 0;
				return true;
			}
			return false;
		}

		private afterWait(wc: number): boolean {
			let i;
			let uiArr = this._actUI;
			for (i = 0; i < uiArr.length; i++) {
				let g = uiArr[i];
				g.close();
			}
			observer.UIManager.send("upd_wave", wc + 1)
			return true;
		}

		private respawnEnemy(list: any[]): boolean {
			let j;
			let i;
			let k;
			let waveData: any[];
			let n = list.length;
			for (j = 0; j < n; j++) {
				waveData = list[j];
				let tm = new DyEngine.DyTaskManager();
				this._tm.addChild(tm);
				for (i = 0; i < waveData.length; i++) {
					let wave = waveData[i];
					let c: number = wave.count;
					if (wave.id == "pause") {
						tm.addPause(c);
					}
					else {
						let dh = DyMath.toNumber(wave.dh, 1);
						for (k = 0; k < c; k++) {
							tm.addTask(this.addEnemy, [wave.id, wave.hp, j, wave.gold, dh], this, false);
							tm.addPause(wave.period);
						}
					}
				}
			}
			return true;
		}

		private addEnemy(entry: string, hp: number, pidx: number, g: number = 0, dh: number = 1): boolean {
			// egret.log("addEnemy", entry, hp);			
			let path: any[] = this.config.path[pidx];
			let unit: BasicUnit = BasicUnit.make(entry, path[0].x, path[0].y, hp);
			if (G.gLevel == 2) {
				hp = hp * 2;
			}
			else if (G.gLevel == 1) {
				hp = Math.round(hp * 1.5);
			}
			unit.path = path;
			unit.gold = g;
			unit.dh = dh;
			this._creeps++;
			unit.dieEvent.on("ondie", (u, hiter) => {
				this._creeps--;
				let rew: number = G.gold + u.gold;
				if (hiter instanceof eTower) {
					rew += Number(hiter.extargold);
				}
				G.gold = rew;
				observer.UIManager.send("upd_gold");
			}, this);
			unit.dieEvent.on("onrun", (u) => {
				this._creeps--;
			}, this);
			this.addToLayer(GameWorld.LAYER_OBJECTS, unit);
			return true;
		}

		public hurt(dh: number) {
			this.home.health -= dh;
			if (this.home.health < 0)
				this.home.health = 0;
			observer.UIManager.send("hurt_home", this.home.health)
			if (this.home.health == 0) {
				DyEngine.Engine.getInstance().stop();
				gui.GameEnd.make(1);
			}

		}
		private onDie(): void {
			// G.director.runWithScene(new EndMenu());
		}
		private onTouch(e: egret.TouchEvent): void {

		}


		private onMove(e: egret.TouchEvent): void {

		}

		// private onCast(e: egret.TouchEvent): void {
		// 	if (this.cursk == 0)
		// 		return;
		// 	// if (!(e.target instanceof egret.Stage) && !(e.target instanceof DyEngine.DyAnimator))// || e.target instanceof fairygui.GProgressBar) {
		// 	// {
		// 	// 	return;
		// 	// }
		// 	// if (e.target instanceof DyEngine.DyAnimator) {
		// 	// 	return;
		// 	// }
		// 	// egret.log(e.target);
		// }

		private onLabel(prefix: string, ebody: string) {
			// egret.log("onLabel", prefix, ebody);
			ebody = ebody.substr(0, ebody.length - 1);
			if (prefix == "snd") {
				G.onceSnd(ebody)
			}
		}

		private hitRange(dmg: number, ox: number, oy: number, radis: number, buff: string) {
			let ary = G.phys.query(ox, oy, radis);
			let i: number;
			let obj: BasicUnit;
			for (i = 0; i < ary.length; i++) {
				if (ary[i] instanceof BasicUnit) {
					obj = ary[i];
					obj.hurt(dmg, 0, null);
					if (buff == "sk1") {
						let b = Buff.make(obj, "sk1");
						b.duration = 4;
						b.hurt = 2;
						b.period = 1;
						b.create();
						obj.buff = b;
					}
					else if (buff == "sk2") {
						let b = Buff.make(obj, "sk2");
						b.duration = 3;
						b.faint = 3;
						b.create();
						obj.buff = b;
					}
				}
			}
		}
		private _rMark1: gobjs.EffectShadow;
		private _rMark2: gobjs.EffectShadow;
		private onEnd(e: egret.TouchEvent): void {
			if (e.target instanceof fairygui.GProgressBar) {
				return;
			}
			let ex = e.stageX + e.stageX * (1 - G.scale)
			let ey = e.stageY + e.stageY * (1 - G.scale); //修正缩放带来的偏移
			if (this.cursk > 0) {
				if (this.cursk == 1) {
					if (this.cd1 > 0)
						return;
					// if (G.isMobile)
					// 	ey = ey + 20;
					let eff = utils.EffectFlash.make("common", "sk1", ex, ey);
					eff.type = 1;
					this.cd1 = 5;
					// observer.UIManager.send("");
					eff.events.on("onlab", this.onLabel, eff);
					eff.events.on("end", (mc) => {
						this.hitRange(10, ex, ey, 70, "sk1");
						eff.events.off();
						if (this._rMark1) {
							this._rMark1.kill();
							this._rMark1 = null;
						}
					}, eff);
					this._rMark1 = gobjs.EffectShadow.make(1, ex, ey, 70);
					this._bgContainer.addChild(this._rMark1);
				}
				if (this.cursk == 2) {
					if (this.cd2 > 0)
						return;
					// if (G.isMobile)
					// ey = ey + 30 * G.scale;

					let eff = utils.EffectFlash.make("common", "sk2", ex, ey);
					eff.type = 1;
					this.cd2 = 15;
					eff.events.on("onlab", this.onLabel, eff);
					eff.events.on("end", (mc) => {
						this.hitRange(0, ex, ey, 70, "sk2");
						if (this._rMark2) {
							this._rMark2.kill();
							this._rMark2 = null;
						}
					}, eff);
					this._rMark2 = gobjs.EffectShadow.make(1, ex, ey, 70);
					this._bgContainer.addChild(this._rMark2);
				}
				observer.UIManager.send("casted");
			}
			else {
				// egret.log("e.target:", e.target);
				if (e.target instanceof fairygui.GButton) {
					return;
				}
				if (e.target instanceof DyEngine.DyAnimator) {
					let o = <DyEngine.DyAnimator>e.target;
					if (o.uObj instanceof eBase) {
						let tar = <eBase>o.uObj;
						if (tar.busying) {
							return;
						}
						gui.BuildMenu.show(tar, tar.x, tar.y);
						return;
					}
					else if (o.uObj instanceof gobjs.eTower) {
						let tar = <gobjs.eTower>o.uObj;
						if (tar.busying) {
							return;
						}
						gui.BuildMenu.show(tar, tar.x, tar.y);
						return;
					}
				}
				else {
					gui.BuildMenu.hide();
				}
			}
		}

		public addToLayer(layer: number, obj: DyEngine.DyObject): void {

			switch (layer) {
				case GameWorld.LAYER_OBJECTS:
					this.addGameObject(this._gameObjects, obj)
					this._objectsLayer.addChild(obj.animator);
					break;
				case GameWorld.LAYER_FRONTS:
					this.addGameObject(this._foreObjects, obj)
					this._foreLayer.addChild(obj.animator);
					break;
			}
		}

		public removeFromLayer(layer: number, obj: DyEngine.DyObject): void {
			if (obj == null)
				return;
			let ary: any[];
			switch (layer) {
				case GameWorld.LAYER_OBJECTS:
					ary = this._gameObjects;
					break;
				case GameWorld.LAYER_FRONTS:
					ary = this._foreObjects;
					break;
			}
			this.removeGameObject(ary, obj)
			this._objectsLayer.removeChild(obj.animator);
		}


		public addGameObject(ary: any[], go: DyEngine.DyObject): void {
			if (ary.indexOf(go) != -1) {
				return;
			}
			let i: number;
			let obj: DyEngine.DyObject;
			for (i = 0; i < ary.length; i++) {
				obj = ary[i];
				if (obj == null) {
					ary[i] = go;
					return;
				}
			}
			ary.push(go);
		}


		public removeGameObject(ary: any[], go: DyEngine.DyObject): void {
			let i: number = ary.indexOf(go);
			if (i != -1) {
				ary[i] = null;
			}
		}
		private _last: number = 0;
		public update(): void {
			this.elpased += 2 * G.elapsed;
			this.cd1 -= 2 * G.elapsed;
			this.cd2 -= 2 * G.elapsed;
			if (this.elpased - this._last >= 1) {
				this._last = this.elpased;
				observer.UIManager.send("elpased", this._last);
			}

			// this.eventUpdate.send("update", this);
			let i: number;
			let obj: DyEngine.DyObject;
			let lstObj: DyEngine.DyObject;
			let layer = this._objectsLayer;
			let list = this._gameObjects;
			// let list = this._gameObjects.sort((a, b) => {
			// 	if (a == null)
			// 		return 0;
			// 	if (b == null || a.y > b.y)
			// 		return 1;
			// 	else
			// 		return 0;
			// })

			for (i = 0; i < list.length; i++) {
				obj = list[i];
				if (obj) {
					if (lstObj == null)
						lstObj = obj;
					// layer.addChild(obj.animator);
					// layer.setChildIndex(obj.animator,layer.numChildren -1)
					// egret.log("dkda:",lstObj,obj);
					let dep1 = layer.getChildIndex(obj.animator);
					let dep2 = layer.getChildIndex(lstObj.animator);
					if (dep1 != -1 && dep2 != -1 && ((obj.y > lstObj.y && dep1 < dep2) || (obj.y < lstObj.y && dep1 > dep2))) {
						layer.swapChildren(obj.animator, lstObj.animator);
						lstObj = obj;
					}
					obj.update();
				}
			}
			list = this._foreObjects;
			for (i = 0; i < list.length; i++) {
				obj = list[i];
				if (obj) {
					obj.update();
					if (obj.dead) {
						obj.kill();
						list[i] = null;
					}
				}
			}
			list = this._tickers;
			let slist = this._senders;
			let func;
			let sender;
			for (i = 0; i < list.length; i++) {
				func = list[i];
				sender = slist[i];
				if (func) {
					func.apply(sender);
				}
			}
			// for (i = 0; i < this._tmlist.length; i++) {
			// 	let tm = this._tmlist[i];
			// 	if (tm.isRunning)
			// 		tm.update();
			// }

			if (this._tm.isRunning)
				this._tm.update();
			G.phys.update();
			if (this._taskzero && this._creeps <= 0 && this.home.health > 0) {
				DyEngine.Engine.getInstance().stop();
				gui.GameEnd.make(0);
			}
		}
		private _tickers: any[] = [];
		private _senders: any[] = [];
		public addTicker(func: Function, src: any) {
			if (this._tickers.indexOf(func) == -1) {
				this._tickers.push(func);
				this._senders.push(src);
			}
		}
		public cursk: number = 0;
		public cast(s: number) {
			if (s == 1) {
				if (this.cd1 > 0)
					return;
				this.cd1 = 15;
			}
			else if (s == 2) {
				if (this.cd2 > 0)
					return;
				this.cd2 = 0;
			}
		}


		public clear(): void {
			G.gold = 0;
			let engine: DyEngine.Engine = DyEngine.Engine.getInstance();
			engine.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
			engine.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
			engine.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
			this.eventUpdate.clean();
			this._tm.clear();
			let i;
			let uiArr = this._actUI;
			for (i = 0; i < uiArr.length; i++) {
				let g = uiArr[i];
				g.close();
			}

			let list = this._gameObjects;
			let obj;
			for (i = 0; i < list.length; i++) {
				obj = list[i];
				if (obj) {
					obj.kill();
				}
			}
			this._gameObjects = [];
			this._foreObjects = [];
			if (this.parent)
				this.parent.removeChild(this);
			gobjs.BasicUnit.destory();
			gobjs.Bullet.destory();
		}
	}
}