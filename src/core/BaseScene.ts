class BaseScene {

	protected _cb: Function;
	protected _initialized: Boolean;

	public constructor() {
	}

	public initialize() {
		this._initialized = true;
	}

	public show(cb: Function = null, args: any[] = null) {
		this.initialize();
		this._cb = cb;
		this.doCallback();
	}

	/**
	 * 暂时隐藏
	 *
	 */
	public hide(cb: Function = null) {
		this._cb = cb;
		this.doCallback();
	}

	/**
	 * 彻底清理
	 *
	 */
	public free() {
		this._initialized = false;
	}

	protected doCallback() {
		if (this._cb != null) {
			this._cb.apply(this);
			this._cb = null;
		}
	}
}