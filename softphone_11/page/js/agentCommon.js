/**
 *The Agent Info
 */
var AgentInfo = function(agentId, phoneNumber)
{
	this.agentId = agentId;
	this.phoneNumber = phoneNumber;
	this.status = AGENT_STATE.IDLE;
	this.preRest = false;
	this.preBusy = false;
};

function CallInfo()
{
	this.callId = "";
	this.callfeature = "";
	this.caller = "";
	this.called = "";
	this.callskill = "";
	this.callskillid = "";
	this.orgicallednum = "";
	this.calldata = "";
	this.begintime = "";
	this.endtime = "";
	
	this.otherParty = "";
}

/**
 *change html tag to string
 * @param objVal
 * @returns
 */
function htmlEncode(objVal)
{
	var str = objVal+"";
	if(str == '')
	{
		return str;
	}
	str = str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(new RegExp("\"","g"),"&quot;").replace(new RegExp("\'","g"),"&#39;").replace(new RegExp("  ","g")," &nbsp;");
	return str;
}


Date.prototype.format = function(fmt) 
{ //author: meizz 
  var o = { 
    "M+" : this.getMonth()+1,                 
    "d+" : this.getDate(),                    
    "h+" : this.getHours(),                   
    "m+" : this.getMinutes(),                 
    "s+" : this.getSeconds(),                 
    "q+" : Math.floor((this.getMonth()+3)/3), 
    "S"  : this.getMilliseconds()             
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
    	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
};


String.prototype.trim = function() 
{ 
	var value = this.replace(/(^\s*)|(\s*$)/g, "");      
    return value.replace(/(^　*)|(　*$)/g, "");     
}; 

/**
 * agent status constant
 */
var AGENT_STATE = {};
AGENT_STATE.IDLE        = 4;//Idle status
AGENT_STATE.TALKING     = 7;//Talking status
AGENT_STATE.BUSY        = 3;//Busy status
AGENT_STATE.REST        = 8;//Rest status
AGENT_STATE.WORKING     = 5;//Work status

var AGENT_STATE_DES = {};
AGENT_STATE_DES.IDLE        = "Idle";//Idle status
AGENT_STATE_DES.TALKING     = "Talking";//Talking status
AGENT_STATE_DES.BUSY        = "Busy";//Busy status
AGENT_STATE_DES.REST        = "Rest";//Rest status
AGENT_STATE_DES.WORKING     = "ACW";//Work status


/*var AGENT_CTI_STATUS = [];
AGENT_CTI_STATUS.LOG_IN = 1;
AGENT_CTI_STATUS.LOG_OUT = 2;
AGENT_CTI_STATUS.NOT_READY = 3;
AGENT_CTI_STATUS.READY = 4;
AGENT_CTI_STATUS.WORK_NOT_READY = 5;
AGENT_CTI_STATUS.WORK_READY = 6;
AGENT_CTI_STATUS.BUSY = 7;
AGENT_CTI_STATUS.REST = 8;*/


/**
 * Call feature
 */
var CALL_FEATURE = {};
CALL_FEATURE.OTHER = -1;                    /** Other */
CALL_FEATURE.NORMAL = 0;                    /** Normal Call in */
CALL_FEATURE.INTERNAL = 6;                  /** Inner Call */
CALL_FEATURE.FEATURE_OUT = 7;               /** Call out */
CALL_FEATURE.PRE_OCCUPY = 41;               /** Preempted */
CALL_FEATURE.OUTBOUND_VIRTUAL_CALLIN = 43;  /** Predicted */
CALL_FEATURE.OUTBOUND_PREVIEW = 44;         /** Preview */
CALL_FEATURE.OUTBOUND_CALLBACK = 45;        /** Call Back */
CALL_FEATURE.INTERNAL_TWO_HELP = 51;        /** Two-Help */
CALL_FEATURE.INTERNAL_THREE_HELP = 52;      /** Three-Help */
CALL_FEATURE.CONFERENCE = 53;               /** Conference*/

CALL_FEATURE.TRANSFER_CONFERENCE = 99;      /** Transfer-Conference*/

var CALL_STATUS = {};
CALL_STATUS.ALERTING = "Alerting";
CALL_STATUS.TALKING = "Talking";
CALL_STATUS.RELEASE = "Release";
CALL_STATUS.HOLD = "Hold";
CALL_STATUS.METU = "Metu";


var WINDOW_LIST = {};
WINDOW_LIST.CALLOUT = "/page/html/agentCall_callout.html";
WINDOW_LIST.REST = "/page/html/agentCall_rest.html";
WINDOW_LIST.HOLDLIST = "/page/html/agentCall_holdlist.html";
WINDOW_LIST.THREEPARTY = "/page/html/agentCall_threeParty.html";
WINDOW_LIST.INNERCALL = "/page/html/agentCall_innerCall.html";
WINDOW_LIST.INNERHELP = "/page/html/agentCall_innerHelp.html";
WINDOW_LIST.TRANSFER = "/page/html/agentCall_transfer.html";
WINDOW_LIST.SECONDDIAL = "/page/html/agentCall_secondDial.html";
WINDOW_LIST.APPLYCALL = "/page/html/agentCall_applyCall.html";

var WEBCHAT_STATUS = {};
WEBCHAT_STATUS.REQUESTINNER = "REQUESTINNER";
WEBCHAT_STATUS.RINGING = "Ring";
WEBCHAT_STATUS.CONNECTED = "Connected";
WEBCHAT_STATUS.DISCONNECTED = "Disconnected";
WEBCHAT_STATUS.CALLOUTFAILED = "CallOutFailed";

/**
 * the current agent info
 */
var global_agentInfo;
var global_resultCode = new ResultCode();
var global_allCallInfo = new HashMap();
var global_currentCalloutCallId = "";
var global_currentCalloutNumber = "";
var global_currentInnercallCallId = "";
var global_currentInnercallAgent = "";
var global_currentDealCallId = "";
var global_currentHoldList = new Array();
var global_currentConferenceType = "";
var global_currentWebChatCallId = "";
var global_currentVdnId = "";


function HashMap()
 {
     /** Map 大小 **/
     var size = 0;
     /** Object **/
     var entry = {};
     
     /** Store **/
     this.put = function (key , value)
     {
         if(!this.containsKey(key))
         {
             size ++ ;
         }
         entry[key] = value;
     };
     
     /** Get**/
     this.get = function (key)
     {
         if( this.containsKey(key) )
         {
             return entry[key];
         }
         else
         {
             return null;
         }
     };
     
     /** Remove **/
     this.remove = function ( key )
     {
         if( delete entry[key] )
         {
             size --;
         }
     };
     
     /** Clear map **/ 
     this.clear = function() 
     {  
         try 
         {  
             delete entry;  
             entry = {};  
             size = 0;
         } 
         catch (e) 
         {  
             return e;  
         }  
     }; 
     
     /** Is Contain Key **/
     this.containsKey = function ( key )
     {
         return (key in entry);
     };
     
     /** Is Contain Value **/
     this.containsValue = function ( value )
     {
         for(var prop in entry)
         {
             if(entry[prop] == value)
             {
                 return true;
             }
         }
         return false;
     };
     
     /** All Value **/
     this.values = function ()
     {
//         var values = new Array(size);
    	 var values = new Array();
         for(var prop in entry)
         {
             values.push(entry[prop]);
         }
         return values;
     };
     
     /** All Key **/
     this.keys = function ()
     {
//         var keys = new Array(size);
    	 var keys = new Array();
         for(var prop in entry)
         {
             keys.push(prop);
         }
         return keys;
     };
     
     /** Map Size **/
     this.size = function ()
     {
         return size;
     };
 }
 
 /*
 * 该方法定义了REST接口返回的调用操作的结果码
 */


function ResultCode()
{
	/** 返回类型:成功 */
    this.SUCCESSCODE = "0";
    
    /** -------------------------- 错误码开始 ----------------------------*/
	
	/****************************一般性错误 *************************/
    /**
     * 获取Agent事件的方法错误
     */
	thisAGENT_EVENT_METHOD_ERROR = "000-001";
    
    /**
     * 坐席通过URL传递的参数或者地址错误，不符合定义
     */
    this.AGENT_REST_INVALID = "000-002";
    
    /** Begin add by liujunxia for DTS2012032100369*/
    /**
     * 没有权限调用接口
     */
    this.AGENT_REST_NORIGHT = "000-003";
    /** End add by liujunxia for DTS2012032100369*/
    
    
    /****************************服务端配置错误 *************************/
    this.SERVER_CONFIG_INVALID_WAS_URL = "999-001";
     
    
    
    /****************************在线坐席类错误 *************************/
    /**
     *  签入参数为空或者不合法
     */
    this.AGENT_LOGIN_INVALID_PARA = "100-001";

    /**
     * 坐席已经登录
     */
    this.AGENT_LOGIN_ALREADY_IN = "100-002";
    
    /**
     * 坐席登陆的时候抛ResourceUnavailableException或ProviderUnavailableException异常，又没有具体原因
     */
    this.AGENT_LOGIN_CTI_ERROR = "100-003";
        
    /**
     * 登录过程中，用户名或者密码错误
     */
    this.AGENT_LOGIN_USERNAME_OR_PASSWORD_INVALID = "100-004";
    
    /**
     * 登出参数不合法
     */
    this.AGENT_LOGOUT_INVALID_PARA = "100-005";
    
    /**
     * 坐席没有登录
     */
    this.AGENT_NOT_LOGIN = "100-006";
    
    /**
     * 坐席操作时发生异常，可能是WAS资源错误无法访问或者内部错误产生
     */
    this.AGENT_INNER_ERROR = "100-007";
    
    /**
     * 坐席已经登出
     */
    this.AGENT_LOGOUT_ALREADY_LOGOUT = "100-008";
    
    /**
     * 设置坐席状态错误
     */
    this.AGENT_SET_STATE_ERROR = "100-009";
    
    /**
     * 签出时状态错误
     */
    this.AGENT_LOGOUT_STATUS_ERROR = "100-010";
    
    /**
     * 签入时参数不合法错误
     */
    this.AGENT_LOGIN_INVALID_PARAMETER_ERROR = "100-011";
    
    /**
     *  签入时座席类型错误
     */
    this.AGENT_LOGIN_INVALID_AGENTTYPE = "100-012";
    
    /**
     *  绑定座席电话时电话无效
     */
    this.AGENT_LOGIN_INVALID_PHONE = "100-013";
    
    /**
     * 座席签入的电话不在配置范围内
     */
    this.AGENT_LOGIN_INVALID_PHONE_NOT_CONFIG = "100-014";
    
    /**
     * 坐席已经登录,并且不能被强制踢出(新增,配置文件中能否被强制踢出开关为off的时候返回)
     * add by fxq
     */
    this.AGENT_LOGIN_ALREADY_IN_CAN_NOT_FORCE_LOGIN = "100-015";
    
    /**
     * 座席登录,ip无效
     */
    this.AGENT_LOGIN_INVALID_IP = "100-016";
    
    /********************** 第三方用户操作接口类错误  *****************/

    /**
     * 密码修改失败
     */
    this.THIRDPARTYUSER_MODIFY_PASSWORD_ERROR = "110-002";
    
    /**
     * 旧密码错误
     */
    this.THIRDPARTYUSER_OLD_PASSWORD_ERROR = "110-003";
    
    /**
     * 密码查询失败
     */
    this.THIRDPARTYUSER_QUERY_PASSWORD_ERROR = "110-004";
    
    /**
     * 获取CTI登录信息时密码为空
     */
    this.THIRDPARTYUSER_QUERY_CTIINFO_PASSWORD_EMPTY = "110-005";
    
    /**
     * 获取CTI登录信息时,查询密码鉴权模式失败
     */
    this.THIRDPARTYUSER_QUERY_CTIINFO_GETAUTHTYPE_FAIL = "110-006";
    
    /**
     * 获取CTI登录信息时,密码鉴权失败
     */
    this.THIRDPARTYUSER_QUERY_CTIINFO_AUTH_FAIL = "110-007";
    
    /**
     * 获取CTI登录信息时,查询数据库失败
     */
    this.THIRDPARTYUSER_QUERY_CTIINFO_DB_FAIL = "110-008";
    
    /**
     * 获取CTI登录信息时,无记录
     */
    this.THIRDPARTYUSER_QUERY_CTIINFO_NO_RECORD = "110-009";
    
    /**
     * 用户名查询失败
     */
    this.THIRDPARTYUSER_QUERY_USERNAME_ERROR = "110-010";
    
    /**
     * 用户鉴权模式查询失败
     */
    this.THIRDPARTYUSER_QUERY_AUTHTYPE_ERROR = "110-011";
    
    /**
     * 根据属性查询座席失败
     */
    this.THIRDPARTYUSER_QUERY_AGENT_BY_ATTRIBUTE_ERROR = "110-012";
    
    /**
     * 账号被锁
     */
    this.ACCOUNT_LOCKED = "110-016";
    
    /**
     * 密码修改失败,新旧密码相同
     */
    this.THIRDPARTYUSER_MODIFY_PASSWORD_ERROR_SAME_OLD = "110-017";
    
    /**
     * 密码修改失败,与name相同或者是name的反序
     */
    this.THIRDPARTYUSER_MODIFY_PASSWORD_ERROR_SAME_NAME = "110-018";
    
    /**
     * 密码修改失败,与name相同或者是name的反序
     */
    this.THIRDPARTYUSER_MODIFY_PASSWORD_ERROR_REGULAR = "110-019";
    
    /**
     * 密码修改失败，密码长度不符合，必须在8-30
     */
    this.THIRDPARTYUSER_MODIFY_PASSWORD_ERROR_LEN = "110-020";
    
    /**
     * 用户名或密码错误次数已达到上限, 帐号被锁定
     */
    this.THIRDPARTYUSER_LOCK_ACCOUNT = "110-021";
    
    /**
     * 密码修改失败,新密码与确认密码不同
     */
    this.THIRDPARTYUSER_MODIFY_PASSWORD_ERROR_DIF_REPWD = "110-022";
    
    /****************************语音呼叫类错误 *************************/
    /**
     * 外呼号码错误
     */
    this.VOICECALL_CALL_OUT_PHONE_ERROR = "200-001";
    
    /**
     * 应答时没有呼叫错误
     */
    this.VOICECALL_ANSWER_NOCALL_ERROR = "200-002";
    
    /**
     * 静音时没有呼叫错误
     */
    this.VOICECALL_BEGINMUTE_NOCALL_ERROR = "200-003";
    
    /**
     * 静音时呼叫状态错误
     */
    this.VOICECALL_BEGINMUTE_STATE_ERROR = "200-004";
    
    /**
     * 连接保持时没有呼叫错误
     */
    this.VOICECALL_CONNECTHOLD_NOCALL_ERROR = "200-005";
    
    /**
     * 连接保持时没有保持呼叫错误
     */
    this.VOICECALL_CONNECTHOLD_NOHOLDCALL_ERROR = "200-006";
    
    /**
     * 取消静音时没有呼叫错误
     */
    this.VOICECALL_ENDMUTE_NOCALL_ERROR = "200-007";
    
    /**
     * 取消静音时呼叫状态错误
     */
    this.VOICECALL_ENDMUTE_STATE_ERROR = "200-008";
    
    /**
     * 报音时没有呼叫错误
     */
    this.VOICECALL_REPORTVOICE_NOCALL_ERROR = "200-009";
    
    /**
     * 三方通话时没有呼叫错误
     */
    this.VOICECALL_THREEPARTY_NOCALL_ERROR = "200-010";
    
    /**
     * 三方通话时没有保持呼叫错误
     */
    this.VOICECALL_THREEPARTY_NOHOLDCALL_ERROR = "200-011";
    
    /**
     * 呼叫转移时没有呼叫错误
     */
    this.VOICECALL_TRANFER_NOCALL_ERROR = "200-012";
    
    /**
     * 保持时没有呼叫错误
     */
    this.VOICECALL_HOLD_NOCALL_ERROR = "200-013";
    
    /**
     * 保持时呼叫状态错误
     */
    this.VOICECALL_HOLD_CALLSTATUS_ERROR = "200-014";
    
    /**
     * 取保持时没有保持呼叫错误
     */
    this.VOICECALL_GETHOLD_NOHOLDCALL_ERROR = "200-015";
    
    /**
     * 取保持时呼叫状态错误
     */
    this.VOICECALL_GETHOLD_CALLSTATUS_ERROR = "200-016";
    
    /**
     * 挂断时无呼叫错误
     */
    this.VOICECALL_RELEASE_NOCALL_ERROR = "200-017";
    
    /**
     * 内部咨询时无呼叫错误
     */
    this.VOICECALL_INSULT_NOCALL_ERROR = "200-018";
    
    
    
    
    
    
    /****************************座席班组类错误 *************************/
    /**
     * 查询座席信息无权限错误
     */
    this.AGENTGROUP_GETAGENT_NORIGHT_ERROR = "300-001";
    
    /**
     * 查询座席信息无座席信息错误
     */
    this.AGENTGROUP_GETAGENT_NOAGENT_ERROR = "300-002";
    
    /**
     * 查询座席班组信息无此座席信息错误
     */
    this.AGENTGROUP_GETAGENTGROUP_NOAGENT_ERROR = "300-003";
    
    /**
     * 查询座席班组信息无此座席班组信息错误
     */
    this.AGENTGROUP_GETAGENTGROUP_NOAGENTGROUP_ERROR = "300-004";
    
    /****************************呼叫数据类错误 *************************/
    /**
     * 设置随路数据时无呼叫信息错误
     */
    this.CALLDATA_SETCALLDATA_NOCALL_ERROR = "400-001";
    
    /**
     * 设置随路数据时无信息可设置错误
     */
    this.CALLDATA_SETCALLDATA_NODATA_ERROR = "400-002";
    
    /**
     * 获取保持队列信息时无话务信息
     */
    this.CALLDATA_GETHOLDLIST_NOHOLDCALL_ERROR = "400-003";
    
    /****************************录音回放类错误 *************************/
    /**
     * 快退时状态错误
     */
    this.RP_JUMPBACK_INVALIDSTATUS_ERROR = "500-001";
    
    /**
     * 快进时状态错误
     */
    this.RP_JUMPFORW_INVALIDSTATUS_ERROR = "500-002";
    
    /**
     * 暂停放音时状态错误
     */
    this.RP_PAUSEPLAY_INVALIDSTATUS_ERROR = "500-003";
    
    /**
     * 暂停录音时状态错误
     */
    this.RP_PAUSERECORD_INVALIDSTATUS_ERROR = "500-004";
    
    /**
     * 继续放音时状态错误
     */
    this.RP_RESUMEPLAY_INVALIDSTATUS_ERROR = "500-005";
    
    /**
     * 继续录音时状态错误
     */
    this.RP_RESUMERECORD_INVALIDSTATUS_ERROR = "500-006";
    
    /**
     * 开始放音时状态错误
     */
    this.RP_STARTPLAY_INVALIDSTATUS_ERROR = "500-007";
    
    /**
     * 开始录音时状态错误
     */
    this.RP_STARTECORD_INVALIDSTATUS_ERROR = "500-008";
    
    /**
     * 停止放音时状态错误
     */
    this.RP_STOPPLAY_INVALIDSTATUS_ERROR = "500-009";
    
    /****************************队列设备类错误 *************************/
    /**
     * 查询座席技能队列信息无此座席信息或座席无配置技能错误
     */
    this.QUEUEDEVICE_GETAGENTQUEUE_NOAGENTORNOQUEUE_ERROR = "600-001";
    
    /**
     * 查询指定VDN的技能队列信息无队列配置信息
     */
    this.QUEUEDEVICE_GETVDNQUEUE_NOQUEUE_ERROR = "600-002";
    
    /**
     * 查询座席所在VDN的接入码信息时无配置信息
     */
    this.QUEUEDEVICE_GETVDNINNO_NOINNO_ERROR = "600-003";
    
    /**
     * 查询座席所在VDN的IVR信息时无配置信息
     */
    this.QUEUEDEVICE_GETIVRINNO_NOIVR_ERROR = "600-004";
    
    /**
     * 查询座席所在VDN的技能队列信息无队列配置信息
     */
    this.QUEUEDEVICE_GETAGENTVDNQUEUE_NOQUEUE_ERROR = "600-005";
    
    /*****************************************************************/
    
 
    /**
     * 文字交谈:其它错误
     */
    this.AGENT_TEXTCHAT_DATABASE_SAVEFIAL = "700-100";
    
    this.AGT_CHAT_QUERY_DB_FAILED = "700-014";
    
    /**发送的文字内容中存在敏感词*/
    this.AGT_CHAT_FILTER_WORD = "700-016";
    
    /***沒有屏幕共享的session***********/
    this.AGT_CHAT_ERR_SCREEN_SHARE_NOT_EXIST = "700-017";
    
    /**
     * 后缀名不正确
     */
    this.AGT_CHAT_ERR_FILEPREFIX = "700-023";
    
    /**
     * 文件不是图片
     */
    this.AGT_CHAT_ERR_FILE_NOTPICTURE = "700-024";
    
    
    /********************** 视频类错误 ***********************************/
    
    /** 视频回放异常 */
    this.VIDEO_PLAY_EVENT_EXCEPTION = "800-001";
    
    /********************** 实时质检操作接口类错误 ***********************************/
    
    /** 质检操作时发生NOPROVIDER异常 */
    this.QUALITYCONTROL_NOPROVIDER_EXCEPTION = "900-001";
    
    /** 质检操作时发生没有权限异常 */
    this.QUALITYCONTROL_NORIGHT_EXCEPTION = "900-002";
    
    /** 质检操作时发生ResourceUnavailableException异常 */
    this.QUALITYCONTROL_RESOURCEUNAVAILABLE_EXCEPTION = "900-003";
    
    /** 质检监视时发生没有座席信息 */
    this.QUALITYCONTROL_MONITOR_AGENT_NOAGENT_EXCEPTION = "900-004";
    
    /** 质检操作时发生状态异常 */
    this.QUALITYCONTROL_STATUS_ERROR = "900-005";
    
    /**
     * 超过当前vdn最大座席登录数。
     */
    this.OVER_MAX_LOGIN = "The number of login agents has exceeded that permitted for this VDN.";
    
    /**
     * 超过当前vdn最大视频座席登录数。
     */
    this.OVER_MAX_VIDEO_LOGIN = "The number of video agents who log in to the VDN to which the agent belongs reaches the upper limit.";
}

function agentConsole_debug(msg)
{
	agentConsole_displayMsg("DEBUG", msg);
}

function agentConsole_error(msg)
{
	agentConsole_displayMsg("ERROR", msg);
}

function agentConsole_info(msg)
{
	agentConsole_displayMsg("INFO", msg);
}


function agentConsole_displayMsg(level, msg)
{
	var buffer = [];
	buffer.push("<tr");
	if (level == "ERROR")
	{
		buffer.push(" style='font-color:red'");
	}
	buffer.push("><td style='width:200px'>" + new Date().format("yyyy-MM-dd hh:mm:ss")
			+ " [" + level + "] </td><td style='word-break:break-all;word-wrap:break-word'>" + htmlEncode(msg)+ "</td></tr>");
	$("#agentConsole tbody").append(buffer.join(""));
}

function agentConsole_cleanLog()
{
	$("#agentConsole tbody").empty();
}


/**
 * This is agent status button'id
 */
var AGENT_STATUS_BUTTON = {};
AGENT_STATUS_BUTTON.INWORK      = "agentStatus_InWork";
AGENT_STATUS_BUTTON.EXITWORK    = "agentStatus_ExitWork";
AGENT_STATUS_BUTTON.REST        = "agentStatus_rest";
AGENT_STATUS_BUTTON.CANCELREST  = "agentStatus_cancelRest";
AGENT_STATUS_BUTTON.BUSY        = "agentStatus_sayBusy";
AGENT_STATUS_BUTTON.IDLE        = "agentStatus_sayIdle";

/**
 * This agent voice button'id
 */
var AGENT_VOICE_BUTTON = {};
AGENT_VOICE_BUTTON.ANSWER      = "agentCall_answer";
AGENT_VOICE_BUTTON.HANGUP      = "agentCall_hangup";
AGENT_VOICE_BUTTON.HOLD        = "agentCall_hold";
AGENT_VOICE_BUTTON.UNHOLD      = "agentCall_unHold";
AGENT_VOICE_BUTTON.THREEPARTY  = "agentCall_threeParty";
AGENT_VOICE_BUTTON.TRANSFER    = "agentCall_transfer";
AGENT_VOICE_BUTTON.CALLOUT     = "agentCall_callout";
AGENT_VOICE_BUTTON.SECONDAIL   = "agentCall_secondDial";
AGENT_VOICE_BUTTON.INNERCALL   = "agentCall_innercall";
AGENT_VOICE_BUTTON.INNERHELP   = "agentCall_innerhelp";
AGENT_VOICE_BUTTON.METU        = "agentCall_mute";
AGENT_VOICE_BUTTON.UNMETUE     = "agentCall_unmute";




/**
 * change button status
 * @param status
 */
function buttonInfo_changeButtonStatus(status)
{
	if (status["disabled"] != undefined)
	{
		buttonInfo_disableButton(status["disabled"]);
	}
	if (status["enabled"] != undefined)
	{
		buttonInfo_enableButton(status["enabled"]);
	}
	buttonInfo_showOrHideButtons();
	
}

function buttonInfo_showOrHideButtons()
{
	var buttons = [[AGENT_STATUS_BUTTON.INWORK, AGENT_STATUS_BUTTON.EXITWORK], 
	               [AGENT_STATUS_BUTTON.REST, AGENT_STATUS_BUTTON.CANCELREST],
	               [AGENT_STATUS_BUTTON.BUSY, AGENT_STATUS_BUTTON.IDLE],
	               [AGENT_VOICE_BUTTON.HOLD, AGENT_VOICE_BUTTON.UNHOLD], 
	               [AGENT_VOICE_BUTTON.METU, AGENT_VOICE_BUTTON.UNMETUE]];
	var len = buttons.length; 
	var button =[];
	for (var i = 0; i < len; i ++)
	{
		button = buttons[i];
		if ($("#" + button[0] ).length == 1
				&& $("#" + button[1]).length == 1)
		{
			if ($("#" + button[0] + "[disabled=disabled]").length == 1
					&& $("#" + button[1] + "[disabled=disabled]").length == 1)
			{
				continue;
			}
			else if ($("#" + button[0] + "[disabled=disabled]").length == 1)
			{
				$("#" + button[1]).show();
				$("#" + button[0]).hide();
			}
			else if ($("#" + button[1] + "[disabled=disabled]").length == 1)
			{
				$("#" + button[1]).hide();
				$("#" + button[0]).show();
			}
		}
	}
	
	
}



/**
 * disable button
 */
function buttonInfo_disableButton(buttonArray)
{
	for (var i in buttonArray)
	{
		$("#" + buttonArray[i]).attr("disabled", "disabled");
	}
}

 /**
  * enable button
  */
function buttonInfo_enableButton(buttonArray)
{
	for (var i in buttonArray)
	{
		$("#" + buttonArray[i]).removeAttr("disabled");
	}
}



var AGENT_BUTTON_STATUS = {};
/**
 * Idle status
 */
AGENT_BUTTON_STATUS.IDLE = {
		"disabled" : [
		              AGENT_STATUS_BUTTON.EXITWORK,
		              AGENT_STATUS_BUTTON.CANCELREST,
		              AGENT_STATUS_BUTTON.IDLE,
		              
		              AGENT_VOICE_BUTTON.ANSWER,
		              AGENT_VOICE_BUTTON.HANGUP,
		              AGENT_VOICE_BUTTON.HOLD,
		              AGENT_VOICE_BUTTON.UNHOLD,
		              AGENT_VOICE_BUTTON.THREEPARTY,
		              AGENT_VOICE_BUTTON.TRANSFER,
		              AGENT_VOICE_BUTTON.SECONDAIL,
		              AGENT_VOICE_BUTTON.INNERHELP,
		              AGENT_VOICE_BUTTON.METU,
		              AGENT_VOICE_BUTTON.UNMETUE
		              ],
		"enabled" : [
		             AGENT_STATUS_BUTTON.INWORK,
		             AGENT_STATUS_BUTTON.REST,
		             AGENT_STATUS_BUTTON.BUSY,
		             
		             AGENT_VOICE_BUTTON.CALLOUT,
		             AGENT_VOICE_BUTTON.INNERCALL
		            ]
};

/**
 * Busy status
 */
AGENT_BUTTON_STATUS.BUSY = {
		"disabled" : [
		              AGENT_STATUS_BUTTON.INWORK,
		              AGENT_STATUS_BUTTON.EXITWORK,
		              AGENT_STATUS_BUTTON.REST,
		              AGENT_STATUS_BUTTON.CANCELREST,
		              AGENT_STATUS_BUTTON.IDLE,
		              AGENT_STATUS_BUTTON.BUSY,
		              
		              AGENT_VOICE_BUTTON.ANSWER,
		              AGENT_VOICE_BUTTON.HANGUP,
		              AGENT_VOICE_BUTTON.HOLD,
		              AGENT_VOICE_BUTTON.UNHOLD,
		              AGENT_VOICE_BUTTON.THREEPARTY,
		              AGENT_VOICE_BUTTON.TRANSFER,
		              AGENT_VOICE_BUTTON.SECONDAIL,
		              AGENT_VOICE_BUTTON.INNERHELP,
		              AGENT_VOICE_BUTTON.METU,
		              AGENT_VOICE_BUTTON.UNMETUE
		              ],
		"enabled" : [
		             AGENT_STATUS_BUTTON.IDLE,
		             
		             AGENT_VOICE_BUTTON.CALLOUT,
		             AGENT_VOICE_BUTTON.INNERCALL
		            ]
};

/**
 * Working status
 */
AGENT_BUTTON_STATUS.WORKING = {
		"disabled" : [
		              AGENT_STATUS_BUTTON.INWORK,
		              AGENT_STATUS_BUTTON.EXITWORK,
		              AGENT_STATUS_BUTTON.REST,
		              AGENT_STATUS_BUTTON.CANCELREST,
		              AGENT_STATUS_BUTTON.IDLE,
		              AGENT_STATUS_BUTTON.BUSY,
		              
		              AGENT_VOICE_BUTTON.ANSWER,
		              AGENT_VOICE_BUTTON.HANGUP,
		              AGENT_VOICE_BUTTON.HOLD,
		              AGENT_VOICE_BUTTON.UNHOLD,
		              AGENT_VOICE_BUTTON.THREEPARTY,
		              AGENT_VOICE_BUTTON.TRANSFER,
		              AGENT_VOICE_BUTTON.SECONDAIL,
		              AGENT_VOICE_BUTTON.INNERHELP,
		              AGENT_VOICE_BUTTON.METU,
		              AGENT_VOICE_BUTTON.UNMETUE
		              ],
		"enabled" : [
		             AGENT_STATUS_BUTTON.BUSY,
		             AGENT_STATUS_BUTTON.REST,
		             AGENT_STATUS_BUTTON.EXITWORK,
		             AGENT_VOICE_BUTTON.CALLOUT,
		             AGENT_VOICE_BUTTON.INNERCALL
		            ]
};

/**
 * Rest status
 */
AGENT_BUTTON_STATUS.REST = {
		"disabled" : [
		              AGENT_STATUS_BUTTON.INWORK,
		              AGENT_STATUS_BUTTON.EXITWORK,
		              AGENT_STATUS_BUTTON.REST,
		              AGENT_STATUS_BUTTON.IDLE,
		              AGENT_STATUS_BUTTON.BUSY,
		              
		              AGENT_VOICE_BUTTON.ANSWER,
		              AGENT_VOICE_BUTTON.HANGUP,
		              AGENT_VOICE_BUTTON.HOLD,
		              AGENT_VOICE_BUTTON.UNHOLD,
		              AGENT_VOICE_BUTTON.THREEPARTY,
		              AGENT_VOICE_BUTTON.TRANSFER,
		              AGENT_VOICE_BUTTON.SECONDAIL,
		              AGENT_VOICE_BUTTON.INNERHELP,
		              AGENT_VOICE_BUTTON.METU,
		              AGENT_VOICE_BUTTON.UNMETUE,
		              AGENT_VOICE_BUTTON.CALLOUT,
			          AGENT_VOICE_BUTTON.INNERCALL
		              ],
		"enabled" : [
		             AGENT_STATUS_BUTTON.CANCELREST
		            ]
};

/**
 * Ringing status
 */
AGENT_BUTTON_STATUS.RINGING = {
		"disabled" : [
		              AGENT_VOICE_BUTTON.HOLD,
		              AGENT_VOICE_BUTTON.UNHOLD,
		              AGENT_VOICE_BUTTON.THREEPARTY,
		              AGENT_VOICE_BUTTON.TRANSFER,
		              AGENT_VOICE_BUTTON.INNERHELP,
		              AGENT_VOICE_BUTTON.METU,
		              AGENT_VOICE_BUTTON.UNMETUE,
		              AGENT_VOICE_BUTTON.CALLOUT,
		              AGENT_VOICE_BUTTON.SECONDAIL,
			          AGENT_VOICE_BUTTON.INNERCALL
		              ],
		"enabled" : [
		              AGENT_VOICE_BUTTON.ANSWER,
		              AGENT_VOICE_BUTTON.HANGUP
		             ]
};



/**
 * Talking status
 */
AGENT_BUTTON_STATUS.TALKING = {
		"disabled" : [
		              AGENT_STATUS_BUTTON.INWORK,
		              AGENT_STATUS_BUTTON.EXITWORK,
		              AGENT_STATUS_BUTTON.CANCELREST,
		              AGENT_STATUS_BUTTON.IDLE,
		              
		              AGENT_VOICE_BUTTON.ANSWER,
		              AGENT_VOICE_BUTTON.HANGUP,
		              AGENT_VOICE_BUTTON.HOLD,
		              AGENT_VOICE_BUTTON.UNHOLD,
		              AGENT_VOICE_BUTTON.THREEPARTY,
		              AGENT_VOICE_BUTTON.TRANSFER,
		              AGENT_VOICE_BUTTON.INNERHELP,
		              AGENT_VOICE_BUTTON.METU,
		              AGENT_VOICE_BUTTON.UNMETUE,
		              AGENT_VOICE_BUTTON.CALLOUT,
		              AGENT_VOICE_BUTTON.SECONDAIL,
			          AGENT_VOICE_BUTTON.INNERCALL
		              ],
		"enabled" : [
		              AGENT_STATUS_BUTTON.BUSY,
		              AGENT_STATUS_BUTTON.REST,
		             ]
};

/**
 * 
 * When agent click busy button when agent in talking status ,
 * agent is into pre_busy status
 */
AGENT_BUTTON_STATUS.BUSYWHENTALKING = {
		"disabled" : [
		              AGENT_STATUS_BUTTON.INWORK,
		              AGENT_STATUS_BUTTON.EXITWORK,
		              AGENT_STATUS_BUTTON.CANCELREST,
		              AGENT_STATUS_BUTTON.REST,
		              AGENT_STATUS_BUTTON.BUSY
		              ],
  		"enabled" : [
  		              AGENT_STATUS_BUTTON.IDLE
  		             ]
};


/**
 * 
 * When agent click busy button when agent in talking status ,
 * agent is into pre_rest status
 */
AGENT_BUTTON_STATUS.RESTWHENTALKING = {
		"disabled" : [
		              AGENT_STATUS_BUTTON.INWORK,
		              AGENT_STATUS_BUTTON.EXITWORK,
		              AGENT_STATUS_BUTTON.REST,
		              AGENT_STATUS_BUTTON.BUSY,
		              AGENT_STATUS_BUTTON.IDLE,
		              ],
  		"enabled" : [
  		              AGENT_STATUS_BUTTON.CANCELREST
  		             ]
};

/**
 * 
 *  agent cancel busy when in talking status
 */
AGENT_BUTTON_STATUS.CANCELBUSYWHENTALKING = {
		"disabled" : [
		              AGENT_STATUS_BUTTON.INWORK,
		              AGENT_STATUS_BUTTON.EXITWORK,
		              AGENT_STATUS_BUTTON.CANCELREST,
		              AGENT_STATUS_BUTTON.IDLE
		              ],
  		"enabled" : [
  		              AGENT_STATUS_BUTTON.REST,
  		              AGENT_STATUS_BUTTON.BUSY
  		             ]
};

/**
 * agent cancel rest when in talking status
 */
AGENT_BUTTON_STATUS.CANCELRESTWHENTALKING = {
		"disabled" : [
		              AGENT_STATUS_BUTTON.INWORK,
		              AGENT_STATUS_BUTTON.EXITWORK,
		              AGENT_STATUS_BUTTON.CANCELREST,
		              AGENT_STATUS_BUTTON.IDLE
		              ],
  		"enabled" : [
  		              AGENT_STATUS_BUTTON.REST,
  		              AGENT_STATUS_BUTTON.BUSY
  		             ]
};




/**
 * 
 * When agent click busy button when agent in working status ,
 * agent is into pre_rest status
 */
AGENT_BUTTON_STATUS.RESTWHENWORKING = {
		"disabled" : [
		              AGENT_STATUS_BUTTON.INWORK,
					  AGENT_STATUS_BUTTON.REST,
					  AGENT_STATUS_BUTTON.IDLE,
					  AGENT_STATUS_BUTTON.BUSY,
					  AGENT_STATUS_BUTTON.CANCELREST,
						
					  AGENT_VOICE_BUTTON.ANSWER,
					  AGENT_VOICE_BUTTON.HANGUP,
				      AGENT_VOICE_BUTTON.HOLD,
					  AGENT_VOICE_BUTTON.UNHOLD,
				      AGENT_VOICE_BUTTON.THREEPARTY,
				      AGENT_VOICE_BUTTON.TRANSFER,
					  AGENT_VOICE_BUTTON.INNERHELP,
					  AGENT_VOICE_BUTTON.METU,
					  AGENT_VOICE_BUTTON.UNMETUE,
					  AGENT_VOICE_BUTTON.CALLOUT,
					  AGENT_VOICE_BUTTON.SECONDAIL,
					  AGENT_VOICE_BUTTON.INNERCALL
		              ],
  		"enabled" : [
  		              AGENT_STATUS_BUTTON.EXITWORK
  		             ]
};


/**
 * 
 * When agent click busy button when agent in working status ,
 * agent is into pre_busy status
 */
AGENT_BUTTON_STATUS.BUSYWHENWORKING = {
		"disabled" : [
		              AGENT_STATUS_BUTTON.INWORK,
					  AGENT_STATUS_BUTTON.REST,
					  AGENT_STATUS_BUTTON.IDLE,
					  AGENT_STATUS_BUTTON.BUSY,
					  AGENT_STATUS_BUTTON.CANCELREST,
						
					  AGENT_VOICE_BUTTON.ANSWER,
					  AGENT_VOICE_BUTTON.HANGUP,
				      AGENT_VOICE_BUTTON.HOLD,
					  AGENT_VOICE_BUTTON.UNHOLD,
				      AGENT_VOICE_BUTTON.THREEPARTY,
				      AGENT_VOICE_BUTTON.TRANSFER,
					  AGENT_VOICE_BUTTON.INNERHELP,
					  AGENT_VOICE_BUTTON.METU,
					  AGENT_VOICE_BUTTON.UNMETUE,
					  AGENT_VOICE_BUTTON.CALLOUT,
					  AGENT_VOICE_BUTTON.SECONDAIL,
					  AGENT_VOICE_BUTTON.INNERCALL
		              ],
  		"enabled" : [
  		              AGENT_STATUS_BUTTON.EXITWORK
  		             ]
};

/**
 * 
 * When agent click submit rest button when agent in idle status ,
 * agent is into pre_rest status first
 */
AGENT_BUTTON_STATUS.RESTWHENIDLE = {
		"disabled" : [
					  AGENT_STATUS_BUTTON.INWORK,
					  AGENT_STATUS_BUTTON.BUSY,
		              AGENT_STATUS_BUTTON.REST
		              ],
  		"enabled" : [
  		              AGENT_STATUS_BUTTON.CANCELREST
  		             ]
};

/**
 * 
 * When agent click cancel rest button when agent in idle status ,
 * agent is into idle status 
 */
AGENT_BUTTON_STATUS.CANCELRESTWHENIDLE = {
		"disabled" : [
		              AGENT_STATUS_BUTTON.CANCELREST
		              ],
  		"enabled" : [
  		              AGENT_STATUS_BUTTON.INWORK,
  		              AGENT_STATUS_BUTTON.BUSY,
  		              AGENT_STATUS_BUTTON.REST
  		             ]
};




/**
 * if callfeature is unknow type, only enable hangup button.
 */
AGENT_BUTTON_STATUS.TALKING_DEFAULT= {
		"disabled" : [
			AGENT_VOICE_BUTTON.ANSWER,
			AGENT_VOICE_BUTTON.HOLD,
			AGENT_VOICE_BUTTON.UNHOLD ,
			AGENT_VOICE_BUTTON.THREEPARTY ,
			AGENT_VOICE_BUTTON.TRANSFER,
			AGENT_VOICE_BUTTON.CALLOUT,
			AGENT_VOICE_BUTTON.SECONDAIL,
			AGENT_VOICE_BUTTON.INNERCALL,
			AGENT_VOICE_BUTTON.INNERHELP,
			AGENT_VOICE_BUTTON.METU,
			AGENT_VOICE_BUTTON.UNMETUE
		 ],
		 "enabled" : [
   			AGENT_VOICE_BUTTON.HANGUP
   		 ]
};

/**
 *talking when normal callin and callout
 *agent receive AgentEvent_Talking event
 *and call feature is CALL_FEATURE.NORMAL or CALL_FEATURE.FEATURE_OUT or CALL_FEATURE.PRE_OCCUPY
 * or CALL_FEATURE.OUTBOUND_VIRTUAL_CALLIN or CALL_FEATURE.OUTBOUND_PREVIEW or CALL_FEATURE.OUTBOUND_CALLBACK
 */
AGENT_BUTTON_STATUS.TALKING_NORMALCALL = {
		"disabled" : [
			AGENT_VOICE_BUTTON.ANSWER,
			AGENT_VOICE_BUTTON.UNHOLD ,
			AGENT_VOICE_BUTTON.THREEPARTY,
			AGENT_VOICE_BUTTON.CALLOUT,
			AGENT_VOICE_BUTTON.INNERCALL,
			AGENT_VOICE_BUTTON.UNMETUE
		 ],
		 "enabled" : [
   			AGENT_VOICE_BUTTON.HANGUP,
   			AGENT_VOICE_BUTTON.HOLD,
   			AGENT_VOICE_BUTTON.TRANSFER,
   			AGENT_VOICE_BUTTON.SECONDAIL,
   			AGENT_VOICE_BUTTON.INNERHELP,
   			AGENT_VOICE_BUTTON.METU
   		 ]
};


/**
 *talking after hold operation when normal callin and callout
 *agent receive AgentEvent_Talking event
 *and call feature is CALL_FEATURE.NORMAL or CALL_FEATURE.FEATURE_OUT or CALL_FEATURE.PRE_OCCUPY
 * or CALL_FEATURE.OUTBOUND_VIRTUAL_CALLIN or CALL_FEATURE.OUTBOUND_PREVIEW or CALL_FEATURE.OUTBOUND_CALLBACK
 */
AGENT_BUTTON_STATUS.TALKING_NORMALCALLAFTERHOLD = {
		"disabled" : [
			AGENT_VOICE_BUTTON.ANSWER,
			AGENT_VOICE_BUTTON.UNHOLD,
			AGENT_VOICE_BUTTON.CALLOUT,
			AGENT_VOICE_BUTTON.INNERCALL,
			AGENT_VOICE_BUTTON.UNMETUE
		 ],
		 "enabled" : [
   			AGENT_VOICE_BUTTON.HANGUP,
   			AGENT_VOICE_BUTTON.HOLD,
   			AGENT_VOICE_BUTTON.THREEPARTY,
   			AGENT_VOICE_BUTTON.TRANSFER,
   			AGENT_VOICE_BUTTON.SECONDAIL,
   			AGENT_VOICE_BUTTON.INNERHELP,
   			AGENT_VOICE_BUTTON.METU
   		 ]
};

/**
 *talking when innercall call
 *agent receive AgentEvent_Talking event
 *and call feature is CALL_FEATURE.INTERNAL
 */
AGENT_BUTTON_STATUS.TALKING_INNERCALL= {
		"disabled" : [
			AGENT_VOICE_BUTTON.ANSWER,
			AGENT_VOICE_BUTTON.HOLD,
			AGENT_VOICE_BUTTON.UNHOLD,
			AGENT_VOICE_BUTTON.THREEPARTY,
			AGENT_VOICE_BUTTON.TRANSFER,
			AGENT_VOICE_BUTTON.CALLOUT,
			AGENT_VOICE_BUTTON.SECONDAIL,
			AGENT_VOICE_BUTTON.INNERCALL,
			AGENT_VOICE_BUTTON.INNERHELP,
			AGENT_VOICE_BUTTON.METU,
			AGENT_VOICE_BUTTON.UNMETUE
		 ],
		 "enabled" : [
   			AGENT_VOICE_BUTTON.HANGUP
   		 ]
};


/**
 *agent receive AgentEvent_Talking event
 *and call feature is CALL_FEATURE.INTERNAL_TWO_HELP
 */
AGENT_BUTTON_STATUS.TALKING_INNER2PARTY= {
		"disabled" : [
			AGENT_VOICE_BUTTON.ANSWER,
			AGENT_VOICE_BUTTON.HOLD,
			AGENT_VOICE_BUTTON.UNHOLD,
			AGENT_VOICE_BUTTON.THREEPARTY,
			AGENT_VOICE_BUTTON.TRANSFER,
			AGENT_VOICE_BUTTON.CALLOUT,
			AGENT_VOICE_BUTTON.SECONDAIL,
			AGENT_VOICE_BUTTON.INNERCALL,
			AGENT_VOICE_BUTTON.INNERHELP,
			AGENT_VOICE_BUTTON.METU,
			AGENT_VOICE_BUTTON.UNMETUE
		 ],
		 "enabled" : [
   			AGENT_VOICE_BUTTON.HANGUP
   		 ]
};


/**
 *agent receive AgentEvent_Talking event
 *and call feature is CALL_FEATURE.INTERNAL_THREE_HELP
 */
AGENT_BUTTON_STATUS.TALKING_INNER3PARTY= {
		"disabled" : [
			AGENT_VOICE_BUTTON.ANSWER,
			AGENT_VOICE_BUTTON.HOLD,
			AGENT_VOICE_BUTTON.UNHOLD,
			AGENT_VOICE_BUTTON.THREEPARTY,
			AGENT_VOICE_BUTTON.TRANSFER,
			AGENT_VOICE_BUTTON.CALLOUT,
			AGENT_VOICE_BUTTON.SECONDAIL,
			AGENT_VOICE_BUTTON.INNERCALL,
			AGENT_VOICE_BUTTON.INNERHELP,
			AGENT_VOICE_BUTTON.METU,
			AGENT_VOICE_BUTTON.UNMETUE
		 ],
		 "enabled" : [
   			AGENT_VOICE_BUTTON.HANGUP
   		 ]
};


/**
 *agent receive AgentEvent_Talking event
 *and call feature is CALL_FEATURE.CONFERENCE
 */
AGENT_BUTTON_STATUS.TALKING_CONFERENCE= {
		"disabled" : [
			AGENT_VOICE_BUTTON.ANSWER,
			AGENT_VOICE_BUTTON.HOLD,
			AGENT_VOICE_BUTTON.UNHOLD,
			AGENT_VOICE_BUTTON.THREEPARTY,
			AGENT_VOICE_BUTTON.TRANSFER,
			AGENT_VOICE_BUTTON.CALLOUT,
			AGENT_VOICE_BUTTON.SECONDAIL,
			AGENT_VOICE_BUTTON.INNERCALL,
			AGENT_VOICE_BUTTON.INNERHELP,
			AGENT_VOICE_BUTTON.METU,
			AGENT_VOICE_BUTTON.UNMETUE
		 ],
		 "enabled" : [
   			AGENT_VOICE_BUTTON.HANGUP
   		 ]
};


/**
 * agent receive AgentEvent_Hold event
 * and call is held
 */
AGENT_BUTTON_STATUS.HOLD = {
		"disabled" : [
			AGENT_VOICE_BUTTON.ANSWER,
			AGENT_VOICE_BUTTON.HANGUP,
			AGENT_VOICE_BUTTON.HOLD,
			AGENT_VOICE_BUTTON.THREEPARTY ,
			AGENT_VOICE_BUTTON.TRANSFER,
			AGENT_VOICE_BUTTON.SECONDAIL,
			AGENT_VOICE_BUTTON.INNERHELP,
			AGENT_VOICE_BUTTON.METU,
			AGENT_VOICE_BUTTON.UNMETUE
		 ],
		 "enabled" : [
			AGENT_VOICE_BUTTON.UNHOLD,
			AGENT_VOICE_BUTTON.CALLOUT,
			AGENT_VOICE_BUTTON.INNERCALL
 		 ]
};

/**
 * Metu call.
 */
AGENT_BUTTON_STATUS.METU = {
		"disabled" : [
  			AGENT_VOICE_BUTTON.ANSWER,
  			AGENT_VOICE_BUTTON.HOLD,
  			AGENT_VOICE_BUTTON.UNHOLD ,
  			AGENT_VOICE_BUTTON.THREEPARTY ,
  			AGENT_VOICE_BUTTON.TRANSFER,
  			AGENT_VOICE_BUTTON.CALLOUT,
  			AGENT_VOICE_BUTTON.SECONDAIL,
  			AGENT_VOICE_BUTTON.INNERCALL,
  			AGENT_VOICE_BUTTON.INNERHELP,
  			AGENT_VOICE_BUTTON.METU
  		 ],
  		"enabled" : [
  			AGENT_VOICE_BUTTON.HANGUP,
  			AGENT_VOICE_BUTTON.UNMETUE
  		 ]
};

/**
 * NO call is hold
 */
AGENT_BUTTON_STATUS.NOHOLDCALL={
		"disabled" : [	
		    AGENT_VOICE_BUTTON.THREEPARTY 
		 ]
};