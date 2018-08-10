module core {
	export class DataMgr {
		public static towers: any;
		public constructor() {
		}

		public static init() {
			RES.getResByUrl("tower_json", (obj: any) => {
				let ary: any[] = obj;
				let i;
				let n = ary.length;
				let d: any;
				let ret: any = {};
				for (i = 0; i < n; i++) {
					d = ary[i];
					ret[d.ID] = d;
				}
				DataMgr.towers = ret;
			}, this, RES.ResourceItem.TYPE_JSON);
		}
	}
}