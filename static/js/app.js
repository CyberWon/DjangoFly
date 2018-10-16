/**
 @ Name：vip-admin.template
 @ Author：随丶
 @ version：1.3.0
 */
layui.define(['layer','laytpl'], function (exp) {
    "use strict";

    var $       = layui.$
    ,device     = layui.device()
    ,layer      = layui.layer
    ,laytpl     = layui.laytpl
    ,dom        = $(document)
    ,idx        = 0
    ,cfg        = layui.data('app')['config']?JSON.parse(layui.data('app')['config']):{}

    // 字符常量
    ,MOD_NAME           = '#VIP_app'            // 应用
    ,MOD_TITLE          = '.vip-title'          // 标题
    ,MOD_NAV            = '.vip-nav'            // 导航
    ,MOD_HREF           = '[vip-href]'          // 跳转属性
    ,MOD_BODY           = '.vip-body'           // 内容框架
    ,MOD_ASIDE          = '.vip-aside'          // 右侧面板
    ,MOD_TOUCH          = '.vip-touch'          // 触摸操作面板
    ,MOD_REFRESH        = '.vip-refresh'        // 右侧面板刷新
    ,MOD_CLOSE          = '.vip-close'          // 右侧面板关闭
    ,MOD_OTHER_CLOSE    = '.vip-other-close'    // 右侧面板关闭
    ,MOD_OUT            = '.vip-out'            // 系统关闭

    // 外部接口
    ,app = {
        // 版本
        version: '1.3.0'
        // 默认全局配置项
        ,config: {
            title: '后台管理模板'
            ,logo: '../img/web/logo.png'
            ,bodyTitle: '仪表板'
            ,bodyHref: 'dashboard.html'
            ,loading: '<div class="sk-rotating-plane"></div>'
            ,scrollTopVal: 15
            ,asideMaxNum: 10
            ,asideMaxMsg: '面板数量已超最大值'
            ,navWidth: 6
            ,isTitleShow: true
            ,hexDefaultLength: 10
            ,method: 'get'
            ,msg: '消息'
            ,msgOffset: '150px'
            ,errMsg: '接口格式数据出错'
            ,tabMsg: '保留一个选项卡'
            ,entryErrMsg: '常用快捷入口接口数据出错'
            ,thingErrMsg: '待办事项接口数据出错'
            ,noticePanelErrMsg: '公告列表接口数据出错'             // 1.3.0
            ,userErrMsg: '最新用户列表接口数据出错'                 // 1.3.0
            ,ajaxErrMsg: '缺少必要参数[URL]'                      // 1.3.0
            ,ajaxSuccessCode: 0                                // 1.3.0
            ,themeSrc: '../css/theme/'                         // 1.2.1
            ,touchTitle: '触控面板(左右滑动丶单击)'                // 1.2.1
            ,broVer: 9
            ,broVerMsg: '如果您非得使用ie浏览,那么请使用ie9+'
            ,out: function(){
                layer.confirm('退出?', {title:'提示'}, function(index){
                    layer.close(index);
                });
            }
        }
        // 视图渲染(模型视图，数据源，添加的dom)
        ,viewTpl: function(tpl,data,el){
            laytpl($(tpl).html()).render(data, function(html){
                $(el).html(html);
            });
        }
        // 加密(字符串，长度)
        ,hex: function(str,num) {
            var val = "";
            for (var i = 0; i < str.length; i++) {
                if (val == "") val = str.charCodeAt(i).toString(16);
                else val += str.charCodeAt(i).toString(16);
            }
            return val.substr(0,num||cfg.hexDefaultLength);
        }
        // 存储数据
        ,setData: function(name,key,val){
            layui.data(name, {
                key: key
                ,value: val
            });
        }
        // 获取数据
        ,getData: function(name,key){
            var info = layui.data(name);
            return info[key];
        }
        // 更新数据
        ,upData: function(name,key,val){
            app.setData(name,key,val);
        }
        // 删除数据
        ,delData: function(name,key){
            layui.data(name, {
                key: key
                ,remove: true
            });
        }
        // 对象 转 json字符串
        ,objToStr: function(json){
            return JSON.stringify(json);
        }
        // json字符串 转 对象
        ,strToObj: function(str){
            return JSON.parse(str);
        }

        // 导航栏
        ,nav: function(obj){
            $[cfg.method||'get'](obj.url,obj.where||{},function(res){
                if(res.code == cfg.ajaxSuccessCode||0){
                    res = $.extend({},res,{cfg:obj.cfg});
                    app.viewTpl(obj.tpl,res,obj.el);
                    if(!app.getData('app','tab')){
                        var title = cfg.bodyTitle,href = cfg.bodyHref;
                        app.setData('app','tab',app.objToStr([{title:title,href:href,key:app.hex(title+href),now:1}]));
                    }
                    app.tab(app.strToObj(app.getData('app','tab')));
                }else{
                    app.msg(res.msg||cfg.errMsg);
                }
            },'json');
        }
        // 渲染tab
        ,tab: function(list){
            app.viewTpl('#tabTpl',list,MOD_ASIDE);
        }
        // 添加一个tab
        ,addTab: function(title,href){
            var tab = []
            , key = app.hex(title+href)
            , obj = {title:title,href:href,key:key}
            , strTab = app.getData('app','tab')
            , isIdx = -1;

            if(strTab){
                tab = app.strToObj(strTab);
            }

            // 遍历选项卡合集
            $.each(tab,function(k,v){
                tab[k].now = 0;
                if(v.key == key){
                    isIdx = k;
                    tab[k].now = 1;
                }else{
                    obj.now = 1;
                }
            });
            if(isIdx<0){

                if(tab.length >= cfg.asideMaxNum){
                    app.msg(cfg.asideMaxMsg);
                    return false;
                }

                tab.push(obj);
            }else{
                tab[isIdx].now = 1;
            }
            // 设置选项卡合集
            app.setData('app','tab',app.objToStr(tab));
            // 渲染Tab
            app.tab(tab);
        }
        // 删除tab
        ,delTab: function(){
            var href = $(MOD_BODY).attr('src')
            , tab = app.strToObj(app.getData('app','tab'));
            if(tab.length != 1){
                $.each(tab,function(k,v){
                    if(v && v.href && href == v.href){
                        tab.splice(k,1);
                        var idx = -1;
                        if(k == tab.length){
                            idx = k-1;
                        }else{
                            idx = k;
                        }
                        tab[idx].now = 1;
                        app.bodyHref(tab[idx].href);
                    }
                });
            }else{
                app.msg(cfg.tabMsg);
            }
            app.setData('app','tab',app.objToStr(tab));
            // 渲染tab
            app.tab(tab);
        }
        // 删除其他所有tab
        ,delOtherTab: function(){
            var tab = app.strToObj(app.getData('app','tab')),nowTab=[];
            $.each(tab,function(k,v){
                if(v && v.now == 1){
                    nowTab.push(v);
                }
            });
            app.setData('app','tab',app.objToStr(nowTab));
            // 渲染tab
            app.tab(nowTab);
        }
        // 点击跳转 通过（标题，连接，是否新选项卡） 1.3.0更新
        ,hrefApi: function(title,href,blank){
            console.log(title,href,blank);
            if(href && title){
                if(blank){
                    window.open(href);
                    return false;
                }
                app.loading();
                app.addTab(title,href);
                app.bodyHref(href);
            }else{
                app.msg('空链接');
                app.close();
            }
        }
        // 子窗口跳转页面 通过自身this 1.3.0
        ,href: function(t){
             var title = $(t).attr('vip-title')||$(t).attr('title')||$(t).html()
             ,href = $(t).attr('vip-href')
             ,blank = $(t).attr('vip-blank')||false;
            app.hrefApi(title,href,blank);
        }
        // 子页面跳转
        ,bodyHref: function(url){
            $(MOD_BODY).attr('src',url);
        }

        // 赋值 1.3.0
        ,val: function(elArr,valArr,fArr){
            $.each(elArr,function(k,v){
                $(v)[fArr?fArr[k]:'html'](valArr[k]);
            })
        }

        // 弹出通知层
        ,msg: function(str){
            layer.msg(str||cfg.msg, {offset: cfg.msgOffset});
        }
        // 公告
        ,notice: function(content,yFunc,sFunc){
            layer.open({
                type: 1
                ,title: false
                ,closeBtn: false
                ,area: '300px'
                ,shade: 0.8
                ,btn: ['前往', '拒绝']
                ,btnAlign: 'c'
                ,moveType: 1
                ,content: '<div class="vip-alert-notice-box">'+content+'</div>'
                ,success: sFunc
                ,yes: yFunc
            });
        }
        // 公告面板 1.3.0
        ,noticePanel: function(obj){
            app.ajaxTpl(obj,cfg.noticePanelErrMsg);
        }
        // 用户 1.3.0
        ,user: function(obj){
            app.ajaxTpl(obj,cfg.userErrMsg);
        }
        // 加载层
        ,loading: function(html){
            var that = this, BODY = $(MOD_BODY);
            var idx = layer.load(0, {zIndex: 10, skin: 'vip-loading-box',shade: 0, content: html||cfg.loading});
            BODY.load(function() {
                that.close(idx);
                BODY.contents().scroll(function(){
                    if($(this).scrollTop() > cfg.scrollTopVal){
                        app.titleAniM(false);
                    }else{
                        app.titleAniM(true);
                    }
                });
            });
        }
        // 关闭层
        ,close: function(idx){
            idx?layer.close(idx):layer.closeAll('loading');
        }
        // 二级导航
        ,subNav: function(that,n){
            $('.vip-nav-user li i, .vip-nav-btn li i').removeClass('active');
            that.addClass('active');
            idx = layer.tips(that.next('.vip-sub-nav').html(), that, {
                skin: 'vip-layer-sub-nav'
                ,shade: 0
                ,tips: [n||1, 'white']
                ,shadeClose : true
                ,time: false
            });
        }
        // 标题栏展开与关闭动画
        ,titleAniM: function(flag){
            if(flag){
                if(!$(MOD_TITLE).hasClass('active')){
                    $(MOD_TITLE).addClass('active');
                }
            }else{
                $(MOD_TITLE).removeClass('active');
            }
        }

        // 主题
        ,theme: function(obj){
            app.setData('app','themeSrc',obj.cfg.src||cfg.themeSrc);
            app.setData('app','theme', app.objToStr(obj.list) );
            app.viewTpl(obj.tpl,obj,obj.el);
            var nowTheme = app.getData('app','nowTheme');
            if(nowTheme){
                app.setTheme(nowTheme);
            }
        }
        // 去除主题
        ,delTheme: function(){
            $('[id^=layuicss-csstheme]').remove();
        }
        // 设置主题
        ,setTheme: function(type){
            var list = app.strToObj(app.getData('app','theme'));
            app.delTheme();
            $.each(list,function(k,v){
               if(v.skin == type){
                   if(type != 'default'){
                       app.setData('app','nowTheme',type);
                       layui.link(app.getData('app','themeSrc')+type+'.css',1);
                   }else{
                       app.setData('app','nowTheme','');
                   }
               }
            });
        }

        // ajax 1.3.0
        ,ajaxTpl: function(obj,errMsg){
            if(obj.url){
                $[cfg.method||'get'](obj.url,obj.where||{},function(res){
                    if(res.code == cfg.ajaxSuccessCode||0){
                        app.viewTpl(obj.tpl,res,obj.el);
                        if(obj.done && typeof(obj.done) === 'function'){
                            obj.done();
                        }
                    }else{
                        app.msg(errMsg||cfg.errMsg);
                    }
                },'json');
            }else{
                app.msg(cfg.ajaxErrMsg);
            }
        }

        // logo
        ,logo: function(obj){
            app.viewTpl(obj.tpl,{logo:obj.logo,title:obj.title,href:obj.href},obj.el)
        }
        // 常用快捷入口
        ,entry: function(obj){
            app.ajaxTpl(obj,cfg.entryErrMsg);
        }
        // 待办事项
        ,thing: function(obj){
            app.ajaxTpl(obj,cfg.thingErrMsg);
        }

        // 刷新本窗体(页面连接)
        ,refresh: function(){
            app.loading();
            app.bodyHref($(MOD_BODY).attr('src'));
        }
        // 获取表格选中的ids(选中的数据)
        ,getIds: function(res){
            var ids = '';
            if(res && res.length>0){
                $.each(res,function(k,v){
                    ids += v['id']+',';
                });
                ids = ids.substr(0,ids.length-1);
            }
            return ids;
        }
        // 设置全局项
        ,set: function (opts) {
            return $.extend({}, app.config, opts);
        }
        // 返回浏览器类型
        ,browser: function(){
            var userAgent = navigator.userAgent;
            var isOpera = userAgent.indexOf("Opera") > -1;
            if (isOpera) {
                return "Opera"
            }
            if (userAgent.indexOf("Firefox") > -1) {
                return "Firefox";
            }
            if (userAgent.indexOf("QQBrowser") > -1) {
                return "QQBrowser";
            }
            if (userAgent.indexOf("Safari") > -1) {
                return "Safari";
            }
            if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                return "IE";
            }
            if (userAgent.indexOf("Chrome") > -1) {
                if (window.navigator.webkitPersistentStorage.toString().indexOf('DeprecatedStorageQuota') > -1) {
                    return "Chrome";
                } else {
                    return "360";
                }
            }
        }
        // 收集信息
        ,collect: function(){
            var param = {domain:document.domain,url:window.location.href,browser:app.browser(),system:device.os};
            $.ajax({
                url: "http://site.vip-admin.com/index/collect/info",
                type : "post",
                dataType: "jsonp",
                jsonp: "callback",
                jsonpCallback: "callback",
                data: param,
                context: document.body,
                success: function(res) {
                    // do something...
                }
            });
        }
        // 默认执行方法
        ,run: function(opts){
            // 全局配置
            var cfgStr = app.objToStr( opts );
            app.setData('app','config',cfgStr);
            // 加载中...
            app.loading();
            // 标题
            $(MOD_TITLE).html(cfg.title);
            // 是否显示标题
            app.titleAniM(cfg.isTitleShow);
            // 子窗口页面
            var tabStr = app.getData('app','tab');
            if(tabStr){
                $.each(app.strToObj(tabStr),function(k,v){
                    if(v.now == 1){
                        app.bodyHref(v.href);
                        // logo
                        app.logo({
                            logo: opts.logo
                            ,title: v.title||opts.bodyTitle
                            ,href: v.href||opts.bodyHref
                            ,tpl: '#logoTpl'
                            ,el: '.vip-nav-logo'
                        });
                    }
                })
            }
            else{
                app.bodyHref(opts.bodyHref);
                // logo
                app.logo({
                    logo: opts.logo
                    ,title: opts.bodyTitle
                    ,href: opts.bodyHref
                    ,tpl: '#logoTpl'
                    ,el: '.vip-nav-logo'
                });
            }
            // 收集信息
            if(!app.getData('app','isColl')){
                app.collect();
                app.setData('app','isColl',1);
            }
            // 设置touch面板信息
            $(MOD_TOUCH).html(cfg.touchTitle);

            // 退出登录
            dom.on('click',MOD_OUT,cfg.out);
        }
    }

    // 构造器
    ,Class = function (opts) {
        var that = this;
        cfg = that.config = app.set(opts);
        // 初始化
        that.init(that.config);
    };

    // 阻止IE10以下访问
    if (device.ie && device.ie < app.config.broVer) {
        layer.alert(app.config.broVerMsg);
    }

    // 默认配置
    Class.prototype.config = {};

    // 初始化事件
    Class.prototype.init = function(opts) {
        var that = this;
        // dom监听
        that.domListen();
        // 挂载到win方法
        that.winFunc();
        // 触摸滑动
        that.touch();
        // 开始运行默认方法
        app.run(opts);
    };

    // dom 监听
    Class.prototype.domListen = function() {

        // 监听主题
        dom.on('click','[vip-theme]',function(){
            app.setTheme($(this).attr('vip-theme'));
        });

        // 点击一级或者二级菜单的链接跳转到相应的页面 1.3.0 修改更新
        dom.on('click',MOD_HREF,function(){
            app.href(this);
        });

        // 监听刷新选项卡按钮
        dom.on('click',MOD_REFRESH,app.refresh);

        // 监听关闭选项卡按钮
        dom.on('click',MOD_CLOSE,app.delTab);

        // 监听关闭其他所有选项卡按钮
        dom.on('click',MOD_OTHER_CLOSE,app.delOtherTab);

        // 监听右侧选项卡进入操作
        dom.on('mouseenter',MOD_ASIDE,function(){
            $(this).addClass('active');
        });

        // 监听右侧选项卡离开操作
        dom.on('mouseleave',MOD_ASIDE,function(){
            $(this).removeClass('active');
        });

        // 监听二级菜单切换按钮
        dom.on('mouseenter','.vip-nav .vip-sub-nav .layui-card .layui-card-body span i',function(){
            $(this).addClass('active').siblings().removeClass('active');
            $(this).parent().parent().parent().find('.layui-card-body .layui-row')
            .eq($(this).index()).addClass('layui-show').siblings().removeClass('layui-show');
        });
    };

    // 挂载到win上的方法
    Class.prototype.winFunc = function(){
        // 子页面方便调用，以基本参数方式调用打开一个窗口 1.3.0
        window.appHrefApi = function(t,h,b){
            app.hrefApi(t,h,b);
        };
        // 子页面方便调用，以this方式调用打开一个窗口 1.3.0 修改更新
        window.appHref = function(t){
            app.href(t);
        };
        // 子窗体调用方法-获取数据表格ids
        window.appGetIds = function(res){
            return app.getIds(res);
        };
    };

    // 触摸
    Class.prototype.touch = function(){
        var startX,startY;
        $(MOD_TOUCH).on("touchstart", function(e) {
            // 判断默认行为是否可以被禁用
            if (e.cancelable) {
                // 判断默认行为是否已经被禁用
                if (!e.defaultPrevented) {
                    e.preventDefault();
                }
            }
            startX = e.originalEvent.changedTouches[0].pageX, startY = e.originalEvent.changedTouches[0].pageY;
        });
        $(MOD_TOUCH).on("touchend", function(e) {
            // 判断默认行为是否可以被禁用
            if (e.cancelable) {
                // 判断默认行为是否已经被禁用
                if (!e.defaultPrevented) {
                    e.preventDefault();
                }
            }
            var moveEndX = e.originalEvent.changedTouches[0].pageX,
                moveEndY = e.originalEvent.changedTouches[0].pageY,
                X = moveEndX - startX,
                Y = moveEndY - startY,
                W = $(document).width();
            /*alert(X+','+Y);
            // 最左滑
            if ( (startX <= 10) && X > 0 ) {
                alert('最左滑');
            }
            // 最右滑
            else if ( (startX >= W-10) && X < 0 ) {
                alert('最右滑');
            }*/
            // 左滑
            if (  X > 0 ) {
                $(MOD_NAV).css('display','flex');
            }
            //右滑
            else if ( X < 0 ) {
                $(MOD_NAV).hide();
            }
            //单击
            else{
                //alert('单击');
                if($(MOD_ASIDE).hasClass('active')){
                    $(MOD_ASIDE).removeClass('active');
                }else{
                    $(MOD_ASIDE).addClass('active');
                }
            }
        });
    };

    // 核心入口
    app.init = function (opts) {
        return new Class(opts);
    };

    exp('app', app);
});
