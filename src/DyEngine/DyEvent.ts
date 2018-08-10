module DyEngine {
    export class DyEvent {
        private _callbacks: any = {};
        private _sender;

        public on(event, fn, sender) {
            (this._callbacks[event] = this._callbacks[event] || []).push(fn);
            this._sender = sender;
        }

        public off(event?, fn?) {
            this.clean(event, fn);
        }
        public clean(event?, fn?) {
            // all
            if (0 == arguments.length) {
                this._callbacks = {};
                return;
            } 
            this._sender = null;

            // specific event
            var callbacks = this._callbacks[event];
            if (!callbacks) {
                return;
            }

            // remove all handlers
            if (event && !fn) {
                delete this._callbacks[event];
                return;
            }

            // remove specific handler
            var i = this.index(callbacks, fn._off || fn);
            if (~i) {
                callbacks.splice(i, 1);
            }
            return;
        }
        private index(arr, obj) {
            if ([].indexOf) {
                return arr.indexOf(obj);
            }

            for (var i = 0; i < arr.length; ++i) {
                if (arr[i] === obj)
                    return i;
            }
            return -1;
        }

        public send(event, ...args: any[]) {
            var params = [].slice.call(arguments, 1);
            var callbacks = this._callbacks[event];

            if (callbacks) {
                callbacks = callbacks.slice(0);
                for (var i = 0, len = callbacks.length; i < len; ++i) {
                    callbacks[i].apply(this._sender, params);
                }
            }
            return this;
        }
    }
}