module go {
	export class eHome extends DyEngine.DyObject {
		// public health:number = 20;
		// public hpmax:number = 20;
		private _acc: number = 2;
		private _oriy: number;
		public constructor() {
			super();

		}

		public create(ax: number, ay: number): void {
			this.animator.addAnimation("def", G.getCommonMovieClip("eHome"));
			this.animator.switchAnimation("def", true);
			// this.animator.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);			
			// this.animator.touchEnabled = true;
			this.x = ax;
			this.y = ay;
			this._oriy = this.y;
			this.velocity.y = 12;
		}

		public static make(ax: number, ay: number): eHome {
			let base: eHome = new eHome();
			base.create(ax, ay);
			return base;
		}

		public update() {
			super.update();
			if (this.y > this._oriy + 10)
				this.velocity.y = -8;
			else if (this.y < this._oriy - 10) {
				this.velocity.y = 8;
			}
		}

	}
}