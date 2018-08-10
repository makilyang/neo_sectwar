module DyEngine {
	export class DyTileMap extends DyGroup {
		private _rows: number;
		private _cols: number;
		private _arrTiles: DyTile[];
		public container: egret.DisplayObjectContainer;
		public constructor(c: egret.DisplayObjectContainer) {
			super();
			this._arrTiles = [];
			this.container = c;
		}

		public setSize(col: number, row: number): void {
			this._cols = col;
			this._rows = row;
			this.height = row * G.height;
			this.width = G.width;
		}

		public makeTils(): void {
			let i: number = 0;
			let j: number = 0;
			for (i; i < this._cols; i++) {
				for (j; j < this._rows; j++) {
					var tile: DyTile = new DyTile(this);
					tile.y = j * G.height;
					tile.addRes("4399bg_jpg");
					this._arrTiles.push(tile);
				}
			}
		}

		public addTile(tile: DyTile): void {

		}

		public update(): void {
			super.update();
			var i: number = 0;
			let tile: DyTile;
			for (i; i < this._arrTiles.length; i++) {
				tile = this._arrTiles[i];
				tile.update();
			}
		}
	}
}