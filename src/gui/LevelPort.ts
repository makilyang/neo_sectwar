module gui {
	export class LevelPort extends fairygui.GComponent {
		public static url: string = "ui://lvir3vtdc7ly13";
		private _c1: fairygui.Controller;
		private _c2: fairygui.Controller;
		private _mapid: string;
		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);
			this._c1 = this.getController("c1");
			this._c2 = this.getController("c2");
			this.addClickListener(this.onEnter, this);
		}

		public setup_afterAdd(xml: any): void {
			super.setup_afterAdd(xml);
			// G.sd.rec["m004"] = [1,1,1,1,1,1];
			let n = this._name;
			let mf = D.map[n];
			if (!mf)
			{
				this._c1.selectedIndex =1;
				return;
			}
			this._mapid = n;

			let sd = {rec:{}};
			let aryreq: number = sd.rec[mf.req];
			if (aryreq) {
				if (aryreq[0] == 0) {
					this._c1.selectedIndex = 1;
				}
				else {
					this._c1.selectedIndex = 0;
				}
			}
			else if (mf.req == null) {
				this._c1.selectedIndex = 0;
			}
			else
				this._c1.selectedIndex = 1;
			let aryme = G.sd.rec[n];
			if (aryme) {
				let math = DyEngine.DyMath;
				this._c1.selectedIndex = 2;//存在记录就是已经通关
				if (Number(aryme[5]) > 0) {
					this._c2.selectedIndex = 3;
					if (math.toNumber(aryme[8]) == 0) {
						this.getTransition("t0").play();
						aryme[8] = 1;
					}
				}
				else if (Number(aryme[4]) > 0) {
					this._c2.selectedIndex = 2;
					if (math.toNumber(aryme[7]) == 0) {
						this.getTransition("t0").play();
						aryme[7] = 1;
					}
				}
				else if (Number(aryme[3]) > 0) {
					this._c2.selectedIndex = 1;
					if (math.toNumber(aryme[6]) == 0) {
						this.getTransition("t0").play();
						aryme[6] = 1;
					}
				}
			}
			else
				this._c2.selectedIndex = 0;
		}

		private onEnter(e: egret.Event): void {
			if (this._c1.selectedIndex == 1)
				return;
			EnterUI.make(100, 100, this._mapid);
		}
	}
}