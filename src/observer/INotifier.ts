interface INotifier {
	getMediatorName(): string;

	/**
	 * List <code>INotification</code> interests.
	 *
	 * @return an <code>Array</code> of the <code>INotification</code> names this <code>IMediator</code> has an interest in.
	 */
	listNotificationInterests(): string[];

	/**
	 * Handle an <code>INotification</code>.
	 *
	 * @param notification the <code>INotification</code> to be handled
	 */
	handleNotification(notification: observer.Notification): void;

	/**
	 * Called by the View when the Mediator is registered
	 */
	onRegister(): void;

	/**
	 * Called by the View when the Mediator is removed
	 */
	onRemove(): void;
}