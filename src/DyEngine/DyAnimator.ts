module DyEngine {
	export class DyAnimator extends egret.DisplayObjectContainer {
		private _animations: Object;
		public currentAnimationKey: string;
		private _currentAnimation: egret.MovieClip;
		private _images: Object;
		public frameEvent: DyEvent;
		public uObj:DyObject;
		public constructor() {
			super();
			this._animations = {};
			this._images = {};
			this.frameEvent = new DyEvent();
		}

		public render(): void {

		}

		public addImage(key: string, texture: egret.Texture): void {

			let result = this._images[key];
			if (result == null) {
				result = new egret.Bitmap;
				this._images[key] = result;
				this.addChild(result);
			}
			result.texture = texture;
		}

		public removeImage(key: string): void {
			let result = this._images[key];
			if (result != null) {
				this._images[key] = null;
				this.removeChild(result);
			}
		}

		public addAnimation(key: string, clip: egret.MovieClip): void {
			// clip.
			this._animations[key] = clip;
			// clip.stop();
			// clip.addEventListener(egret.MovieClipEvent.ENDED, this.onFrameLabel, this);
		}

		// protected onFrameLabel(e: egret.MovieClipEvent) {
		// 	this.frameEvent.send("onend");
		// }

		public switchAnimation(key: string, force: boolean = false): void {

			if (this.currentAnimationKey == key && !force)
				return;
			let mc: egret.MovieClip = this._animations[key];
			if (this._currentAnimation) {
				this.removeChild(this._currentAnimation);
			}
			this._currentAnimation = mc;
			if (this._currentAnimation) {
				this.currentAnimationKey = key;
				this.addChild(mc);
				mc.play();
			}

		}

		public gotoAndPlay(frame: number, repeat: number = -1): void {
			if (this._currentAnimation)
				this._currentAnimation.gotoAndPlay(frame, repeat);
		}

		public gotoAndStop(frame: number, repeat: number = -1): void {
			if (this._currentAnimation)
				this._currentAnimation.gotoAndStop(frame);
		}

		public play(): void {
			if (this._currentAnimation)
				this._currentAnimation.play(-1);
		}

		public stop(): void {
			if (this._currentAnimation)
				this._currentAnimation.stop();
		}

		public update(): void {
			let frameLab: string;
			let ani = this._currentAnimation;
			if (ani) {
				frameLab = ani.currentFrameLabel;
				if (ani.currentFrame == ani.totalFrames) {
					this.frameEvent.send("onend");
				}
			}
			if (frameLab) {
				let eStr;
				let idx: number;
				let ebody;
				let prefix;
				let events: string[] = frameLab.split(';');
				for (let i = 0; i < events.length; i++) {
					eStr = events[i];
					idx = eStr.indexOf(":");
					prefix = eStr.substr(0, idx);
					ebody = eStr.substr(idx + 1);
					this.frameEvent.send("onlab", prefix, ebody);
				}
			}
		}

		public kill() {
			if (this._currentAnimation)
				this._currentAnimation.stop();
			let mc: egret.MovieClip;
			let cont = this._animations;
			for (let key in cont) {
				mc = cont[key];
				if (mc) {
					mc.stop();
					// mc.removeEventListener(egret.MovieClipEvent.FRAME_LABEL, this.onFrameLabel, mc);
				}
			}
			this._currentAnimation = null;
			this._animations = {};
			this._images = {};
			this.uObj = null;
		}
	}
}