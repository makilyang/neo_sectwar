module observer {
	export class Notification {
		public callback: Function;
		// the name of the notification instance
		public name: string;
		// the type of the notification instance
		public type: string;
		// the body of the notification instance
		public body: any;
		/**
		* Constructor. 
	 	* 
		* @param name name of the <code>Notification</code> instance. (required)
	 	* @param body the <code>Notification</code> body. (optional)
		* @param type the type of the <code>Notification</code> (optional)
		*/
		public constructor(name: string, body: Object = null, cb: Function = null) {
			this.name = name;
			this.body = body;
			this.callback = cb;
		}	

		/**
		 * Get the string representation of the <code>Notification</code> instance.
		 * 
		 * @return the string representation of the <code>Notification</code> instance.
		 */
		public toString(): string {
			let msg: string = "Notification Name: " + this.name;
			msg += "\nBody:" + ((this.body == null) ? "null" : this.body);
			msg += "\nType:" + ((this.type == null) ? "null" : this.type);
			return msg;
		}
	}
}