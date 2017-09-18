$(function(){

	/*初始状态*/
	init_load();
	
	/*签入*/
	$("#agentLogin_login").click(function(){
		addAttr(["#agentLogin_login"]);
		agentCallOperation_showLogin();
	});
	
	/*签出*/
	$("#agentLogin_logout").click(function(){
		agentLogin_doLogout();
		
	});
	
	/*外呼*/
	$("#agentStatusOutCall").click(function(){
		addAttr(["#agentCallAnswer"]);
		/*设置是否自动应答*/
		agentCallOperation_toSetAutoAnswer();
		agentCallOperationCallOut();
		
	});
	/*挂机*/
	$("#agentCallHangup").click(function(){
		agentCallOperation_toHangUp();
	});
	
	/*示忙*/
	$("#agentStatusSayBusy").click(function(){
		agentStatusOperation_toBusy();
	});
	
	/*示闲*/
	$("#agentStatusSayIdle").click(function(){
		agentStatusOperation_toIdle();
	});
	
	/*应答*/
	$("#agentCallAnswer").click(function(){
		agentCallOperation_toAnswer();
		addAttr(["#agentCallAnswer"]);
		$("#callDuration").html("");
		colorInt=window.clearInterval(colorInt);
	});

	/*保持*/
	$("#agentCallHold").click(function(){
		agentCallOperation_toHold();
		hideObj(["#agentCallHold"]);
		showObj(["#agentCallUnHold"]);
	});
	
	/*取消保持*/
	$("#agentCallUnHold").click(function(){
		agentCallOperationUnHold();
		hideObj(["#agentCallUnHold"]);
		showObj(["#agentCallHold"]);
	});
});

	/*初始状态*/
	function init_load(){
		addAttr(["#agentStatusOutCall,#agentCallAnswer,#agentCallHangup,#agentStatusInWork,#agentCallHold,#agentLogin_logout,#agentStatusRest,#agentStatusSayIdle"]);
		$("#agentLogin_login,#agentCallUnHold").css({"color":"white","cursor":"pointer"});
		hideObj(["#agentStatusSayBusy","#agentCallUnHold"]);
	}
	/*隐藏对象*/
	function hideObj(arr){
		var a = new Array();
		a = arr;
		for(var i=0;i<a.length;i++){
			$(a[i]).hide();
		}
	}
	/*显示对象*/
	function showObj(arr){
		var a = new Array();
		a = arr;
		for(var i=0;i<a.length;i++){
			$(a[i]).show();
		}
	}
	/*禁用按钮状态*/
	function addAttr(arr){
		var a = new Array();
		a = arr;
		for(var i=0;i<a.length;i++){
			$(a[i]).attr("disabled",true).css({"color":"#c7cad4","cursor":"no-drop"});
		}
	}
	/*恢复按钮可用状态*/
	function removeAttr(arr){
		var a = new Array();
		a = arr;
		for(var i=0;i<a.length;i++){
			$(a[i]).removeAttr("disabled").css({"color":"white","cursor":"pointer"});
		}
	}
	
	var int;
	var t = 0;
	function timeStart(){
		/*通话时长*/
		int = setInterval(function () {
		var nowtime = new Date();
		t = parseInt(t+1);
		var time = t;
		/*var day = parseInt(hour / 24);*/
		var hour = parseInt(minute / 60 % 60);
		var minute = parseInt(t / 60 % 60);
		var seconds = parseInt(t % 60);

		if(t > 0 && t < 60){
			var html =  seconds + "秒";
		}
		if(t == 60){
			var html =  "1分钟";
		}
		if(t > 60 && t < 60*60){
			var html =  minute + "分钟" + seconds + "秒";
		}
		if(t == 60*60){
			var html =  "1小时";
		}
		if(t > 60*60){
			var html = hour + "小时" + minute + "分钟" + seconds + "秒";
		}
		$('#callDuration').html(html);
	  }, 1000);
	}
	
	function timeEnd(){
		int=window.clearInterval(int);
	}

/*外呼响铃*/
	function agentOther_PhoneAlerting(){
		addAttr(["#agentCallAnswer,#agentStatusSayBusy,#agentStatusSayIdle,#agentStatusRest,#agentStatusInWork,#agentCallHold,#agentStatusOutCall,#agentLogin_logout,#agentCallHold"]);
		removeAttr(["#agentCallHangup"]);
		/*自动应答时，应答按钮不可选*/
		var value = $("input[name='agentSetting_autoAnswer']:checked").val();
		if(value==0){
			addAttr(["#agentCallAnswer"]);
		}
	}
/*挂机*/
	function agentOther_PhoneRelease(){
		addAttr(["#agentCallAnswer,#agentCallHangup,#agentStatusInWork,#agentCallHold,#agentLogin_login"]);
		removeAttr(["#agentStatusOutCall,#agentStatusSayBusy,#agentStatusRest,#agentStatusSayIdle,#agentLogin_logout"]);
		timeEnd();
		holdFlg=false;
		colorInt=window.clearInterval(colorInt);
		addAttr(["#agentCallAnswer"]);
		/*挂机后重新计时*/
		t=0;
		hideObj(["#agentStatusSayBusy"]);
		showObj(["#agentStatusSayIdle"]);
		$("#workStatus").html("会话小结");
	}
/*保持*/
	var holdFlg=false;
	function agentEvent_Hold(){
		holdFlg=true;
		addAttr(["#agentStatusSayIdle,#agentStatusRest,#agentStatusOutCall,#agentCallAnswer,#agentCallHangup,#agentStatusInWork,#agentCallHold,#agentLogin_login,#agentLogin_logout"]);
		removeAttr(["agentCallUnHold"]);
	}
/*接通电话*/
	function agentEvent_Talking(oneEvent){
		$("#callDuration").html("");
		$("#workStatus").html("通话中");
		if(!holdFlg){
			timeStart();
		}
		$("#caller").html((oneEvent.content.caller).replace("99903",""));
		$("#called").html((oneEvent.content.called).replace("99903",""));
		
		addAttr(["#agentCallAnswer,#agentStatusSayBusy,#agentStatusSayIdle,#agentStatusRest,#agentStatusInWork,#agentStatusOutCall,#agentLogin_logout"]);
		removeAttr(["#agentCallHangup,#agentCallHold"]);
	}
/*工作状态*/
	function agentState_Ready_Status(){
		agentCallOperation_toSetAutoAnswer();
	}
/*签入*/
	function agentOther_InService(){
		$("#workNo").html($("#agentLogin_agentId").val());
		$("#callId").html($("#agentLogin_phonenumber").val());
		$("#workStatus").html("空闲");
		addAttr(["#agentCallAnswer,#agentCallHangup,#agentStatusInWork,#agentCallHold,#agentLogin_login"]);
		removeAttr(["#agentStatusSayIdle,#agentLogin_logout,#agentStatusOutCall,#agentStatusSayBusy"]);
		showObj(["#agentStatusSayIdle"]);
		hideObj(["#agentStatusSayBusy"]);
	}
/*签出*/
	function agentOther_ShutdownService(){
		addAttr(["#agentCallAnswer,#agentStatusSayBusy,#agentStatusSayIdle,#agentStatusRest,#agentStatusInWork,#agentCallHold,#agentStatusOutCall,#agentCallHangup,#agentLogin_logout"]);
		removeAttr(["#agentLogin_login"]);
		$("#agentStatusRest").val("小休");
		$("#workNo").html("");
		$("#caller").html("");
		$("#called").html("");
		$("#callId").html("");
		$("#workStatus").html("");
		$("#callDuration").html("");
	}
/*示忙*/
	function agentState_SetNotReady_Success(){
		$("#workStatus").html("忙碌");
		hideObj(["#agentStatusSayBusy"]);
		showObj(["#agentStatusSayIdle"]);
		addAttr(["#agentCallAnswer,#agentCallHangup,#agentStatusInWork,#agentCallHold,#agentLogin_login"]);
		removeAttr(["#agentStatusOutCall,#agentStatusRest,#agentStatusSayIdle,#agentLogin_logout"]);
	}
/*示闲*/
	function agentState_CancelNotReady_Success(){
		$("#workStatus").html("空闲");
		hideObj(["#agentStatusSayIdle"]);
		showObj(["#agentStatusSayBusy"]);
		addAttr(["#agentStatusInWork,#agentCallHangup,#agentCallHold"]);
	}
/*示忙*/
	function agentState_Busy(){
		/*自动应答时，应答按钮不可选*/
		var value = $("input[name='agentSetting_autoAnswer']:checked").val();
		if(value==0){
			addAttr(["#agentCallAnswer"]);
		}
		/*设置是否自动应答*/
		agentCallOperation_toSetAutoAnswer();
		i = true;
	}
	/*转接中*/
	var i = true;
	function agentEvent_Ringing(){
		$("#agentCallAnswer").removeAttr("disabled").css({"color":"white","cursor":"pointer"});
		if(i){
			colorInt=window.setInterval(index, 600); //让index 多久循环一次
			i=false;
		} 
	}
	var colorInt;	
	function index(){
		setTimeout(" $('#agentCallAnswer').css('color','white')",500); //第一次闪烁
		setTimeout( "$('#agentCallAnswer').css('color','red')",100); //第二次闪烁
		$('#agentCallAnswer').css('color','#c7cad4');  //默认值
	};
/**
 * show the window about transfer
 */
var timer;
var winOpen;
function agentCallOperation_showLogin()
{
	$("#agentLogin_agentId").val("");
	$("#agentLogin_password").val("");
	$("#agentLogin_phonenumber").val("");
	$("#winFlag").val("");
	winOpen = window.open("./page/html/agentCall_login.html", "AgentTransfer", "left=" +  (window.screen.availWidth-600)/2 
			+ ",top=" + (window.screen.availHeight-500)/2
			+ ",width=350,height=250,scrollbars=no,resizable=no,toolbar=no,directories=no,status=no,menubar=no,location=no");
	timer=window.setInterval(login,500);
}

function login() { 
	var agentLogin_agentId = $("#agentLogin_agentId").val();
	var agentLogin_password = $("#agentLogin_password").val();
	var agentLogin_phonenumber = $("#agentLogin_phonenumber").val();
	var winFlag = $("#winFlag").val();
	if (winFlag == "true") { 
		window.clearInterval(timer);
		agentLogin_doLogin();
	}
	if (winOpen.closed == true) {
		removeAttr(["#agentLogin_login"]);
		window.clearInterval(timer);
	}	
} 

/*获取随路数据*/
function agentCallData_getCallData()
{
	var retJson = CallData.queryCallAppData({
		"agentid" : global_agentInfo.agentId
	});
	var retResult = retJson.retcode;
	if(global_resultCode.SUCCESSCODE != retResult)
	{
		console.log("queryCallAppData  failed. Retcode : " + retResult);
	}
	else
	{
		var data = convertCallData(retJson.result);
		//alert(JSON.stringify(data));
		
	}
}

/*字符串转成JSON*/
function convertCallData(cStr){
	var sStr = cStr.split(",");
	var callDataNames = new Array("ActivityId","CallDataId","Appointment","","CallCenterId","VDNID","SkillId","ActivityName","OutCallTableName","CustomerName","CallTime","BeginCallDate","TotalCallTime","TotalCalledTime","CallingNum","CallType","RingingTime","CalledNum","CallDetailId","PreviewOutboundType");
	for(var i = 0; i < sStr.length; i++){
		createJson(callDataNames[i], sStr[i]);
	}
	console.log(jsonStr);
	return jsonStr;
}
var jsonStr = {};
// 参数：prop = 属性，val = 值  
function createJson(prop, val) {  
    // 如果 val 被忽略  
    if(typeof val === "undefined") {  
        // 删除属性  
        delete jsonStr[prop];  
    }  
    else {  
        // 添加 或 修改  
        jsonStr[prop] = val;  
    }  
}

function agentCallData_setCallData()
{
	var callData = "test test test test test";
	var retJson = CallData.setCallAppDataEx({
		"agentid" : global_agentInfo.agentId,
		$entity : {
			"callid" : global_currentDealCallId,
			"calldata" :callData
		}
	});
	var retResult = retJson.retcode;
	if(global_resultCode.SUCCESSCODE != retResult)
	{
		alert("setCallAppDataEx  failed. Retcode : " + retResult);
	}
	else
	{
		agentCallData_getCallData();
	}
}
/*获取callId等 数据方法*/
function getContentData(){
	var contentData = $("#contentData").val();
	console.log("====>"+contentData);
	
	var data = JSON.parse(contentData);
	console.log("====>"+data.callid);
	return data.callid;
}
