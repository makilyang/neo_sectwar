module observer {
	export class UIManager {
		protected static instance: UIManager;
		// Mapping of Mediator names to Mediator instances
		protected mediatorMap: any;
		// Mapping of Notification names to Observer lists
		protected observerMap: any;
		public constructor() {
			if (UIManager.instance != null)
				throw Error("UI组件管理器已经初始化");
			UIManager.instance = this;
			this.mediatorMap = [];
			this.observerMap = [];
		}

		public static getInstance(): UIManager {
			if (this.instance == null)
				this.instance = new UIManager();
			return this.instance;
		}

		public static send(notificationName: string, body: any = null, cb: Function = null): void {
			if (this.instance == null)
				this.instance = new UIManager();
			this.instance.sendNotification(notificationName, body, cb);
		}

		public removeAllUI(): void {
			for (let key in this.mediatorMap) {
				let mediator: INotifier = this.mediatorMap[key];
				if (mediator) {
					this.mediatorMap[mediator.getMediatorName()] = null;
					// Get Notification interests, if any.
					var interests: any[] = mediator.listNotificationInterests();

					// Register Mediator as an observer for each of its notification interests
					if (interests.length > 0) {
						// Register Mediator as Observer for its list of Notification interests
						for (let i: number = 0; i < interests.length; i++) {
							this.removeObserver(interests[i], mediator);
						}
					}
					// alert the mediator that it has been registered
					mediator.onRemove();
				}
			}
			this.mediatorMap.length = 0;
		}

		public removeUI(mediatorName: string): void {
			var mediator: INotifier = this.mediatorMap[mediatorName];
			if (mediator == null)
				return;
			this.mediatorMap[mediatorName] = null;

			// Get Notification interests, if any.
			var interests: string[] = mediator.listNotificationInterests();

			// Register Mediator as an observer for each of its notification interests
			if (interests.length > 0) {
				// Register Mediator as Observer for its list of Notification interests
				for (let i: number = 0; i < interests.length; i++) {
					this.removeObserver(interests[i], mediator);
				}
			}
			// alert the mediator that it has been registered
			mediator.onRemove();
		}

		public registerUI(mediator: INotifier): void {
			// do not allow re-registration (you must to removeMediator fist)
			let n: string = mediator.getMediatorName();
			if (this.mediatorMap[n] != null)
				return;

			// Register the Mediator for retrieval by name
			this.mediatorMap[n] = mediator;

			// Get Notification interests, if any.
			var interests: string[] = mediator.listNotificationInterests();

			// Register Mediator as an observer for each of its notification interests
			if (interests.length > 0) {
				// Create Observer referencing this mediator's handlNotification method
				var observer: Observer = Observer.make(mediator.handleNotification, mediator);

				// Register Mediator as Observer for its list of Notification interests
				for (let i: number = 0; i < interests.length; i++) {
					this.registerObserver(interests[i], observer);
				}
			}

			// alert the mediator that it has been registered
			mediator.onRegister();
		}

		public sendNotification(notiN: string, body: Object = null, cb: Function = null): void {
			var note: Notification = new Notification(notiN, body, cb);
			this.notifyObservers(note);
		}

		public removeObserver(notificationName: string, context: INotifier): void {
			if (this.observerMap[notificationName] != null) {
				// Get a reference to the observers list for this notification name
				var observers_ref: Observer[] = this.observerMap[notificationName];

				// Copy observers from reference array to working array, 
				// since the reference array may change during the notification loop
				//var observers: Array = new Array();
				var observer: Observer;
				for (let i: number = 0; i < observers_ref.length; i++) {
					observer = observers_ref[i] as Observer;
					if (observer.compareNotifyContext(context)) {
						observers_ref.splice(i, 1);
						i--;
					}
				}
			}
		}

		/**
		 * Register an <code>IObserver</code> to be notified
		 * of <code>INotifications</code> with a given name.
		 *
		 * @param notificationName the name of the <code>INotifications</code> to notify this <code>IObserver</code> of
		 * @param observer the <code>IObserver</code> to register
		 */
		public registerObserver(notificationName: string, observer: Observer): void {
			var observers: Observer[] = this.observerMap[notificationName];
			if (observers) {
				observers.push(observer);
			}
			else {
				this.observerMap[notificationName] = [observer];
			}
		}

		public notifyObservers(notification: Notification): void {
			let n: string = notification.name;
			// egret.log(this.observerMap[n]);
			if (this.observerMap[n] != null) {
				// Get a reference to the observers list for this notification name
				var observers_ref: Observer[] = this.observerMap[notification.name];

				// Copy observers from reference array to working array, 
				// since the reference array may change during the notification loop
				var observers: Observer[] = [];
				var observer: Observer;
				let i: number;
				for (i = 0; i < observers_ref.length; i++) {
					observer = observers_ref[i] as Observer;
					observers.push(observer);
				}
				// Notify Observers from the working array				
				for (i = 0; i < observers.length; i++) {
					observer = observers[i] as Observer;
					observer.notifyObserver(notification);
				}
			}
		}
	}
}