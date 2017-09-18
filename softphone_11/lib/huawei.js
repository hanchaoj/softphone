;(function(window){

  var AGENT_STATE = {
    IDLE        : 4,//Idle status
    TALKING     : 7,//Talking status
    BUSY        : 3,//Busy status
    REST        : 8,//Rest status
    WORKING     : 5//Work status
  };

  var AGENT_STATE_DES = {
    IDLE        : "Idle",//Idle status
    TALKING     : "Talking",//Talking status
    BUSY        : "Busy",//Busy status
    REST        : "Rest",//Rest status
    WORKING     : "ACW"//Work status
  };

  var CODE_STATE ={
    0:"未知",
    1:"签入",
    2:"签出",
    3:"示忙",
    4:"示闲",
    5:"工作",
    6:"未使用,空闲",
    7:"通话态"
  }

  /**
   * Call feature
   */
  var CALL_FEATURE = {
    OTHER : -1,                  /** Other */
    NORMAL : 0,                    /** Normal Call in */
    INTERNAL : 6,                  /** Inner Call */
    FEATURE_OUT : 7,               /** Call out */
    PRE_OCCUPY : 41,               /** Preempted */
    OUTBOUND_VIRTUAL_CALLIN : 43,  /** Predicted */
    OUTBOUND_PREVIEW : 44,         /** Preview */
    OUTBOUND_CALLBACK : 45,        /** Call Back */
    INTERNAL_TWO_HELP : 51,        /** Two-Help */
    INTERNAL_THREE_HELP : 52,      /** Three-Help */
    CONFERENCE : 53,               /** Conference*/
    TRANSFER_CONFERENCE : 99      /** Transfer-Conference*/
  };

  var CALL_STATUS = {
    ALERTING : "Alerting",
    TALKING : "Talking",
    RELEASE : "Release",
    HOLD : "Hold",
    METU : "Metu"
  };

  var WEBCHAT_STATUS = {
    REQUESTINNER : "REQUESTINNER",
    RINGING : "Ring",
    CONNECTED : "Connected",
    DISCONNECTED : "Disconnected",
    CALLOUTFAILED : "CallOutFailed"
  };

  function HashMap() {
    /** Map 大小 **/
    var size = 0;
    /** Object **/
    var entry = {};

    /** Store **/
    this.put = function (key , value) {
      if(!this.containsKey(key)) {
        size ++ ;
      }
      entry[key] = value;
    };

    /** Get**/
    this.get = function (key) {
      if( this.containsKey(key) ) {
        return entry[key];
      } else {
        return null;
      }
    };

    /** Remove **/
    this.remove = function ( key ) {
      if( delete entry[key] ) {
        size --;
      }
    };

    /** Clear map **/
    this.clear = function() {
      try {
        delete entry;
        entry = {};
        size = 0;
      } catch (e) {
        return e;
      }
    };

    /** Is Contain Key **/
    this.containsKey = function ( key ) {return (key in entry);};

    /** Is Contain Value **/
    this.containsValue = function ( value ) {
      for(var prop in entry) {
        if(entry[prop] == value)
        {
          return true;
        }
      }
      return false;
    };

    /** All Value **/
    this.values = function () {
//         var values = new Array(size);
      var values = new Array();
      for(var prop in entry) {
        values.push(entry[prop]);
      }
      return values;
    };

    /** All Key **/
    this.keys = function () {
//         var keys = new Array(size);
      var keys = new Array();
      for(var prop in entry) {
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

  function AgentInfo(agentId, phoneNumber) {
    this.agentId = agentId;
    this.phoneNumber = phoneNumber;
    this.status = AGENT_STATE.IDLE;
    this.preRest = false;
    this.preBusy = false;
  };

  function CallInfo() {
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

  function ResultCode() {
    /** 返回类型:成功 */
    this.SUCCESSCODE = "0";

    /** -------------------------- 错误码开始 ----------------------------*/

    /****************************一般性错误 *************************/
    /**
     * 获取Agent事件的方法错误
     */
    this.AGENT_EVENT_METHOD_ERROR = "000-001";

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

  /**
   * 通话唯一
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
  var getEventLisnter_timer = "";

  //eventHandle.js
  AgentEventDispatcher.getAgentEvent2 = function(_params) {
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
    if (params.$timeoutHandle) {
      request.setTimeoutHandle(params.$timeoutHandle);
    }
    if (params.$callback) {
      request.execute(params.$callback);
    }
    else {
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

  function getEventLisnter(){
    AgentEventDispatcher.getAgentEvent2({
      "agentid":global_agentInfo.agentId,
      $callback:function(result, data, entity){
        var agentEvents = entity.event;
        if(null == agentEvents || agentEvents.length == 0) {
          clearTimeout(getEventLisnter_timer);
          getEventLisnter_timer = setTimeout(getEventLisnter, 500);
        } else {
          agentEventHandle(agentEvents);
          getEventLisnter();
        }
      }
    })
  }

  var CKAGENTINFO ={
    WorkNo:"123",
    Password:"cti-1234",
    PhoneNumber:"8013"
  }
  var agenttype={Audio:4, Video:11}
  /**
   * 登录
   * @param agentId
   * @param password
   * @param phoneNumber
   * @param status
   * @param releasePhone
   */
  function agentLogin_login(agentId, password, phoneNumber, status, releasePhone,type) {
    OnlineAgent.login({
      "agentid" : agentId,
      $entity:{
        "password":password,
        "phonenum":phoneNumber,
        "status": status,
        "releasephone" : releasePhone,
        "agenttype":type
      },
      $callback: function(result, data, entity){
        var resLogin = entity;
        var retCodeLogin = resLogin.retcode;
        switch (retCodeLogin) {
          case "0":
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
            if (btn) {
              agentLogin_doForceLogin(agentId, password, phoneNumber, status, releasePhone);
            }
            break;
          default :
            console.error("Error! Retcode : " + retCodeLogin + ". RetMessage:" +  resLogin.message);
            break;
        }
      }
    });
  }

  function agentLogin_doForceLogin(agentId, password, phoneNumber, status, releasePhone){
    OnlineAgent.forceLogin({
      "agentid" : CKAGENTINFO.WorkNo,
      $entity:{
        "password":CKAGENTINFO.Password,
        "phonenum":CKAGENTINFO.PhoneNumber,
        "status": 4,
        "releasephone" : false,
        "agenttype": agenttype.Audio,
        "autoanswer":false,//自动应答
        "autoenteridle":false//自动进入空闲态?
      },
      $callback: function(result,data, entity){
        console.log("[huawei]agentLogin_doForceLogin:",entity);
        var resLogin = entity;
        var retCodeLogin = resLogin.retcode;
        switch (retCodeLogin) {
          case "0":
            // login success
            global_currentVdnId = resLogin.result.vdnid;
            agentLogin_loginSuccess(CKAGENTINFO.WorkNo, CKAGENTINFO.PhoneNumber);
            break;
          default :
            console.error("Error! Retcode : " + retCodeLogin + ". RetMessage:" +  resLogin.message);
            break;
        }
      }
    })
  }

  function agentLogin_loginSuccess(agentId, phoneNumber){
    global_agentInfo = new AgentInfo(agentId, phoneNumber);
    console.log("[huawei]agentLogin_loginSuccess:",global_agentInfo);
    OnlineAgent.resetSkill({
      "agentid" : agentId,
      "autoflag": true,//是否自动录音
      "phonelinkage" : 0,
      //"skillid":"1;2;3",
      $callback: function(result,data, entity){
        console.log("[huawei]resetSkill:",entity);
        var resLogin = entity;
        var retCodeLogin = resLogin.retcode;
        switch (retCodeLogin) {
          case "0":
            console.log("[huawei]agent [" + agentId + "] login successfully.");
            setTimeout(getEventLisnter, 500);
            break;
          default :
            alert("Error! Retcode : " + retCodeLogin + ". RetMessage:" +  resLogin.message);
            break;
        }
      }
    })
  }

  /**
   * 登出
   */
  function agentLogin_lagout() {
    OnlineAgent.logout({"agentid" : global_agentInfo.agentId});
  }

  function agentLogin_doForceLogoutWithReason() {
    OnlineAgent.forceLogoutWithReason({"agentid" : global_agentInfo.agentId, "reason" : 1});
  }

  /**
   * 打电话
   * @param agentId
   * @param phoneNo
   * @returns {{calloutNumber: *, calloutCallId: (SVGAnimatedString|any|Object)}}
   */
  var phoneNum = "*8838630759";
  function agentCallOperation_toCallOut(phoneNo) {
    var retJson = VoiceCall.callout({"agentid": global_agentInfo.agentId, $entity: {"called": phoneNum}});
    var retResult = retJson.retcode;
    console.log("phoneNo:",phoneNum,retJson);
    if (global_resultCode.SUCCESSCODE == retResult) {
      global_currentCalloutNumber = phoneNum;
    }
  }

  /**
   * 接电话
   * @param agentId
   */
  function agentCallOperation_toAnswer() {
    var retJson = VoiceCall.answer({"agentid" : global_agentInfo.agentId});
    var retResult = retJson.retcode;
    if(global_resultCode.SUCCESSCODE != retResult) {
      console.error("Answer call failed. Retcode : " + retResult);
    }
  }

  /**
   * 挂断电话
   * @param agentId
   */
  var isForVTM = true; // 不同方式挂断??
  function agentCallOperation_toHangUp() {
    var retJson;
    if (isForVTM) {
      retJson = VoiceCall.releaseForVTM({"agentid":global_agentInfo.agentId});
    } else {
      retJson = VoiceCall.release({"agentid":global_agentInfo.agentId});
    }
    var retResult = retJson.retcode;
    if(global_resultCode.SUCCESSCODE == retResult) {
      //挂断成功
    } else {
      console.error("Hangup call failed. Retcode : " + retResult);
    }
  }

  /**
   * 电话保持
   */
  function agentCallOperation_toHold() {
    var retJson = VoiceCall.hold({"agentid":global_agentInfo.agentId});
    var retResult = retJson.retcode;
    if(global_resultCode.SUCCESSCODE == retResult) {

    } else {
      alert("Hold call failed. Retcode : " + retResult);
    }
  }

  /**
   * 取消电话保持 fixme currentCallId
   * @param currentCallId
   * @returns {*}
   */
  function agentCallOperation_toUnHold(currentCallId) {
    var retJson = VoiceCall.getHold({"agentid":global_agentInfo.agentId, "callid":currentCallId});
    var retResult = retJson.retcode;
    return retResult;
  }

  /**
   * 静音
   */
  function agentCallOperation_toMetu() {
    var retJson = VoiceCall.beginMute({"agentid":global_agentInfo.agentId});
    var retResult = retJson.retcode;
    if(global_resultCode.SUCCESSCODE == retResult) {	//No need to wait any event.

    } else {
      alert("Metu call failed. Retcode : " + retResult);
    }
  }

  /**
   * 消息分发
   * @param oneEvent
   */
  function agentEventHandle(oneEvent){
    var eventType = oneEvent.eventType;
    if (eventType != "AgentEvent_ControlWindow_Notify" && eventType != "AgentEvent_Orders_Notify") {
    }
    console.log('[huawei] agentEventHandle[%s] [%s]:',eventType,JSON.stringify(oneEvent));

    switch (eventType) {
      case "AgentState_SetNotReady_Success":
      case "AgentState_Force_SetNotReady":
        Proc_agentState("BUSY");
        break;
      case "AgentState_Ready":               //Into Idle status
      case "AgentState_Force_Ready":         //Forcibly Into Idle status
      case "AgentState_CancelNotReady_Success":  //Cancel busy status successfully, and agent into Idle status
      case "AgentState_CancelRest_Success":      //Cancel rest status successfully, and agent into Idle status
      case "AgentState_CancelWork_Success":      //Exit work status successfully, and agent into Idle status
        Proc_agentState("IDLE");
        //eventHandle_stopRecordTimer();//停止录音检查定时器
        break;
      case "AgentState_SetRest_Success":        //Into rest status successfully
        Proc_agentState("REST");
        break;
      case "AgentState_Rest_Timeout":
        break;
      case "AgentState_SetWork_Success":
      case "AgentState_Work":
        Proc_agentState("WORKING");
        break;
      case "AgentState_Busy":
        Proc_agentState("TALKING");
        break;

    /****************************Agent Voice Talking Event****************************/
      case "AgentEvent_Customer_Alerting":
        Proc_agentEvent_customerAlerting(oneEvent)
        break;
      case "AgentEvent_Ringing":
        Proc_agentEvent_Ringing(oneEvent);
        break;
      case "AgentEvent_Hold":
        Proc_agentEvent_hold(oneEvent)
        break;
      case "AgentEvent_Talking":
        Proc_agentEvent_talking(oneEvent);
        break;

      case "AgentEvent_Call_Out_Fail":
      case "AgentEvent_Connect_Fail":
        break;

      case "AgentEvent_Call_Release":
        break;
      case "AgentEvent_Customer_Release":
        //对方挂断
        break;
      case "AgentOther_PhoneRelease":
        break;
      default:
    }
  }

  /**
   * 记录当前坐席状态
   * @param state
   * @constructor
   */

  var CODE_STATE ={
    0:"未知",
    1:"签入",
    2:"签出",
    3:"示忙",
    4:"示闲",
    5:"整理",
    6:"未使用,空闲",
    7:"通话态"
  }
  function Proc_agentState(state){
    global_agentInfo.status = AGENT_STATE[state];
    console.log("[huawei]Proc_agentState---------:",global_agentInfo.status,CODE_STATE[global_agentInfo.status]);
    global_agentInfo.preRest = false;
    global_agentInfo.preBusy = false;
  }

  function Proc_agentEvent_customerAlerting(event){
    console.log("****Proc_agentEvent_customerAlerting******",event);
    try {
      var callId = event.content.callid;
      global_currentDealCallId = callId;
      var otherParty =  event.content.otherPhone;
      if (global_currentCalloutCallId == callId) {
        //Agent do callout and the customer phone is ringing.
        //agentCallInfo_showCurrentCallInfo(otherParty, CALL_STATUS.ALERTING, CALL_FEATURE.FEATURE_OUT);
        return;
      }

      if (global_currentInnercallCallId == callId) {
        //Agent do callout and the customer phone is ringing.
        //agentCallInfo_showCurrentCallInfo(global_currentInnercallAgent, CALL_STATUS.ALERTING, CALL_FEATURE.INTERNAL);
        return;
      }
    } catch(e){
      console.info('Proc_agentEvent_customerAlerting...',e);
    }
  }

  function Proc_agentEvent_Ringing(event){
    console.log('[huawei:震铃]Proc_agentEvent_Ringing...',event)
    //var callId = event.content.callid;
    //global_currentDealCallId = callId;
    //eventProcess_queryCallInfoByCallId(callId);
    //agentCallInfo_showCallInfo(callId, CALL_STATUS.ALERTING);
  }

  function Proc_agentEvent_hold(){

  }

  function Proc_agentEvent_talking(event){

    console.log('@@@@@Proc_agentEvent_talking@@@@@',event);

    var callId = event.content.callid;
    global_currentDealCallId = callId;
    eventProcess_removeFromHoldList(callId);
    var feature = CALL_FEATURE.OTHER;
    var otherParty = event.content.caller;
    if (event.content.feature != undefined && event.content.feature != null) {
      feature = parseInt(event.content.feature);
    }

    switch (feature) {
      case CALL_FEATURE.FEATURE_OUT:
        otherParty = event.content.called;
      case CALL_FEATURE.NORMAL:
      case CALL_FEATURE.PRE_OCCUPY:
      case CALL_FEATURE.OUTBOUND_VIRTUAL_CALLIN:
      case CALL_FEATURE.OUTBOUND_PREVIEW:
      case CALL_FEATURE.OUTBOUND_CALLBACK:
        break;
      case CALL_FEATURE.INTERNAL:
        break;
      case CALL_FEATURE.INTERNAL_TWO_HELP:
        break;
      case CALL_FEATURE.INTERNAL_THREE_HELP:
        break;
      case CALL_FEATURE.CONFERENCE:
        break;
      default:
        break;
    }
  }

  function agentCallInfo_showCurrentCallInfo(otherParty, callStatus, callFeature){

  }

  function agentCallInfo_showCallInfo(){

  }

  function eventProcess_removeFromHoldList(callId) {
    var tempArray = [];
    var len = global_currentHoldList.length;
    for (var i = 0; i < len; i++) {
      if (callId != global_currentHoldList[i]) {
        tempArray.push(global_currentHoldList[i]);
      }
    }
    global_currentHoldList = tempArray;
  }


  ////////////////////////


  /**
   * 是否自动应答
   * @param flag
   */
  function agentCallOperation_toAutoAnswer(flag) {
    var retJson = OnlineAgent.setAgentAutoAnswer ({
      "agentid": global_agentInfo.agentId,
      "isautoanswer":flag || false
    });
    var retResult = retJson.retcode;
    if(global_resultCode.SUCCESSCODE != retResult) {
      alert("Set whether auto answer  failed. Retcode : " + retResult);
    }
  }

  /**
   * 挂断后示闲还是示忙
   * @param flag true | false
   */
  function agentCallOperation_toIntoAcw(flag) {
    var retJson = OnlineAgent.setAgentAutoEnterIdle({
      "agentid" : global_agentInfo.agentId,
      "flag":flag||false
    });
    var retResult = retJson.retcode;
    if(global_resultCode.SUCCESSCODE != retResult) {
      alert("Set whether into ACW after hangup  failed. Retcode : " + retResult);
    }
  }

  /**
   * to working status 工作
   */
  function agentStatusOperation_toWork() {
    var retJson = OnlineAgent.sayWork({"agentid":global_agentInfo.agentId});
    var retResult = retJson.retcode;
    if(global_resultCode.SUCCESSCODE == retResult) {
    } else {
      alert("change agent status to work status failed. Retcode :" + retResult);
    }
  }

  /**
   * cancel working status 取消工作
   */
  function agentStatusOperation_toExitWork() {
    var retJson = OnlineAgent.cancelWork({"agentid":global_agentInfo.agentId});
    var retResult = retJson.retcode;
    if(global_resultCode.SUCCESSCODE == retResult) {

    } else {
      alert("change agent status to Idle status failed. Retcode :" + retResult);
    }
  }

  //主动示忙
  function agentStatusOperation_toBusy() {
    var retJson = OnlineAgent.sayBusy({"agentid":global_agentInfo.agentId});
    var retResult = retJson.retcode;
    if(global_resultCode.SUCCESSCODE == retResult) {
      if (global_agentInfo.status == AGENT_STATE.TALKING) {
        /**
         * when agent click busy button in talking status,
         * agent will recevie AgentState_SetNotReady_Success event until finished talking
         */
        //agentStatus_setPreBusyWhenTalking();
      }
      else if (global_agentInfo.status == AGENT_STATE.WORKING) {
        /**
         * when agent click busy button in working status,
         * agent will recevie AgentState_SetNotReady_Success event until exit work
         */
        //agentStatus_setPreBusyWhenWorking();
      }
    } else {
      alert("change agent status to busy status failed. Retcode :" + retResult);
    }
  }

  /**
   * 主动示闲
   */
  function agentStatusOperation_toIdle(){
    var retJson = OnlineAgent.sayFree({"agentid":global_agentInfo.agentId});
    var retResult = retJson.retcode;
    if(global_resultCode.SUCCESSCODE == retResult) {
      if (global_agentInfo.status == AGENT_STATE.TALKING) {

      }
    } else {
      alert("cancel busy status failed. Retcode :" + retResult);
    }
  }

  /**
   * 查询坐席技能组
   */
  function queryAgentSkills(){
    var retJson = OnlineAgent.queryAgentSkills({
      "agentid" : global_agentInfo.agentId
    });
    console.log('[huawei]queryAgentSkills',retJson)
  }

  /**
   * 登出
   */
  function agentLogin_lagout() {
    OnlineAgent.logout({"agentid" : global_agentInfo.agentId});
  }

  function agentLogin_doForceLogoutWithReason() {
    OnlineAgent.forceLogoutWithReason({"agentid" : global_agentInfo.agentId, "reason" :"xxxxxxx"});
  }

  window.agentLogin_doForceLogin=agentLogin_doForceLogin;
  window.agentCallOperation_toAutoAnswer =agentCallOperation_toAutoAnswer;
  window.agentCallOperation_toIntoAcw =agentCallOperation_toIntoAcw;

  window.agentCallOperation_toAnswer=agentCallOperation_toAnswer;
  window.agentCallOperation_toHangUp=agentCallOperation_toHangUp;


  window.agentCallOperation_toCallOut=agentCallOperation_toCallOut;

  //工作和取消
  window.agentStatusOperation_toWork = agentStatusOperation_toWork;
  window.agentStatusOperation_toExitWork =agentStatusOperation_toExitWork;

  //示忙和示闲
  window.agentStatusOperation_toBusy =agentStatusOperation_toBusy;
  window.agentStatusOperation_toIdle=agentStatusOperation_toIdle;

  //静音
  window.agentCallOperation_toMetu=agentCallOperation_toMetu;

  window.queryAgentSkills =queryAgentSkills;

  window.agentLogin_lagout=agentLogin_lagout;

  window.eventProcess_queryCallInfoByCallId=eventProcess_queryCallInfoByCallId;

  function eventProcess_queryCallInfoByCallId(callId)
  {
    var retJson = CallData.queryCallInfoByCallId({"agentid": global_agentInfo.agentId , "callid": callId});
    var retResult = retJson.retcode;
    if(global_resultCode.SUCCESSCODE == retResult) {
      var ctiCallInfo = retJson.result;
      console.log("CallData.queryCallInfoByCallId-----",ctiCallInfo)
    }
  }

  var 呼入 = {
    "AgentState_Busy": "通话中",
    "AgentOther_PhoneAlerting": "物理话机振铃",
    //摘机后
    "AgentOther_PhoneOffhook": "等物理话机摘机",
    "AgentEvent_Ringing": "收到用户呼入",
    //answerh后
    "AgentEvent_Talking": "建立成功",
  }

  var 外呼 = {
    "AgentOther_PhoneAlerting": "物理话机振铃",
    "AgentOther_PhoneOffhook": "物理话机摘机(自动)",
    "AgentState_Busy": "通话中",
    "AgentState_Work": "工作中",

    //对方震铃
    "AgentEvent_Customer_Alerting": "对方振铃",
    //被叫摘机后
    "AgentEvent_Talking": "通话建立",
    "AgentEvent_Call_Out_Fail": "外呼失败",
  }

  //answer
  // "AgentEvent_Ringing": "收到用户呼入后",
  var 应答 = {
    "AgentOther_PhoneAlerting": "物理话机振铃",
    "AgentOther_PhoneOffhook": "物理话机摘机",
    "AgentState_Busy": "通话中",
    "AgentState_Work": "工作中",


    "AgentEvent_Talking":"坐席进入",
    "AgentEvent_Auto_Answer":"坐席自动应答",
    "AgentEvent_No_Answer":"坐席久不应答"
  }

  var 挂断 = {
    "AgentEvent_Call_Release": "坐席挂断",
    "AgentEvent_Customer_Release": "客户挂断",
  }

  var 保持 = {
    "AgentEvent_Hold":"保持成功"
  }
  var 取消保持 = {
    "AgentEvent_Talking":"坐席进入",
  }



})(this);