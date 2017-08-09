package msgs
{
	import utils.Pool;

	/**
	 * 玩家角度改变消息
	 */
	public class MsgAngle
	{
		/**消息类型**/
		public var type:String="angle";
		/**角色id**/
		public var id:int=-1;
		/**角色移动的角度**/
		public var angle:int=-1;
		
		/**消息体object**/		
		private var msgObject:Object={};
		private static var instance:MsgAngle;

		/**
		 * 从对象池创建
		 */
		public static function I():MsgAngle
		{
			instance=Pool.getItemByClass("angle",MsgAngle);
			return instance;
		}
		
		/**
		 * 玩家角度改变消息
		 */
		public function MsgAngle()
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
		}
		
		/**获取消息体object**/
		public function getObject():Object
		{
			msgObject={type:type,data:[id,angle]};
			return msgObject;
		}
		
		/**获取消息体Json文本**/
		public function getJsonString():String
		{
			msgObject={type:type,data:[id,angle]};
			return JSON.stringify(msgObject);
		}
		
		/**消息销毁，放入对象池**/
		public function destroy():void
		{
			Pool.recover("angle",this);
		}
	}
}