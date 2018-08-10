module go {
	export class eBase extends DyEngine.DyObject {
		public busying: boolean;
		private _bar: utils.BuildBar;
		private _elpased: number = 0;
		public constructor() {
			super();
		}

		public create(): void {
			this.animator.addAnimation("def", G.getCommonMovieClip("eBase"));
			this.animator.switchAnimation("def", true);
			// this.animator.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
			this.animator.touchEnabled = true;
			this._elpased = 0;
		}

		public static make(ax: number, ay: number): eBase {
			let base: eBase = new eBase();
			base.create();
			base.x = ax;// *G.ScaleW;
			base.y = ay;// *G.ScaleH;
			return base;
		}
		public startBuild() {
			if (this._bar == null) {
				let bar = utils.BuildBar.make(this, 0, 0);
				this._bar = bar;
				this.busying = true;
			}
		}

		// private onTouchEnd(e: egret.TouchEvent): void {
			
		// }

		public update()
		{
			if (this.busying) {
				this._elpased += G.elapsed * 2;
				let b = this._bar;
				if (b) {
					b.update(this._elpased, 1);
				}
				if (this._elpased >1)
				{
					this.busying = false;
					this._elpased = 0;
					this._bar.kill();
					this._bar = null;
					this.events.send("build",this);					
				}
			}
			super.update();
		}

	}
}