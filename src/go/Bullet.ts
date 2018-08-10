module go {
    import DyMath = DyEngine.DyMath;
    export class Bullet extends DyEngine.DyObject {
        public static members: Bullet[] = [];
        public tower: eTower;
        public exists: boolean;
        public clip: egret.MovieClip;
        public key: string;
        public target: DyEngine.DyObject;
        private _layer: number;
        private range: number = 10;
        public damage: number = 0;
        public dt: number = 0;
        public crit: number = 0;
        public speed: number = 320;
        public tx: number = 0;
        public ty: number = 0;
        private _life: number = 3;
        public constructor() {
            super();
        }

        public create(res: string, clip: string) {
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
            this.exists = true;
            this._layer = core.GameWorld.LAYER_OBJECTS;
            this.animator.addAnimation("def", mc)
            this.animator.gotoAndStop(1);
            this.animator.switchAnimation("def");
            if (!this.Collider)
                this.Collider = DyEngine.DyShape.make(this, 0, 0, 2);
            this.Collider.interestDist = this.range;
            this.Collider.contactEvent.on("collision", this.addContact, this);
            this.animator.x = this.x;
            this.animator.y = this.y;
            this._life = 3;
            G.sWorld.addToLayer(this._layer, this);
            G.phys.addShape(this.Collider);
        }

        public addContact(self: DyEngine.DyShape, s1: DyEngine.DyShape) {
            if (!this.target || this.target.dead)
                return;
            super.addContact(self, s1);
            let t = s1.udata;
            let dist = DyEngine.DyMath.distance(this.x, this.y, t.x, t.y);
            if (t instanceof BasicUnit && dist < this.range && this.target == t) {
                this.target = t;
                let dmg = this.damage;
                if (t.typeDef != this.dt)
                    dmg = Math.round(this.damage * 0.5);
                t.hurt(dmg, this.crit, this.tower);
                this.kill();
            }
        }
        private _vx: number;
        private _vy: number;
        private _deg: number = 0;
        public update() {
            if (this.target && !this.target.dead) {
                this.tx = this.target.x;
                this.ty = this.target.y;
                let speed = this.speed;
                let ang: number = DyMath.getAngle(this.x, this.y, this.tx, this.ty);
                this._vx = Math.cos(ang) * speed
                this._vy = Math.sin(ang) * speed;
                this._deg = ang * 180 / Math.PI;
            }
            this.velocity.x = this._vx;
            this.velocity.y = this._vy;
            this.angle = this._deg;
            this._life -= 2 * G.elapsed;
            if (this._life < 0)
                this.kill();
            super.update();
        }

        public kill() {
            // this.parent.removeChild(this.clip);
            if (!this.exists)
                return;
            this.dead = true;
            this.Collider.contactEvent.clean();
            G.phys.removeShape(this.Collider);
            this.clip.stop();
            this.exists = false;
            G.sWorld.removeFromLayer(this._layer, this);
        }

        public free() {
            this.kill();
            this.clip = null;
            this.Collider = null;
        }

        public static make(target: DyEngine.DyObject, res: string, clip: string, ox: number, oy: number): Bullet {
            let base: Bullet = Bullet.getAvail(res + "_" + clip);
            if (base == null) {
                base = new Bullet;
                Bullet.members.push(base);
            }
            base.target = target;
            base.x = ox;
            base.y = oy;
            base.tx = target.x;
            base.ty = target.y;
            base.create(res, clip);
            return base;
        }

        public static getAvail(key: string): Bullet {
            var o: Bullet;
            var n: number = Bullet.members.length;
            var i: number = 0;
            while (i < n) {
                o = Bullet.members[i];
                if (o != null && !o.exists && o.key == key) {
                    return o;
                }
                i++;
            }
            return null;
        }

        public static destory() {
            var o: Bullet;
            var n: number = Bullet.members.length;
            var i: number = 0;
            while (i < n) {
                o = Bullet.members[i];
                if (o != null) {
                    o.free();
                }
                i++;
            }
            Bullet.members.length = 0;
        }
    }
}