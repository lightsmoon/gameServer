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
			this.eventEmitter.on("message",Utils.bind(this.onMessage,this));
			this.eventEmitter.on("leaveRoom",Utils.bind(this.removeClient,this));
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
			this.broadcastToWorld(msgAdd.getObject());
			msgAdd.destroy();
			this.clients.push(client);
			var len=this.clients.length;
			console.log("有玩家上线了！同时在线人数："+len);
			for(var i=len-1;i>-1;i--){
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
			client.send(msg.getObject());
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
				this.broadcastToWorld(leaveClient);
			};
			var len=this.clients.length;
			if(len==0)this.id=0;
			console.log("有玩家上线了！同时在线人数："+len);
		}

		/**
		*接收到消息
		*/
		__proto.onMessage=function(msg){
			this.broadcastToWorld(msg);
		}

		/**
		*广播消息(世界)
		*@param msg 发送的消息字符串
		*/
		__proto.broadcastToWorld=function(msg){
			var len=this.clients.length;
			for(var i=0;i<len;i++){
				this.clients[i].send(msg);
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
			this.webSocket.on("message",Utils.bind(this.messageHandler,this));
			this.webSocket.on("close",Utils.bind(this.closeHandler,this));
		}

		__class(GameClient,'GameClient');
		var __proto=GameClient.prototype;
		/**
		*接收客户端发送过来消息
		*@param msg
		*/
		__proto.messageHandler=function(bytes){
			var arr=bytes.split(",")
			var str=MsgUtils.byteToString(arr);
			var obj=JSON.parse(str);
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

		__proto.send=function(msg){
			var str=JSON.stringify(msg);
			var bytes=MsgUtils.stringToByte(str);
			this.webSocket.send(bytes);
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
			this.server.on('connection',Utils.bind(this.connectionHandler,this));
			this.createRoom();
		}

		__class(GameServer,'GameServer');
		var __proto=GameServer.prototype;
		/**
		*有客户端连接成功
		*@param webSocket 连接时会分配一个客户端的webSocket镜像
		*/
		__proto.connectionHandler=function(webSocket){
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


	/**
	*玩家角度改变消息
	*/
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


	//class msgs.MsgUtils
	var MsgUtils=(function(){
		function MsgUtils(){}
		__class(MsgUtils,'msgs.MsgUtils');
		MsgUtils.stringToByte=function(str){
			var bytes=[];
			var len,c;
			len=str.length;
			for(var i=0;i < len;i++){
				c=str.charCodeAt(i);
				if(c >=0x010000 && c <=0x10FFFF){
					bytes.push(((c >> 18)& 0x07)| 0xF0);
					bytes.push(((c >> 12)& 0x3F)| 0x80);
					bytes.push(((c >> 6)& 0x3F)| 0x80);
					bytes.push((c & 0x3F)| 0x80);
					}else if(c >=0x000800 && c <=0x00FFFF){
					bytes.push(((c >> 12)& 0x0F)| 0xE0);
					bytes.push(((c >> 6)& 0x3F)| 0x80);
					bytes.push((c & 0x3F)| 0x80);
					}else if(c >=0x000080 && c <=0x0007FF){
					bytes.push(((c >> 6)& 0x1F)| 0xC0);
					bytes.push((c & 0x3F)| 0x80);
					}else {
					bytes.push(c & 0xFF);
				}
			}
			return bytes;
		}

		MsgUtils.byteToString=function(bytes){
			if(typeof bytes==='string'){
				return bytes;
			};
			var str='',
			_arr=bytes;
			for(var i=0;i < _arr.length;i++){
				var one=_arr[i].toString(2),
				v=one.match(/\^1+?(?=0)/);
				if(v && one.length==8){
					var bytesLength=v[0].length;
					var store=_arr[i].toString(2).slice(7-bytesLength);
					for(var st=1;st < bytesLength;st++){
						store+=_arr[st+i].toString(2).slice(2);
					}
					str+=String.fromCharCode(parseInt(store,2));
					i+=bytesLength-1;
					}else {
					str+=String.fromCharCode(_arr[i]);
				}
			}
			return str;
		}

		return MsgUtils;
	})()


	//class utils.Byte
	var Byte=(function(){
		function Byte(data){
			this._xd_=true;
			this._allocated_=8;
			//this._d_=null;
			//this._u8d_=null;
			this._pos_=0;
			this._length=0;
			if (data){
				this._u8d_=new Uint8Array(data);
				this._d_=new DataView(this._u8d_.buffer);
				this._length=this._d_.byteLength;
				}else {
				this.___resizeBuffer(this._allocated_);
			}
		}

		__class(Byte,'utils.Byte');
		var __proto=Byte.prototype;
		/**@private */
		__proto.___resizeBuffer=function(len){
			try {
				var newByteView=new Uint8Array(len);
				if (this._u8d_ !=null){
					if (this._u8d_.length <=len)newByteView.set(this._u8d_);
					else newByteView.set(this._u8d_.subarray(0,len));
				}
				this._u8d_=newByteView;
				this._d_=new DataView(newByteView.buffer);
				}catch (err){
				throw "___resizeBuffer err:"+len;
			}
		}

		/**
		*读取字符型值。
		*@return
		*/
		__proto.getString=function(){
			return this.rUTF(this.getUint16());
		}

		/**
		*从指定的位置读取指定长度的数据用于创建一个 Float32Array 对象并返回此对象。
		*@param start 开始位置。
		*@param len 需要读取的字节长度。
		*@return 读出的 Float32Array 对象。
		*/
		__proto.getFloat32Array=function(start,len){
			var v=new Float32Array(this._d_.buffer.slice(start,start+len));
			this._pos_+=len;
			return v;
		}

		/**
		*从指定的位置读取指定长度的数据用于创建一个 Uint8Array 对象并返回此对象。
		*@param start 开始位置。
		*@param len 需要读取的字节长度。
		*@return 读出的 Uint8Array 对象。
		*/
		__proto.getUint8Array=function(start,len){
			var v=new Uint8Array(this._d_.buffer.slice(start,start+len));
			this._pos_+=len;
			return v;
		}

		/**
		*从指定的位置读取指定长度的数据用于创建一个 Int16Array 对象并返回此对象。
		*@param start 开始位置。
		*@param len 需要读取的字节长度。
		*@return 读出的 Uint8Array 对象。
		*/
		__proto.getInt16Array=function(start,len){
			var v=new Int16Array(this._d_.buffer.slice(start,start+len));
			this._pos_+=len;
			return v;
		}

		/**
		*在指定字节偏移量位置处读取 Float32 值。
		*@return Float32 值。
		*/
		__proto.getFloat32=function(){
			var v=this._d_.getFloat32(this._pos_,this._xd_);
			this._pos_+=4;
			return v;
		}

		__proto.getFloat64=function(){
			var v=this._d_.getFloat64(this._pos_,this._xd_);
			this._pos_+=8;
			return v;
		}

		/**
		*在当前字节偏移量位置处写入 Float32 值。
		*@param value 需要写入的 Float32 值。
		*/
		__proto.writeFloat32=function(value){
			this.ensureWrite(this._pos_+4);
			this._d_.setFloat32(this._pos_,value,this._xd_);
			this._pos_+=4;
		}

		__proto.writeFloat64=function(value){
			this.ensureWrite(this._pos_+8);
			this._d_.setFloat64(this._pos_,value,this._xd_);
			this._pos_+=8;
		}

		/**
		*在当前字节偏移量位置处读取 Int32 值。
		*@return Int32 值。
		*/
		__proto.getInt32=function(){
			var float=this._d_.getInt32(this._pos_,this._xd_);
			this._pos_+=4;
			return float;
		}

		/**
		*在当前字节偏移量位置处读取 Uint32 值。
		*@return Uint32 值。
		*/
		__proto.getUint32=function(){
			var v=this._d_.getUint32(this._pos_,this._xd_);
			this._pos_+=4;
			return v;
		}

		/**
		*在当前字节偏移量位置处写入 Int32 值。
		*@param value 需要写入的 Int32 值。
		*/
		__proto.writeInt32=function(value){
			this.ensureWrite(this._pos_+4);
			this._d_.setInt32(this._pos_,value,this._xd_);
			this._pos_+=4;
		}

		/**
		*在当前字节偏移量位置处写入 Uint32 值。
		*@param value 需要写入的 Uint32 值。
		*/
		__proto.writeUint32=function(value){
			this.ensureWrite(this._pos_+4);
			this._d_.setUint32(this._pos_,value,this._xd_);
			this._pos_+=4;
		}

		/**
		*在当前字节偏移量位置处读取 Int16 值。
		*@return Int16 值。
		*/
		__proto.getInt16=function(){
			var us=this._d_.getInt16(this._pos_,this._xd_);
			this._pos_+=2;
			return us;
		}

		/**
		*在当前字节偏移量位置处读取 Uint16 值。
		*@return Uint16 值。
		*/
		__proto.getUint16=function(){
			var us=this._d_.getUint16(this._pos_,this._xd_);
			this._pos_+=2;
			return us;
		}

		/**
		*在当前字节偏移量位置处写入 Uint16 值。
		*@param value 需要写入的Uint16 值。
		*/
		__proto.writeUint16=function(value){
			this.ensureWrite(this._pos_+2);
			this._d_.setUint16(this._pos_,value,this._xd_);
			this._pos_+=2;
		}

		/**
		*在当前字节偏移量位置处写入 Int16 值。
		*@param value 需要写入的 Int16 值。
		*/
		__proto.writeInt16=function(value){
			this.ensureWrite(this._pos_+2);
			this._d_.setInt16(this._pos_,value,this._xd_);
			this._pos_+=2;
		}

		/**
		*在当前字节偏移量位置处读取 Uint8 值。
		*@return Uint8 值。
		*/
		__proto.getUint8=function(){
			return this._d_.getUint8(this._pos_++);
		}

		/**
		*在当前字节偏移量位置处写入 Uint8 值。
		*@param value 需要写入的 Uint8 值。
		*/
		__proto.writeUint8=function(value){
			this.ensureWrite(this._pos_+1);
			this._d_.setUint8(this._pos_,value,this._xd_);
			this._pos_++;
		}

		/**
		*@private
		*在指定位置处读取 Uint8 值。
		*@param pos 字节读取位置。
		*@return Uint8 值。
		*/
		__proto._getUInt8=function(pos){
			return this._d_.getUint8(pos);
		}

		/**
		*@private
		*在指定位置处读取 Uint16 值。
		*@param pos 字节读取位置。
		*@return Uint16 值。
		*/
		__proto._getUint16=function(pos){
			return this._d_.getUint16(pos,this._xd_);
		}

		/**
		*@private
		*读取指定长度的 UTF 型字符串。
		*@param len 需要读取的长度。
		*@return 读出的字符串。
		*/
		__proto.rUTF=function(len){
			var v="",max=this._pos_+len,c=0,c2=0,c3=0,f=String.fromCharCode;
			var u=this._u8d_,i=0;
			while (this._pos_ < max){
				c=u[this._pos_++];
				if (c < 0x80){
					if (c !=0){
						v+=f(c);
					}
					}else if (c < 0xE0){
					v+=f(((c & 0x3F)<< 6)| (u[this._pos_++] & 0x7F));
					}else if (c < 0xF0){
					c2=u[this._pos_++];
					v+=f(((c & 0x1F)<< 12)| ((c2 & 0x7F)<< 6)| (u[this._pos_++] & 0x7F));
					}else {
					c2=u[this._pos_++];
					c3=u[this._pos_++];
					v+=f(((c & 0x0F)<< 18)| ((c2 & 0x7F)<< 12)| ((c3 << 6)& 0x7F)| (u[this._pos_++] & 0x7F));
				}
				i++;
			}
			return v;
		}

		/**
		*字符串读取。
		*@param len
		*@return
		*/
		__proto.getCustomString=function(len){
			var v="",ulen=0,c=0,c2=0,f=String.fromCharCode;
			var u=this._u8d_,i=0;
			while (len > 0){
				c=u[this._pos_];
				if (c < 0x80){
					v+=f(c);
					this._pos_++;
					len--;
					}else {
					ulen=c-0x80;
					this._pos_++;
					len-=ulen;
					while (ulen > 0){
						c=u[this._pos_++];
						c2=u[this._pos_++];
						v+=f((c2 << 8)| c);
						ulen--;
					}
				}
			}
			return v;
		}

		/**
		*清除数据。
		*/
		__proto.clear=function(){
			this._pos_=0;
			this.length=0;
		}

		/**
		*@private
		*获取此对象的 ArrayBuffer 引用。
		*@return
		*/
		__proto.__getBuffer=function(){
			return this._d_.buffer;
		}

		/**
		*写入字符串，该方法写的字符串要使用 readUTFBytes 方法读取。
		*@param value 要写入的字符串。
		*/
		__proto.writeUTFBytes=function(value){
			value=value+"";
			for (var i=0,sz=value.length;i < sz;i++){
				var c=value.charCodeAt(i);
				if (c <=0x7F){
					this.writeByte(c);
					}else if (c <=0x7FF){
					this.writeByte(0xC0 | (c >> 6));
					this.writeByte(0x80 | (c & 63));
					}else if (c <=0xFFFF){
					this.writeByte(0xE0 | (c >> 12));
					this.writeByte(0x80 | ((c >> 6)& 63));
					this.writeByte(0x80 | (c & 63));
					}else {
					this.writeByte(0xF0 | (c >> 18));
					this.writeByte(0x80 | ((c >> 12)& 63));
					this.writeByte(0x80 | ((c >> 6)& 63));
					this.writeByte(0x80 | (c & 63));
				}
			}
		}

		/**
		*将 UTF-8 字符串写入字节流。
		*@param value 要写入的字符串值。
		*/
		__proto.writeUTFString=function(value){
			var tPos=0;
			tPos=this.pos;
			this.writeUint16(1);
			this.writeUTFBytes(value);
			var dPos=0;
			dPos=this.pos-tPos-2;
			this._d_.setUint16(tPos,dPos,this._xd_);
		}

		/**
		*@private
		*读取 UTF-8 字符串。
		*@return 读出的字符串。
		*/
		__proto.readUTFString=function(){
			var tPos=0;
			tPos=this.pos;
			var len=0;
			len=this.getUint16();
			return this.readUTFBytes(len);
		}

		/**
		*读取 UTF-8 字符串。
		*@return 读出的字符串。
		*/
		__proto.getUTFString=function(){
			return this.readUTFString();
		}

		/**
		*@private
		*读字符串，必须是 writeUTFBytes 方法写入的字符串。
		*@param len 要读的buffer长度,默认将读取缓冲区全部数据。
		*@return 读取的字符串。
		*/
		__proto.readUTFBytes=function(len){
			(len===void 0)&& (len=-1);
			if (len==0)return "";
			len=len > 0 ? len :this.bytesAvailable;
			return this.rUTF(len);
		}

		/**
		*读字符串，必须是 writeUTFBytes 方法写入的字符串。
		*@param len 要读的buffer长度,默认将读取缓冲区全部数据。
		*@return 读取的字符串。
		*/
		__proto.getUTFBytes=function(len){
			(len===void 0)&& (len=-1);
			return this.readUTFBytes(len);
		}

		/**
		*在字节流中写入一个字节。
		*@param value
		*/
		__proto.writeByte=function(value){
			this.ensureWrite(this._pos_+1);
			this._d_.setInt8(this._pos_,value);
			this._pos_+=1;
		}

		/**
		*@private
		*在字节流中读一个字节。
		*/
		__proto.readByte=function(){
			return this._d_.getInt8(this._pos_++);
		}

		/**
		*在字节流中读一个字节。
		*/
		__proto.getByte=function(){
			return this.readByte();
		}

		/**
		*指定该字节流的长度。
		*@param lengthToEnsure 指定的长度。
		*/
		__proto.ensureWrite=function(lengthToEnsure){
			if (this._length < lengthToEnsure)this._length=lengthToEnsure;
			if (this._allocated_ < lengthToEnsure)this.length=lengthToEnsure;
		}

		/**
		*写入指定的 Arraybuffer 对象。
		*@param arraybuffer 需要写入的 Arraybuffer 对象。
		*@param offset 偏移量（以字节为单位）
		*@param length 长度（以字节为单位）
		*/
		__proto.writeArrayBuffer=function(arraybuffer,offset,length){
			(offset===void 0)&& (offset=0);
			(length===void 0)&& (length=0);
			if (offset < 0 || length < 0)throw "writeArrayBuffer error - Out of bounds";
			if (length==0)length=arraybuffer.byteLength-offset;
			this.ensureWrite(this._pos_+length);
			var uint8array=new Uint8Array(arraybuffer);
			this._u8d_.set(uint8array.subarray(offset,offset+length),this._pos_);
			this._pos_+=length;
		}

		/**
		*获取此对象的 ArrayBuffer数据,数据只包含有效数据部分 。
		*/
		__getset(0,__proto,'buffer',function(){
			var rstBuffer=this._d_.buffer;
			if (rstBuffer.byteLength==this.length)return rstBuffer;
			return rstBuffer.slice(0,this.length);
		});

		/**
		*字节顺序。
		*/
		__getset(0,__proto,'endian',function(){
			return this._xd_ ? "littleEndian" :"bigEndian";
			},function(endianStr){
			this._xd_=(endianStr=="littleEndian");
		});

		/**
		*字节长度。
		*/
		__getset(0,__proto,'length',function(){
			return this._length;
			},function(value){
			if (this._allocated_ < value)
				this.___resizeBuffer(this._allocated_=Math.floor(Math.max(value,this._allocated_ *2)));
			else if (this._allocated_ > value)
			this.___resizeBuffer(this._allocated_=value);
			this._length=value;
		});

		/**
		*当前读取到的位置。
		*/
		__getset(0,__proto,'pos',function(){
			return this._pos_;
			},function(value){
			this._pos_=value;
			this._d_.byteOffset=value;
		});

		/**
		*可从字节流的当前位置到末尾读取的数据的字节数。
		*/
		__getset(0,__proto,'bytesAvailable',function(){
			return this.length-this._pos_;
		});

		Byte.getSystemEndian=function(){
			if (!Byte._sysEndian){
				var buffer=new ArrayBuffer(2);
				new DataView(buffer).setInt16(0,256,true);
				Byte._sysEndian=(new Int16Array(buffer))[0]===256 ? "littleEndian" :"bigEndian";
			}
			return Byte._sysEndian;
		}

		Byte.BIG_ENDIAN="bigEndian";
		Byte.LITTLE_ENDIAN="littleEndian";
		Byte._sysEndian=null;
		return Byte;
	})()


	//class utils.Pool
	var Pool=(function(){
		function Pool(){};
		__class(Pool,'utils.Pool');
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


	//class utils.Utils
	var Utils=(function(){
		function Utils(){};
		__class(Utils,'utils.Utils');
		Utils.toRadian=function(angle){
			return angle *Utils._pi2;
		}

		Utils.toAngle=function(radian){
			return radian *Utils._pi;
		}

		Utils.getGID=function(){
			return Utils._gid++;
		}

		Utils.bind=function(fun,scope){
			var rst=fun;
			rst=fun.bind(scope);;
			return rst;
		}

		Utils.updateOrder=function(array){
			if (!array || array.length < 2)return false;
			var i=1,j=0,len=array.length,key=NaN,c;
			while (i < len){
				j=i;
				c=array[j];
				key=array[j]._zOrder;
				while (--j >-1){
					if (array[j]._zOrder > key)array[j+1]=array[j];
					else break ;
				}
				array[j+1]=c;
				i++;
			}
			return true;
		}

		Utils._gid=1;
		Utils._pi=180 / Math.PI;
		Utils._pi2=Math.PI / 180;
		Utils._extReg=/\.(\w+)\??/g;
		return Utils;
	})()



	new GameServer();

})(window,document,Laya);
