class D {
	public static towers: any;
	public static creeps: any;
	public static map: any;

	public static init() {
		if (this.towers == null) {
			RES.getResByUrl("tower_json", (obj: any[]) => {
				let i;
				let o;
				let r: any = {};
				for (i = 0; i < obj.length; i++) {
					o = obj[i];
					r[o.ID] = o;
				}
				this.towers = r;
			}, this, RES.ResourceItem.TYPE_JSON);
		}
		if (this.creeps == null) {
			RES.getResByUrl("creep_json", (obj: any[]) => {
				let i;
				let o;
				let r: any = {};
				for (i = 0; i < obj.length; i++) {
					o = obj[i];
					r[o.ID] = o;
				}
				this.creeps = r;
			}, this, RES.ResourceItem.TYPE_JSON);
		}
	}

	public static initmap() {
		this.map = RES.getRes("map_json");
	}
}
