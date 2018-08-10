module core {
	export class Buff {
		public entry: string;
		public duration: number = 0;
		public period: number = 1;
		public hurt: number = 0;
		public faint: number = 0;
		public dead: boolean = false;
		private _period: number = 0;
		public target: DyEngine.DyObject;
		public constructor() {
		}


		public static make(target: DyEngine.DyObject, entry: string): Buff {
			let b: Buff = new Buff();
			b.entry = entry;
			b.target = target;
			return b;
		}

		public create() {
			this._period = this.period;

			if (this.target)
				this.target.faintTime = this.faint;
		}

		public update() {
			if (this.target == null || this.dead) {
				this.dead = true;
				if (this.target && this.target.buff)
					this.target.buff = null;
				return;
			}
			let dura = this.duration;
			let per = this._period;
			// let ft = this.faint;
			dura = dura - 2* G.elapsed;
			this.duration = dura;
			per = per -  2 * G.elapsed;
			this._period = per;
			// ft = ft - G.elapsed;
			// this.faint = ft;
			if (dura < 0)
				this.dead = true;
			else if (per < 0) {
				this._period = this.period;
				if (this.hurt > 0) {
					this.target.hurt(this.hurt, 0, null);
					utils.EffectDmg.make(this.target,this.hurt);
				}
			}
			// else {
			// 	this.target.faintTime = ft;
			// }
		}
	}
}