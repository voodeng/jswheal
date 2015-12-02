/**---------------------------------
* @Author: Voodeng
* @Date:   2015-11-03 17:10:58
* @Last Modified by:   Voodeng
* @Last Modified time: 2015-11-19 21:55:55
* @require jQuery.js | amazeui.js
* !!! Put this script in the latest.
* Init the BDZCF, init that animate, init all....
 ---------------------------------*/


(function($){
	"use strict";
	var window,console,alert;
	// 浏览器的console兼容
	if (typeof window.console != 'object'){
		window.console = {log:function(){},debug:function(){},info:function(){},warn:function(){},error:function(){},assert:function(){},dir:function(){},dirxml:function(){},trace:function(){},group:function(){},groupEnd:function(){},time:function(){},timeEnd:function(){},profile:function(){},profileEnd:function(){},count:function(){}};
	}
	var log = function(str) {console.log(str); return;};
	var def_title = document.title;
	var basePath= "http://www.bdzcf.com";

	var zcf = {
		ext: {
			zget: function(url,type,param,callback) {
				$.ajax({
								url: url,
		            type: type,
		            data: param,
		            async:false,
		            dataType: "json",
		            success: callback,
		            error: function () { console.log("Get Error"); }
		        });
			},
			brower: function(){
				// 检测当前浏览器
			},
			url: function(type){
				// 获取当前url地址,默认为path
				var href = window.location.href;
				var host = window.location.host;
				var path = window.location.pathname;
				var hash = window.location.hash;

				switch (type){
					case "href": return href;
					case "host": return host;
					case "path": return path;
					case "hash": return hash;
					default: return path;
				}
			},
			is:  function(obj, type) {
				// 判断对象类型
        return Object.prototype.toString.call(obj) === '[Object ' + type + ']';
    	},
    	has: function(container) {
    		// 判断元素是否存在
    		return $(container).length > 0;
    	},
			filename: function(path,type){
				// 分析文件类型
				// type = 0 -> ext , 1 -> front
				// 最后一个.的位置
				var ext = path.lastIndexOf(".");
				// 第一个.的位置,非相对目录,无后缀的路径会返回 -1
				var exti = path.indexOf('.');
				if (exti === -1){
					var last = path.split('/').pop();
      		path = path + '/' + last + '.js';
      		console.log(path);
				}
				var length = path.length;
				// .之后的类型
				var extname = path.substring(ext+1,length);
				// .之前的路径
				var frontpath = path.substring(0,ext);
				// 后缀长度大于5则返回整个路径
				if (extname.length > 5) {extname = path;}
				// (extname.length > 5) ? log("Don't need to have this file;") : extname;
				var re='';
				if (type) {re = frontpath;} else {re = extname;}
				return re;
			},
			query: function(node){
				// 查询链接?后的node
				function getVars(){
					var vars = [], hash;
					var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
					for(var i = 0; i < hashes.length; i++)
					{
					  hash = hashes[i].split('=');
					  vars.push(hash[0]);
					  vars[hash[0]] = hash[1];
					}
					return vars;
				}
				return getVars()[node];
			},
			toMobile: function(id){
				// 跳转到移动页面
				// var url = "http://m.bdzcf.com";
				var url = "http://localhost:3000";
				$(id).click(function(){
					window.open (url, 'BDZCF in Mobile', 'height=auto, width=320, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
				});
			},
			tpl: function(t,data){
				// use template.js
				var render = template.compile(t);
				var html = render(data);
				return html;
			}
		},
		pageview: {
			getbanner: function(){
				// var api = basePath+"/banner/getBannerImage?callback=?";
				var api = "/static/api/getBannerImage.json",
				    type ="get",
				    json;
				zcf.ext.zget(api,type,"",function(data){
					json = data;
				});
				// console.log(zcf.ext.zget(api,type,""))
				return json;
			},
			// getpost: function(){
			// 	var api = basePath + "/project/list/condition?callback=?";
			// 	var type = "post";
			// 	var json = zajax(api,type);
			// 	console.log(json);
			// },
			// getnews: function(){
			// 	var api = basePath + "/message/getNews?callback=?";
			// 	var type = "post";
			// 	var json = zajax(api,type);
			// 	console.log(json);
			// },
			slider: function(container){
				// use amazeui.min.js
				$(container).flexslider({
				            controlNav: true,
				            directionNav: true
				        });
			},
			offTime: function(){
				//container,time_data,offset,type
				var container = $("*[data-offtime]");

				if ( container.length < 1) {
					return false;
				} else {
					console.log("Start Time.");
					container.each(function() {
						var time_data = $(this).attr("data-offtime");
						time_data = zcf.pageview.dateFormat(time_data,"yyyy/MM/dd hh:mm:ss");
						// 0结束，1开始
						var type = 1;
						var str;
					  if (type==1)  {str = "距离众筹开始还有： ";} else {str = "距离众筹结束还有：";}
					  container.find(".offTime-str").html(str);
					  downCount($(this),time_data);
					});
				}

				function downCount(container,time_data){

					var currentDate = function () {
	            // 获取客服端时间， 必要时改为服务器时间
	            var date = new Date();
	            // 时区
	            var offset = +8;
	            var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
	            var new_date = new Date(utc + (3600000*offset));
	            return new_date;
	        };

	        function countdown () {
	            var target_date = new Date(time_data), // set target date
	                current_date = currentDate(); // get fixed current date

	            var difference = target_date - current_date;

	            // 已结束的
	            if (difference < 0) {
	            		$(container).html("倒计时已中止！");
	                clearInterval(interval);
	                return;
	            }

	            var _second = 1000,
	                _minute = _second * 60,
	                _hour = _minute * 60,
	                _day = _hour * 24;

	            var days = Math.floor(difference / _day),
	                hours = Math.floor((difference % _day) / _hour),
	                minutes = Math.floor((difference % _hour) / _minute),
	                seconds = Math.floor((difference % _minute) / _second);

	                days = (String(days).length >= 2) ? days : '0' + days;
	                hours = (String(hours).length >= 2) ? hours : '0' + hours;
	                minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
	                seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;

	            $(container).find('.days').text(days);
	            $(container).find('.hours').text(hours);
	            $(container).find('.minutes').text(minutes);
	            $(container).find('.seconds').text(seconds);
	        }

	        var interval = setInterval(countdown, 1000);

				}
			},
			dateFormat: function (dateString,format) {
			            if(!dateString)return "";
			            var time = new Date(dateString.replace(/-/g,'/').replace(/T|Z/g,' ').trim());
			            var o = {
			                "M+": time.getMonth() + 1, //月份
			                "d+": time.getDate(), //日
			                "h+": time.getHours(), //小时
			                "m+": time.getMinutes(), //分
			                "s+": time.getSeconds(), //秒
			                "q+": Math.floor((time.getMonth() + 3) / 3), //季度
			                "S": time.getMilliseconds() //毫秒
			            };
			            if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
			            for (var k in o)
			                if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			            return format;
			        },
			resizeImg: function(con,type,sw,sh){
				// 可设置要显示的图片范围 1920*640 -> 960*480的内容必须显示
				// 全屏背景大图自动等比例拉伸以适应窗口。

				var win = $(window);
						con = $(".img-re");

				// if (con == "" || typeof(con) == "undefined") {
				// 	con = $(".img-re");
				// 	win = $(window);
				// }	else {
				// 	con = $(con)
				// 	win = $(con).parent()
				// }

				// log(win)
				if (con.length < 1) {
					return;
				} else {
					con.each(function(){
						var self = this;
						resize(self);
						window.onresize = function(){
							resize(self);
						};
						// log(con)
					});

				}

				function resize(src,real){
					// 是否获取真实图片大小
					if( real == 1 ){
						// var img = new Image();
						img.src = src.src;
					} else {
						var img = src;
						re();
					}

					function re() {
						var winH = win.height();
						var winW = win.width();
						var winR = winW / winH;
						var imgH = img.height;
						var imgW = img.width;
						var imgR = imgW / imgH;
						var off;
						// log(imgW)
						// log("W:"+winR)
						// log("R:"+imgR)
						// winR > 1 宽>高，winR<1 宽<高
						// imgR >1 宽>高，imgR<1 宽<高
						if(winR <1 && imgR > winR) {
							img.height = winH;
							img.width = winH * imgR;
							off = (img.width - winW) / 2;
							img.style.marginLeft = -off + "px";
							// log(1);
						} else if(winR <1 && imgR < winR) {
							img.height = winH;
							img.width = winH * imgR;
							off = (img.width - winW) / 2;
							img.style.marginLeft = -off + "px";
							// log(2)
							} else if (winR >1 && imgR > winR){
							img.height = winH;
							img.width = winH * imgR;
							off = (img.width - winW) / 2;
							img.style.marginLeft = -off + "px";
							// log(3)
						} else if (winR >1 && imgR < winR){
							img.width = winW;
							img.height = winW / imgR;
							off = (img.width - winW) / 2;
							img.style.marginLeft = -off + "px";
							// log(4)
						}
					}

				}
			},
			setBanner: function(){
				// 默认图片大小:1920x650
				// 安全显示区域:1040x650
				// 新容器大小 1920x450
				// 1440以上屏幕，上下左右删减居中
				// 1040以上1440以下，高宽100%自动使用图片大小
				// 320 < x < 1040 等比缩小，左右裁剪居中
				// 适配图片太大的情况,居中显示
				var ro = 1920 / 650;
				var neh = 450;
				var ri = 1.7;
				var safa = 1040;
				$("#banner .am-slides img").each(function(){
					var self =this;
					resize(self);

				});

				function resize(opt){
					var wW = $(window).width();
					var wH = wW / 1.7;
					// log(wW);

					if (wW >= 1460 ){
						// $(opt).width(1920)
						// $(opt).css("margin-left",-(1920 - wW)/2 );
						// $(opt).css("margin-top",-(650-450)/2);
						$(opt).width("100%");
						$(opt).height("100%");
						$(opt).css("margin",0);
						$("#banner").css("max-height","650px");
					} else if (safa < wW && wW <1440){
						$(opt).width("100%");
						$(opt).height("100%");
						$(opt).css("margin",0);
						$("#banner").css("max-height","450px");
						// log(1)
					} else if (320<= wW && wW < 720 ){
						// $("#banner").height(wH);
						$(opt).height(wH);
						$(opt).width(wH * ro);
						// log(2)
						$(opt).css("margin-left",-(wH * ro - wW)/2 );
						$("#banner").css("max-height","450px");
					}
				}
			},
			pageside: function(){
				// init page-sidebar 包括 用户中心的侧边栏
				if(zcf.ext.has(".page-sidebar")){

					$(".page-sidebar li a.active").removeClass('active');

					// 初始根据url来为制定匹配的a href=url添加active
					var path = zcf.ext.url();
					var act = $("a[href='"+path+"']");
					act.addClass('active');
					if(act.parent().parent().hasClass('subNav')){
								act.parent().parent().css("display","block");
							}

					// 监测侧边栏链接;
					$(".page-sidebar a").on({
						click: function(){
							$(".page-sidebar li a.active").removeClass('active');
							$(this).addClass('active');

							if($(this).parent().parent().hasClass('subNav')){
								$(this).parent().parent().css("display","block");
							}
						}
					});

					$(".page-sidebar .hasSub").click(function(){
						var sub = $(this).find(".subNav");
						sub.toggle();
					});
				}
			},
			pro_sel: function(){
				var id,type;
				var api = "/product/list?";
				if (zcf.ext.has(".pro-list-sel")) {
					//类型筛选
					$(".pro-type-sel a").on({
						click: function(){
							var hash = $(this).attr('href');
							$(".pro-type-sel .active").removeClass('active');
							$(this).addClass('active');
						}
					});
					//状态筛选
				}
			},
			pro_star: function(){
				// 项目加是那个星星，根据#pro-star容器的starnume指定
				var star;
				var con = "#pro-star",
						numb = $(con).attr("starnume");
				if(typeof(numb) == "undefined") numb = '';
				// numb ? numb = numb : numb = 5;
				if (numb) {numb = numb; }else {numb =5;}
				if(zcf.ext.has(con)){
					starItem();
				}

				function starItem(){
					var stared = ' <span class="stared">&#xf005;</span> ';
					var unstared = ' <span class="star">&#xf006;</span> ';
					for(var i = 0;i<numb;i++){
						// log(i);
						$(con).append(stared);
					}
					if(numb < 5){
						numb = 5 - numb;
						for(i = 0;i<numb;i++){
							$(con).append(unstared);
						}
					}
				}
			},
			init_paymod: function(id) {
				// init paymodule container
				var heis = [{}],
						maxheis;
				if(zcf.ext.has(id)){
					$(id).each(function(i){
                heis[i] = $(this).height();
					});
					maxheis = Math.max.apply(null,heis);
					// console.log(heis,maxheis)
					$(id).height(maxheis);
				}
			},
			init_membernav: function() {
				// 用户导航下拉
				$(".member-stael").on({
					hover: function(){
						$(this).siblings('.member-drop').show();
						// console.log(this)
					},
					click: function(){
						$(this).siblings('.member-drop').toggle();
					}
				});
			},
			init_rside: function(){
				if(zcf.ext.has(".rside")){
					$(function(){
						if($(window).width() > 720) {
							$(window).scroll(function(){
								if($(window).scrollTop()>200){
									$(".rside ").fadeIn();
								}
								else{
									$(".rside").fadeOut();
								}
							});
							$(".show-qcode").click(function(){
								$("#qcode-modal").modal({
									"width":"1000"
								});
							});
							$(".rside .totop").click(function(){
								$('html,body').animate({'scrollTop':0},500);
							});
						}

					});

				}
			},
			rePage: function(){
				// var doc =$(window).height()
				// if(zcf.ext.has("#main")){
				// 	var mh = $("#main").height()
				// 	if (mh < doc){
				// 		$("#main").height(doc)

				// 	}
				// }

				if(zcf.ext.has(".page-sidebar")){
					var mh = $("#main").height();
					mh =+ 127;
					var ph = $(".page-sidebar").height();
					var con = $(".page-container").height();
					var win =$(window).height();
					// if (win > mh && ph < mh){
					// 	$(".page-sidebar").css("height",win+"px")
					// } else if (win < mh && ph < mh) {
					// 	$(".page-sidebar").css("height","auto")
					// }
				}
			}
		},
		pageload: {
			loading: "/static/loading.gif",
			load: function(page){
				//
			}
		},
		pageChange: {
			// 页面载入加载等
			// 拦截a标签
			// ajax加载内容到指定container
			container: "#main",
			loading_icon: "/static/img/loading.gif",

			// 确定目录级数
			isTop : (location.pathname.split("/").length == 2),
			currentHash:"",
			preHash:"",

			init: function(){},
			hashChange : function(hash,sub_hash){

				console.log("hash : "+hash);
				console.log("this.prevHash : "+this.prevHash);
				console.log("this.isTop : "+this.isTop);

				if(hash == this.prevHash) return;

				this.lock();

				if(hash === "" || hash === "/"){
					// to top
					document.title = def_title;


					this.isTop = true;

				}


				this.prevHash = hash;
			}
		},
		user: {
			cret_sign: function(){
				// 签到
				var api = "/user/cret_sign";
				var id = ".user-sign-button";
				if(zcf.ext.has(id)){
					$(id).on({
						click: function(){
							alert("签到成功");
							// 看看怎么发送api给后台来确认签到状态
							$(this).html("已签到");
							$(this).attr({"disabled":"disabled"});
						}
					});
				}

			},
			login: function(){
				// 登录
				var api = "/user/login";
				if(zcf.ext.has(".toLogin")){
					// log(1);
				}
			},
			signup: function(){
				// 注册
				var api = "/user/signup";

			},
			logout: function(){
				cleanCookie();
			},
			vaild: function(){
				// 表单验证
			},
			sendPhoneCode: function(){
				// 手机确认码
			},
			setCookie: function(){
				//
			},
			cleanCookie: function(){

			}
		},
		use: function(path){
			// 构建use方法，用来加载文件，不负责解决依赖问题，不指定位置
			// 分析路径和后缀，根据后缀加载文件
			var type = this.ext.filename(path,1);

			if (type == "html" || type == "ztpl") {
				console.log("is Html template");
					// return 'template.compile(' + t + ');';
			} else if (type == "js"){
				var head = document.getElementsByTagName('head')[0];
				var script = document.createElement('script');
				script.src = path;
				script.type = 'text/javascript';
				head.appendChild(script);
			}
			log("use pat:" + path);
		},
		init : function() {
			console.log("voodeng will Init the page!");
			console.info(def_title);
			// TODO:通过body id 或 path 来区分初始化页面
			this.pageview.init_membernav();
			this.ext.toMobile(".toMobile");
			// this.pageview.resizeImg(".am-slider")
			if(zcf.ext.url()=="/") {
				this.pageview.setBanner();
				window.onresize = function(){
							zcf.pageview.setBanner();
							zcf.pageview.slider(".am-slider");
						};
			}
			this.pageview.offTime();
			this.pageview.slider(".am-slider");
			this.pageview.resizeImg();
			this.pageview.init_rside();
			this.pageview.rePage();
			// $(zcf.ready);
		},
		moca: {
			// 测试用路由路径等
		},
		ready: (function(){
			var self = function(){
				self.setupHashEvent();
				// console.log(self)
			};

			self.setupHashEvent = function(){
				// 拦截href=/开头的a标签
				$(document).on("click",'a[href^="/"]',function(){

					location.hash = $(this).attr("href");
					return false;
				});

				$(window).on("hashchange",function(){
					console.log(location.hash);
					var hash;
					if(location.hash === ""){
						hash =["/","/",undefined];
					}else{
						hash = location.hash.match(/^#(\/\w*\/?)(#\w+)?/);
						// 预计产出格式
						// ["#/page/", "/page/", undefined, index: 0, input: "#/page/contact"]
						// hash = location.hash.match(/^#(\/\w*\/?)(#\w+)?(\/\w+\/?)?/);
					}
					log(hash);
				});
			};

			return self;
		})()
	};
	window.zcf = zcf;
})(jQuery);

// Plugin
