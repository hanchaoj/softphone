
/**
 * 签入
 */
function agentLogin_doLogin()
{
	var agentId = $("#agentLogin_agentId").val().trim();
	var password = $("#agentLogin_password").val().trim();
	var phoneNumber = $("#agentLogin_phonenumber").val().trim();
	var status = $("#agentLogin_loginstatus").val();
	var releasePhone = $("#agentLogin_releasePhone").val();
	if (agentId == "")
	{
		alert("Please input workno!");
		return;
	}
	agentLogin_login(agentId, password, phoneNumber, status, releasePhone);
}

/**
 * 签入
 * @param agentId : 工号 
 * @param password : 密码
 * @param phoneNumber : 分机号
 * @param status : 4 means agent will be into idle status after login
 *     4 means agent will be into ACW status after login
 * @param releasePhone : 
 *    true means always off hook after finishing call.
 *    false means phone will keep talking after finishing call.
 */
function agentLogin_login(agentId, password, phoneNumber, status, releasePhone)
{
	OnlineAgent.login({
		"agentid" : agentId,
		$entity:{
			"password":password,
			"phonenum":phoneNumber,
			"status": status,
			"releasephone" : releasePhone,
			"agenttype": $("#agentLogin_agentType").val()
		},
		$callback: function(result, data, entity){
			 var resLogin = entity;
			 var retCodeLogin = resLogin.retcode;
			 switch (retCodeLogin)
			 {
				case "0":
				    //document.cookie=data.getResponseHeader("Set-GUID");
					// login success	
					global_currentVdnId = resLogin.result.vdnid;
					agentLogin_loginSuccess(agentId, phoneNumber);
					break;
				case "100-015":
					console.log("The agent has logged in. And the system do not allow forcibly login ");
					break;
				case "100-002":						
					//The agent has loged in. But you can force login.
					var btn = confirm("The agent has logged in. Do you want to forcibly login?");
					if (btn)
					{
						agentLogin_doForceLogin(agentId, password, phoneNumber, status, releasePhone);
					}
					break;
				default :
					console.log("Error! Retcode : " + retCodeLogin + ". RetMessage:" +  resLogin.message);
				break;
			 }
		}
	});
}

/**
 * 如果已经有用户登录，选择强制登录
 * @param agentId
 * @param password
 * @param phoneNumber
 * @param status
 * @param releasePhone
 */
function agentLogin_doForceLogin(agentId, password, phoneNumber, status, releasePhone)
{
	OnlineAgent.forceLogin({
		"agentid" : agentId,
		$entity:{
			"password":password,
			"phonenum":phoneNumber,
			"status": status,
			"releasephone" : releasePhone,
			"agenttype": 4
		},
		$callback: function(result,data, entity){
			 var resLogin = entity;
			 var retCodeLogin = resLogin.retcode;
			 switch (retCodeLogin)
			 {
				case "0":
					// login success
					global_currentVdnId = resLogin.result.vdnid;
					agentLogin_loginSuccess(agentId, phoneNumber);
					break;
				default :
					console.log("Error! Retcode : " + retCodeLogin + ". RetMessage:" +  resLogin.message);
				break;
			 }
		}
	});

}

/**
 * 登录成功后，获取代理事件
 * @param agentId
 * @param phoneNumber 
 */
function agentLogin_loginSuccess(agentId, phoneNumber)
{
	$("#agentLogin_login").attr("disabled", "disabled");
	$("#agentLogin_logout").removeAttr("disabled");
	$("#agentLogin_forceLogout").removeAttr("disabled");
	//设置技能队列
	var skillgroup = $("#skillgroup").val().trim();
	global_agentInfo = new AgentInfo(agentId, phoneNumber);
	OnlineAgent.resetSkill({
		"agentid" : agentId,
		"autoflag": false,//手动添加Skill需要设置为false
		"skillid" : skillgroup,
		"phonelinkage" : 0,
		$callback: function(result,data, entity){
			 var resLogin = entity;
			 var retCodeLogin = resLogin.retcode;
			 switch (retCodeLogin)
			 {
				case "0":
					agentConsole_debug("agent [" + agentId + "] login successfully.");
					// reset skill successfully	
					setTimeout("getEventLisnter()", 500);
					break;
				default :
					console.log("Error! Retcode : " + retCodeLogin + ". RetMessage:" +  resLogin.message);
				break;
			 }
		}
	});

}


/**
 * 签出
 */
function agentLogin_doLogout()
{
    var agentId = $("#agentLogin_agentId").val().trim();
	if (global_agentInfo == null
			|| global_agentInfo.undfined)
	{
		window.location.href = "index.html";
		return;
	}
	agentLogin_lagout(agentId);
	agentOther_ShutdownService();
	//window.location.href = "index.html";
}

/**
 * 签出
 */
/*function agentLogin_lagout()
{
	OnlineAgent.logout({"agentid" : global_agentInfo.agentId});
}*/
function agentLogin_lagout(agentId)
{
	OnlineAgent.logout({
		"agentid" : agentId,
		$entity:{
			
		},
		$callback: function(result, data, entity){
			 var resLogout = entity;
			 var retCodeLogout = resLogout.retcode;
			 switch (retCodeLogout)
			 {
				case "0":
					// login success	
					//alert("success");
					break;
				case "100-005":
					console.log("100-005:登出参数不合法 ");
					break;
				case "100-006":
					console.log("100-006:坐席没有登录 ");
					break;
				case "100-007":
					console.log("100-007:坐席操作时发生异常，可能是WAS资源错误无法访问，或内部错误产生 ");
					break;
				case "100-008":	
					console.log("100-008:坐席已登出 ");		
					
					break;
				default :
					console.log("Error! Retcode : " + retCodeLogin + ". RetMessage:" +  resLogin.message);
				break;
			 }
		}
	});
}

/**
 * 设置是否自动应答
 */
function agentCallOperation_toSetAutoAnswer()
{
	var value = $("input[name='agentSetting_autoAnswer']:checked").val();
	agentCallOperation_toAutoAnswer(value == 0 ? true : false);
}

/**
 *  设置是否自动应答
 * @param flag: 自动应答：true
 */
function agentCallOperation_toAutoAnswer(flag)
{
	var retJson = OnlineAgent.setAgentAutoAnswer ({
		"agentid": global_agentInfo.agentId,
		"isautoanswer":flag
	});
	var retResult = retJson.retcode;
	if(global_resultCode.SUCCESSCODE != retResult)
	{
		console.log("Set whether auto answer  failed. Retcode : " + retResult);
	}
}

var isForVTM = true;
/**
 *挂机
 */
/*function agentCallOperation_toHangUp()
{
	var retJson;
	if (isForVTM)
	{
		retJson = VoiceCall.releaseForVTM({"agentid":global_agentInfo.agentId});
	}
	else
	{
		retJson = VoiceCall.release({"agentid":global_agentInfo.agentId});
	}
	var retResult = retJson.retcode;
	if(global_resultCode.SUCCESSCODE == retResult)
	{	
		
	}
	else
	{
		alert("Hangup call failed. Retcode : " + retResult);
	}
}*/

function agentCallOperation_toHangUp()
{

	var retJson;

		retJson = VoiceCall.release({
		"agentid":global_agentInfo.agentId,
		$entity:{
			
		},
		$callback: function(result, data, entity){
			 var resLogin = entity;
			 var retCodeLogin = resLogin.retcode;
			 switch (retCodeLogin)
			 {
				case "0":
					// login success	
					//alert("success");
					break;
				case "100-006":
					console.log("100-006:坐席没有登录 ");
					break;
				case "100-007":
					console.log("100-007:坐席操作时发生异常，可能是WAS资源错误无法访问，或内部错误产生 ");
					break;
				case "200-017":						
					console.log("200-017:挂断时无呼叫错误 ");
					break;
				default :
					console.log("Error! Retcode : " + retCodeLogin + ". RetMessage:" +  resLogin.message);
				break;
			 }
		}});
}

/**
 * 应答
 */
function agentCallOperation_toAnswer()
{
	var retJson = VoiceCall.answer({"agentid" : global_agentInfo.agentId});
	var retResult = retJson.retcode;
	if(global_resultCode.SUCCESSCODE != retResult)
	{	
		console.log("Answer call failed. Retcode : " + retResult);
	}
}

	
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

/**
 * 保持
 * 呼入和呼出时使用
 */
function agentCallOperation_toHold()
{
	var retJson = VoiceCall.hold({"agentid":global_agentInfo.agentId});
	var retResult = retJson.retcode;
	if(global_resultCode.SUCCESSCODE == retResult)
	{	
		
	}
	else
	{
		console.log("Hold call failed. Retcode : " + retResult);
	}
}


/**
 * 取消保持
 */
 function agentCallOperationUnHold(){

	var phoneNum;
	var resultJson = agentCallOperation_getHoldList();
	var retJson = CallData.queryCallAppData({"agentid" :$("#agentLogin_agentId").val()});
	var retRes =retJson.retcode;
	if(0== retRes){
		var holdCallList=resultJson.result;
		console.log("holdCallList"+holdCallList);
		if(holdCallList!=null){
			phoneNum =holdCallList[0].callid ;
			console.log("取消保持的电话号码："+phoneNum);
		}else{
			console.log("保持列表为空. Retcode : " + retResult);
		}
	}
	var retResult = agentCallOperation_toUnHold(phoneNum);
    if (retResult != 0)
	{
		console.log("Call out failed.  Retcode : " + retResult);
	}
}
/**
 * 获取所有保持中的电话
 * @returns
 */
function agentCallOperation_getHoldList()
{
	return CallData.queryHoldListInfo({"agentid":global_agentInfo.agentId});
}

/**
 * 取消保持
 * @param currentCallId :取消保持的电话ID
 */
function agentCallOperation_toUnHold(currentCallId)
{
	var retJson = VoiceCall.getHold({"agentid":global_agentInfo.agentId, "callid":currentCallId});
	var retResult = retJson.retcode;
	return retResult;
}

/*function agentCallOperation_toUnHold(currentCallId)
{
	
	var retJson = VoiceCall.getHold({
		"agentid":global_agentInfo.agentId,
		 "callid":currentCallId,
		$entity:{
			
		},
		$callback: function(result, data, entity){
			 var resUnhold = entity;
			 retCodeUnhold = resUnhold.retcode;
			 switch (retCodeUnhold)
			 {
				case "0":
					// login success	
					//alert("success");
					break;
				case "100-006":
					console.log("100-006:坐席没有登录 ");
					break;
				case "100-007":
					console.log("100-007:坐席操作时发生异常，可能是WAS资源错误无法访问，或内部错误产生 ");
					break;
				case "200-015":						
					console.log("200-015:取消保持时无呼叫错误 ");
					break;
				case "200-016":						
					console.log("200-016:呼叫状态错误 ");
					break;
				default :
					console.log("Error! Retcode : " + retCodeLogin + ". RetMessage:" +  resLogin.message);
				break;
			 }
		}});
		var retResult = retJson.retcode;
		return retResult;
}
*/
/**
 * 示忙
 */
function agentStatusOperation_toBusy()
{
	var retJson = OnlineAgent.sayBusy({"agentid":global_agentInfo.agentId});
	var retResult = retJson.retcode;
	if(global_resultCode.SUCCESSCODE == retResult)
	{	
		if (global_agentInfo.status == AGENT_STATE.TALKING)
		{
			/**
			 * when agent click busy button in talking status, 
			 * agent will recevie AgentState_SetNotReady_Success event until finished talking
			 */
			agentStatus_setPreBusyWhenTalking();
		}
		else if (global_agentInfo.status == AGENT_STATE.WORKING)
		{
			/**
			 * when agent click busy button in working status, 
			 * agent will recevie AgentState_SetNotReady_Success event until exit work
			 */
			agentStatus_setPreBusyWhenWorking();
		}
	}
	else
	{
		console.log("change agent status to busy status failed. Retcode :" + retResult);
	}	
}

/**
 * 示闲
 */
function agentStatusOperation_toIdle()
{
	
	var retJson = OnlineAgent.sayFree({"agentid":global_agentInfo.agentId});
	var retResult = retJson.retcode;
	
	if(global_resultCode.SUCCESSCODE == retResult)
	{		
		if (global_agentInfo.status == AGENT_STATE.TALKING)
		{
			/**
			 * agent click idle button in talking status
			 */
			agentStatus_cancelPreBusyWhenTalking();
		}
	}
	else
	{
		console.log("cancel busy status failed. Retcode :" + retResult);
	}
}

/**
 * Display curent call info
 * @param otherParty 
 * @param callStatus
 * @param callFeature
 */
function agentCallInfo_showCurrentCallInfo(otherParty, callStatus, callFeature)
{
	$("#agentCall_otherParty").text(otherParty);
	$("#agentCall_callStatus").text(callStatus);
	var desc = "";
	switch (callFeature) {
		case CALL_FEATURE.NORMAL:
			desc = "Call-In";
			break;
		case CALL_FEATURE.INTERNAL:
			desc = "Inner-Call";
			break;
		case CALL_FEATURE.FEATURE_OUT:
			desc = "Call-out";
			break;	
		case CALL_FEATURE.PRE_OCCUPY:
			desc = "Preempted";
			break;	
		case CALL_FEATURE.OUTBOUND_VIRTUAL_CALLIN:
			desc = "Predicted";
			break;	
		case CALL_FEATURE.OUTBOUND_PREVIEW:
			desc = "Preview";
			break;	
		case CALL_FEATURE.OUTBOUND_CALLBACK:
			desc = "Call Back";
			break;	
		case CALL_FEATURE.INTERNAL_TWO_HELP:
			desc = "Two-Help";
			break;	
		case CALL_FEATURE.INTERNAL_THREE_HELP:
			desc = "Three-Help";
			break;
		case CALL_FEATURE.CONFERENCE:
			desc = "Conference";
			break;	
		case CALL_FEATURE.TRANSFER_CONFERENCE:
			desc = "Transfer-Conference";
			break;	
		default:
			break;
	}
	$("#agentCall_callFeature").text(desc);
}

/**
 * update call status
 * @param callStatus
 */
function agentCallInfo_updateCallStatus(callStatus)
{
	$("#agentCall_callStatus").text(callStatus);
}


function agentCallInfo_showCallInfo(callId, callStatus)
{
	var callInfo = global_allCallInfo.get(global_currentDealCallId);
	var callFeature = CALL_FEATURE.OTHER;
	var otherParty = callInfo.caller;
	if (callInfo.callfeature != undefined
			&& callInfo.callfeature != null)
	{
		callFeature = parseInt(callInfo.callfeature);
	}
	switch (callFeature) {
		case CALL_FEATURE.FEATURE_OUT:
			otherParty = callInfo.called;
			break;
		default:
			break;
	}
	agentCallInfo_showCurrentCallInfo(otherParty, callStatus, callFeature);
}


function agentCallInfo_clearCallInfo()
{
	$("#agentCall_otherParty").text("");
	$("#agentCall_callStatus").text("");
	$("#agentCall_callFeature").text("");
}

/**
 * get all online agents
 */
function agentCallOperation_getAllOnlineAgents()
{
	return AgentGroup.queryAllLoginedAgentInfoOnVdn({
		"agentid":global_agentInfo.agentId
	}); 
}

/**
 * To transfer
 * @param deviceType 	1:to skill; 2:to agent; 3:to IVR;4:to accesscode4; 5: to external
 * @param mode
 * @param address
 * @param mediaability
 * @returns
 */
function agentCallOperation_toTransfer(deviceType, mode, address, mediaability)
{
	var retJson = VoiceCall.transfer({
		"agentid": global_agentInfo.agentId,
		$entity:{
			"devicetype": deviceType,
			"mode": mode,
			"address": address,
			"mediaability": mediaability
		}
	});
	var retResult = retJson.retcode;
	if(global_resultCode.SUCCESSCODE == retResult
			&& deviceType == 5
			&& (mode == 3) || (mode == 4))
	{
		global_currentConferenceType = CALL_FEATURE.CONFERENCE;
	}
	return retResult;
}

/**
 *To call out
 *@param phoneNo : the customer phone number
 */
function agentCallOperation_toCallOut(phoneNo)
{
	var retJson = VoiceCall.callout({"agentid":global_agentInfo.agentId,
			$entity:{
				"called":phoneNo
				//"skillid":1,
				//"callappdata":"随录数据"
			}
	});
	var retResult = retJson.retcode;
	if(global_resultCode.SUCCESSCODE == retResult)
	{	
		global_currentCalloutNumber = phoneNo;
		global_currentCalloutCallId = retJson.result;
	}
	return retResult;
}

/**
 * 
 * To three-party call
 * @param currentCallId : the callID that has be hold
 */
function agentCallOperation_toThreeParty(currentCallId)
{

	var retJson = VoiceCall.confJoin({"agentid": global_agentInfo.agentId,
				  $entity:{"callid":currentCallId}});
	var retResult = retJson.retcode;
	if(global_resultCode.SUCCESSCODE == retResult)
	{
		global_currentConferenceType = CALL_FEATURE.CONFERENCE;
	}
	return retResult;
}

/**
 * get all ivrs
 */
function agentCallOperation_getAllIVRs()
{
	return QueueDevice.queryIVRInfoOnVdn({
		"agentid": global_agentInfo.agentId
	});
}