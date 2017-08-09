package msgs
{
	import laya.utils.Pool;

	/**
	 * 玩家攻击改变消息
	 */
	public class MsgAttack
	{
		/**消息类型**/
		public var type:String="attack";
		/**角色id**/
		public var id:int=-1;
		/**角色移动的角度**/
		public var angle:int=-1;
		
		public var isAttack:Boolean=false;
		public var attackType:int=0;
		
		/**消息体object**/		
		private var msgObject:Object={};
		private static var instance:MsgAttack;

		/**
		 * 从对象池创建
		 */		
		public static function I():MsgAttack
		{
			instance=Pool.getItemByClass("attack",MsgAttack);
			return instance;
		}
		
		/**
		 * 玩家角度改变消息
		 */
		public function MsgAttack()
		{
		}
		
		/**
		 *根据object初始化消息
		 */
		public function initMsg(object:Object):void
		{
			msgObject=object;
			id=object.data[0];
			angle=object.data[1];
			isAttack=object.data[2];
			attackType=object.data[3];
		}
		
		/**获取消息体object**/
		public function getObject():Object
		{
			msgObject={type:type,data:[id,angle,isAttack,attackType]};
			return msgObject;
		}
		
		/**获取消息体Json文本**/
		public function getJsonString():String
		{
			msgObject={type:type,data:[id,angle,isAttack,attackType]};
			return JSON.stringify(msgObject);
		}
		
		/**消息销毁，放入对象池**/
		public function destroy():void
		{
			Pool.recover("attack",this);
		}
	}
}