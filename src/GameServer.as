package
{
	import utils.Utils;

	public class GameServer
	{
		/***导入nodeJs第三方ws.js原生WebSocket模块***/
		private const WebSocketServer:Object = __JS__("require('ws').Server");
		/***webSocket服务器***/
		private var server:Object;
		/**新建一个聊天房间 ***/		
		private var room:Game;
		
		public function GameServer()
		{
			///创建服务器，端口号设置为8999
			server = new WebSocketServer({ port: 8999 });
			trace("启动服务器,端口号:"+8999);
			trace("服务器IP地址为:"+IP);
			//服务器监听客户端连接事件(需加js原生的作用域绑定bind(this))
			server.on('connection',Utils.bind(connectionHandler,this));
			
			createRoom();
		}
		
		/**
		 * 有客户端连接成功
		 * @param webSocket 连接时会分配一个客户端的webSocket镜像
		 */		
		private function connectionHandler(webSocket:Object):void
		{
			//新的客户端连接服务器，创建client类
			var client:GameClient = new GameClient(webSocket);			
			//添加到房间
			room.addClient(client);
		}
		
		private function createRoom():void
		{
			room = new Game();
		}
		
		
		
		/**
		 * 获取本机的ip地址 
		 */		
		private function get IP():String
		{
			//导入nodejs原生os系统操作模块
			var os:Object =__JS__("require('os')")
			//获得网络接口列表。
			var ifaces:Object = os.networkInterfaces();
			//本机IP地址
			var ip:String= '';
			//遍历网络接口,获得本机ip地址
			for (var dev:String in ifaces)
			{
				//有多种接口，包括物理地址、IP地址等
				var info:Object=ifaces[dev];
//				trace(info)
				for(var i:String in info)
				{
					if (ip === '' && info[i].family === 'IPv4' && !info[i]["internal"])
					{
						ip = info[i].address;
						return ip;
					}
				}
			}
			return ip;
		}
	}
}