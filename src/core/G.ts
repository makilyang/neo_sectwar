class G {
	public static SAVEKEY: string = "YSfyz24399_2"
	public static DELAY: number = 30;
	public static director: Director;
	public static elapsed: number = 0.02;
	public static timeScale: number = 0.5;
	// public static ScaleW: number = 1;
	// public static ScaleH: number = 1;
	public static sWorld: core.GameWorld;
	public static gLevel: number = 0;
	public static uimgr: observer.UIManager;
	/**
	 * 最大每帧秒数
	 */
	public static maxElapsed: number = 0.0333333;
	public static scroll: egret.Point;
	public static width: number;
	public static height: number;
	public static widthHalf: number;
	public static heightHalf: number;
	public static bgMuz: egret.Sound;
	public static bgSoundChancel: egret.SoundChannel;
	public static figMuz: egret.Sound;
	public static figSndChancel: egret.SoundChannel;
	public static resLoaded: boolean;
	public static nickName: string;
	public static token: string;
	public static buffDelay: number = 0;
	public static gold: number = 0;
	public static sd: any;
	public static phys: DyEngine.DyPhysics;
	public static scale: number;
	public static isMobile: boolean = false;
	public static userInfo: any;

	public static SHOP: any = {
		"zs002": { g: 100 }, "zs003": { req: "zs002", g: 200 }, "zs004": { req: "zs003", g: 300 }, "zs005": { req: "zs004", g: 400 },
		"yx002": { g: 100 }, "yx003": { req: "yx002", g: 200 }, "yx004": { req: "yx003", g: 300 }, "yx005": { req: "yx004", g: 400 },
		"ck002": { g: 100 }, "ck003": { req: "ck002", g: 200 }, "ck004": { req: "ck003", g: 300 }, "ck005": { req: "ck004", g: 400 },
		"fs002": { g: 100 }, "fs003": { req: "fs002", g: 200 }, "fs004": { req: "fs003", g: 300 }, "fs005": { req: "fs004", g: 400 }
	};
	public static TALENT: any = {
		"zs0": { req: 0, g: 1, title: "增加伤害" }, "zs1": { req: 1, title: "增加范围", g: 2 }, "zs2": { req: 2, title: "增加速度", g: 3 }, "zs3": { req: 3, title: "减少造价", g: 4 },
		"yx0": { req: 0, g: 1, title: "增加伤害" }, "yx1": { req: 1, title: "增加范围", g: 2 }, "yx2": { req: 2, title: "增加速度", g: 3 }, "yx3": { req: 3, title: "减少造价", g: 4 },
		"ck0": { req: 0, g: 1, title: "增加伤害" }, "ck1": { req: 1, title: "增加范围", g: 2 }, "ck2": { req: 2, title: "增加速度", g: 3 }, "ck3": { req: 3, title: "减少造价", g: 4 },
		"fs0": { req: 0, g: 1, title: "增加伤害" }, "fs1": { req: 1, title: "增加范围", g: 2 }, "fs2": { req: 2, title: "增加速度", g: 3 }, "fs3": { req: 3, title: "减少造价", g: 4 }
	};

	public static init(width: number, height: number, stagew: number, stageh: number) {
		this.director = new Director;
		this.scroll = new egret.Point();

		this.width = width;
		this.height = height;
		this.widthHalf = width * 0.5;
		this.heightHalf = height * 0.5;
		// this.ScaleW = width / 422;
		// this.scale = stageh / height;	
		let s1 = stagew / width;
		let s2 = stageh / height;
		if (s1 < s2)
			this.scale = s1;
		else
			this.scale = s2;

		// if (scale != 1)
		// 	this.width = width * scale;
		this.gold = 500;

		this.userInfo = null;
		this.uimgr = observer.UIManager.getInstance();
		this.phys = new DyEngine.DyPhysics();
		let str = egret.localStorage.getItem(G.SAVEKEY);
		if (str)
			this.sd = JSON.parse(str);
		egret.log("screen size:", width + "x" + height, "Scale:" + this.scale);//this.ScaleH, this.ScaleW+this.sd);		
		if (this.sd == null) {
			this.sd = { ddb: 0, star: 0, rec: {}, shop: [], tal: {}, score: 0, tt: 0, tm: 0 };
		}
		let tm = new Date(DyEngine.DyMath.toNumber(this.sd.tm));
		let today = new Date();

		if (tm.getDate() != today.getDate() && tm.getMonth() != today.getMonth()) {
			this.sd.tm = today.getTime();
			this.sd.tt = 0;
		}
		// this.sd = { ddb: 1000, star: 1000, rec: {}, shop: [], tal: {}, score: 0 };
		// this.sd.star = 100000;
		// this.sd.ddb = 100000;
		// this.sd.rec["m001"]= [1,1,1,0,1,1];
		// this.sd.rec["m002"]= [1,1,1,0,1,1];
		// this.sd.rec["m003"]= [1,1,1,0,1,1];
		// this.sd.rec["m004"]= [1,1,1,0,1,1];
		// this.sd.rec["m005"]= [1,1,1,0,1,1];
		// this.sd.rec["m006"]= [1,1,1,1,1,1];
		// this.sd.rec["m007"]= [1,1,1,1,1,1];
		// this.sd.rec["m008"]= [1,1,1,1,1,1];
		this.gLevel = 0;
	}
/*	public static _mcDataFactory: egret.MovieClipDataFactory;
	public static getCommonMovieClip(key: string): egret.MovieClip {
		if (G._mcDataFactory == null) {
			let mcTexture = RES.getRes("common_png");
			let mcData = RES.getRes("common_json");
			var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
			G._mcDataFactory = mcDataFactory;
		}
		let role: egret.MovieClip = new egret.MovieClip(G._mcDataFactory.generateMovieClipData(key));
		return role;
	}

	public static _towerDataFactory: egret.MovieClipDataFactory;

	public static initTowerFactory() {
		if (G._towerDataFactory == null) {
			let mcTexture = RES.getRes("ta_png");
			let mcData = RES.getRes("ta_json");
			var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
			G._towerDataFactory = mcDataFactory;
		}
	}

	public static getTowerClip(key: string): egret.MovieClip {
		if (G._towerDataFactory == null) {
			return null;
		}
		let role: egret.MovieClip = new egret.MovieClip(G._towerDataFactory.generateMovieClipData(key));
		return role;
	}

	public static _unitDataFactory: egret.MovieClipDataFactory;

	public static getUnitClip(key: string): egret.MovieClip {
		if (this._unitDataFactory == null) {
			let mcTexture = RES.getRes("guai_png");
			let mcData = RES.getRes("guai_json");
			var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
			this._unitDataFactory = mcDataFactory;
		}
		let role: egret.MovieClip = new egret.MovieClip(this._unitDataFactory.generateMovieClipData(key));
		return role;
	}*/

	public static str_pad(str: string, len: number, padStr: string, type: string = "left"): string {
		var realLen: number = str.length;
		var padNum: number = len - realLen;
		var i: number = 0;
		for (i; i < padNum; i++) {
			str = padStr + str;
		}
		return str;
	}

	public static talent(t: string): number {
		let talobj = this.sd.tal;
		let v: number = DyEngine.DyMath.toNumber(talobj[t]);
		return v;
	}

	public static onceSnd(snd: string) {
		let sound: egret.Sound = new egret.Sound();
		sound.once(egret.Event.COMPLETE, function (e: egret.Event) {
			sound.play(0, 1);
		}, this);
		sound.load("resource/snd/" + snd + ".mp3");
	}
}