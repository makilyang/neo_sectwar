module core {
	export class Camera {
		private _target: DyEngine.BasicObject;
		public pause: boolean;
		private _speedX: number;
		private _speedY: number;
		private _newX: number;
		private _newY: number;
		private _arenaWidth:number;
		private _areaHeight:number;
		private offset:number = 0;
		public constructor() {
			this._arenaWidth = Number.MAX_VALUE;
			this._areaHeight = Number.MAX_VALUE;
		}

		public update(): void {
			if (!this.pause && this._target != null) {
				if (this._target == null) {
					return;
				}
				var _vel: egret.Point = this._target.velocity;
				// switch (_mode) {
				// 	case MODE_BLOCK:
				// 		_speedX = _speedY = 0;
				// 		break;
				// 	case MODE_CAR:
				// 		_speedX = (DyG.scroll.x - ((-_target.x + 320) - _vel.x * 8)) * 0.25;
				// 		_speedY = (DyG.scroll.y - ((-_target.y + 2 * 480 * 0.25) - _vel.y * 6)) / 3;
				// 		break;
				// 	case MODE_CINEMA:
				// 		_speedX = (DyG.scroll.x - ((-_target.x + Global.SCR_DIV_WIDTH) - _vel.x)) / 4; //28;
				// 		_speedY = (DyG.scroll.y - ((-_target.y + Global.SCR_DIV_HEIGHT) - _vel.y)) / 4; //28;
				// 		break;
				// 	case MODE_HERO:
				// 		if (Global.PlayMode == 1) {
				// 			if (!Global.playerA.dead && !Global.playerB.dead)
				// 				_rp = DyMath.getMiddlePoint(Global.playerA.wypoint, Global.playerB.wypoint, _trp);
				// 			else if (Global.playerA.dead)
				// 				_rp = Global.playerB.wypoint;
				// 			else
				// 				_rp = Global.playerA.wypoint;
				// 		}
				// 		else {
				// 			_rp.x = _target.x;
				// 			_rp.y = _target.y;
				// 		}
				// 		_speedX = (DyG.scroll.x - ((-_rp.x + Global.SCR_DIV_WIDTH) - 13)) / 6;
				// 		_speedY = (DyG.scroll.y - ((-_rp.y + Global.SCR_DIV_HEIGHT) - _vel.y / 30)) / 6;
				// 		break;
				// }
				this._speedX = (G.scroll.x - ((-this._target.x + G.widthHalf) - 13)) / 6;
				this._speedY = (G.scroll.y - ((-this._target.y + G.heightHalf) - _vel.y/15)) / 2;
				//this._newX = G.scroll.x - Math.ceil(_speedX + DyMath.roundingError);
				this._newY = G.scroll.y - Math.ceil(this._speedY);// + DyMath.roundingError);								
			
				if (this._newY < 0) {
					this._newY = 0;
					this._speedY = 0;
				}
				else if (Math.abs(this._newY) > (this._areaHeight - G.height)) {
					this._newY = -this._areaHeight + G.height;
					this._speedY = 0;
				}
				// egret.log("camera:", this._newY, "speedx:", this._speedY, "scorllx:", G.scroll.y);
				// G.scroll.x = _newX;
				G.scroll.y = this._newY;
			}
		}

		public setTarget(obj:DyEngine.BasicObject, resetCamera:Boolean = false):void
		{
			this._target = obj;
			if (resetCamera)
			{
				this.reset();
			}
		}

		public reset():void
		{
			this._speedX = this._speedY = 0;		
			if (this._target != null)			{
				
				G.scroll.x = -this._target.x + G.widthHalf - this.offset;
				G.scroll.y = -this._target.y + G.heightHalf;
				if (G.scroll.y < 0)
				{
					G.scroll.y = 0;
				}
			}
		}
	}
}