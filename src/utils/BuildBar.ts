module utils {
	export class BuildBar {
		public static members: BuildBar[] = [];
		public exists: boolean;
		public view: fairygui.GProgressBar;
		public key: string;
		public parent: DyEngine.DyObject;
		public constructor() {

		}

		public create(parent: DyEngine.DyObject) {
			let mc;
			if (this.view == null) {
				this.view = fairygui.UIPackage.createObject("tdui1", "建造进度").asProgress;

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
			this.view.x = this.parent.x;
			this.view.y = this.parent.y;
		}


		public kill() {
			// this.parent.removeChild(this.clip);
			fairygui.GRoot.inst.removeChild(this.view);
			this.exists = false;
		}

		public static make(parent: DyEngine.DyObject, ox: number, oy: number): BuildBar {
			let base: BuildBar = BuildBar.getAvail();
			if (base == null) {
				base = new BuildBar;
				BuildBar.members.push(base);
			}
			base.create(parent);
			// base.clip.x = ox;
			// base.clip.y = oy;
			return base;
		}

		public static getAvail(): BuildBar {
			var o: BuildBar;
			var n: number = BuildBar.members.length;
			var i: number = 0;
			while (i < n) {
				o = BuildBar.members[i];
				if (o != null && !o.exists) {
					return o;
				}
				i++;
			}
			return null;
		}

		public update(val: number, max: number) {
			if (this.parent) {
				this.view.value = val;
				this.view.max = max;
			}
		}
	}
}