module gui {
	export class RankUI implements INotifier {
		private _view: fairygui.GComponent;
		private _tfgold: fairygui.GTextField;
		private _btn: fairygui.GButton;
		private _list: fairygui.GList;
		public constructor() {
			this.create();
		}

		public create() {

			this._view = fairygui.UIPackage.createObject("tdui1", "005 排行榜").asCom;
			this._btn = this._view.getChild("n2").asButton;
			this._btn.addEventListener(egret.TouchEvent.TOUCH_END, this.onClose, this);
			this._tfgold = this._view.getChild("n5").asTextField;
			this._list = this._view.getChild("n16").asList;
			// this._tfTitle = this._view.getChild("n41").asTextField;
			// this._tfwc = this._view.getChild("n44").asTextField;
			this._view.setSize(G.width, G.height);
			// this._view.getChild("w0").asButton.addEventListener(egret.TouchEvent.TOUCH_END, this.onActived, this);
			fairygui.GRoot.inst.addChild(this._view);
			let score: number = DyEngine.DyMath.toNumber(G.sd.score)
			this._tfgold.text = String(score);
			observer.UIManager.getInstance().registerUI(this);
			this._list.removeChildrenToPool();
			var func1 = (obj: any) => {
				if (obj.code == 10000) {
					let data = obj.data;
					this._list.removeChildrenToPool();
					var n: number = data.length;
					if (n > 11)
						n = 11;
					for (let i = 0; i < n; i++) {
						let comp: fairygui.GComponent = this._list.addItemFromPool().asCom;
						comp.getChild("n14").asTextField.text = data[i].rank;
						comp.getChild("n15").asTextField.text = data[i].score;
					}
				}
				else {
					egret.log("error:", obj);
				}
			}
			let h5api: any = window["h5api"];
			if (h5api) {
				console.log('开始上传')
				if (score > 0) {
					h5api.submitScore(score, (obj) => {
						console.log('代码:' + obj.code + ',消息:' + obj.message + ',数据:' + obj.data)
						if (obj.code === 10000) {
							console.log('上传成功')
						} else {
							console.log('上传失败')
						}
						h5api.getRank(func1);
					});
				}
				else {
					h5api.getRank(func1);
				}
			}
		}

		// private onRank(obj: any): void {
		// 	if (obj.code == 10000) {
		// 		let data = obj.data;
		// 		this._list.removeChildrenToPool();
		// 		var n: number = data.length;
		// 		if (n > 11)
		// 			n = 11;
		// 		for (let i = 0; i < n; i++) {
		// 			let comp: fairygui.GComponent = this._list.addItemFromPool().asCom;
		// 			comp.getChild("n14").asTextField.text = data[i].rank;
		// 			comp.getChild("n15").asTextField.text = data[i].score;
		// 		}
		// 	}
		// 	else {
		// 		egret.log("error:", obj);
		// 	}
		// }
		private onActived(e: egret.TouchEvent) {
			let cur: fairygui.GButton = e.currentTarget;
			setTimeout(() => {
				cur.selected = false;
			}, 1000);

		}

		private onClose(e: egret.TouchEvent) {
			this._btn.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClose, this);
			fairygui.GRoot.inst.removeChild(this._view);
			observer.UIManager.getInstance().removeUI(this.getMediatorName());
		}

		public getMediatorName(): string {
			return "RankUI";
		};

		/**
		 * List <code>INotification</code> interests.
		 *
		 * @return an <code>Array</code> of the <code>INotification</code> names this <code>IMediator</code> has an interest in.
		 */
		public listNotificationInterests(): string[] {
			return ["upd_rank"];
		}

		/**
		 * Handle an <code>INotification</code>.
		 *
		 * @param notification the <code>INotification</code> to be handled
		 */
		public handleNotification(notification: observer.Notification): void {

			switch (notification.name) {
				case "upd_rank":
					// egret.log("dfdadfUIPD");
					this._tfgold.text = String(DyEngine.DyMath.toNumber(G.sd.score));
					break;
			}
		}

		/**
		 * Called by the View when the Mediator is registered
		 */
		public onRegister(): void {

		}

		/**
		 * Called by the View when the Mediator is removed
		 */
		public onRemove(): void {

		}
	}
}