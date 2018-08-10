class Director {
	private static instance: Director;
	private static _Caches: any = {};
	public currentScreen: BaseScene;
	public constructor() {
		egret.log("director", Director.instance);
		if (Director.instance)
			throw new Error("只允许实例化一次！")
	}

	public static getInstance(): Director {
		if (!this.instance) {
			this.instance = new Director();
		}
		return this.instance;
	}

	public runWithCache(key: string, ref: any, args: any[] = null) {
		let scene: BaseScene = Director._Caches[key];
		if (scene) {
			this.runWithScene(scene, args);
		}
		else {
			scene = new ref();
			Director._Caches[key] = scene;
			this.runWithScene(scene, args);
		}
	}

	public clearCache() {
		Director._Caches = {};
	}

	public runWithScene(scene: BaseScene, args: any[] = null) {
		var self = this;
		function freeCurrentScreen() {
			self.currentScreen.free();
			self.currentScreen = null;
			self.runWithScene(scene, args);
		}
		if (scene != null) {
			scene.initialize();
		}
		if (this.currentScreen != null) {
			this.currentScreen.hide(freeCurrentScreen);
			return;
		}
		if (scene != null) {
			this.currentScreen = scene;
			this.currentScreen.show(null, args);
		}
	}
}