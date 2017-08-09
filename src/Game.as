package
{
	
	import msgs.MsgAddPlayer;
	import msgs.MsgInitPlayers;
	import msgs.MsgUtils;
	
	import utils.Utils;
	

	/**
	 *服务器游戏逻辑处理 
	 * @author CHENZHENG
	 * 
	 */	
	public class Game
	{
		/***所有客户端的连接 */		
		public var clients:Vector.<GameClient> =new Vector.<GameClient>;
		/***所有客户端昵称列表**/
		public var clientNames:Array=[];
		/***游戏元素id分配**/
		private var id:int=0;
			
		/***原生nodejs的事件发送模块***/		
		public var EventEmitter:Object =__JS__("require('events').EventEmitter");
		/**webSocket事件发送者***/
		public var eventEmitter:Object=new EventEmitter();		
		/**时间循环***/
		public var timer:Object=__JS__("setInterval(this.onFrame.bind(this),16);");
		
		
		public function Game()
		{
			//监听消息产生事件(js原生的作用域绑定bind(this))
			eventEmitter.on("message",Utils.bind(onMessage,this));
			//监听离开房间事件(js原生的作用域绑定bind(this))
			eventEmitter.on("leaveRoom",Utils.bind(removeClient,this));
			
		}
		
		public function onFrame():void
		{
			var len:int=this.clients.length;
			for(var i:int=len-1;i>-1;i--)
			{
				clients[i].update();
			}
		}
		
		/**
		 * 添加新来的客户端 
		 */		
		public function addClient(client:GameClient):void
		{
			//客户端消息事件对象，用于发送消息
			client.eventEmitter=this.eventEmitter;
			//新加入客户端id
			++id;
			client.data.id=id;
			
			//广播加入的玩家
			var msgAdd:MsgAddPlayer=MsgAddPlayer.I();
			msgAdd.id=client.data.id;
			msgAdd.x=client.x;
			msgAdd.y=client.y;
			msgAdd.dir=client.dir;
			this.broadcastToWorld(msgAdd.getObject());
			msgAdd.destroy();
			//加入客户端列表
			this.clients.push(client);
			
			var len:int=clients.length;
			trace("有玩家上线了！同时在线人数："+len);
			
			//更新客户端列表名字、位置、方向
			for(var i:int=len-1;i>-1;i--)
			{
				var msgAdd1:MsgAddPlayer=MsgAddPlayer.I();
				msgAdd1.id=clients[i].data.id;
				msgAdd1.x=clients[i].x;
				msgAdd1.y=clients[i].y;
				msgAdd1.dir=clients[i].dir;
				this.clientNames.push(msgAdd1.getObject());
				msgAdd1.destroy();
			}
			
			//设置客户端Id,发送初始玩家列表
			var msg:MsgInitPlayers=MsgInitPlayers.I();
			msg.clients=this.clientNames;
			msg.id=id;
			msg.x=client.x;
			msg.y = client.y;
			client.send(msg.getObject());
			msg.destroy();
			
			clientNames=[];
		}
		
		/**
		 *移除房间用户 
		 */		
		private function removeClient(client:GameClient):void
		{
			//查找客户端索引
			var index1:int = this.clients.indexOf(client);
			//如果找到
			if(index1!=-1)
			{	
				var leaveClient:Object={leave:client.data.id};
				//删除离开的客户端
				this.clients.splice(index1,1);
				//系统广播玩家离开消息
				this.broadcastToWorld(leaveClient);
			}
			var len:int=clients.length;
			if(len==0) id=0;
			trace("有玩家上线了！同时在线人数："+len);
		}
		
		/**
		 *接收到消息
		 */
		private function onMessage(msg:Object):void
		{
			//广播消息（应当使用四叉树优化广播）
			this.broadcastToWorld(msg);
		}
		
		/**
		 * 广播消息(世界) 
		 * @param msg 发送的消息字符串
		 */		
		public function broadcastToWorld(msg:Object):void
		{
			//获取客户端总数
			var len:int = this.clients.length;
			//遍历所有客户端并发送消息
			for(var i:int = 0;i<len;i++)
			{
				this.clients[i].send(msg);
			}
		}
	}
}