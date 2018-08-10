module DyEngine {
	import Point = egret.Point;
	import DyMath = DyEngine.DyMath;
	export class DyObject {
		public entry: string;
		public point: Point;
		public acceleration: Point; //加速度
		public scrollFactor: Point; //滚动速率
		public scale: Point; //滚动速率
		public angularAcceleration: number = 0; //角加速度
		public angle: number = 0;
		public angularVelocity: number = 0; //角速度
		public angularDrag: number = 0;
		public maxAngular: number = 10000;
		public moves: boolean = true;
		public dead: boolean = false;
		public active: boolean = true; //活跃状态，允许update
		public exists: boolean = true; //是否已经kill
		public isGroup: boolean = false; //对象是个组，包含多个子对象
		public velocity: Point;
		protected _scrpoint: Point; //屏幕座标
		public maxVelocity: Point;
		public drag: Point;
		public gravityEnable: Boolean = true;
		public width: number = 0;
		public height: number = 0;
		protected _tag: number = 0;
		public visible: boolean = true;
		public animator: DyAnimator;
		public parentGroup: DyGroup = null;
		public onFloor: boolean;
		public Collider: DyShape;
		public typeDef: number = 0;
		public health: number = 10;
		public hpmax: number = 10;
		public events: DyEvent;
		public lastHiter: DyObject;
		public faintTime: number = 0;
		public buff: core.Buff;

		public constructor() {
			this.point = Point.create(0, 0);
			this.acceleration = Point.create(0, 0);
			this.velocity = Point.create(0, 0);
			this.drag = Point.create(0, 0);
			this.scale = Point.create(1, 1);
			this.scrollFactor = Point.create(1, 1);
			this.maxVelocity = Point.create(10000, 10000);
			this.exists = true;
			this.animator = new DyAnimator();
			this.animator.uObj = this;
			this.gravityEnable = false;
			this.events = new DyEvent();
		}

		/**
 * 对象池中的标识
 */


		public get tag(): number {
			return this._tag;
		}

		public set tag(arg: number) {
			this._tag = arg;
		}

		public get x(): number {
			return this.point.x;
		}

		public set x(arg: number) {
			this.point.x = arg;
		}

		public get y(): number {
			return this.point.y;
		}

		public set y(arg: number) {
			this.point.y = arg;
		}

		public update() {
			this.updateMotion();
			this.faintTime = this.faintTime - 2 * G.elapsed;
			let b = this.buff;
			if (b) {
				b.update();
			}
		}

		protected updateMotion() {
			let vc: number;
			if (!this.moves || this.faintTime > 0) {
				return;
			}

			//角速度			
			vc = (DyMath.calcVelocity(this.angularVelocity, this.angularAcceleration, this.angularDrag, this.maxAngular) - this.angularVelocity) * 0.5;
			this.angularVelocity = this.angularVelocity + vc;
			this.angle = this.angle + this.angularVelocity * G.maxElapsed;
			this.angularVelocity = this.angularVelocity + vc;
			//X轴
			vc = DyMath.calcVelocity(this.velocity.x, this.acceleration.x, this.drag.x, this.maxVelocity.x); // - velocity.x) * 0.5;
			//			velocity.x = velocity.x + vc;
			var dx: number = vc * G.maxElapsed;
			//			velocity.x = velocity.x + vc;

			//y轴 重力
			var dy: number = 0;
			if (this.gravityEnable) {
				vc = (DyMath.calcVelocity(this.velocity.y, 2461, this.drag.y, this.maxVelocity.y) - this.velocity.y) * 0.5;
			}
			else
				vc = (DyMath.calcVelocity(this.velocity.y, 0, this.drag.y, this.maxVelocity.y) - this.velocity.y) * 0.5; //没有重力时,加速度为0
			this.velocity.y = this.velocity.y + vc;
			dy = this.velocity.y * G.maxElapsed;
			// this.velocity.y = this.velocity.y + vc;

			//z轴
			// vc = (DyMath.calcVelocity(this.velocity.y, this.acceleration.y, this.drag.y, this.maxVelocity.y) - this.velocity.y) * 0.3;
			// this.velocity.y = this.velocity.y + vc;
			// var dz: number = this.velocity.y * G.maxElapsed;
			// this.velocity.y = this.velocity.y + vc;

			this.point.x = this.point.x + dx;
			this.point.y = this.point.y + dy;
			// if (this.gravityEnable && this.point.y > G.floor) {
			// 	this.point.y = G.floor;
			// 	this.onFloor = true;
			// 	this.velocity.y = 0;
			// }

			if (this.animator) {
				this.animator.x = this.point.x;
				this.animator.y = this.point.y;
				//				animator.z = wypoint.z; //Z放大
				this.animator.rotation = this.angle;
				this.animator.scaleX = this.scale.x;
				this.animator.update();
			}
			/*if (collider) {
				collider.x = wypoint.x;
				collider.y = wypoint.y;
				collider.z = wypoint.z;
				//				collider.angle = angle;
			}*/
			if (this.Collider) {
				this.Collider.x = this.point.x;
				this.Collider.y = this.point.y;
			}
		}


		public hurt(damage: number, crit: number, hiter: gobjs.eTower) {
			// egret.log("hurt:", this.health, this.hpmax, damage);
			this.health -= damage;
			if (this.health <= 0)
				this.dead = true;
			this.lastHiter = hiter;
		}

		public addContact(self: DyEngine.DyShape, s1: DyEngine.DyShape) {
			// egret.log("eTower", self, s1);
		}

		public getScreenPosition(point: Point = null, ox: Number = 0): Point {
			if (point == null) {
				point = new Point();
			}
			point.x = this.point.x + G.scroll.x * this.scrollFactor.x;
			point.y = this.point.y + G.scroll.y * this.scrollFactor.y;
			return point;
		}

		public onScreen(): Boolean {
			this._scrpoint = this.getScreenPosition(this._scrpoint);
			if (this._scrpoint.x + this.width < 0 || this._scrpoint.x > G.width || this._scrpoint.y + this.height < 0 || this._scrpoint.y > G.height) {
				return false;
			}
			return true;
		}

		public reset(ax: number, ay: number): void {
			this.point.x = ax;
			this.point.y = ay;
			this.active = true;
			this.exists = true;
			this.dead = false;
			if (this.animator) {
				this.animator.x = ax;
				this.animator.y = ay;
				this.animator.rotation = this.angle;
				this.animator.update();
			}
			if (this.Collider) {
				this.Collider.x = ax;
				this.Collider.y = ay;
			}
		}

		public render(): void {
			if (this.animator)
				this.animator.render();
		}

		public free(): void {
			if (this.animator)
				this.animator.parent.removeChild(this.animator);
			this.exists = false;
		}

		public kill(): void {
			this.exists = false;
			if (this.animator)
				this.animator.kill();

		}
	}
}