var window = window || global;
var document = document || (window.document = {});
/***********************************/
/*http://www.layabox.com  2017/3/23*/
/***********************************/
var Laya=window.Laya=(function(window,document){
	var Laya={
		__internals:[],
		__packages:{},
		__classmap:{'Object':Object,'Function':Function,'Array':Array,'String':String},
		__sysClass:{'object':'Object','array':'Array','string':'String','dictionary':'Dictionary'},
		__propun:{writable: true,enumerable: false,configurable: true},
		__presubstr:String.prototype.substr,
		__substr:function(ofs,sz){return arguments.length==1?Laya.__presubstr.call(this,ofs):Laya.__presubstr.call(this,ofs,sz>0?sz:(this.length+sz));},
		__init:function(_classs){_classs.forEach(function(o){o.__init$ && o.__init$();});},
		__isClass:function(o){return o && (o.__isclass || o==Object || o==String || o==Array);},
		__newvec:function(sz,value){
			var d=[];
			d.length=sz;
			for(var i=0;i<sz;i++) d[i]=value;
			return d;
		},
		__extend:function(d,b){
			for (var p in b){
				if (!b.hasOwnProperty(p)) continue;
				var gs=Object.getOwnPropertyDescriptor(b, p);
				var g = gs.get, s = gs.set; 
				if ( g || s ) {
					if ( g && s)
						Object.defineProperty(d,p,gs);
					else{
						g && Object.defineProperty(d, p, g);
						s && Object.defineProperty(d, p, s);
					}
				}
				else d[p] = b[p];
			}
			function __() { Laya.un(this,'constructor',d); }__.prototype=b.prototype;d.prototype=new __();Laya.un(d.prototype,'__imps',Laya.__copy({},b.prototype.__imps));
		},
		__copy:function(dec,src){
			if(!src) return null;
			dec=dec||{};
			for(var i in src) dec[i]=src[i];
			return dec;
		},
		__package:function(name,o){
			if(Laya.__packages[name]) return;
			Laya.__packages[name]=true;
			var p=window,strs=name.split('.');
			if(strs.length>1){
				for(var i=0,sz=strs.length-1;i<sz;i++){
					var c=p[strs[i]];
					p=c?c:(p[strs[i]]={});
				}
			}
			p[strs[strs.length-1]] || (p[strs[strs.length-1]]=o||{});
		},
		__hasOwnProperty:function(name,o){
			o=o ||this;
		    function classHas(name,o){
				if(Object.hasOwnProperty.call(o.prototype,name)) return true;
				var s=o.prototype.__super;
				return s==null?null:classHas(name,s);
			}
			return (Object.hasOwnProperty.call(o,name)) || classHas(name,o.__class);
		},
		__typeof:function(o,value){
			if(!o || !value) return false;
			if(value===String) return (typeof o==='string');
			if(value===Number) return (typeof o==='number');
			if(value.__interface__) value=value.__interface__;
			else if(typeof value!='string')  return (o instanceof value);
			return (o.__imps && o.__imps[value]) || (o.__class==value);
		},
		__as:function(value,type){
			return (this.__typeof(value,type))?value:null;
		},		
		interface:function(name,_super){
			Laya.__package(name,{});
			var ins=Laya.__internals;
			var a=ins[name]=ins[name] || {self:name};
			if(_super)
			{
				var supers=_super.split(',');
				a.extend=[];
				for(var i=0;i<supers.length;i++){
					var nm=supers[i];
					ins[nm]=ins[nm] || {self:nm};
					a.extend.push(ins[nm]);
				}
			}
			var o=window,words=name.split('.');
			for(var i=0;i<words.length-1;i++) o=o[words[i]];
			o[words[words.length-1]]={__interface__:name};
		},
		class:function(o,fullName,_super,miniName){
			_super && Laya.__extend(o,_super);
			if(fullName){
				Laya.__package(fullName,o);
				Laya.__classmap[fullName]=o;
				if(fullName.indexOf('.')>0){
					if(fullName.indexOf('laya.')==0){
						var paths=fullName.split('.');
						miniName=miniName || paths[paths.length-1];
						if(Laya[miniName]) console.log("Warning!,this class["+miniName+"] already exist:",Laya[miniName]);
						Laya[miniName]=o;
					}
				}
				else {
					if(fullName=="Main")
						window.Main=o;
					else{
						if(Laya[fullName]){
							console.log("Error!,this class["+fullName+"] already exist:",Laya[fullName]);
						}
						Laya[fullName]=o;
					}
				}
			}
			var un=Laya.un,p=o.prototype;
			un(p,'hasOwnProperty',Laya.__hasOwnProperty);
			un(p,'__class',o);
			un(p,'__super',_super);
			un(p,'__className',fullName);
			un(o,'__super',_super);
			un(o,'__className',fullName);
			un(o,'__isclass',true);
			un(o,'super',function(o){this.__super.call(o);});
		},
		imps:function(dec,src){
			if(!src) return null;
			var d=dec.__imps|| Laya.un(dec,'__imps',{});
			function __(name){
				var c,exs;
				if(! (c=Laya.__internals[name]) ) return;
				d[name]=true;
				if(!(exs=c.extend)) return;
				for(var i=0;i<exs.length;i++){
					__(exs[i].self);
				}
			}
			for(var i in src) __(i);
		},
		getset:function(isStatic,o,name,getfn,setfn){
			if(!isStatic){
				getfn && Laya.un(o,'_$get_'+name,getfn);
				setfn && Laya.un(o,'_$set_'+name,setfn);
			}
			else{
				getfn && (o['_$GET_'+name]=getfn);
				setfn && (o['_$SET_'+name]=setfn);
			}
			if(getfn && setfn) 
				Object.defineProperty(o,name,{get:getfn,set:setfn,enumerable:false});
			else{
				getfn && Object.defineProperty(o,name,{get:getfn,enumerable:false});
				setfn && Object.defineProperty(o,name,{set:setfn,enumerable:false});
			}
		},
		static:function(_class,def){
				for(var i=0,sz=def.length;i<sz;i+=2){
					if(def[i]=='length') 
						_class.length=def[i+1].call(_class);
					else{
						function tmp(){
							var name=def[i];
							var getfn=def[i+1];
							Object.defineProperty(_class,name,{
								get:function(){delete this[name];return this[name]=getfn.call(this);},
								set:function(v){delete this[name];this[name]=v;},enumerable: true,configurable: true});
						}
						tmp();
					}
				}
		},		
		un:function(obj,name,value){
			value || (value=obj[name]);
			Laya.__propun.value=value;
			Object.defineProperty(obj, name, Laya.__propun);
			return value;
		},
		uns:function(obj,names){
			names.forEach(function(o){Laya.un(obj,o)});
		}
	};

	window.console=window.console || ({log:function(){}});
	window.trace=window.console.log;
	Error.prototype.throwError=function(){throw arguments;};
	//String.prototype.substr=Laya.__substr;
	Object.defineProperty(Array.prototype,'fixed',{enumerable: false});

	return Laya;
})(window,document);

(function(window,document,Laya){
	var __un=Laya.un,__uns=Laya.uns,__static=Laya.static,__class=Laya.class,__getset=Laya.getset,__newvec=Laya.__newvec;
	//class Game
	var Game=(function(){
		function Game(){
			this.clientNames=[];
			this.id=0;
			this.clients=new Array;
			this.EventEmitter=require('events').EventEmitter;
			this.eventEmitter=new this.EventEmitter();
			this.timer=setInterval(this.onFrame.bind(this),16);;
			this.eventEmitter.on("message",this.onMessage.bind(this));
			this.eventEmitter.on("leaveRoom",this.removeClient.bind(this));
		}

		__class(Game,'Game');
		var __proto=Game.prototype;
		__proto.onFrame=function(){
			var len=this.clients.length;
			for(var i=len-1;i>-1;i--){
				this.clients[i].update();
			}
		}

		/**
		*添加新来的客户端
		*/
		__proto.addClient=function(client){
			client.eventEmitter=this.eventEmitter;
			++this.id;
			client.data.id=this.id;
			var msgAdd=MsgAddPlayer.I();
			msgAdd.id=client.data.id;
			msgAdd.x=client.x;
			msgAdd.y=client.y;
			msgAdd.dir=client.dir;
			this.broadcastToWorld(msgAdd.getJsonString());
			msgAdd.destroy();
			this.clients.push(client);
			for(var i=this.clients.length-1;i>-1;i--){
				var msgAdd1=MsgAddPlayer.I();
				msgAdd1.id=this.clients[i].data.id;
				msgAdd1.x=this.clients[i].x;
				msgAdd1.y=this.clients[i].y;
				msgAdd1.dir=this.clients[i].dir;
				this.clientNames.push(msgAdd1.getObject());
				msgAdd1.destroy();
			};
			var msg=MsgInitPlayers.I();
			msg.clients=this.clientNames;
			msg.id=this.id;
			msg.x=client.x;
			msg.y=client.y;
			client.webSocket.send(msg.getJsonString());
			msg.destroy();
			this.clientNames=[];
		}

		/**
		*移除房间用户
		*/
		__proto.removeClient=function(client){
			var index1=this.clients.indexOf(client);
			if(index1!=-1){
				var leaveClient={leave:client.data.id};
				this.clients.splice(index1,1);
				this.broadcastToWorld(JSON.stringify(leaveClient));
			}
			if(this.clients.length==0)this.id=0;
			console.log("离开的玩家："+this.clients.length);
		}

		/**
		*接收到消息
		*/
		__proto.onMessage=function(msg){
			this.broadcastToWorld(JSON.stringify(msg));
		}

		/**
		*广播消息(世界)
		*@param msg 发送的消息字符串
		*/
		__proto.broadcastToWorld=function(msg){
			var len=this.clients.length;
			for(var i=0;i<len;i++){
				this.clients[i].webSocket.send(msg);
			}
		}

		return Game;
	})()


	//class GameClient
	var GameClient=(function(){
		function GameClient(webSocket){
			this.webSocket=null;
			this.eventEmitter=null;
			this.data=null;
			this.isConnect=false;
			this.dir=0;
			this.speedX=NaN;
			this.speedY=NaN;
			this.isAttack=false;
			this.x=Math.floor(Math.random()*1100+50);
			this.y=Math.floor(Math.random()*700+30);
			this.data=new GameObjectData();
			this.webSocket=webSocket;
			this.webSocket.on("message",this.messageHandler.bind(this));
			this.webSocket.on("close",this.closeHandler.bind(this));
		}

		__class(GameClient,'GameClient');
		var __proto=GameClient.prototype;
		/**
		*接收客户端发送过来消息
		*@param msg
		*/
		__proto.messageHandler=function(msg){
			var obj=JSON.parse(msg);
			if(obj.type=="angle"){
				var msgAng=MsgAngle.I();
				msgAng.initMsg(obj);
				this.data.angle=msgAng.angle;
				msgAng.destroy();
				if(this.data.angle!=-1){
					this.dir=Math.round(this.data.angle/45);
					if(this.dir==8)this.dir=0;
				}
				obj=msgAng.getObject();
			}
			else if(obj.hasOwnProperty("state")){
				obj.x=Math.round(this.x*100);
				obj.y=Math.round(this.y*100);
			}
			else if(obj.hasOwnProperty("isAttack")){
				this.isAttack=obj.isAttack;
			}
			this.eventEmitter&&this.eventEmitter.emit("message",obj);
		}

		/**
		*客户端断开连接
		*/
		__proto.closeHandler=function(aa){
			this.isConnect=false;
			this.eventEmitter&&this.eventEmitter.emit("leaveRoom",this);
		}

		/**
		*客户端更新
		*/
		__proto.update=function(){
			if(this.data.angle!=-1&&!this.isAttack){
				var radians=Math.PI / 180 *this.data.angle
				this.speedX=Math.sin(radians)*this.data.speed;
				this.speedY=Math.cos(radians)*this.data.speed;
				this.x+=this.speedX;
				this.y+=this.speedY;
			}
		}

		return GameClient;
	})()


	//class GameObjectData
	var GameObjectData=(function(){
		function GameObjectData(){
			this.id=-1;
			this.type="";
			this.pathID=-1;
			this.name="";
			this.offX=0;
			this.offY=0;
			this.w=0;
			this.h=0;
			this.xoffset=0;
			this.yoffset=0;
			this.collInScene=false;
			this.collLogicID=0;
			this.isCollStart=false;
			this.teamId=-1;
			this.speed=2;
			this.addSpeed=0;
			this.acceSpeed=0;
			this.angle=-1;
			this.blood=0;
			this.addBlood=0;
			this.attack=0;
			this.addAttack=0;
			this.defense=0;
			this.addDefense=0;
			this.score=0;
			this.lost=[];
			this.backPack=[];
			this.useNet=false;
			this.ammoType="";
			this.ammoSpeed=0;
			this.ammoInterval=0;
			this.ammoAngle=0;
			this.ammoCount=0;
			this.ammoAngleArr=[];
			this.ammoOffset=0;
			this.lifeTime=0;
		}

		__class(GameObjectData,'GameObjectData');
		return GameObjectData;
	})()


	//class GameServer
	var GameServer=(function(){
		function GameServer(){
			this.server=null;
			this.room=null;
			this.WebSocketServer=require('ws').Server;
			this.server=new this.WebSocketServer({port:8999 });
			console.log("启动服务器,端口号:"+8999);
			console.log("服务器IP地址为:"+this.IP);
			this.server.on('connection',this.connectionHandler.bind(this));
			this.createRoom();
		}

		__class(GameServer,'GameServer');
		var __proto=GameServer.prototype;
		/**
		*有客户端连接成功
		*@param webSocket 连接时会分配一个客户端的webSocket镜像
		*/
		__proto.connectionHandler=function(webSocket){
			console.log("有玩家上线了！！！")
			var client=new GameClient(webSocket);
			this.room.addClient(client);
		}

		__proto.createRoom=function(){
			this.room=new Game();
		}

		/**
		*获取本机的ip地址
		*/
		__getset(0,__proto,'IP',function(){
			var os=require('os')
			var ifaces=os.networkInterfaces();
			var ip='';
			for (var dev in ifaces){
				var info=ifaces[dev];
				for(var i in info){
					if (ip==='' && info[i].family==='IPv4' && !info[i]["internal"]){
						ip=info[i].address;
						return ip;
					}
				}
			}
			return ip;
		});

		return GameServer;
	})()


	//class msgs.MsgAddPlayer
	var MsgAddPlayer=(function(){
		function MsgAddPlayer(){
			this.type="addPlayer";
			this.id=-1;
			this.x=0;
			this.y=0;
			this.dir=-1;
			this.msgObject={};
		}

		__class(MsgAddPlayer,'msgs.MsgAddPlayer');
		var __proto=MsgAddPlayer.prototype;
		/**
		*根据object初始化消息
		*/
		__proto.initMsg=function(object){
			this.msgObject=object;
			this.id=object.data[0];
			this.x=object.data[1];
			this.y=object.data[2];
			this.dir=object.data[3];
		}

		/**获取消息体object**/
		__proto.getObject=function(){
			this.msgObject={type:this.type,data:[this.id,this.x,this.y,this.dir]};
			return this.msgObject;
		}

		/**获取消息体Json文本**/
		__proto.getJsonString=function(){
			this.msgObject={type:this.type,data:[this.id,this.x,this.y,this.dir]};
			return JSON.stringify(this.msgObject);
		}

		/**消息销毁，放入对象池**/
		__proto.destroy=function(){
			Pool.recover("addPlayer",this);
		}

		MsgAddPlayer.I=function(){
			MsgAddPlayer.instance=Pool.getItemByClass("addPlayer",MsgAddPlayer);
			return MsgAddPlayer.instance;
		}

		MsgAddPlayer.instance=null
		return MsgAddPlayer;
	})()


	//class msgs.MsgAngle
	var MsgAngle=(function(){
		function MsgAngle(){
			this.type="angle";
			this.id=-1;
			this.angle=-1;
			this.msgObject={};
		}

		__class(MsgAngle,'msgs.MsgAngle');
		var __proto=MsgAngle.prototype;
		/**
		*根据object初始化消息
		*/
		__proto.initMsg=function(object){
			this.msgObject=object;
			this.id=object.data[0];
			this.angle=object.data[1];
		}

		/**获取消息体object**/
		__proto.getObject=function(){
			this.msgObject={type:this.type,data:[this.id,this.angle]};
			return this.msgObject;
		}

		/**获取消息体Json文本**/
		__proto.getJsonString=function(){
			this.msgObject={type:this.type,data:[this.id,this.angle]};
			return JSON.stringify(this.msgObject);
		}

		/**消息销毁，放入对象池**/
		__proto.destroy=function(){
			Pool.recover("angle",this);
		}

		MsgAngle.I=function(){
			MsgAngle.instance=Pool.getItemByClass("angle",MsgAngle);
			return MsgAngle.instance;
		}

		MsgAngle.instance=null
		return MsgAngle;
	})()


	//class msgs.MsgInitPlayers
	var MsgInitPlayers=(function(){
		function MsgInitPlayers(){
			this.type="initPlayers";
			this.id=-1;
			this.x=0;
			this.y=0;
			this.clients=[];
			this.msgObject=null;
		}

		__class(MsgInitPlayers,'msgs.MsgInitPlayers');
		var __proto=MsgInitPlayers.prototype;
		/**
		*根据object初始化消息
		*/
		__proto.initMsg=function(object){
			this.id=object.data[0];
			this.x=object.data[1];
			this.y=object.data[2];
			this.clients=object.data[3];
		}

		/**获取消息体object**/
		__proto.getObject=function(){
			this.msgObject={type:this.type,data:[this.id,this.x,this.y,this.clients]};
			return this.msgObject;
		}

		/**获取消息体Json文本**/
		__proto.getJsonString=function(){
			return JSON.stringify({type:this.type,data:[this.id,this.x,this.y,this.clients]});
		}

		/**消息销毁，放入对象池**/
		__proto.destroy=function(){
			Pool.recover("initPlayers",this);
		}

		MsgInitPlayers.I=function(){
			MsgInitPlayers.instance=Pool.getItemByClass("initPlayers",MsgInitPlayers);
			return MsgInitPlayers.instance;
		}

		MsgInitPlayers.instance=null
		return MsgInitPlayers;
	})()


	//class laya.utils.Pool
	var Pool=(function(){
		function Pool(){};
		__class(Pool,'laya.utils.Pool');
		Pool.getPoolBySign=function(sign){
			return Pool._poolDic[sign] || (Pool._poolDic[sign]=[]);
		}

		Pool.clearBySign=function(sign){
			if (Pool._poolDic[sign])Pool._poolDic[sign].length=0;
		}

		Pool.recover=function(sign,item){
			if (item["__InPool"])return;
			item["__InPool"]=true;
			Pool.getPoolBySign(sign).push(item);
		}

		Pool.getItemByClass=function(sign,cls){
			var pool=Pool.getPoolBySign(sign);
			var rst=pool.length ? pool.pop():new cls();
			rst["__InPool"]=false;
			return rst;
		}

		Pool.getItemByCreateFun=function(sign,createFun){
			var pool=Pool.getPoolBySign(sign);
			var rst=pool.length ? pool.pop():createFun();
			rst["__InPool"]=false;
			return rst;
		}

		Pool.getItem=function(sign){
			var pool=Pool.getPoolBySign(sign);
			var rst=pool.length ? pool.pop():null;
			if (rst){
				rst["__InPool"]=false;
			}
			return rst;
		}

		Pool._poolDic={};
		Pool.InPoolSign="__InPool";
		return Pool;
	})()



	new GameServer();

})(window,document,Laya);
