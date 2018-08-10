module DyEngine {
	export class DyMath {
		public constructor() {
		}
		public static randomRangenumber(lower: number, upper: number): number {
			return Math.random() * (upper - lower) + lower;
		}

		public static equal(a: number, b: number, diff: number = 1E-5): Boolean {
			return Math.abs(a - b) <= diff;
		}

		public static distance(x1: number, y1: number, x2: number, y2: number): number {
			var dx: number = x2 - x1;
			var dy: number = y2 - y1;
			return Math.sqrt(dx * dx + dy * dy);
		}

		public static getnumberArr(num: number): number[] {
			var arr: number[] = [];
			var str: String = String(num);
			for (var i: number = str.length - 1; i >= 0; i--) {
				var result: number = Math.round(num / Math.pow(10, i));
				arr.unshift(result);
				num = num % Math.pow(10, i);
			}
			return arr;
		}

		public static getAngle(x1: number, y1: number, x2: number, y2: number, norm: boolean = true): number {
			let dx: number = (x2 - x1);
			let dy: number = (y2 - y1);
			let angle: number = Math.atan2(dy, dx);
			if (norm) {
				if (angle < 0) {
					angle = ((Math.PI * 2) + angle);
				}
				else {
					if (angle >= (Math.PI * 2)) {
						angle = (angle - (Math.PI * 2));
					}
				}
			}
			return angle;
		}


		public static calcVelocity(velocity: number, acceleration: number = 0, drag: number = 0, max: number = 10000): number {
			var d: number;
			if (acceleration != 0) {
				velocity = velocity + acceleration * G.elapsed;
			}
			else {
				if (drag != 0) {
					d = drag * G.maxElapsed;
					if (velocity - d > 0) {
						velocity = velocity - d;
					}
					else {
						if (velocity + d < 0) {
							velocity = velocity + d;
						}
						else {
							velocity = 0;
						}
					}
				}
			}
			if (velocity != 0 && max != 10000) {
				if (velocity > max) {
					velocity = max;
				}
				else if (velocity < -max) {
					velocity = -max;
				}
			}
			return velocity;
		}

		public static toNumber(v: any,def:number = 0): number {
			let r = Number(v);
			if (isNaN(r))
				r = def;
			return r;
		}
	}
}