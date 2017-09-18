// GET /agentevent/{agentid:\d{1,5}}
AgentEventDispatcher.getAgentEvent2 = function(_params)
{
	var params = _params ? _params : {};
	var request = new REST.Request();
	request.setSpecial(true);
	request.setMethod('GET');
	var uri = params.$apiURL ? params.$apiURL : REST.apiURL;
	uri += '/agentevent/';
	uri += REST.Encoding.encodePathSegment(params.agentid);
//	uri += '?time=' + new Date().getTime();
	request.setURI(uri);
	if (params.$username && params.$password)
		request.setCredentials(params.$username, params.$password);
	if (params.$accepts)
		request.setAccepts(params.$accepts);
	else
		request.setAccepts('application/json');
	if (params.$contentType)
		request.setContentType(params.$contentType);
	else
		request.setContentType('text/plain');
	if (params.$timeoutHandle)
	{
		request.setTimeoutHandle(params.$timeoutHandle);
	}
	if (params.$callback)
	{
		request.execute(params.$callback);
	}
	else
	{
		var returnValue;
		request.setAsync(false);
		var callback = function(httpCode, xmlHttpRequest, value)
		{
			returnValue = value;
		};
		request.execute(callback);
		return returnValue;
	}
};

var getEventLisnter_timer = "";
var getEventLisnter = function ()
{	
	AgentEventDispatcher.getAgentEvent2({
		"agentid":global_agentInfo.agentId,
		$callback: function(result, data, entity){
			try {
				if(entity == undefined || entity == "") {
					global_heartBeatValue += 1;
					agentConsole_error("Event result is undefined ! It's " + global_heartBeatValue + " times");
					if(global_heartBeatValue > 10){
						agentConsole_error("Event result is undefined ! It's over " + global_heartBeatValue + " times about losing heart");
						global_heartBeatValue = 0;
					} else {
						getEventLisnter_timer = setTimeout("getEventLisnter()", 500);
					}
					return;
				}
				global_heartBeatValue = 0;
				if(entity.retcode != global_resultCode.SUCCESSCODE) {
					if (entity.retcode == "000-003") {
						global_noAccessNumber++;
						agentConsole_error("No auth to visit the interface! It's " + global_noAccessNumber + " times");
						if (global_noAccessNumber > 5)
						{
							agentConsole_error("No auth to visit the interface! It's over 5 times");
							return;
						}
					}
					if(entity.retcode == "100-006" )
					{
						agentConsole_error("The current agent has not logined!");
					}
					else
					{
						getEventLisnter_timer = setTimeout("getEventLisnter()", 500);
					}
					return;
				}
				
				global_noAccessNumber = 0;
				
				var agentEvents = entity.event;
				if(null == agentEvents || agentEvents.length == 0) {
					getEventLisnter_timer = setTimeout("getEventLisnter()", 500);
					return;
				}
				
				agentEventHandle(agentEvents);
				getEventLisnter();
			} catch(err) {
				agentConsole_error(err);
				getEventLisnter_timer = setTimeout("getEventLisnter()", 500);
			}
		},
		$timeoutHandle : function() {
			global_heartBeatValue += 1;
			agentConsole_error("Get event timeout! It's " + global_heartBeatValue + " times");
			if(global_heartBeatValue > 10){
				global_heartBeatValue = 0;
				agentConsole_error("Get event timeout! It's over 10 times about losing heart");
			}
			else
			{
				getEventLisnter_timer = setTimeout("getEventLisnter()", 500);
			}
		}
	});
};



function queryCallAppData(agentId){
	var retJson = CallData.queryCallAppData({"agentid" :agentId});
	console.log('---queryCallAppData-----',retJson);
}


function agentEventHandle(oneEvent)
{	
	var eventType = oneEvent.eventType;
	if (eventType != "AgentEvent_ControlWindow_Notify" && eventType != "AgentEvent_Orders_Notify") {
		agentConsole_debug(JSON.stringify(oneEvent));
		
	}
	
	switch(eventType) {
	/****************************Agent Status Event****************************/
	
	case "AgentState_SetNotReady_Success": //Into busy status successfully
		agentState_SetNotReady_Success();
	case "AgentState_Force_SetNotReady":   //Forcibly into busy status
		Proc_agentState_busy(oneEvent);
		break;
	case "AgentState_Ready":               //Into Idle status
		agentState_Ready_Status();
	case "AgentState_Force_Ready":         //Forcibly Into Idle status
	case "AgentState_CancelNotReady_Success":  //Cancel busy status successfully, and agent into Idle status
		agentState_CancelNotReady_Success();
	case "AgentState_CancelRest_Success":      //Cancel rest status successfully, and agent into Idle status
	case "AgentState_CancelWork_Success":      //Exit work status successfully, and agent into Idle status
		Proc_agentState_idle(oneEvent);
		/**
		 * 停止录音检查定时器
		 */
		eventHandle_stopRecordTimer();
		break;
	case "AgentState_SetRest_Success":        //Into rest status successfully
		Proc_agentState_rest(oneEvent);
		break;
	case "AgentState_Rest_Timeout":           //Only tell the agent, rest timeout
		break;
	case "AgentState_SetWork_Success":       //Into work status successfully
	case "AgentState_Work":					//After finishing talking, agent into work status
		Proc_agentState_work(oneEvent);
		break;
	case "AgentState_Busy": 				//Into talking status
		agentState_Busy();
		Proc_agentState_talking(oneEvent);
		break;
	
	/****************************Agent Voice Talking Event****************************/	
	case "AgentEvent_Customer_Alerting":  //1.Customer phone is alerting. 
		console.log('AgentEvent_Customer_Alerting',oneEvent)
		Proc_agentEvent_customerAlerting(oneEvent);
		break;
	case "AgentEvent_Ringing":            //2.When manual answer call and a call come in, agent receive the event.
		agentEvent_Ringing();
		Proc_agentEvent_Ringing(oneEvent);
		break;
	case "AgentEvent_Hold":               //3Hold call successfully
		agentEvent_Hold();
		Proc_agentEvent_hold(oneEvent);
		break;
	case "AgentEvent_Talking":            //4.Talking connnect successfully.
		agentEvent_Talking(oneEvent);
		Proc_agentEvent_talking(oneEvent);
		$("#contentData").val(JSON.stringify(oneEvent.content));
		//获取随路数据
		agentCallData_getCallData();
		getContentData();
		
		/**
		 * 启动录音定时器
		 */
		eventHandle_startRecordTimer();
		break;
	case "AgentEvent_Conference":         //5.三方通话成功.
		Proc_agentEvent_conference(oneEvent);
		AgentEvent_Conference();
		break;
	case "AgentEvent_Call_Out_Fail":       //6.Call out failed
		Proc_agentEvent_callOutFail(oneEvent);
		break;
	case "AgentEvent_Inside_Call_Fail":    //do inner-call failed
		Proc_agentEvent_insideCallFail(oneEvent);
		break;
	case "AgentEvent_Call_Release":        //Call release 
		Proc_agentEvent_callRelease(oneEvent);
		AgentEvent_Call_Release();
		break;
	case "AgentEvent_No_Answer":
		break;
	case "AgentEvent_Customer_Release":        //客户退出呼叫
		Proc_agentEvent_customerRelease(oneEvent);
		AgentEvent_Customer_Release();
		break;
	case "AgentEvent_Auto_Answer":         //agent has auto answered the call
		Proc_agentEvent_autoAnswer(oneEvent);
		break;
	case "AgentEvent_Connect_Fail":        //Connect failed event
		break;
	case "AgentEvent_Consult_Fail":       //do inner-help failed
		Proc_agentEvent_consultCallFail(oneEvent);
		break;			
		
	/****************************Other Event****************************/

	case "AgentOther_ShutdownService":  //Agent logout event
		break;
	case "AgentOther_InService":        //Agent log in event
		agentOther_InService();
		break;
	case "AgentOther_PhoneAlerting":    //When agent's phone is not in talking status and agent callout or a call come in,  agent's phone will be alerting firstly.
		agentOther_PhoneAlerting();
		Proc_agentEvent_phoneAlerting(oneEvent);
		break;
	case "AgentOther_PhoneOffhook":     //Agent pick up phone
		break;
	case "AgentOther_PhoneRelease":     //Agent hangup the phone
		agentOther_PhoneRelease();
		break;		
	case "AgentOther_PhoneUnknow":      //the phone unkown status
		break;
	case "AgentOther_All_Agent_Busy":   //All agents are busy
		break;
		
	case "AgentChat_Ring":   
		Proc_agentEvent_chatRing(oneEvent);
		break;
	case "AgentChat_Connected":    
		Proc_agentEvent_chatConnect(oneEvent);
		break;
	case "AgentChat_Disconnected":    
		Proc_agentEvent_chatDisconnect(oneEvent);
		break;		
	case "AgentChat_DataRecved":     
		Proc_agentEvent_chatDataReceved(oneEvent);
		break;
	case "AgentChat_CallOutCreated":     
		Proc_agentEvent_chatCallOutCreated(oneEvent);
		break;
	case "AgentChat_CalloutFailed":     
		Proc_agentEvent_chatCallOutFail(oneEvent);
		break;
		
	case "AgentMediaEvent_Record_Fail":   //座席录音开始失败事件
		/**
		 * 停止录音检查定时器，并检查录音状态
		 */
		eventHandle_currentRecordState = false;
		eventHandle_stopRecordTimer();
		eventHandle_recordStateCheck();
		break;
	case "AgentMediaEvent_Record": //座席录音开始
		/**
		 * 停止录音检查定时器
		 */
		eventHandle_currentRecordState = true;
		eventHandle_stopRecordTimer();
		eventHandle_currentRecordPath = "";
		break;

	case "AgentMediaEvent_StopRecordDone":  //座席停止录音成功
		/**
		 * 停止录音检查定时器
		 */
		eventHandle_currentRecordState = false;
		eventHandle_stopRecordTimer();
		eventHandle_currentRecordPath = "";
		break;	
		
	default:
		//alert("no deal the event:  " + eventType);
		
	}
}

/**
 * 当前录音状态
 * true表示录音
 * false表示未录音
 */
var eventHandle_currentRecordState = false;

/**
 * 当前录音盘符
 */
var eventHandle_currentRecordPath = "";

/**
 * 录音定时器
 */
var eventHandle_currentRecordTimer = "";

/**
 * 启动录音检查定时器
 */
function eventHandle_startRecordTimer()
{
	if (!eventHandle_currentRecordState
			&& eventHandle_currentRecordTimer == "")
	{
		eventHandle_currentRecordTimer = setTimeout("eventHandle_recordStateCheck()", 2000);
	}
}

/**
 * 停止录音检查定时器
 */
function eventHandle_stopRecordTimer()
{
	if (eventHandle_currentRecordTimer != "")
	{
		clearTimeout(eventHandle_currentRecordTimer);
		eventHandle_currentRecordTimer = "";
	}
}

/**
 * 检查录音状态
 * 如果录音状态为未录音，则手动启动录音。手动录音先在X盘进行，如果X盘录音失败，则在Y盘录音，Y盘也录音失败，则提示录音失败
 */
function eventHandle_recordStateCheck()
{
	if (!eventHandle_currentRecordState)
	{
		//当前不是录音态
		if (eventHandle_currentRecordPath == "")
		{
			var fileName = eventHandle_createRecordFilePathOnX();
			eventHandle_beginRecordWhenRecordFailed(fileName);
			eventHandle_currentRecordPath = "X";
		}
		else if (eventHandle_currentRecordPath == "X")
		{
			var fileName = eventHandle_createRecordFilePathOnY();
			eventHandle_beginRecordWhenRecordFailed(fileName);
			eventHandle_currentRecordPath = "Y";
		}
		else if (eventHandle_currentRecordPath == "Y")	
		{
			//两次手动录音都失败，请修改提示
			alert("record failed");
			eventHandle_currentRecordPath = "";
		}
	}
}

/**
 * 在指定目录录音
 */
function eventHandle_beginRecordWhenRecordFailed(fileName)
{
	/**
	 * global_agentInfo.agentId表示当前座席工号，请按实际情况修改
	 */
	RecordPlayVoice.beginRecord({
		"agentid" :  global_agentInfo.agentId,
		"filename" : fileName
	});
}


//录音文件名称为“盘符：\VDN号\媒体类型编号\年月日\工号\文件名+后缀”，其中：文件命名规则：8位日期＋6位录音开始时间（例如20090312114401）。媒体类型编号：媒体类型编号，语音媒体为0。 
function eventHandle_createRecordFilePathOnX()
{
	/**
	 * X表示X盘符，请按实际情况修改
	 * global_currentVdnId表示当前座席签入的VDNID， 请按实际情况修改
	 * global_agentInfo.agentId表示当前座席工号，请按实际情况修改
	 */
	var fileName =   "X:/" + global_currentVdnId
    	+ "/0/" + new Date().format("yyyyMMdd") + "/"
    	+ global_agentInfo.agentId + "/" + new Date().format("hhmmss")
    	+ ".V3";
	return fileName;
}

function eventHandle_createRecordFilePathOnY()
{
	/**
	 * Y表示Y盘符，请按实际情况修改
	 * global_currentVdnId表示当前座席签入的VDNID， 请按实际情况修改
	 * global_agentInfo.agentId表示当前座席工号，请按实际情况修改
	 */
	var fileName =   "Y:/" + global_currentVdnId
    	+ "/0/" + new Date().format("yyyyMMdd") + "/"
    	+ global_agentInfo.agentId + "/" + new Date().format("hhmmss")
    	+ ".V3";
	return fileName;
}


