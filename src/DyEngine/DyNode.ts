module DyEngine {
	export class DyNode {
		public next: DyNode = null;
		public prev: DyNode = null;
		public data: any = null;
		public constructor() {
		}

		public static make(data: any): DyNode {
			let node: DyNode = new DyNode();
			node.data = data;
			return node;
		}
	}
}