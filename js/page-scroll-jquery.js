/**
*	Description: 触屏移动设备网页滑动整页切换实现
*	Param: param={'page':'.page'}, page 为要实现滑动切换的页面类名
*	Call: $('#page-wrap').pageSlideSwicth({'page':'.page', 'lim-w':false})
*	Author: jianjian
*	CreatedTime: 2014-11-21 16:29
*   Remark: 当lim-w为true时页面最大的宽度为480px
*	Revise: 当前显示的页面添加act类名
* 	ReviseTime: 2015-01-05 18:40
*/

;!function($){
	$.fn.pageSlideSwitch = function(param){

		var w_w = $(window).width();
		var w_h = $(window).height();

		var arg = $.extend({}, $.fn.pageSlideSwitch.defaultParam, param);
		
		return this.each(function(index, val){//val是所有页面的父级包裹的div
			//初始化页面
			if(arg['lim-w']){
				$(val).css({'width':w_w<480?w_w:480, 'height':w_h, 'position':'relative', 'overflow':'hidden'});
			}else{
				$(val).css({'width':w_w, 'height':w_h, 'position':'relative', 'overflow':'hidden'});
			}
		
			$(val).data('idx', 0);		//起始页面为0;
			var pages = $(arg.page); 	//获取所有要显示的页面
			var len   = pages.length;
			for(var i=0; i<len; i++){
				$(pages[i]).css({
					'position':'absolute',
					'top':'0',
					'left':'0',
					'right':'0',
					'bottom':'0',
					'width':'100%',
					'height':'100%',
					'overflow':'hidden',
					'-webkit-transform':'translate3d(0, ' + i*w_h + 'px, 0)',
					'transform':'translate3d(0, ' + i*w_h + 'px, 0)'
				});
			}

			var t_x, t_y;	//触摸开始时的坐标值
			var starttime;  //触摸开始时的时间值
			var gapX;		//滑动结束时，在x轴滑动的距离
			var gapY;		//滑动结束时，在y轴滑动的距离
			//触摸开始
			function touchStartHandle(evt){
				evt.preventDefault();
				var touches = evt.originalEvent.touches;
				t_x = touches[0].pageX;
				t_y = touches[0].pageY;
				starttime = (new Date())*1;
			};
			//滑动
			function touchMoveHandle(evt){
				evt.preventDefault();
				var touches = evt.originalEvent.touches;
				var _x  = touches[0].pageX;
				var _y  = touches[0].pageY;
				gapY = _y - t_y; //触摸纵向移动的距离
				gapX = _x - t_x; //触摸横向移动的距离
				// console.log('gapY = ' + gapY);
				// console.log('gapX = ' + gapX);

				var _idx = $(val).data('idx');//获取当前显示的页面的索引值

				var i = _idx - 1;
				var m = i + 3;

				// console.log('_idx = ' + _idx);
				// console.log('   m = ' + m);

				//滑动时改变页面元素的位置
				for(i; i<m; i++){
					pages[i] && $(pages[i]).css({'-webkit-transition':'-webkit-transform 0s ease-out', 'transition':'transform 0s ease-out'});
					pages[i] && $(pages[i]).css({'-webkit-transform':'translate3d(0, ' + ((i-_idx)*w_h + gapY) +  'px, 0)', 'transform':'translate3d(0, ' + ((i-_idx)*w_h + gapY) +  'px, 0)'});
				}
			};
			//触摸结束
			function touchEndHandle(evt){
				evt.preventDefault();
				var touches = evt.originalEvent.touches;
				
				
				var threshold = w_h/6; //设置移动距离的阀值
				var endtime   = (new Date())*1;

				// console.log('%cthreshold = ' + threshold, 'color:red');
				//当手指移动时间超过300ms 的时候，按位移算
				if(endtime - starttime > 300){
					if(gapY >= threshold){//下拉
						// console.log('%c下拉换页', 'color:blue');
						goIndex(-1);
					}else if(gapY < 0 && gapY < -threshold){//上拉
						// console.log('%c上拉换页', 'color:blue');
						goIndex(1);
					}else{//复位
						// console.log('%c复位', 'color:blue');
						goIndex(0);
					}
				}else{
					//优化
					//快速移动也能使得翻页
					if(gapY > 50){
						goIndex(-1);
					}else if(gapY < -50){
						goIndex(1);
					}else{
						goIndex(0);
					}
				}

				t_x = 0; //清除起始触摸时记录的值
				t_y = 0;
				starttime = 0;
			};

			function goIndex(n){
				var _idx = $(val).data('idx');
				var cidx = _idx + n;

				var len = pages.length;
				//当索引右超出
				if(cidx > len-1){
					cidx = len - 1;
				//当索引左超出	
				}else if(cidx < 0){
					cidx = 0;
				}

				$(val).data('idx', cidx);//保留当前显示的页面的索引值
				pages.removeClass('act');
				//修改页面过度的方式
				pages[cidx-1] && $(pages[cidx-1]).css({'-webkit-transition':'-webkit-transform 0.2s ease-out', 'transition':'transform 0.2s ease-out'});
				pages[cidx]   && $(pages[cidx]).css({'-webkit-transition':'-webkit-transform 0.2s ease-out', 'transition':'transform 0.2s ease-out'});
				pages[cidx+1] && $(pages[cidx+1]).css({'-webkit-transition':'-webkit-transform 0.2s ease-out', 'transition':'transform 0.2s ease-out'});

				pages[cidx-1] && $(pages[cidx-1]).css({'-webkit-transform':'translate3d(0, ' + (-w_h) + 'px, 0)', 'transform':'translate3d(0, ' + (-w_h) + 'px, 0)'});
				pages[cidx]   && $(pages[cidx]).css({'-webkit-transform':'translate3d(0, 0, 0)', 'transform':'translate3d(0, 0, 0)'}).addClass('act');
				pages[cidx+1] && $(pages[cidx+1]).css({'-webkit-transform':'translate3d(0, ' + (w_h) + 'px, 0)', 'transform':'translate3d(0, ' + (w_h) + 'px, 0)'});
			}

			$(val).on('touchstart', touchStartHandle);
			$(val).on('touchmove', touchMoveHandle);
			$(val).on('touchend', touchEndHandle);
		});
	};

	$.fn.pageSlideSwitch.defaultParam = {
		'page': '.page',
		'lim-w': true
	};
}(jQuery);