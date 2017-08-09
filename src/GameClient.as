package
{
	
	import msgs.MsgAngle;
	import msgs.MsgUtils;
	
	import utils.Byte;
	import utils.Utils;

	/**
	 *服务器端被连接时产生的客户端镜像 
	 * @author CHENZHENG
	 */	
	public class GameClient
	{
		/***客户端镜像socket**/
		public var webSocket:Object;
		/***webSocket事件发送者***/
		public var eventEmitter:Object;
		
		public var data:GameObjectData;
		public var isConnect:Boolean;
		
		public var x:int=Math.floor(Math.random()*1100+50);
		public var y:int = Math.floor(Math.random() * 700 + 30);
		
		
		public var dir:int=0;
		private var speedX:Number;
		private var speedY:Number;
		
		private var isAttack:Boolean=false;
		
		
		public function GameClient(webSocket:Object)
		{
			data=new GameObjectData();
			
			//socket实例
			this.webSocket = webSocket;			
			//客户端消息监听(需加js原生的作用域绑定bind(this))
			this.webSocket.on("message",Utils.bind(messageHandler,this));
			//客户端断开监听(需加js原生的作用域绑定bind(this))
			this.webSocket.on("close",Utils.bind(closeHandler,this));
		}
		/**
		 * 接收客户端发送过来消息 
		 * @param msg
		 */		
		public function messageHandler(bytes:String):void
		{
			//为什么接收到的是二进制字符串？？？？？？
			var arr:Array=bytes.split(",")
			var str:String=MsgUtils.byteToString(arr);
			var obj:Object=JSON.parse(str);
			
			//客户端逻辑
			if(obj.type=="angle")
			{
				var msgAng:MsgAngle=MsgAngle.I();
				msgAng.initMsg(obj);				
				data.angle=msgAng.angle;
				msgAng.destroy();
				if(data.angle!=-1)
				{
					dir=Math.round(data.angle/45);
					if(dir==8) dir=0;
				}
				obj=msgAng.getObject();
			}
			else if(obj.hasOwnProperty("state"))
			{
				obj.x=Math.round(this.x*100);
				obj.y=Math.round(this.y*100);
			}
			else if(obj.hasOwnProperty("isAttack"))
			{
				this.isAttack=obj.isAttack;
			}
			
			//客户端有消息到,发送给服务器处理
			eventEmitter&&eventEmitter.emit("message",obj);
		}
		
		/**
		 * 客户端断开连接 
		 */		
		public function closeHandler(aa):void
		{
			isConnect=false;
			//发送客户端离开消息
			eventEmitter&&eventEmitter.emit("leaveRoom",this);
		}
		
		/**
		 * 客户端更新 
		 */	
		public function update():void
		{
			if(data.angle!=-1&&!this.isAttack)
			{
				var radians:Number = Math.PI / 180 *data.angle
				speedX=Math.sin(radians)*data.speed;  
				speedY=Math.cos(radians)*data.speed;
				this.x+=speedX;
				this.y+=speedY;
			}
		}
		
		public function send(msg:Object):void
		{
			//二进制转换
			var str:String=JSON.stringify(msg);
			var bytes:Byte=MsgUtils.stringToByte(str);
			
			this.webSocket.send(bytes);
		}
		
	}
}