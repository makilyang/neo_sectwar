module utils {
    export class EffectFlash {
        public static members: EffectFlash[] = [];
        public exists: boolean;
        public clip: egret.MovieClip;
        public key: string;
        public type: number = 0;//0上升消失
        public completed: boolean = false;
        public events: DyEngine.DyEvent;
        public constructor() {
            this.events = new DyEngine.DyEvent();
        }

        public create(ax: number, ay: number, res: string, clip: string) {
            let mc;
            if (this.clip == null) {
                let mcTexture = RES.getRes(res + "_png");
                let mcData = RES.getRes(res + "_json");

                var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
                mc = new egret.MovieClip(mcDataFactory.generateMovieClipData(clip));
                mc.touchEnabled = false;
                this.key = res + "_" + clip;
                this.clip = mc;
            }
            else
                mc = this.clip;
            this.events.clean();
            this.completed = false;
            this.exists = true;
            mc.gotoAndPlay(1);
            mc.alpha = 1;

            mc.addEventListener(egret.Event.ENTER_FRAME, this.onUpdate, this);
            mc.once(egret.Event.COMPLETE, (e: egret.Event) => {
                this.events.send("end", this);
                if (this.type > 0)
                    this.kill();
                this.completed = true;
            }, this);
            G.sWorld.addChild(mc);
            // this.parent = parent;
        }

        public onUpdate() {
            let label = this.clip.currentFrameLabel;
            if (label)
            {
                let arr = label.split(':');
                this.events.send("onlab",arr[0],arr[1]);
            }
                
            if (this.type == 0) {
                this.clip.y -= 3;
                if (this.completed) {
                    this.clip.alpha -= 0.05;
                    if (this.clip.alpha <= 0) {
                        this.kill();
                    }
                }
            }
            else if (this.completed) {
                this.kill();
            }

        }

        public kill() {
            G.sWorld.removeChild(this.clip);
            this.clip.stop();
            this.clip.removeEventListener(egret.Event.ENTER_FRAME, this.onUpdate, this);
            this.exists = false;
            this.events.clean();
        }

        public static make(res: string, clip: string, ox: number, oy: number): EffectFlash {
            let base: EffectFlash = EffectFlash.getAvail(res + "_" + clip);
            if (base == null) {
                base = new EffectFlash;
                EffectFlash.members.push(base);
            }
            base.create(ox, oy, res, clip);
            base.clip.x = ox;
            base.clip.y = oy;
            return base;
        }

        public static getAvail(key: string): EffectFlash {
            var o: EffectFlash;
            var n: number = EffectFlash.members.length;
            var i: number = 0;
            while (i < n) {
                o = EffectFlash.members[i];
                if (o != null && !o.exists && o.key == key) {
                    return o;
                }
                i++;
            }
            return null;
        }
    }
}