module go {
    export class eTower extends DyEngine.DyObject {
        public target: DyEngine.DyObject;
        private _cd: number = 0;
        public cfg: any;
        public damage: number = 0;
        public range: number = 100;
        public typeDamage: number = 1;
        public canAir: boolean = false;
        public delay: number = 1;
        public crit: number = 10;
        public maxtarget: number = 1;
        public extargold: number = 0;
        public cid: string;

        public busying: boolean;
        private _bar: utils.BuildBar;
        private _elpased: number = 0;
        private _shadow: EffectShadow;

        public constructor() {
            super();
            this.gravityEnable = false;
        }

        public create(): void {
            this._cd = 0;
            this.cid = this.entry.substr(0, 2);
            let tal = G.talent(this.cid);
            if (tal >= 1)
                this.damage = this.damage * 1.2;
            if (tal >= 2)
                this.range = this.range * 1.2;
            if (tal >= 3)
                this.delay = this.delay * 0.8;

            this.animator.addAnimation("idle", G.getTowerClip(this.entry));
            this.animator.addAnimation("attack", G.getTowerClip(this.entry + "g"));
            this.animator.switchAnimation("idle", true);
            // this.animator.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            this.animator.touchEnabled = true;
            this.animator.gotoAndPlay(1);
            this.animator.frameEvent.on("onlab", (prefix: string, ebody: string) => {
                // egret.log(prefix, ebody);
                if (prefix == "ef") {
                    var xl: number = ebody.indexOf('#');
                    var anim: string[] = ebody.substring(0, xl).split(":");
                    var posStr: any[] = ebody.substring(xl + 1).split(",");
                    let ax: number = posStr[0];
                    let ay: number = posStr[1];
                    utils.EffectClip.make(this.animator, anim[0], anim[1], ax, ay);
                }
                else if (prefix == "atk") {
                    this.doMelee();
                    this._cd = this.delay;
                }
                else if (prefix == "arc") {
                    let ary = ebody.split(',');
                    if (ary && ary.length == 3) {
                        this.doArcher(ary[0], Number(ary[1]), Number(ary[2]));
                        this._cd = this.delay;
                    }
                }
                else if (prefix == "mag") {
                    let ary = ebody.split(',');
                    if (ary && ary.length == 3) {
                        this.doFireBall(ary[0], Number(ary[1]), Number(ary[2]));
                        this._cd = this.delay;
                    }
                }
                else if (prefix == "snd") {
                    let sound: egret.Sound = new egret.Sound();
                    sound.once(egret.Event.COMPLETE, function (e: egret.Event) {
                        sound.play(0, 1);
                    }, this);
                    sound.load("resource/snd/" + ebody + ".mp3");
                }
            }, this.animator);
            this.animator.frameEvent.on("onend", this.onAniComplete, this)
            this._shadow = EffectShadow.make(0, this.x, this.y);
            this.animator.addChildAt(this._shadow, 0);
            this.Collider = DyEngine.DyShape.make(this, 0, 0, 100, 0, 0);
            this.Collider.interestDist = this.range;
            this.Collider.contactEvent.on("collision", this.addContact, this);
            G.phys.addShape(this.Collider);
        }

        private onAniComplete() {
            if (this._cd > 0 || this.target == null)
                this.animator.switchAnimation("idle");
            else if (this.target) {
                if (this.target.x < this.x) {
                    this.scale.x = -1;
                }
                else
                    this.scale.x = 1;
                this.animator.switchAnimation("attack");
                this.animator.gotoAndPlay(1);
            }
            // this.animator.gotoAndPlay(1);
        }


        public addContact(self: DyEngine.DyShape, s1: DyEngine.DyShape) {
            super.addContact(self, s1);
            let t = s1.udata;
            if (t instanceof BasicUnit) {
                if (t.inAir && !this.canAir)
                    return;
                let dist = DyEngine.DyMath.distance(this.x, this.y, t.x, t.y);
                if (dist < this.range && this.target == null) {
                    this.target = t;
                    // this.onAniComplete();
                    // if (this._cd <= 0) {
                    //     this.animator.switchAnimation("attack");
                    //     this.animator.gotoAndPlay(1);
                    // }
                }
            }
        }


        public static make(entry: string, ax: number, ay: number): eTower {
            let base: eTower = new eTower();
            base.entry = entry;
            let cfg = D.towers[entry];
            base.damage = cfg.dmg;
            base.range = cfg.range;
            base.typeDamage = cfg.dt;
            base.canAir = (cfg.air == 2);
            base.delay = Number(cfg.spd);
            base.crit = Number(cfg.crit);
            base.maxtarget = Number(cfg.amount);
            base.extargold = Number(cfg.extra);
            base.create();
            base.x = ax;// *G.ScaleW;
            base.y = ay;// *G.ScaleH;
            return base;
        }

        public startBuild() {
            if (this._bar == null) {
                let bar = utils.BuildBar.make(this, 0, 0);
                this._bar = bar;
                this.busying = true;
            }
        }

        // private _shape: egret.Shape;
        // public showRange(hide: boolean = false) {
        //     if (this._shape == null) {

        //         let s = new egret.Shape();
        //         s.graphics.beginFill(0x000000, 0.3);
        //         s.graphics.lineStyle(0.1, 0xcccccc);
        //         let ax: number = -this.range;// * 0.5;
        //         s.graphics.drawCircle(0, 0, this.range);
        //         s.graphics.endFill();
        //         s.touchEnabled = false;
        //         this._shape = s;
        //     }
        //     if (hide && this.animator.contains(this._shape))
        //         this.animator.removeChild(this._shape);
        //     else
        //         this.animator.addChild(this._shape);
        // }



        private doFireBall(t: string, ox: number, oy: number) {
            if (!this.target || this.target.dead)
                return;
            let bullet: Bullet = Bullet.make(this.target, "ta", "fireball", this.x + ox * this.scale.x, this.y + oy);
            bullet.damage = this.damage;
            bullet.crit = this.crit;
            bullet.tower = this;
            bullet.dt = this.typeDamage;
        }
        private doArcher(t: string, ox: number, oy: number) {
            if (!this.target || this.target.dead)
                return;
            let bullet: Bullet = Bullet.make(this.target, "ta", "arrow1", this.x + ox * this.scale.x, this.y + oy);
            bullet.damage = this.damage;
            bullet.crit = this.crit;
            bullet.tower = this;
            bullet.dt = this.typeDamage;
        }
        private doMelee() {
            // egret.log("doMeloo", this.target);
            let t = this.target;
            if (t && !t.dead) {
                let dmg = this.damage;
                if (t.typeDef != this.typeDamage)
                    dmg = Math.round(this.damage * 0.5);
                t.hurt(dmg, 0, this);
            }
        }

        private outfig() {
            this.target = null;
            // this.animator.switchAnimation("idle", true);
            // this.animator.gotoAndPlay(1);
            //  this.scale.x = 1;
        }


        public update() {
            super.update();
            let target = this.target;
            this._cd = this._cd - 2 * G.elapsed;
            if (target) {
                if (target.dead) {
                    this.outfig();
                }
                else {

                    let dist = DyEngine.DyMath.distance(this.x, this.y, target.x, target.y);
                    if (dist > this.range)
                        this.outfig();
                }
            }
            if (this.busying) {
                this._elpased += G.elapsed * 2;
                let b = this._bar;
                if (b) {
                    b.update(this._elpased, 1);
                }
                if (this._elpased > 1) {
                    this.busying = false;
                    this._elpased = 0;
                    this._bar.kill();
                    this._bar = null;
                    this.events.send("build", this);
                }
            }
        }

        public kill() {
            super.kill();
            if (this._shadow)
                this._shadow.kill();
        }

        private onTouchEnd(e: egret.TouchEvent): void {
            gui.BuildMenu.show(this, this.x, this.y);
        }

    }
}