module observer {
	export class Observer {
		public constructor() {
		}

		private notify: Function;
		private context: any;

		/**
		 * Constructor. 
		 * 
		 * <P>
		 * The notification method on the interested object should take 
		 * one parameter of type <code>INotification</code></P>
		 * 
		 * @param notifyMethod the notification method of the interested object
		 * @param notifyContext the notification context of the interested object
		 */
		public static make(notifyMethod: Function, notifyContext: any): Observer {
			var inst: Observer = new Observer();
			inst.setNotifyMethod(notifyMethod);
			inst.setNotifyContext(notifyContext);
			return inst;
		}

		/**
		 * Set the notification method.
		 * 
		 * <P>
		 * The notification method should take one parameter of type <code>INotification</code>.</P>
		 * 
		 * @param notifyMethod the notification (callback) method of the interested object.
		 */
		public setNotifyMethod(notifyMethod: Function): void {
			this.notify = notifyMethod;
		}

		/**
		 * Set the notification context.
		 * 
		 * @param notifyContext the notification context (this) of the interested object.
		 */
		public setNotifyContext(notifyContext: Object): void {
			this.context = notifyContext;
		}

		/**
		 * Get the notification method.
		 * 
		 * @return the notification (callback) method of the interested object.
		 */
		private getNotifyMethod(): Function {
			return this.notify;
		}

		/**
		 * Get the notification context.
		 * 
		 * @return the notification context (<code>this</code>) of the interested object.
		 */
		private getNotifyContext(): any {
			return this.context;
		}

		/**
		 * Notify the interested object.
		 * 
		 * @param notification the <code>INotification</code> to pass to the interested object's notification method.
		 */
		public notifyObserver(notification: Notification): void {
			this.getNotifyMethod().apply(this.getNotifyContext(), [notification]);
		}

		/**
		 * Compare an object to the notification context. 
		 * 
		 * @param object the object to compare
		 * @return boolean indicating if the object and the notification context are the same
		 */
		public compareNotifyContext(object: any): Boolean {
			return object === this.context;
		}
	}
}