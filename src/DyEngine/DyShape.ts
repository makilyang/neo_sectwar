module DyEngine {
	export class DyShape {
		public x: number;
		public y: number;
		public radius: number;
		public width: number;
		public height: number;
		public offsetx: number;
		public offsety: number;
		public interestDist: number;
		public contactEvent: DyEvent;
		public udata:DyObject;
		public constructor() {
			this.contactEvent = new DyEvent();
		}

		public static make(udata: DyObject, ox: number, oy: number, radius: number, w: number = 0, h: number = 0): DyShape {
			let shape = new DyShape;
			shape.offsetx = ox;
			shape.offsetx = oy;
			shape.radius = radius;
			shape.width = w;
			shape.height = h;
			shape.udata = udata;
			return shape;
		}


		public dist(shape: DyShape) {
			let dx: number = this.x - shape.x;
			let dy: number = this.y - shape.y;
			let dist: number = Math.sqrt(dx * dx + dy * dy);
			return dist;
		}

		public addContact(self: DyShape, s1: DyShape) {
			this.contactEvent.send("collision", self, s1);

		}
	}
}