module DyEngine {
	export class DyPhysics {
		private _balls: DyShape[];
		public pause: Boolean = false;
		public constructor() {
			this._balls = [];
		}

		public create() {
			this._balls = [];
		}

		/**
		 * 清理B2D的世界
		 * @param recreate,清理完是否重建
		 *
		 */
		public clearWorld(recreate: Boolean = true): void {
			//			if (space != null)
			{
				//				space.clear();
				//如果是重建物理世界
				this._balls.length = 0;
				if (recreate) {
					//create();
				}
			}
		}

		public addShape(shape: DyShape): void {
			this._balls.push(shape);
		}

		public removeShape(body: DyShape): void {
			let i = this._balls.indexOf(body);
			if (i > -1)
				this._balls.splice(i, 1);

		}

		public query(ox: number, oy: number, radis: number): any[] {
			let i: number = 0;
			let ary = this._balls;
			let ballA: DyShape;
			let dist: number;
			let ret: any[] = [];
			for (let i: number = 0; i < ary.length; i++) {
				ballA = ary[i];
				dist = DyMath.distance(ox, oy, ballA.x, ballA.y);
				if (dist < radis)
					ret.push(ballA.udata);
			}
			return ret;
		}

		public update(): void {
			if (!this.pause) // && space != null)
			{
				let ary = this._balls;
				for (let i: number = 0; i < ary.length - 1; i++) {
					let ballA: DyShape = ary[i];
					for (let j: number = i + 1; j < ary.length; j++) {
						let ballB: DyShape = ary[j];
						this.checkCollision(ballA, ballB);
					}
				}
			}
		}

		private checkCollision(ballA: DyShape, ballB: DyShape): void {
			//			if (ballA.Body.faction == ballB.Body.faction)
			//				return;
			//			if (ballA.Body.userData.tag == 756 || ballB.Body.userData.tag == 756)
			//				trace('sddd');
			//			trace(getQualifiedClassName(ballA.Body.userData));			
			let dist: number = DyMath.distance(ballA.x, ballA.y, ballB.x, ballB.y);
			let isChecked: Boolean;
			// if (ballA.interestDist != 150 && ballB.interestDist != 150 && dist <16)
			// {
			// 	egret.log("ba:",ballA.udata,ballB.udata,dist);
			// }
			if (dist < ballA.interestDist + ballB.interestDist) {
				//						trace("碰撞了", ballA.Body, ballB.Body);
				ballA.addContact(ballA, ballB);
				ballB.addContact(ballB, ballA);

			}

		}
	}
}