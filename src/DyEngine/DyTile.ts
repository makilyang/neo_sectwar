module DyEngine {
	export class DyTile extends DyObject {
		private _bitmap: egret.Bitmap;
		private _parent: DyTileMap;
		public constructor(parent: DyTileMap) {
			super();
			this.animator = new DyAnimator;
			this._bitmap = new egret.Bitmap;
			this._parent = parent;
			this.height = G.height;
			this.width = G.width;
			this.gravityEnable = false;
		}

		public addRes(res: string): void {
			let texture: egret.Texture = RES.getRes(res);
			this._bitmap.texture = texture;
			this._bitmap.height = this.height;
			this._bitmap.width = this.width;
			this._bitmap.y = this.y;
			this._bitmap.fillMode = egret.BitmapFillMode.REPEAT;
			this._parent.container.addChild(this._bitmap);
		}

		public update(): void {
			super.update();
			if (this._bitmap) {
				this._bitmap.x = this.x;
				this._bitmap.y = this.y;
				// this._scrpoint = this.getScreenPosition(this._scrpoint);
				// egret.log("screen:", this.onScreen(), this._scrpoint.y);
				if (!this.onScreen()) {
					if (this._scrpoint.y >= G.height) //SCR_GAP * TileSize)
						this.y -= (this._parent.height); //(parent.numCols * TileSize);
					else if (this._scrpoint.y <= -G.height) // DyG.width + SCR_GAP * TileSize)
					{
						this.y += this._parent.height;//+G.height;
					}
				}
			}
		}
	}
} 