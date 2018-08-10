module gui {
	export class ShopUI implements INotifier {
		private _view: fairygui.GComponent;
		private _tfgold: fairygui.GTextField;
		private _btn: fairygui.GButton;
		public constructor() {
			this.create();
		}

		public create() {

			this._view = fairygui.UIPackage.createObject("tdui1", "商店").asCom;
			this._btn = this._view.getChild("n68").asButton;
			this._btn.addEventListener(egret.TouchEvent.TOUCH_END, this.onClose, this);
			this._tfgold = this._view.getChild("n111").asTextField;
			// this._tfTitle = this._view.getChild("n41").asTextField;
			this._view.setSize(G.width , G.height);
			// this._view.getChild("w0").asButton.addEventListener(egret.TouchEvent.TOUCH_END, this.onActived, this);
			fairygui.GRoot.inst.addChild(this._view);
			this._tfgold.text = G.sd.ddb;
			observer.UIManager.getInstance().registerUI(this);
			G.onceSnd("openui");
		}

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
			G.onceSnd("close");
		}

		public getMediatorName(): string {
			return "ShopUI";
		};

		/**
		 * List <code>INotification</code> interests.
		 *
		 * @return an <code>Array</code> of the <code>INotification</code> names this <code>IMediator</code> has an interest in.
		 */
		public listNotificationInterests(): string[] {
			return ["upd_shop"];
		}

		/**
		 * Handle an <code>INotification</code>.
		 *
		 * @param notification the <code>INotification</code> to be handled
		 */
		public handleNotification(notification: observer.Notification): void {

			switch (notification.name) {
				case "upd_shop":
					// egret.log("dfdadfUIPD");
					this._tfgold.text = String(DyEngine.DyMath.toNumber(G.sd.ddb));					
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