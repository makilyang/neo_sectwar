module utils {
	export class EffectBar {
		public static members: EffectBar[] = [];
		public exists: boolean;
		public view: fairygui.GProgressBar;
		public key: string;
		public parent: DyEngine.DyObject;
		public constructor() {

		}

		public create(parent: DyEngine.DyObject) {
			let mc;
			if (this.view == null) {
				this.view = fairygui.UIPackage.createObject("tdui1", "怪血").asProgress;

			}
			else
				mc = this.view;
			this.exists = true;
			fairygui.GRoot.inst.addChild(this.view);
			// mc.gotoAndPlay(1);
			// mc.once(egret.Event.COMPLETE, (e: egret.Event) => {
			// 	this.kill();
			// }, this);			
			// parent.addChild(mc);
			this.parent = parent;
			this.view.x = this.parent.x - 12;
			this.view.y = this.parent.y - 30;
		}


		public kill() {
			// this.parent.removeChild(this.clip);
			fairygui.GRoot.inst.removeChild(this.view);
			this.exists = false;
		}

		public static make(parent: DyEngine.DyObject, ox: number, oy: number): EffectBar {
			let base: EffectBar = EffectBar.getAvail();
			if (base == null) {
				base = new EffectBar;
				EffectBar.members.push(base);
			}
			base.create(parent);
			// base.clip.x = ox;
			// base.clip.y = oy;
			return base;
		}

		public static getAvail(): EffectBar {
			var o: EffectBar;
			var n: number = EffectBar.members.length;
			var i: number = 0;
			while (i < n) {
				o = EffectBar.members[i];
				if (o != null && !o.exists) {
					return o;
				}
				i++;
			}
			return null;
		}

		public update() {
			if (this.parent) {
				this.view.x = this.parent.x - 12;
				this.view.y = this.parent.y - 30;
				this.view.value = this.parent.health;
				this.view.max = this.parent.hpmax;
			}
		}
	}
}