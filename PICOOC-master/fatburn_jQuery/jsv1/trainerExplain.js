
$(function(){
	$(".content").css("height",$(window).height()+"px");
	appNoShare("运动能力测试");
	getLeftIcon();

	$(".btn").unbind("click").bind("click",function(){
		window.location.href="question1.html"+window.location.search;
	});
})


var deviceType=isMobile();
//设置左上角图标
function getLeftIcon(){
	var getPageInfo = function (){
		var data = {
			iconType:1,//0:默认箭头，1：叉，2：iconUrl传图片
			iconColor:"",
			backNum:1,
			closeWebview:0,
			hidden:false,
			isHandle:false,
			functionName:""
		};
		return JSON.stringify(data);
	};
    if(deviceType == "isApp" && (typeof mobileApp != "undefined")){
		if(getParamByUrl("os")=="android"){
			mobileApp.controlLeft(getPageInfo());
		}
		else{
			mobileApp.controlLeft.postMessage(getPageInfo());
		}
       //mobileApp.showLeftBtn(getPageInfo());
    }
    document.documentElement.style.webkitTouchCallout='none';
	
}

//设置标题
function appNoShare(title){
	var getPageInfo = function (){
		var data = {
			title:title,
			/*isShare:false,
			backgroundColor:'#2c2f31'*/
			color:"",
			opacity:"",
			backgroundColor:"",
			backgroundOpacity:""
		};
		return JSON.stringify(data);
	};
		if(deviceType == "isApp" && (typeof mobileApp != "undefined")){
			if(getParamByUrl("os")=="android"){
				mobileApp.controlTitle(getPageInfo());
			}
			else{
				mobileApp.controlTitle.postMessage(getPageInfo());
			}
		//mobileApp.getShareInfo(getPageInfo());
	}
	document.documentElement.style.webkitTouchCallout='none';
}