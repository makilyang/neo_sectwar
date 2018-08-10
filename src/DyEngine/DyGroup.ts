module DyEngine {
	export class DyGroup extends DyObject {
		public  members:DyObject[];
		protected  _lastAngle:number = 0;
		public  allowRotation:boolean = false;
		protected _lastPosition:egret.Point;

		public constructor() {			
			super();
			this._lastPosition = new egret.Point();
			this.members = [];
			this.isGroup = true;
		}


		public get size():number
		{
			return this.members.length;
		}

		/**
		 * 删除组中对象
		 * @param obj
		 * @param 从成员列表中删除元素，而不是置空
		 * @return 删除的对象
		 *
		 */
		public remove(obj:DyObject, splice:Boolean = false):DyObject
		{
			var index:number = this.members.indexOf(obj);
			if (index > -1)
			{
				this.members[index] = null;
				if (splice)
				{
					this.members.splice(index, 1);
				}
			}
			return obj;
		}

		public getObjectsByTag(tag:number, result:any[] = null):any[]
		{
			var o:DyObject;
			if (result == null)
			{
				result = [];
			}
			var n:number = this.members.length;
			var i:number;
			while (i < n)
			{
				o = this.members[i];
				if (o != null && o.tag == tag)
				{
					result[result.length] = o;
				}
				i++;
			}
			return result;
		}

		public update():void
		{			
			this.updateMotion();
			this.updateMembers();
			if (this.allowRotation)
			{
				this.rotateMembers();
			}
			this.saveOldPos();
		}

		/**
		 * 获取已经死亡的成员数
		 * @return
		 */
		public numDead():number
		{
			var o:DyObject;
			var num:number;
			var n:number = this.members.length;
			var i:number;
			while (i < n)
			{
				o = this.members[i];
				if (o != null && o.dead)
				{
					num++;
				}
				i++;
			}
			return num;
		}

		public rectQuery(ax1:number, ay1:number, ax2:number, ay2:number, result:any[] = null):any[]		
		{
			var o:DyObject;
			if (result == null)
			{
				result = [];
			}
			var n:number = this.members.length;
			var i:number;
			while (i < n)
			{
				o = this.members[i];
				if (o != null && o.exists && o.x > ax1 && o.x < ax2 && o.y > ay1 && o.y < ay2)
				{
					result[result.length] = o;
				}
				i++;
			}
			return result;
		}

		/**
		 * 清除成员列表
		 */
		public clearMembers():void
		{
			var n:number = this.members.length;
			var i:number;
			while (i < n)
			{
				this.members[i] = null;
				i++;
			}
			this.members.length = 0;
		}

		/**
		 * 根据标志获取对象
		 * @param tag
		 * @return
		 */
		public getByTag(tag:number):DyObject
		{
			var o:DyObject;
			var n:number = this.members.length;
			var i:number;
			while (i < n)
			{
				o = this.members[i];
				if (o != null && o.tag == tag)
				{
					return o;
				}
				++i;
			}
			return null;
		}

		/**
		 * 活跃成员数，非死亡成员
		 * @return
		 *
		 */
		public numLiving():number
		{
			var o:DyObject;
			var num:number;
			var n:number = this.members.length;
			var i:number;
			while (i < n)
			{
				o = this.members[i];
				if (o != null && o.exists && !o.dead)
				{
					num++;
				}
				i++;
			}
			return num;
		}

		protected updateMembers():void
		{
			var mx:number; //X轴的移动距离
			var my:number;		
			var o:DyObject;
			var moved:Boolean;
			//判断组的位置是否移动
			if (this.x != this._lastPosition.x || this.y != this._lastPosition.y)
			{
				moved = true;
				mx = this.x - this._lastPosition.x;
				my = this.y - this._lastPosition.y;				
			}
			var n:number = this.members.length;
			var i:number = 0;
			for (i; i < n; ++i)
			{
				o = this.members[i];
				if (o != null && o.exists)
				{
					if (moved)
					{
						//如果对象也是组
						if (o.isGroup)
						{
							o.reset(o.x + mx, o.y + my);
						}
						else
						{
							o.x = o.x + mx;
							o.y = o.y + my;							
						}
					}
					//活跃状态
					if (o.active)
						o.update();
				}
			}
		}

		/**
		 * 屏幕画布上的成员数
		 * @return
		 *
		 */
		public numOnScreen():number
		{
			var o:DyObject;
			var num:number;
			var n:number = this.members.length;
			var i:number;
			while (i < n)
			{
				o = this.members[i];
				if (o != null && o.exists && o.onScreen())
				{
					num++;
				}
				i++;
			}
			return num;
		}

		public swap(obj1:DyObject, obj2:DyObject):Boolean
		{
			var indexA:number = this.members.indexOf(obj1);
			var indexB:number = this.members.indexOf(obj2);
			if (indexA > -1 && indexB > -1)
			{
				this.members[indexA] = obj2;
				this.members[indexB] = obj1;
				return true;
			}
			return false;
		}

		/**
		 * 渲染成员
		 */
		public render():void
		{
			var o:DyObject;
			var n:number = this.members.length;
			var i:number;
			while (i < n)
			{
				o = this.members[i];
				if (o != null && o.exists && o.visible)
				{
					o.render();
				}
				i++;
			}
		}

		public getAlive(tag:number = 0):DyObject
		{
			var o:DyObject;
			var n:number = this.members.length;
			var i:number;
			while (i < n)
			{
				o = this.members[i];
				if (o != null && o.exists && !o.dead && o.tag == tag)
				{
					return o;
				}
				i++;
			}
			return null;
		}
		
		public getCount(tag:number = 0):number
		{
			var o:DyObject;
			var n:number = this.members.length;
			var i:number;
			var count:number;
			while (i < n)
			{
				o = this.members[i];
				if (o != null && o.tag == tag)
				{
					count++;
				}
				i++;
			}
			return count;
		}

		/**
		 * 获取成员列表中靠前的无效成员
		 * @return
		 */
		public getDead():DyObject
		{
			var o:DyObject;
			var n:number = this.members.length;
			var i:number;
			while (i < n)
			{
				o = this.members[i];
				if (o != null && o.dead)
				{
					return o;
				}
				i++;
			}
			return null;
		}

		public getExtant(tag:number = 0):DyObject
		{
			var o:DyObject;
			var n:number = this.members.length;
			var i:number;
			while (i < n)
			{
				o = this.members[i];
				if (o != null && o.tag == tag)
				{
					return o;
				}
				i++;
			}
			return null;
		}

		public contains(obj:DyObject):Boolean
		{
			return this.members.indexOf(obj) > -1 ? true : false;
		}

		/**
		 * 旋转成员
		 */
		protected rotateMembers():void
		{
			var diff:number;
			var point:egret.Point;
			var o:DyObject;
			var n:number;
			var i:number;
			if (this.angle != this._lastAngle)
			{
				diff = (this.angle - this._lastAngle);
				point = new egret.Point();
				n = this.members.length;
				i = 0;
				while (i < n)
				{
					o = this.members[i];
					if (o != null && o.exists)
					{
						if (o.isGroup)
						{
							// o.resetRotation(angle);
						}
						else
						{
							// DyMath.rotatePointDeg(o.x, o.y, x, y, diff, point);
							o.x = point.x;
							o.y = point.y;
							o.angle = (o.angle + diff);
						}
					}
					i++;
				}
			}
		}

		/**
		 * 添加成员
		 * @param obj 要添加的对象
		 * @param toNull 是否添加到成员列表中空的元素内，不改变成员列表长度
		 * @return 添加成功的对象
		 *
		 */
		public add(obj:DyObject, toNull:Boolean = true):DyObject
		{
			var n:number;
			var i:number;
			if (toNull)
			{
				n = this.members.length;
				i = 0;
				while (i < n)
				{
					if (this.members[i] == null)
					{
						this.members[i] = obj;
						return obj;
					}
					i++;
				}
			}
			this.members[this.members.length] = obj;
			return obj;
		}

		/**
		 * 保存上次的位置和角度
		 */
		protected saveOldPos():void
		{
			this._lastPosition.x = this.x;
			this._lastPosition.y = this.y;			
			this._lastAngle = this.angle;
		}

		public kill():void
		{
			var o:DyObject;
			var n:number = this.members.length;
			var i:number;
			while (i < n)
			{
				o = this.members[i];				
				if (o != null && o.exists)
				{
					o.kill();
				}
				i++;
			}
			super.kill();
		}

		public free():void
		{
			var o:DyObject;
			var n:number = this.members.length;
			var i:number;
			while (i < n)
			{
				o = this.members[i];
				if (o != null)
				{
					o.parentGroup = null;
					o.free();
				}
				i++;
			}
			this.clearMembers();
			super.free();
		}

		public resetRotation(angle:number = 0):void
		{
			var diff:number;
			var o:DyObject;
			var n:number;
			var i:number;
			var point:egret.Point = new egret.Point();
			if (angle != this._lastAngle)
			{
				diff = (angle - this._lastAngle);
				n = this.members.length;
				i = 0;
				while (i < n)
				{
					o = this.members[i];
					if (o != null && o.exists)
					{
						if (o.isGroup)
						{
							// o.resetRotation(angle);
						}
						else
						{
							// DyMath.rotatePointDeg(o.x, o.y, x, y, diff, point);
							o.x = point.x;
							o.y = point.y;
							o.angle = (o.angle + diff);
						}
					}
					i++;
				}
				this.saveOldPos();
			}
		}

		public reset(ax:number, ay:number):void
		{
			var mx:number;
			var my:number;			
			var o:DyObject;
			super.reset(ax, ay);
			if (this.x != this._lastPosition.x || this.y != this._lastPosition.y)
			{
				mx = this.x - this._lastPosition.x; //重置坐标后,移动的距离,为了更新组内对象,因为组内对象跟父窗口的坐标不一定相同,有偏移
				my = this.y - this._lastPosition.y;				
			}
			else
			{
				return;
			}
			var n:number = this.members.length;
			var i:number;
			while (i < n)
			{
				o = this.members[i];
				if (o != null && o.exists)
				{
					if (o.isGroup)
					{
						o.reset(o.x + mx, o.y + my);
					}
					else
					{
						o.x = o.x + mx;
						o.y = o.y + my;						
					}
				}
				i++;
			}
			this.saveOldPos();
		}

		/**
		 * 替换一个成员
		 * @param oldObj 被替换的成员
		 * @param newObj 替换的新对象
		 * @return 是否替换成功，如果不包含旧对象则替换不成功
		 */
		public replace(oldObj:DyObject, newObj:DyObject):Boolean
		{
			var index:number = this.members.indexOf(oldObj);
			if (index > -1)
			{
				this.members[index] = newObj;
				return true;
			}
			return false;
		}

		public getAvail(tag:number = 0):DyObject
		{
			var o:DyObject;
			var n:number = this.members.length;
			var i:number;
			while (i < n)
			{
				o = this.members[i];
				if (o != null && !o.exists && o.tag == tag)
				{
					return o;
				}
				i++;
			}
			return null;
		}
		
		public order():void
		{
			// this.members.sortOn("y",Array.NUMERIC);
		}
	}
}