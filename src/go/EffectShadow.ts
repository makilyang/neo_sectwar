module gobjs {
    export class EffectShadow extends egret.Shape {
        private static members: any[] = [];
        public exists: boolean;
        public layer: number;
        public typeid: number;
        public constructor() {
            super();
        }

        public create(r: number): void {
            this.exists = true;
            // this.texture = RES.getRes("shadow_png");
            this.graphics.beginFill(0x000000, 0.3);
            this.graphics.lineStyle(0.1, 0xcccccc);
            if (this.typeid == 0)
                this.graphics.drawEllipse(-15, -2.5, 15 * 2, 2.5 * 2);
            else
                this.graphics.drawCircle(0, 0, r);
            this.graphics.endFill();
        }

        public static make(typeid: number, ax: number, ay: number, rg: number = 1): EffectShadow {
            let base: EffectShadow = EffectShadow.getAvail(typeid);
            if (base == null) {
                base = new EffectShadow;
                EffectShadow.members.push(base);
            }
            base.typeid = typeid;
            base.create(rg);
            base.x = ax;
            base.y = ay;
            return base;
        }

        public kill() {
            if (this.parent)
                this.parent.removeChild(this);        
            this.exists = false;    
        }

        public static getAvail(type: number): EffectShadow {
            var o: EffectShadow;
            var n: number = EffectShadow.members.length;
            var i: number;
            while (i < n) {
                o = EffectShadow.members[i];
                if (o != null && !o.exists && o.typeid == type) {
                    return o;
                }
                i++;
            }
            return null;
        }
    }
}