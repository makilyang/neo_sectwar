module utils {
    export class EffectDmg {
        public static members: EffectDmg[] = [];
        public exists: boolean;
        public view: fairygui.GComponent;
        public key: string;
        public parent: DyEngine.DyObject;
        private _t0: fairygui.Transition;
        private _tf: fairygui.GTextField;
        public constructor() {

        }

        public create(parent: DyEngine.DyObject, dmg: number) {
            if (this.view == null) {
                this.view = fairygui.UIPackage.createObject("tdui1", "伤害数字").asCom;
                this._tf = this.view.getChild("n0").asTextField;
                this._t0 = this.view.getTransition("t0");
            }
            this.exists = true;
            this._tf.text = "-" + dmg;
            fairygui.GRoot.inst.addChild(this.view);
            this._t0.play(() => {
                this.kill();
            });
            // mc.gotoAndPlay(1);
            // mc.once(egret.Event.COMPLETE, (e: egret.Event) => {
            // 	this.kill();
            // }, this);			
            // parent.addChild(mc);
            this.parent = parent;
            this.view.x = this.parent.x;
            this.view.y = this.parent.y;
        }


        public kill() {
            // this.parent.removeChild(this.clip);
            fairygui.GRoot.inst.removeChild(this.view);
            this.exists = false;
        }

        public static make(parent: DyEngine.DyObject, dmg: number, ox: number = 0, oy: number = 0): EffectDmg {
            let base: EffectDmg = EffectDmg.getAvail();
            if (base == null) {
                base = new EffectDmg;
                EffectDmg.members.push(base);
            }
            base.create(parent, dmg);
            // base.clip.x = ox;
            // base.clip.y = oy;
            return base;
        }

        public static getAvail(): EffectDmg {
            var o: EffectDmg;
            var n: number = EffectDmg.members.length;
            var i: number = 0;
            while (i < n) {
                o = EffectDmg.members[i];
                if (o != null && !o.exists) {
                    return o;
                }
                i++;
            }
            return null;
        }

        // public update(val: number, max: number) {
        //     if (this.parent) {
        //         this.view.value = val;
        //         this.view.max = max;
        //     }
        // }
    }
}