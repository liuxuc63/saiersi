KG.WYJ.Scroll = (function(){
	// OOP
	// 定义构造函数/类      第一段
	var Obj = function(options){
		// 设计一个方法，专门处理属性的
		this._setPara(options);
	};
	
	// 在原型对象上添加方法     第二段
	Obj.prototype = {
		constructor: Obj, // 修正一下构造函数的指针
		author: 'WYJ',
		verson: '1.00',
		init: function (){ // 入口方法     共有方法
			// 样式的初始化     健壮性
			this._setScrollStyle();
			
			this.iMoveLen = this.$scrollWrapper.find('li').eq(1).position().left;
			console.log(this.iMoveLen);
			
			// 给箭头绑定事件
			this._bindArrowEvent();	
		},
		_bindArrowEvent: function(){
			var _this = this;
			this.$scrollArrow[0].off('click').on('click', function(){
				_this._moveRight();
			});
			this.$scrollArrow[1].off('click').on('click', function(){
				_this._moveLeft();
			});
		},
		_moveRight: function(){
			if (this.state != 'ready'){
				return;
			}
			this.state = 'stop';
			var _this = this;
			// 因为 通过jQuery获取的 this.$aLiList 失去了时时性，所以需要重新获取
			this.$aLiList = this.$scrollWrapper.find('li');
			// 节点的克隆
			var $oCloneLi = this.$aLiList.last().clone(true);
			// 插入节点    前
			this.$aLiList.eq(0).before($oCloneLi);
			// 立马改变 left 值
			this.$scrollWrapper.children('ul').css({
				'left': -1 * _this.iMoveLen
			});
			// 让 UL 运动
			this.$scrollWrapper.children('ul').animate({
				left: 0
			}, function(){
				_this.$aLiList.last().remove();
				_this.state = 'ready';
			});
		},
		_moveLeft: function(){
			if (this.state != 'ready'){
				return;
			}
			this.state = 'stop';
			var _this = this;
			// 因为 通过jQuery获取的 this.$aLiList 失去了时时性，所以需要重新获取
			this.$aLiList = this.$scrollWrapper.find('li');
			// 克隆第一个节点
			var $oCloneLi = this.$aLiList.eq(0).clone(true);
			// 科隆之后的节点追加
			this.$scrollWrapper.children('ul').append($oCloneLi);
			// 让 UL 运动
			this.$scrollWrapper.children('ul').animate({
				left: -1 * _this.iMoveLen
			}, function(){
				// 移除第一个子节点
				_this.$aLiList.eq(0).remove();
				// 把 UL left 值 改成 0
				$(this).css({
					'left': 0
				});
				_this.state = 'ready';
			});
		},
		_setScrollStyle: function(){
			this.$scrollWrapper.css({
				'overflow': 'hidden',
				'position': 'relative'
			}).children('ul').css({
				'width': 10000,
				'position': 'absolute',
				'left': 0
			});
		},
		_setPara: function(option){ // 设置参数
			this.$scrollWrapper = option.$scrollWrapper;
			this.$scrollArrow = option.$scrollArrow || [];
			this.callback = option.callback || null;
			
			this.state = 'ready'; // 准备好了
		},
		remove: function(){ // 移除组件
			// 事件的解绑
			this.$scrollArrow[0].off('click');
			this.$scrollArrow[1].off('click');
			// 释放内存
			for (var i in this){
				this[i] = null;
			}
		}
	};
	
	// 公开接口
	return Obj;
})();

// 调用的示例
//var oScroll = new KG.WYJ.Scroll({
//	$scrollWrapper: $('.scroll_main'),
//	$scrollArrow: [$('.btn_left'), $('.btn_right')],
//	callback: function(){
//		
//	}
//});
//oScroll.init();