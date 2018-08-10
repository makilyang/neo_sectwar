module utils {
    export class EffectRange extends egret.Shape {
        private static inst: EffectRange;
        public exists: boolean;
        public layer: number;
        public range: number;
        public constructor() {
            super();
        }


        public create(): void {
            this.exists = true;
            // this.texture = RES.getRes("shadow_png");
            let gh = this.graphics;
            gh.clear();
            gh.beginFill(0x000000, 0.3);
            gh.lineStyle(0.1, 0xcccccc);
            // gh.drawEllipse(-15, -2.5, 15 * 2, 2.5 * 2);
            gh.drawCircle(0, 0, this.range);
            gh.endFill();
            this.touchEnabled = false;
        }

        public static make(range: number, ax: number, ay: number): EffectRange {
            let base: EffectRange = EffectRange.inst;
            if (base == null) {
                base = new EffectRange;
                EffectRange.inst = base;
            }
            base.range = range;
            base.create();
            base.x = ax;
            base.y = ay;
            G.sWorld.addChild(base);
            return base;
        }

        public static hide() {
            let inst = EffectRange.inst;
            if (G.sWorld.contains(inst))
                G.sWorld.removeChild(inst);
        }
    }
}