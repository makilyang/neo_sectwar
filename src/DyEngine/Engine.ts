module DyEngine {
	export class Engine extends egret.DisplayObjectContainer {
		private static instance: Engine;
		private _runnging:boolean;
		public state:core.GameWorld;
		public constructor() {
			super();
			if (Engine.instance)
				throw new Error("只允许实例化一次！")
		}

		public static getInstance(): Engine {
			if (!this.instance) {
				this.instance = new Engine();
			}
			return this.instance;
		}

		public start():void
		{
			if (!this._runnging)
			{
				this.stage.addEventListener(egret.Event.ENTER_FRAME, this.update,this);
				this._runnging = true;
			}
		}

		public stop():void
		{
			if (this._runnging)
			{
				this.stage.removeEventListener(egret.Event.ENTER_FRAME, this.update,this);
				this._runnging = false;
			}
		}

		// public switchState(state:DyState):void
		// {
		// 	_screen.x = _offsetX;
		// 	_screen.y = _offsetY;
		// 	_screen.addChild(state);
		// 	if (_state != null)
		// 	{
		// 		_state.free();
		// 		_screen.swapChildren(state, _state);
		// 		_screen.removeChild(_state);
		// 	}
		// 	_state = state;
		// 	_state.create();
		// }

		public update(): void {
			if (!this._runnging)
				return;					
			if (this.state)
			{
				this.state.update();
			}
		}
	}
}