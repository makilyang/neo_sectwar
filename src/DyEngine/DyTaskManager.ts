module DyEngine {
	export class DyTaskManager implements IUpdate {
		protected _started: boolean = false;
		protected _tasks: DyNodeList;
		// protected  _processor:AntProcessor;
		protected _pauseInterval: number = 0;
		protected _task: any;
		/**
		 * 是否允许循环任务 
		 */
		protected _cycle: boolean = false;
		protected _pause: boolean = false;
		public onComplete: Function = null;
		protected _result: boolean;

		private _childs: DyTaskManager[];

		public constructor() {
			this._tasks = new DyNodeList();
			this._childs = [];
		}

		public get size(): number {
			return this._tasks.size;
		}
		/**
		 * 添加阻塞任务,不返回ture,一直执行 
		 * @param func
		 * @param args
		 * @param ignoreCycle
		 * 
		 */
		public addTask(func: Function, args: any[] = null, sender: any = null, ignoreCycle: Boolean = false): void {
			this._tasks.push({ func: func, args: args, ignoreCycle: ignoreCycle, sender: sender });
			this.start();
		}

		public clear(): void {
			this.stop();
			this._tasks.clear();
			this._pauseInterval = 0;
		}

		protected stop(): void {
			if (this._started) {
				// _processor.remove(this);
				this._started = false;
			}
		}

		public addPause(delay: Number, ignoreCycle: Boolean = false): void {
			this.addTask(this.doPause, [delay], this, ignoreCycle);
		}
		/**
		 * 任务如果没有返回TRUE,是否放弃插入到任务队列尾部
		 * @param ignoreCycle:取消任务循环
		 * 
		 */
		public nextTask(ignoreCycle: Boolean = false): void {
			if (this._cycle && !ignoreCycle) {
				this._tasks.push(this._tasks.shift());
			}
			else {
				this._tasks.shift();
			}
		}

		public start(): void {
			if (!this._started) {
				// this._processor.add(this);
				this._started = true;
				this._pause = false;
			}
		}
		/**
		 * 添加即时返回的任务,不等待执行结果
		 * @param func
		 * @param args
		 * @param ignoreCycle
		 * 
		 */
		public addInstantTask(func: Function, args: any[] = null, sender: any = null, ignoreCycle: Boolean = false): void {
			this._tasks.push({ func: func, args: args, ignoreCycle: ignoreCycle, instant: true, sender: sender });
			this.start();
		}

		/**
		 * 往任务队列的开头插入一个优先任务 
		 * @param func
		 * @param args
		 * @param ignoreCycle
		 * 
		 */
		public addUrgentTask(func: Function, args: any[] = null, sender: any = null, ignoreCycle: Boolean = false): void {
			this._tasks.unshift({ func: func, args: args, ignoreCycle: ignoreCycle, sender: sender });
			this.start();
		}

		public addUrgentInstantTask(func: Function, args: any[] = null, sender: any = null, ignoreCycle: Boolean = false): void {
			this._tasks.unshift({ func: func, args: args, ignoreCycle: ignoreCycle, instant: true, sender: sender });
			this.start();
		}

		public waitChilds(ignoreCycle: Boolean = false): void {
			this.addTask(this.allChildCompleted, [], this, ignoreCycle);
		}

		public addChild(tm: DyTaskManager) {
			tm.onComplete = () => {
				let i = this._childs.indexOf(tm);
				if (i > -1)
					this._childs.splice(i, 1);
			};
			this._childs.push(tm);
		}

		private allChildCompleted() {
			if (this._childs.length == 0) {
				return true;
			}
			return false;
		}

		public toString(): String {
			return "{DyTaskManager [cycle: " + this._cycle + ", numTasks: " + this._tasks.size + ", started: " + this._started + ", pause: " + this._pause + "]}";
		}

		private doPause(delay: Number): Boolean {
			this._pauseInterval = this._pauseInterval + 2 * G.elapsed;
			if (this._pauseInterval >= delay) {
				this._pauseInterval = 0;
				return true;
			}
			return false;
		}

		public set pause(value: Boolean) {
			if (value && !this._pause) {
				if (this._started) {
					// _processor.remove(this);
				}
				this._pause = true;
			}
			else {
				if (this._started) {
					// this._processor.add(this);
				}
				this._pause = false;
			}
		}

		public get pause(): Boolean {
			return this._pause;
		}

		public get isRunning(): Boolean {
			return this._started && !this._pause;
		}

		public update(): void {

			if (this._tasks.first != null) {
				this._task = this._tasks.first.data;
			}
			else {
				this._task = null;
			}
			if (this._task != null && this._started) {
				this._result = this._task.func.apply(this._task.sender, this._task.args);
				if (this._task.instant || this._result) {
					this.nextTask(this._task.ignoreCycle);
				}
			}
			else {
				this.stop();
				if (this.onComplete != null) {
					this.onComplete.apply(this);
				}
			}
			let arr = this._childs;
			arr.forEach((val, idx, array) => {
				// egret.log(val, idx, array);
				if (val.isRunning)
					val.update();
			});
		}
	}
}