module core {
	export class Player extends DyEngine.BasicObject {
		public jumped: boolean;
		public isfly:boolean;
		public maxAltitude: number = 0;
		public dieEvent: DyEngine.DyEvent;
		public wingClip: DyEngine.DyAnimator;
		public constructor() {
			super();
			this.animator = new DyEngine.DyAnimator();
			this.dieEvent = new DyEngine.DyEvent();			
		}
		public setFly(): void {
			if (this.wingClip == null) {
				this.wingClip = new DyEngine.DyAnimator();
				let mcTexture = RES.getRes("avatar_png");
				let mcData = RES.getRes("avatar_json");
				var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
				this.wingClip.addAnimation("def", new egret.MovieClip(mcDataFactory.generateMovieClipData("bigwing")));
				this.wingClip.switchAnimation("def",true);
				this.wingClip.x = 0;
				this.wingClip.y = 0;				
			}
			this.animator.addChildAt(this.wingClip,0)
			this.wingClip.gotoAndStop(1);
			this.isfly = true;
			this.animator.switchAnimation("jump",true);
		}

		public stopFly():void
		{
			this.animator.removeChild(this.wingClip);
			// this.wingClip.gotoAndStop(1);
			this.isfly = false;
		}

		public jump(force: number): void {
			this.animator.switchAnimation("jump", false);
			this.animator.gotoAndPlay(1, 1);
			this.velocity.y = force;
		}

		public update(): void {
			super.update();
			if (this.onFloor) {
				if (this.animator.currentAnimationKey != "idle") {
					this.animator.switchAnimation("idle", false);
					this.animator.gotoAndPlay(1, -1);
					this.jumped = false;

				}
			}
			else if (this.velocity.y > 0) {
				if (this.animator.currentAnimationKey != "fall") {
					this.animator.switchAnimation("fall", false);
					this.animator.gotoAndPlay(1, 1);
				}
			}
			if (this.x < 0) {
				this.x = 0;
			}
			else if (this.x > G.width) {
				this.x = G.width;
			}
			// G.h = this.y - 1050;
			if (this.maxAltitude < -this.y) {
				this.maxAltitude = -this.y;
			}
			if (this.isfly)
			{
				this.velocity.y = -1200;
			}
		}
	}
}