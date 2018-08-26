<?php
/**
 *  Dallon
 */

define("IS_RELEASE", false);
define("PROJECT_NAME", "米播");
define("APP_NAME", "mibo");
define("LIVE_DOMAIN_HOST", "mibocdn.yahalei.com");


//用户类型
define('USER_PHONE', 1);
define('USER_WECHAT', 2);
define('USER_SINA', 3);
define('USER_QQ', 4);
define('INTERNAL_STAFF', 7);
define('USER_SERVICE', 8);
define('USER_ROBOT', 9);

//牌色
define("CARD_TYPE_SPADE", '1');   //黑桃spade
define("CARD_TYPE_HEART", '2');   //红桃heart
define("CARD_TYPE_DIAMOND", '3'); //方片diamond
define("CARD_TYPE_CLUB", '4');    //梅花club

//游戏ID
define("GAME_PSZ", 1);    //拼三张
define("GAME_DN", 2);    //斗牛牛
define("GAME_TIP_RATIO", 0.05);     //游戏抽成(小费)比例

//性别
define("SEX_MALE", 1);    //男
define("SEX_FEMALE", 2);    //女

//IM消息协议ID
define('IM_USER_ENTRY', 100);     //用户进入
define('IM_BARRAGE', 101);     //弹幕
define('IM_CHATROOM_CHAT', 102);     //直播间普通聊天
define('IM_GIFT', 103);     //送不带连礼物
define('IM_ON_GIFT', 104);    //送带连礼物
define('IM_USER_EXIT', 105);     //用户退出
define('IM_PRIVATE_GFIT', 106);     //私信送礼物
define('IM_ANCHOR_EXIT', 107);     //主播退出直播室
define('IM_SHARE', 108);     //分享主播
define('IM_FOLLOW_IN_ROOM', 109);     //直播关注
define('IM_PRIVATE_CHAT', 110);     //客服信息，私聊
define('IM_SYS_NOTICE', 111);     //系统消息/公告
define('IM_GAME_RESULT', 112);     //公布每局游戏大赢家，并发送庄家金币等信息
define('IM_SYS_PUBLIC', 115);     //全局广播
define('IM_LIVE_STOP', 122);        //直播意外中断
define('IM_LIVE_RESTART', 123);     //直播意外中断再恢复
define('IM_GAME_PSZ_START', 200);     //拼三张游戏发牌
define('IM_CHANGE_DEALER', 201);     //拼三张切换庄家
define('IM_GAME_DNN_START', 220);     //斗牛牛游戏发牌
define('IM_GAME_CHANGE_BANKER', 230);//pk房间切换庄家
define('IM_GAME_BIG_WINNER', 233);      //发送大赢家消息
define('IM_GAME_START', 300);     //开始游戏
define('IM_GAME_CLOSE', 301);     //关闭游戏
define('IM_GM_ACT', 666);     //系统赠送游戏币或钻石
define('IM_FORCE_CLOSE_LIVE', 401);           //直播强制关闭

//模块ID
define('MOUDEL_USER_RECHARGE', 100);     //用户充值
define('MOUDEL_LIVE_TICKET', 101);     //进直播门票
define('MOUDEL_LIVE_BARRAGE', 102);     //弹幕
define('MOUDEL_LIVE_GIFT', 103);     //送礼物
define('MOUDEL_USER_DIAMOND_EXCHANGE_COIN', 104);     //用户用钻石兑换金币
define('MOUDEL_USER_COIN_EXCHANGE_DIAMOND', 105);     //用户用金币兑换钻石
define('MOUDEL_MESSAGE_GIFT', 106);     //私信送礼物
define('MOUDEL_USER_LOGIN', 200);        //用户登陆
define('MOUDEL_DAY_TASK', 201);   //每日任务
define('MOUDEL_LIVE_ENTRY', 300);     //观看直播
define('MOUDEL_LIVE_SHARE', 400);     //分享

//交易类型 deal_type
define('DEAL_TYPE_DIAMOND', 1);     //钻石
define('DEAL_TYPE_COIN', 2);     //金币

//分享类型
define("SHARE_BY_WECHAT", 1);   //微信
define("SHARE_BY_MOMENT", 2);   //微信朋友圈
define("SHARE_BY_SINA", 3);     //新浪微博
define("SHARE_BY_QQ", 4);       //QQ
define("SHARE_BY_ZONE", 5);     //QQ空间

//直播状态
define("LIVE_STATUS_DEFAULT", 0);       //初始直播
define("LIVE_STATUS_TRAILER", 1);        //预告
define("LIVE_STATUS_LIVING", 2);        //直播中
define("LIVE_STATUS_FINISHED", 3);      //直播结束
define("LIVE_STATUS_FORCE_CLOSE", 4);   //强制关闭

//礼包
define('FIRST_CHARGE_PACKAGE', 1);  //首充礼包
define('STAY_PACKAGE', 2);          //挽留礼包
define('ENCOURAGE_PACKAGE', 3);     //逆袭礼包

//错误码
define("EC_USER_NO_EXIST", 402);       //用户不存在
define("EC_BLACKLIST_NO_ACTION", 470);       //拉黑操作行为不存在

define("EC_NETWORK_DELAY", 201);

define('NIU_WU_XIAO', 10.0); //五小牛
define('NIU_ZHA_DAN', 6.0);//炸弹
define('NIU_JING', 5.0); //金牛
define('NIU_YING', 4.0);//银牛
define('NIU_NIU', 3.0);//牛牛
define('NIU_1', 1.0); //牛1
define('NIU_2', 1.0);//牛2
define('NIU_3', 1.0);//牛3
define('NIU_4', 1.0);//牛4
define('NIU_5', 1.0);//牛5
define('NIU_6', 1.0);//牛6
define('NIU_7', 2.0);//牛7
define('NIU_8', 2.0);//牛8
define('NIU_9', 2.0);//牛9
define('NIU_WU', 0.5);//无牛




