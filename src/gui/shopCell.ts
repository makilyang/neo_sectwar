module gui {
	export class shopCell extends fairygui.GComponent {
		public static url: string = "ui://y1w8mpywgkuz2q";
		private static URLS: any = { "2": "ui://y1w8mpywgkuz2m", "3": "ui://y1w8mpywgkuz2n", "4": "ui://y1w8mpywgkuz2o", "5": "ui://y1w8mpywgkuz2p" };

		private _img: fairygui.GLoader;
		private _lname: string;

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);
			this._img = this.getChild("n4").asLoader;
			this.addEventListener(egret.TouchEvent.TOUCH_END, (e: egret.TouchEvent) => {
				if (this.getController("button").selectedIndex == 1) {
					return;
				}
				let cfg = G.SHOP[this._name];
				let ary: string[] = G.sd.shop;
				if (cfg.req && ary.indexOf(cfg.req) == -1) {
					egret.log("请先购买前置等级!");
					BuyUI.make("要花费" + cfg.g + "金币购买这个升级吗？\n升级后可以在游戏里建造这个级别的防御塔。", "请先购买前置等级!");
					return;
				}
				if (G.sd.ddb < cfg.g) {
					BuyUI.make("要花费" + cfg.g + "金币购买这个升级吗？\n升级后可以在游戏里建造这个级别的防御塔。", "你的金币不够!");
					return;
				}
				BuyUI.make("要花费" + cfg.g + "金币购买这个升级吗？\n升级后可以在游戏里建造这个级别的防御塔。", null, () => {
					G.sd.ddb -= cfg.g;
					G.sd.score += 100;
					this.getController("button").selectedIndex = 1;
					G.sd.shop.push(this._name)
					observer.UIManager.send("upd_shop");
					egret.localStorage.setItem(G.SAVEKEY, JSON.stringify(G.sd));
				}, this);

			}, this);
		}

		public setup_afterAdd(xml: any): void {
			super.setup_afterAdd(xml);
			let n = this._name.substr(-1, 1);
			this._img.url = shopCell.URLS[n];
			if (G.sd.shop.indexOf(this._name) != -1) {
				this.getController("button").selectedIndex = 1;
			}
			else
				this.getController("button").selectedIndex = 0;

		}

	}
}