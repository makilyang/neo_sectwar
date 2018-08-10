module utils {
	export class EffectClip {
		public static members: EffectClip[] = [];
		public exists: boolean;
		public clip: egret.MovieClip;
		public key: string;
		public parent: egret.DisplayObjectContainer;
		public constructor() {

		}

		public create(parent: egret.DisplayObjectContainer, res: string, clip: string) {
			let mc;
			if (this.clip == null) {
				let mcTexture = RES.getRes(res + "_png");
				let mcData = RES.getRes(res + "_json");

				var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
				mc = new egret.MovieClip(mcDataFactory.generateMovieClipData(clip));
				mc.touchEnabled = false;
				this.key = res + "_" + clip;
				this.clip = mc;
			}
			else
				mc = this.clip;
			this.exists = true;
			mc.gotoAndPlay(1);
			mc.once(egret.Event.COMPLETE, (e: egret.Event) => {
				this.kill();
			}, this);			
			parent.addChild(mc);
			this.parent = parent;
		}

		public kill() {
			this.parent.removeChild(this.clip);
			this.clip.stop();
			this.exists = false;
		}

		public static make(parent: egret.DisplayObjectContainer, res: string, clip: string, ox: number, oy: number): EffectClip {
			let base: EffectClip = EffectClip.getAvail(res + "_" + clip);
			if (base == null) {
				base = new EffectClip;
				EffectClip.members.push(base);
			}
			base.create(parent, res, clip);
			base.clip.x = ox;
			base.clip.y = oy;
			return base;
		}

		public static getAvail(key: string): EffectClip {
			var o: EffectClip;
			var n: number = EffectClip.members.length;
			var i: number = 0;
			while (i < n) {
				o = EffectClip.members[i];
				if (o != null && !o.exists && o.key == key) {
					return o;
				}
				i++;
			}
			return null;
		}
	}
}