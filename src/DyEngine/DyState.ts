module DyEngine {
	export class DyState extends egret.DisplayObjectContainer {
		private _defGroup:DyGroup;
		public constructor() {
			super();
			this._defGroup = new DyGroup();
		}

		public add(obj:DyGroup):void
		{
			this._defGroup.add(obj);
		}
	}
}