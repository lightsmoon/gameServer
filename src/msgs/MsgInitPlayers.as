package msgs
{
	import utils.Pool;

	/**
	 * 连线后初始化在线角色消息列表
	 */	
	public class MsgInitPlayers
	{
		/**消息类型**/
		public var type:String="initPlayers";
		/**角色id**/
		public var id:int=-1;
		/**角色x坐标**/
		public var x:int=0;
		/**角色y坐标**/
		public var y:int=0;
		/**在线角色列表**/
		public var clients:Array=[];
		/**消息体object**/
		private var msgObject:Object;
		
		private static var instance:MsgInitPlayers;
		
		/**
		 * 从对象池创建
		 */		
		public static function I():MsgInitPlayers
		{
			instance=Pool.getItemByClass("initPlayers",MsgInitPlayers);
			return instance;
		}
		
		
		/**
		 *连线后初始化在线角色消息列表
		 */	
		public function MsgInitPlayers()
		{
			
		}
		/**
		 *根据object初始化消息
		 */
		public function initMsg(object:Object):void
		{
			id=object.data[0];
			x=object.data[1];
			y=object.data[2];
			clients=object.data[3];
		}
		
		/**获取消息体object**/
		public function getObject():Object
		{
			msgObject={type:type,data:[id,x,y,clients]};
			return msgObject;
		}
		
		/**获取消息体Json文本**/
		public function getJsonString():String
		{
			return JSON.stringify({type:type,data:[id,x,y,clients]});
		}
		
		/**消息销毁，放入对象池**/
		public function destroy():void
		{
			Pool.recover("initPlayers",this);
		}
	}
}