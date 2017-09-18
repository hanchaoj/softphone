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
		addAttr(["#agentLogin_logout"]);
		agentLogin_doLogout();
		
	});
	
	/*外呼*/
	$("#agentStatusOutCall").click(function(){
		addAttr(["#agentCallAnswer,#agentStatusOutCall"]);
		/*设置是否自动应答*/
		agentCallOperation_toSetAutoAnswer();
		agentCallOperationCallOut();
		
	});
	/*挂机*/
	$("#agentCallHangup").click(function(){
		addAttr(["#agentCallHangup"]);
		agentCallOperation_toHangUp();
		//判断是否还有保持中的通话
		if(checkHoldList()){
			hideObj(["#agentCallHold"]);
			showObj(["#agentCallUnHold"]);
			removeAttr(["#agentStatusOutCall"]);
			addAttr(["#agentCallHangup"]);
		}
		
	});
	
	/*示忙*/
	$("#agentStatusSayBusy").click(function(){
		addAttr(["#agentStatusSayBusy"]);
		agentStatusOperation_toBusy();
	});
	
	/*示闲*/
	$("#agentStatusSayIdle").click(function(){
		addAttr(["#agentStatusSayIdle"]);
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
		addAttr(["#agentCallHold"]);
		agentCallOperation_toHold();
		hideObj(["#agentCallHold"]);
		showObj(["#agentCallUnHold"]);
	});
	
	/*取消保持*/
	$("#agentCallUnHold").click(function(){
		//agentCallOperationUnHold();
		agentCallOperation_showUnHold();
	});
	/*查询显示技能队列*/
	$("#agentLogin_agentId").change(function(){
		var agentId = $.trim($("#agentLogin_agentId").val());
		getSkills(agentId);
	});
	
	/*外接*/
	$("#outer").click(function(){
		$("#transferOuter").show();
		$("#transferInner").hide();
	});
	
	/*内接*/
	$("#inner").click(function(){
		$("#transferOuter").hide();
		$("#transferInner").show();
	});
	
	/*转接*/
	$("#zhuanjie").click(function(){
		//addAttr(["#zhuanjie"]);
	});
	
});

	/*初始状态*/
	function init_load(){
		addAttr(["#agentStatusOutCall,#agentCallAnswer,#agentCallHangup,#agentStatusInWork,#agentCallHold,#agentLogin_logout,#agentStatusRest,#agentStatusSayIdle"]);
		addAttr(["#zhuanjie,#huiyi"]);
		$("#agentLogin_login,#agentCallUnHold").css({"color":"white","cursor":"pointer"});
		hideObj(["#agentStatusSayBusy","#agentCallUnHold","#transferInner"]);
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

/*外呼响铃状态*/
	function agentOther_PhoneAlerting(){
		addAttr(["#agentCallAnswer,#agentStatusSayBusy,#agentStatusSayIdle,#agentStatusRest,#agentStatusInWork,#agentCallHold,#agentStatusOutCall,#agentLogin_logout,#agentCallHold"]);
		removeAttr(["#agentCallHangup"]);
		/*自动应答时，应答按钮不可选*/
		var value = $("input[name='agentSetting_autoAnswer']:checked").val();
		if(value==0){
			addAttr(["#agentCallAnswer"]);
		}
	}
/*挂机状态*/
	function agentOther_PhoneRelease(){
		addAttr(["#agentCallAnswer,#agentCallHangup,#agentStatusInWork,#agentCallHold,#agentLogin_login"]);
		removeAttr(["#agentStatusOutCall,#agentStatusSayBusy,#agentStatusRest,#agentStatusSayIdle,#agentLogin_logout"]);

		colorInt=window.clearInterval(colorInt);
		addAttr(["#agentCallAnswer"]);
		addAttr(["#outer,#inner,#zhuanjie,#huiyi"]);
		refreshWorkInt=window.clearInterval(refreshWorkInt);
	}
/*保持状态*/
	var holdFlg=false;
	function agentEvent_Hold(){
		holdFlg=true;
		addAttr(["#agentStatusSayIdle,#agentStatusRest,#agentStatusOutCall,#agentCallAnswer,#agentCallHangup,#agentStatusInWork,#agentCallHold,#agentLogin_login,#agentLogin_logout,#zhuanjie"]);
		removeAttr(["#agentCallUnHold,#agentStatusOutCall"]);
	}
/*外呼*/
	function agentCallOperationCallOut(){
		var phoneNo = $("#agentOutCallNum").val().trim();
		var regex = /[^\d#*]/; 	
		if (phoneNo == "" || regex.test(phoneNo))
		{
			alert("外呼号码仅能为数字, *, 和 #.");
		}
		var retResult = agentCallOperation_toCallOut("99903"+phoneNo);
		if (retResult != 0)
		{
			alert("外呼失败.  原因 : " + retResult);
		}
		return retResult;
}
	
/*接通电话状态*/
	var refreshWorkInt;
	function agentEvent_Talking(oneEvent){
		
		$("#workStatus").html("通话中");
		//没有保持中的通话，才开始计时
		if(!holdFlg && timeState != 2){
			$("#callDuration").html("");
			timeStart();
			//holdFlg=true;
		}
		holdFlg=true;
		$("#caller").html((oneEvent.content.caller).replace("99903",""));
		$("#called").html((oneEvent.content.called).replace("99903",""));
		addAttr(["#agentCallAnswer,#agentStatusSayBusy,#agentStatusSayIdle,#agentStatusRest,#agentStatusInWork,#agentStatusOutCall,#agentLogin_logout"]);
		
		//如果有保持中的通话，可以进行三方通话
		if(checkHoldList()){
			removeAttr(["#huiyi"]);
		}
		removeAttr(["#agentCallHangup,#agentCallHold"]);
		removeAttr(["#outer,#inner,#zhuanjie"]);
		hideObj(["#agentCallUnHold"]);
		showObj(["#agentCallHold"]);
		/*每一秒刷新一次可转接的号码列表*/
		//refreshWorkInt = window.setInterval(agentCallOperation_refreshWorknoList, 5000);
	}
/*工作状态*/
	function agentState_Ready_Status(){
		agentCallOperation_toSetAutoAnswer();
	}
/*签入状态*/
	var currentStatus;
	function agentOther_InService(){
		$("#workNo").html($("#agentLogin_agentId").val());
		$("#callId").html($("#agentLogin_phonenumber").val());
		$("#workStatus").html("空闲");
		addAttr(["#agentCallAnswer,#agentCallHangup,#agentStatusInWork,#agentCallHold,#agentLogin_login"]);
		removeAttr(["#agentStatusSayIdle,#agentLogin_logout,#agentStatusOutCall,#agentStatusSayBusy"]);
		showObj(["#agentStatusSayIdle"]);
		hideObj(["#agentStatusSayBusy"]);
		//轮循当前坐席状态
		currentStatus=window.setInterval(currentS, 1000);
	}
	
	//判断当前坐席状态
	function currentS(){
		if(global_agentInfo.status != AGENT_STATE.TALKING){
			//结束通话计时
			timeEnd();
			t=0;
			timeState=0;
			holdFlg=false;
		}
	}
/*签出状态*/
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
		window.clearInterval(currentStatus);
	}
/*示忙状态*/
	function agentState_SetNotReady_Success(){
		$("#workStatus").html("忙碌");
		hideObj(["#agentStatusSayBusy"]);
		showObj(["#agentStatusSayIdle"]);
		addAttr(["#agentCallAnswer,#agentCallHangup,#agentStatusInWork,#agentCallHold,#agentLogin_login"]);
		removeAttr(["#agentStatusOutCall,#agentStatusRest,#agentStatusSayIdle,#agentLogin_logout"]);
	}
/*示闲状态*/
	function agentState_CancelNotReady_Success(){
		$("#workStatus").html("空闲");
		hideObj(["#agentStatusSayIdle"]);
		showObj(["#agentStatusSayBusy"]);
		addAttr(["#agentStatusInWork,#agentCallHangup,#agentCallHold"]);
	}
/*示忙状态2*/
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
			+ ",width=380,height=320,scrollbars=no,resizable=no,toolbar=no,directories=no,status=no,menubar=no,location=no");
	timer=window.setInterval(login,500);
}

function login() { 
	var agentLogin_agentId = $("#agentLogin_agentId").val();
	var agentLogin_password = $("#agentLogin_password").val();
	var agentLogin_phonenumber = $("#agentLogin_phonenumber").val();
	var skillgroup = $("#skillgroup").val();
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
		console.log(JSON.stringify(data));
		
	}
}
/*设置随路数据*/
function agentCallData_setCallData()
{
	var callData = "106,358,0,,1,7,71,nizong,T_C0000000000000054_77927,test,,1,0,0,02120502151,2,60,9990318016381047,658,0";
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

/*获取技能队列信息方法*/
function getSkills(agentId){
	queryAgent_getStatusAndSkill(agentId);
}

function queryAgent_getStatusAndSkill(agentId){
	queryAgentStatusAndSkill(agentId);
}

function queryAgentStatusAndSkill(agentId){
	AgentGroup.queryAgentStatusAndSkill(
	{
		"agentid" : agentId,
		$entity:{
			
		},
		$callback: function(result, data, entity){
			 var resStatusAndSkill = entity;
			 var retCodeStatusAndSkill = resStatusAndSkill.retcode;
			 var skills = entity.result.skills;
			 var html = "";
			 $("#skillgroup").empty();
			 for(var i = 0; i < skills.length; i++){
				 html += "<option value='"+skills[i].id+"'>"+skills[i].name+"</option>";
			 }
			 if(skills.length == 0){
				  html += "<option value=''>当前帐号无技能队列</option>";
			 }
			 $("#skillgroup").append(html);
			 switch (retCodeStatusAndSkill)
			 {
				case "0":
					console.log("获取技能队列信息成功");
					break;
				case "100-007":
					console.log("座席操作时发生异常，可能是WAS资源错误无法访问或者内部错误产生。");
					break;
				default :
					console.log("Error! Retcode : " + retCodeStatusAndSkill + ". RetMessage:" +  resStatusAndSkill.message);
				break;
			 }
		}
	}
	);
}

/*ie 提示'console' 未定义问题的解决方法*/
window.console = window.console || (function(){ 
	var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile 
	= c.clear = c.exception = c.trace = c.assert = function(){}; 
	return c; 
})();

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

/*转接 Blind Transfer*/
function agentCallOperation_submit()
{
	var deviceType = 0;
	var mode = 0;
	var address = "";
	var mediaability = 0;
	var value = $("input[name='zhuanjie']:checked").val();
	var retResult;
	/*内转*/
	if (value == 1)
	{
		deviceType = 2;
		/*盲转Blind Transfer*/
		mode = 0;
		address =  $.trim($("#transferInner option:selected").val());
		if (address == "")
		{
			alert("Please select one workno");
			return;
		}
		retResult = agentCallOperation_toTransfer(deviceType, mode, address, mediaability);
	}
	/*外转*/
	else if (value == 0)
	{
		deviceType = 5;
		/*转接后无论是否接通，本机直接挂断*/
		mode = 1;
		address =  $.trim($("#transferOuter").val());
		var regex = /[^\d#*]/; 	
		if (address == "" || regex.test(address))
		{
			alert("The dial number contains only digits, *, and #.");
			return;
		}
		retResult = agentCallOperation_toTransfer(deviceType, mode, "99903"+address, mediaability);
	}
	
	if (retResult != 0)
	{
		alert("Transfer failed.  Retcode : " + retResult);
	}
}

/*显示所有空闲的内接号码*/
function agentCallOperation_refreshWorknoList()
	{
	var retJson = agentCallOperation_getAllOnlineAgents();
	var retResult = retJson.retcode;
	if(0 == retResult)
	{	
		var list =  retJson.result;
		var len = list.length;
		var workBean="";
		var buffer = [];
		var isCheck = "checked='checked'";
		for (var i = 0; i < len; i++)
		{
			workBean = list[i];
			if (workBean.workno == global_agentInfo.agentId)
			{
				continue;
			}
			if (workBean.status == AGENT_STATE.WORKING
					|| workBean.status == AGENT_STATE.IDLE)
			{
				buffer.push("<option value='" + workBean.workno  + "'>" + workBean.workno + "</option>");
			}
			
		}
		$("#transferInner").empty();
		$("#transferInner").append(buffer.join(""));
	}
	else
	{
		alert("query online agent failed. Retcode : " + retResult);
	}	
}
/*会议*/
function agentCallOperation_submit()
{
	var currentCallId = $("input[name='agentCall_holdCallWindow_callId']:checked").val();
	if (currentCallId == "")
	{
		alert("Please select one hold call.");
		return;
	}
	var retResult = window.opener.agentCallOperation_toThreeParty(currentCallId)	
    if (retResult != 0)
	{
		alert("Call out failed.  Retcode : " + retResult);
	}
	else
	{
		closeWin();
	}
}
/*跳到转接*/
function agentCallOperation_showTransfer()
{
	winOpen = window.open("./page/html/agentCall_transfer.html", "AgentTransfer", "left=" +  (window.screen.availWidth-600)/2 
			+ ",top=" + (window.screen.availHeight-500)/2
			+ ",width=380,height=320,scrollbars=no,resizable=no,toolbar=no,directories=no,status=no,menubar=no,location=no");
	//timer=window.setInterval(login,500);
}

/*跳到保持列表*/
function agentCallOperation_showUnHold()
{
	winOpen = window.open("./page/html/agentCall_holdlist.html", "AgentTransfer", "left=" +  (window.screen.availWidth-600)/2 
			+ ",top=" + (window.screen.availHeight-500)/2
			+ ",width=380,height=320,scrollbars=no,resizable=no,toolbar=no,directories=no,status=no,menubar=no,location=no");
	//timer=window.setInterval(login,500);
}


/*跳到三方通话列表*/
function agentCallOperation_showThreeParty()
{
	winOpen = window.open("./page/html/agentCall_threeParty.html", "AgentTransfer", "left=" +  (window.screen.availWidth-600)/2 
			+ ",top=" + (window.screen.availHeight-500)/2
			+ ",width=380,height=320,scrollbars=no,resizable=no,toolbar=no,directories=no,status=no,menubar=no,location=no");
	//timer=window.setInterval(login,500);
}

function checkHoldList(){
	/*判断是否还有保持中的通话*/
		var retJson = agentCallOperation_getHoldList();
		var holdCallList = retJson.result;
		if(holdCallList != null && holdCallList.length > 0){
			return true;
		}
		return false;
}
/*三方通话成功状态*/
var timeState = 0;
function AgentEvent_Conference(){
	addAttr(["#huiyi,#agentCallHold,#zhuanjie,#agentStatusOutCall"]);
	timeState = 1;
}

/*客户退出呼叫状态*/
function AgentEvent_Customer_Release(){
	removeAttr(["#agentStatusOutCall"]);
	//判断是否还有保持中的通话
	if(checkHoldList()){
		hideObj(["#agentCallHold"]);
		showObj(["#agentCallUnHold"]);
		removeAttr(["#agentStatusOutCall"]);
		addAttr(["#agentCallHangup"]);
	}else{
		//三方通话成功时，之前保持的通话会释放掉
		addAttr(["#huiyi"]);
	}
	//该情况是：三方通话时，一方客户挂机后，
	//坐席把当前通话转接时，转接成功后的计时问题
	if(timeState == 1){
		timeState = 2;
	}
}

/*座席退出呼叫*/
function AgentEvent_Call_Release(){
	if(!checkHoldList()){
		//timeEnd();
		holdFlg=false;
	}	
}