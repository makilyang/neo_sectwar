module go {
    import DyMath = DyEngine.DyMath;
    import DyEvent = DyEngine.DyEvent;
    export class BasicUnit extends DyEngine.DyObject {
        public static members: BasicUnit[] = [];
        public entry: string;
        public path: any[];
        public dh: number = 1;
        private _currentPath: number = 0;
        private _bar: utils.EffectBar;
        public dieEvent: DyEvent;
        public inAir: boolean = false;
        public speed: number = 10;
        public headx: number = 0;
        public heady: number = 1;
        public fotx: number = 0;
        public foty: number = 0;
        public gold: number = 0;
        public clip: egret.MovieClip;
        private _shadow: EffectShadow;
        public constructor() {
            super();
            this.dieEvent = new DyEvent;
        }

        public create(): void {
            // if (!this.clip)
            //     this.clip = G.getUnitClip(this.entry)
            this.animator.addAnimation("walk", this.clip);
            this.animator.switchAnimation("walk", true);
            this.animator.gotoAndPlay(1);
            this.animator.touchEnabled = false;
            this.animator.x = this.x;
            this.animator.y = this.y;
            if (!this.Collider)
                this.Collider = DyEngine.DyShape.make(this, 0, 0, 1, 0, 0);
            this.Collider.interestDist = 1;
            this.Collider.contactEvent.on("collision", this.addContact, this);
            G.phys.addShape(this.Collider);
            if (!this._shadow)
                this._shadow = EffectShadow.make(0, 0, 0);
            this.animator.addChildAt(this._shadow, 0);
            this.health = this.hpmax;
            this._currentPath = 0;
            this.exists = true;
            this.dead = false;
        }

        public static make(entry: string, ax: number, ay: number, hp: number): BasicUnit {
            let base: BasicUnit = BasicUnit.getAvail(entry);
            if (base == null) {
                base = new BasicUnit;
                BasicUnit.members.push(base);
            }
            let cfg = D.creeps[entry];
            base.entry = entry;
            base.typeDef = cfg.dt;
            base.inAir = (cfg.bt == 2);
            base.speed = cfg.spd;
            base.hpmax = hp;
            base.x = ax;
            base.y = ay;
            base.create();
            return base;
        }

        public kill() {
            if (!this.exists)
                return;
            super.kill();
            if (this._bar) {
                this._bar.kill();
                this._bar = null;
            }
            if (this._shadow) {
                this._shadow.kill();
                this._shadow = null;
            }
            G.sWorld.removeFromLayer(core.GameWorld.LAYER_OBJECTS, this);
            this.Collider.contactEvent.clean();
            G.phys.removeShape(this.Collider);
            if (this.health <= 0) {
                this.dieEvent.send("ondie", this, this.lastHiter);
                let hiter = this.lastHiter;
                let eff = utils.EffectFlash.make("common", "ghost", this.x, this.y);
                if (hiter && hiter instanceof gobjs.eTower && hiter.extargold > 0)
                    utils.EffectFlash.make("common", "gold", this.x, this.y);

            }
            else {
                this.dieEvent.send("onrun", this);
            }
            this.animator.stop();
            this.dieEvent.clean();
        }

        public free() {
            this.kill();
            this.Collider = null;
            this.clip = null;
        }

        public hurt(damage: number, crit: number, hiter: gobjs.eTower) {
            super.hurt(damage, crit, hiter);
            if (!this._bar)
                this._bar = utils.EffectBar.make(this, 0, 0);
        }

        public update() {
            // if (!this.exists)
            //     egret.log("i am not exits");
            super.update();
            if (this.dead) {
                this.kill();
                return;
            }
            if (this._bar)
                this._bar.update();
            let idx = this._currentPath;
            let p = this.path[idx];
            let ax: number = this.x;
            let ay: number = this.y;
            if (DyMath.equal(p.x, ax, 5) && DyMath.equal(p.y, ay, 5)) {
                // if (DyMath.equal(p.x * G.ScaleW, ax, 5 * G.ScaleW) && DyMath.equal(p.y * G.ScaleH, ay, 5 * G.ScaleH)) {
                idx++;
                if (idx < this.path.length) {
                    p = this.path[idx];
                    let speed = this.speed;
                    let ang: number = DyMath.getAngle(ax, ay, p.x, p.y);
                    this.velocity.x = Math.cos(ang) * speed
                    this.velocity.y = Math.sin(ang) * speed;
                    this._currentPath = idx;
                    if (this.velocity.x > 0)
                        this.scale.x = -1;
                    else
                        this.scale.x = 1;
                }
                else {
                    this.dead = true;
                    G.sWorld.hurt(this.dh);
                }
            }
        }

        public static getAvail(key: string): BasicUnit {
            var o: BasicUnit;
            var n: number = BasicUnit.members.length;
            var i: number = 0;
            while (i < n) {
                o = BasicUnit.members[i];
                if (o != null && !o.exists && o.entry == key) {
                    return o;
                }
                i++;
            }
            return null;
        }

        public static destory() {
            var o: BasicUnit;
            var n: number = BasicUnit.members.length;
            var i: number = 0;
            while (i < n) {
                o = BasicUnit.members[i];
                if (o != null) {
                    o.free();
                }
                i++;
            }
            BasicUnit.members.length = 0;
        }
    }
}