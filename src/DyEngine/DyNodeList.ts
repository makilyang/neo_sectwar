module DyEngine {
	export class DyNodeList {
		public first: DyNode = null;
		public last: DyNode = null;
		public constructor() {
		}

		public get size(): number {
			var count: number;
			var n: DyNode = this.first;
			while (n) {
				count++;
				n = n.next;
			}
			return count;
		}

		public shift(): any {
			var data: any;
			if (this.first != null) {
				data = this.first.data;
				this.removeNode(this.first);
			}
			return data;
		}

		protected insertAfter(node: DyNode, newNode: DyNode): void {
			newNode.prev = node;
			newNode.next = node.next;
			if (node.next == null) {
				this.last = newNode;
			}
			else {
				node.next.prev = newNode;
			}
			node.next = newNode;
		}

		public remove(data: Object): void {
			var n: DyNode = this.first;
			while (n) {
				if (n.data == data) {
					this.removeNode(n);
				}
				n = n.next;
			}
		}

		public removeNode(node: DyNode): void {
			if (node.prev == null) {
				this.first = node.next;
			}
			else {
				node.prev.next = node.next;
			}
			if (node.next == null) {
				this.last = node.prev;
			}
			else {
				node.next.prev = node.prev;
			}
			node.data = null;
			node.next = null;
			node.prev = null;
		}

		public unshift(data: Object): void {
			var newNode: DyNode = DyNode.make(data);
			if (this.first == null) {
				this.first = newNode;
				this.last = newNode;
				newNode.prev = null;
				newNode.next = null;
			}
			else {
				this.insertBefore(this.first, newNode);
			}
		}

		public clear(): void {
			var n: DyNode = this.first;
			while (n) {
				n.next = null;
				n.prev = null;
				n.data = null;
				n = n.next;
			}
			this.first = null;
			this.last = null;
		}

		public replace(data: Object, newData: Object): void {
			var n: DyNode = this.first;
			while (n) {
				if (n.data == data) {
					n.data = newData;
				}
				n = n.next;
			}
		}

		protected insertBefore(node: DyNode, newNode: DyNode): void {
			newNode.prev = node.prev;
			newNode.next = node;
			if (node.next == null) {
				this.last = newNode;
			}
			else {
				if (node.prev != null)
					node.prev.next = newNode;
			}
			node.prev = newNode;
		}

		public push(data: Object): void {
			var newNode: DyNode;
			if (this.last == null) {
				this.unshift(data);
			}
			else {
				newNode = DyNode.make(data);
				this.insertAfter(this.last, newNode);
			}
		}

		public contains(data: Object): Boolean {
			var n: DyNode = this.first;
			while (n) {
				if (n.data == data) {
					return true;
				}
				n = n.next;
			}
			return false;
		}
	}
}