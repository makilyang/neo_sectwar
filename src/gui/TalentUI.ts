module gui {
	export class TalentUI implements INotifier {
		private _view: fairygui.GComponent;
		private _tfgold: fairygui.GTextField;
		private _btn: fairygui.GButton;
		public constructor() {
			this.create();
		}

		public create() {

			this._view = fairygui.UIPackage.createObject("tdui1", "004 天赋").asCom;
			this._btn = this._view.getChild("n2").asButton;
			this._btn.addEventListener(egret.TouchEvent.TOUCH_END, this.onClose, this);
			this._tfgold = this._view.getChild("n12").asTextField;
			// this._tfTitle = this._view.getChild("n41").asTextField;
			// this._tfwc = this._view.getChild("n44").asTextField;
			this._view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
			// this._view.getChild("w0").asButton.addEventListener(egret.TouchEvent.TOUCH_END, this.onActived, this);
			fairygui.GRoot.inst.addChild(this._view);
			this._tfgold.text = G.sd.star;
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
			return "TalentUI";
		};

		/**
		 * List <code>INotification</code> interests.
		 *
		 * @return an <code>Array</code> of the <code>INotification</code> names this <code>IMediator</code> has an interest in.
		 */
		public listNotificationInterests(): string[] {
			return ["upd_talnet"];
		}

		/**
		 * Handle an <code>INotification</code>.
		 *
		 * @param notification the <code>INotification</code> to be handled
		 */
		public handleNotification(notification: observer.Notification): void {

			switch (notification.name) {
				case "upd_talnet":
					// egret.log("dfdadfUIPD");
					this._tfgold.text = String(G.sd.star);
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