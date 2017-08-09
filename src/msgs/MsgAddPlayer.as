package msgs
{
	import utils.Pool;

	/**
	 * 玩家上线消息
	 */
	public class MsgAddPlayer
	{
		/**消息类型**/
		public var type:String="addPlayer";
		/**角色id**/
		public var id:int=-1;
		/**角色x坐标**/
		public var x:int=0;
		/**角色y坐标**/
		public var y:int=0;
		/**角色动画方向**/
		public var dir:int=-1;
		
		/**消息体object**/		
		private var msgObject:Object={};
		
		
		private static var instance:MsgAddPlayer;
		
		
		/**
		 * 从对象池创建
		 */
		public static function I():MsgAddPlayer
		{
			instance=Pool.getItemByClass("addPlayer",MsgAddPlayer);
			return instance;
		}
		
		/**
		 * 玩家上线消息
		 */
		public function MsgAddPlayer()
		{
		}
		
		/**
		 *根据object初始化消息
		 */
		public function initMsg(object:Object):void
		{
			msgObject=object;
			id=object.data[0];
			x=object.data[1];
			y=object.data[2];
			dir=object.data[3];
		}
		
		/**获取消息体object**/
		public function getObject():Object
		{
			msgObject={type:type,data:[id,x,y,dir]};
			return msgObject;
		}
		
		/**获取消息体Json文本**/
		public function getJsonString():String
		{
			msgObject={type:type,data:[id,x,y,dir]};
			return JSON.stringify(msgObject);
		}
		
		/**消息销毁，放入对象池**/
		public function destroy():void
		{
			Pool.recover("addPlayer",this);
		}
	}
}