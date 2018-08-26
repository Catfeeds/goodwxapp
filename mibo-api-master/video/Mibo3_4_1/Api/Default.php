<?php

/**
 * 默认接口服务类
 *
 * @author: dogstar <chanzonghuang@gmail.com> 2014-10-04
 */
class Api_Default extends PhalApi_Api {

    protected $req;

    public function getRules() {
        return array();
    }

    public function __construct() {
        $this->req = DI()->request->getAll();
    }


    public function __call($method, $arguments) {
        if (method_exists($this, $method)) {
            return call_user_func_array(array(&$this, $method), $arguments);
        }
    }

    /**
     * 默认入口
     * @ignore
     * @request
     */
    public function index() {
        $ab = array("1", "2");
        echo count($ab);
        exit;
    }


    /**
     * @ignore
     */
    public function test() {

        $model = new Model_Card();
        $ss = $model->getPkCardByLoopId(10);
        print_r($ss);

    }


    /**
     * @ignore
     */
    public function testModel() {
        $anchor_id = 14;
        //$fans_num = DI()->notorm->follow_list->where('is_cancel = 0')
        //        ->where('to_user_id = ?', $anchor_id)->count('*');
        //$fans_user_ids = DI()->notorm->follow_list->where('is_cancel = 0')
        //    ->where('to_user_id = ?', $anchor_id)->select('user_id')->order('id ASC')->fetchPairs('user_id');
        $domain_im = new Domain_IM();
        $domain_im->sendUserMsg(1, 3217, 'hello');
        exit;
        for ($i = 0; $i < $fans_num; $i += 19) {
            $cut_ids = array_slice($fans_user_ids, $i, 20, true);
            $cut_ids = array_keys($cut_ids);
            $domain_im->sendUserMsg(14, $cut_ids, '我开直播了，＾▲＾');

        }

    }

    /**
     * @ignore
     */
    public function notifyAllUser() {
//        $this->notifyFansWhenLive(3243,503);
        $domain_im = new Domain_IM();
        $fans_user_ids = DI()->notorm->follow_list->where('is_cancel = 0')
            ->where('to_user_id = ?', 3243)->select('user_id')->order('id ASC')->fetcAll();

        $num = count($fans_user_ids);
        $count = 0;
        for ($i = 0; $i < $num; $i++) {
            $count++;
            $uids[] = $fans_user_ids[$i];
            if ($count == 30 || $i == $num - 1) {
                $domain_im->sendUserMsg(2, $uids, '您关注的主播麦霸沐沐今晚八点与你相约，记得一定要来哦！今晚20：00一定要来，一定要来，一定！');
            }
        }

    }

    /**
     * @ignore
     */
    public function testLog() {
        DI()->logger->info('sss', 'sssss');
        echo 'sss';exit;
    }

    /**
     * @ignore
     */
    public function testRedis() {
        $ip = PhalApi_Tool::getClientIp();
        $times = DI()->redis->get_time(md5($ip));
        $times = $times ? ($times + 1) : 1;
        DI()->redis->set_time(md5($ip), $times);
        echo $times;exit;

    }

    /**
     * @ignore
     */
    public function testRedis1() {
        $key = 'aa';
        $ss = DI()->redis->hGetAll($key);
        print_r($ss);exit;

    }

    /**
     * 详细描述
     * @ignore
     */
    public function testNotice2() {
        DI()->redis->set_rPush('live_340_ticket_userid', 3217);
    }

    /**
     * 详细描述
     * @ignore
     */
    public function testNotice() {
        $anchor_id = 29;
        $this->req['live_id'] = 340;
        $fans_num = DI()->notorm->follow_list->where('is_cancel = 0')
            ->where('to_user_id = ?', $anchor_id)->count('*');
        $fans_user_ids = DI()->notorm->follow_list->where('is_cancel = 0')
            ->where('to_user_id = ?', $anchor_id)->select('user_id')->order('id ASC')->fetchPairs('user_id');
        print_r($fans_user_ids);
        //从redis中取出买票的用户id,如果已经买票且是粉丝，则只以买票的名义通知用户
        $user_id_redis_key = 'live_' . $this->req['live_id'] . '_ticket_userid';
        echo $user_id_redis_key;
        $redis_user_ids = DI()->redis->get_lRange($user_id_redis_key, 0, -1);
        print_r($redis_user_ids);
        //echo 'ssssssssssssssssssssss';
        foreach ($redis_user_ids as $redis_user_id) {
            if (is_string($redis_user_id) || is_int($redis_user_id)) {
                if (array_key_exists($redis_user_id, $fans_user_ids)) {
                    unset($fans_user_ids[$redis_user_id]);
                }
            }
        }
        print_r($fans_user_ids);
        //$rs = DI()->redis->del($user_id_redis_key);
        //DI()->logger->debug('redis-del-user-id-------------', $rs);

        $domain_im = new Domain_IM();
        //for ($i = 0; $i < $fans_num; $i += 19) {
        //    $cut_ids = array_slice($fans_user_ids, $i, 20, true);
        //    $cut_ids = array_keys($cut_ids);
        //    $extra = array('type' => 0, 'value' => $this->req['live_id']);
        //    $domain_im->sendUserMsg(1, $cut_ids, '您关注的主播开直播了!', $extra);
        //}
        exit;
    }

    /**
     * 详细描述
     * @ignore
     */
    public function robotUpdate() {

    }

    /**
     * 详细描述
     * @ignore
     */
    public function testNo2() {
        $this->req['live_id'] = 340;
        $im_id_redis_key = 'live_' . $this->req['live_id'] . '_ticket_imid';
        $im_ids = DI()->redis->get_lRange($im_id_redis_key, 0, -1);
        $num = count($im_ids);
        $domain_im = new Domain_IM();
        for ($i = 0; $i < $num; $i += 19) {
            $cut_ids = array_slice($im_ids, $i, 20, true);

            if (!empty($cut_ids)) {
                $extra = array('type' => 0, 'value' => $this->req['live_id']);
                $domain_im->sendUserMsgFromImId(1, $cut_ids, '您已购票的直播开始了!', $extra);
            }
        }
        $rs = DI()->redis->del($im_id_redis_key);
        DI()->logger->debug('redis-imid-del-------', $rs);
    }

    /**
     * @ignore
     */
    public function level() {

        $data = array();
        for ($i = 1; $i <= 100; $i++) {
            $it['level'] = $i;
            $it['experience'] = 500 * $i * $i;
            $it['name'] = '第' . $i . '级';
            $data[] = $it;
            unset($it);
        }
//        var_dump($data);
        $rs = DI()->notorm->user_experience->insert_multi($data);
        var_dump($rs);
        exit;
    }

    /**
     * @ignore
     */
    public function addImUser() {
        $user_name = 'mibokf1002';
        $password = '6eee4d33c03c8b23cb8d6d3e8a3a45a8';
        $emchat = new Emchat_Lite();
        $users = array(
            array(
                'username' => "mibokf1000",
                'password' => "6eee4d33c03c8b23cb8d6d3e8a3a45a8",
            ),
            array(
                'username' => "mibokf1001",
                'password' => "6eee4d33c03c8b23cb8d6d3e8a3a45a8",
            ),
        );
        $rs = $emchat->createUsers($users);
        var_dump($rs);
        exit;

    }

    /**
     * @ignore
     */
    public function getGift() {
        $gift_model = new Model_Gift();
        $gift_list = $gift_model->getGiftList();
        $thumb_dir = './gift/thumb/';
        if (!is_dir($thumb_dir)) {
            mkdir($thumb_dir, 0777, true);
        }
        $effect_dir = './gift/effect/';
        if (!is_dir($effect_dir)) {
            mkdir($effect_dir, 0777, true);
        }

        foreach ($gift_list as $item) {
            if (!empty($item['thumb_url'])) {
                $thumb_ext = substr(strrchr($item['thumb_url'], '.'), 1);
                if (!file_exists($thumb_dir . $item['id'] . "." . $thumb_ext)) {
                    file_put_contents($thumb_dir . $item['id'] . "." . $thumb_ext, file_get_contents($item['thumb_url']));
                }
            }
            if (!empty($item['effect_url'])) {
                $effect_ext = substr(strrchr($item['effect_url'], '.'), 1);
                if (!file_exists($effect_dir . $item['id'] . "." . $effect_ext)) {
                    file_put_contents($effect_dir . $item['id'] . "." . $effect_ext, file_get_contents($item['effect_url']));
                }
            }
        }
    }

    /**
     * @ignore
     */
    public function getGift2() {
        $url = "http://211.155.84.135:16161/gifts?appVersion=108&build=1.0.8&ch=360cn&device=android&screen=1080x1776&systemVersion=4.4.2";
        $gift_list = json_decode(file_get_contents($url), true);
        $giftList = array();


        foreach ($gift_list['item'] as $itm) {
            $it = array();
            $it['price'] = $itm['gold'];
            $it['name'] = $itm['name'];
            $it['thumb_url'] = $itm['icon']['url'];
            $it['effect_url'] = $itm['gif'];
            $it['md5'] = $itm['md5'];
            $it['score'] = $itm['score'];
            $it['combo'] = $itm['combo'];
            $giftList[] = $it;

            $thumb = explode('/', $itm['icon']['url']);
            $length = count($thumb);
            $filename = $thumb[$length - 1];
            file_put_contents("thumb/" . $filename, file_get_contents($itm['icon']['url']));

            if (!empty($itm['gif'])) {
                $effect = explode('/', $itm['gif']);
                $length2 = count($thumb);
                $filename2 = $effect[$length2 - 1];
                file_put_contents("effect/" . $filename2, file_get_contents($itm['gif']));
            }
        }

//        $gift_model = new Model_Gift();
//        $rs = $gift_model->insertGiftList($giftList);
//        var_dump($rs);
        exit();
    }

    /**
     * @ignore
     */
    public function showCard() {

        $puke = range(1, 13);
        $huase = array(1 => '黑桃', 2 => '红桃', 3 => '梅花', 4 => '方块');
        $i = array_rand($puke, 1);
        $j = array_rand($huase, 1);
        echo "随机取出的扑克为：" . $huase[$j] . $puke[$i];
        exit;
    }


    /**
     * @ignore
     */
    public function chat() {
        $domain = new Domain_IM();

        $rs = file_get_contents('http://t.com/video/Public/mibo/index.php?service=Game.ReqCard&channel=bt&gid=1&live_id=7&user_id=1&dealer_id=14');
        $rs = json_decode($rs, true);
        $extra = array();
        foreach ($rs['data'] as $key => $per_pool) {
            if (is_array($per_pool)) {
                foreach ($per_pool as $second_key => $card) {
                    if ($key == 'dealer_card') {
                        $extra['dealer_pool_card'][$second_key]['type'] = $card[0];
                        $extra['dealer_pool_card'][$second_key]['value'] = $card[1];
                    }
                    if ($key == 'pool1_card') {
                        $extra['pool_1_card'][$second_key]['type'] = $card[0];
                        $extra['pool_1_card'][$second_key]['value'] = $card[1];
                    }
                    if ($key == 'pool2_card') {
                        $extra['pool_2_card'][$second_key]['type'] = $card[0];
                        $extra['pool_2_card'][$second_key]['value'] = $card[1];
                    }
                    if ($key == 'pool3_card') {
                        $extra['pool_3_card'][$second_key]['type'] = $card[0];
                        $extra['pool_3_card'][$second_key]['value'] = $card[1];
                    }
                }
            }
        }

        $extra['loop_id'] = $rs['data']['loop_id'];
        $rs = $domain->sendLiveMsg(1, '253935214219231664', '拼三张发牌', '200', $extra);
        if ($rs) echo 'ok';
    }

    /**
     * 详细描述
     * @ignore
     */
    public function getRedis() {
        $rs = DI()->redis->get_forever('chatroom_7_robot_user_list_key');
        $arr = explode(',', $rs);
        echo '............';
        var_dump(count($arr));
        exit;
    }

    /**
     * @ignore
     */
    public function testMsg() {
        $easemob = new Emchat_Lite();
        $i = $this->req['p'];
        //$room_data = array();
            $rs = $easemob->getChatRooms($i);
            print_r($rs);exit;
            //$rooms_num = isset($rs['data']) ? count($rs['data']) : 0;
            //if($rooms_num < 100 && is_array($rs['data'])) {
            //    $room_data = array_merge($room_data,$rs['data']);
            //} else {
            //    $room_data = array_merge($room_data,$rs['data']);
            //}

    }

    /**
     * @ignore
     */
    public function sendMsg() {
        //$easemob = new Emchat_Lite();
        //$rs = $easemob->getChatRooms();
        //print_r($rs);exit;
        //$room_data = json_encode($rs['data']);
        //
        //DI()->redis->set_forever('im_rooms_data', $room_data);
        //$aa = json_decode(DI()->redis->get_forever('im_rooms_data'),true);
        //print_r($aa);exit;

        $msg = "尊贵的玩家，您于2017年01月05日19:54充值3000米钻，很抱歉没有及时到账，现系统已经给您补足，并额外送152万米币以表歉意，有疑问请联系微信：mibokf";
        $im_domain = new Domain_IM();
        $rs = $im_domain->sendLiveMsg(1, 8872113799169,"test",IM_SYS_PUBLIC);
        //$rs = $im_domain->sendUserMsg(2, 29, $msg);
        //$rs = $im_domain->sendUserMsg(2, 110872, $msg);

//        $rs = $im_domain->sendUserMsg(2, 11660, $msg);
        //$rs = $im_domain->sendLiveMsg()
        var_dump($rs);
        exit;
    }

    /**
     * 详细描述
     * @ignore
     */
    public function getRoom() {
        $emchat = new Emchat_Lite();
        $res = $emchat->getChatRooms();
        print_r($res);
        exit;
    }

    /**
     * 详细描述
     * @ignore
     */
    public function addRoom() {
        $emchat = new Emchat_Lite();
        $emchat_rs = $emchat->addChatRoomMember('268444217032835604', 'mb100025');
        print_r($emchat_rs);
        exit;
    }

    /**
     * @ignore
     */
    public function getJoin() {
        $emchat = new Emchat_Lite();
        $emchat_rs = $emchat->getChatRoomJoined('mb100025');
        print_r($emchat_rs);
        exit;
    }

    /**
     * @ignore
     */
    public function delChat() {

    }

    /**
     * @ignore
     */
    public function redis() {
        var_dump(DI()->redis->get_time('aliyu_notify'));
        exit;
    }

    /**
     * @ignore
     */
    public function testEmail() {
        DI()->mail = new PHPMailer_Lite();
        $add_arr = array('belle@mibolive.com', '362226577@qq.com', '313256513@qq.com');
        //$rs = DI()->mail->send('362226577@qq.com', '玩家下注异常', '玩家下注超过500万了，赶紧去看看！');
        $rs = DI()->mail->send($add_arr, '玩家下注异常', '玩家下注超过500万了，赶紧去看看！');
        var_dump($rs);
        exit;
    }

    /**
     * @ignore
     */
    public function privateKeyA($domain, $filename) {

        $time = strtotime("+8 hours");
        $time = 1479290137;

        $key = "Aliyunsign4578";

        //$domain="http://www.a.com";

        //$filename="/mulu/1.jpg";

        //$sstring = "URI-Timestamp-rand-uid-PrivateKey"

        $sstring = $filename . "-" . $time . "-0-0-" . $key;

        $md5 = md5($sstring);

        $auth_key = "auth_key=" . $time . "-0-0-" . $md5;

        $url = $domain . $filename . "?" . $auth_key;

        return trim($url);

    }

    /**
     * @ignore
     */
    public function se() {
        //http://mibocdn.yahalei.com/mibo/mb-1-2.m3u8
        $stream_name = "mb-" . 173 . '-' . 421;

        $aliyun_cfg = DI()->config->get("app.aliyun");
        $private_key = $aliyun_cfg['private_key'];
        $timestamp = 1479290437 + 300;
        $sstring = "/mibo-1479290437-0-0-Aliyunsign4578";


        //var_dump($sstring);
        $auth_key = md5($sstring);

        var_dump("ok:--[df249c2e5ab3b781e9f518330d5aab33]");

        $tkey = $this->privateKeyA("http://mibocdn.yahalei.com", "/mibo/mb-1-2.m3u8");

        var_dump($tkey);


        echo $auth_key;
        exit;
    }

    /**
     * @ignore
     */
    public function tes() {
        $stream_name = "mb-" . 174 . '-' . 36 . '.m3u8';
        $filename = '/' . APP_NAME . "/" . $stream_name;
        echo $this->getAuthkey($filename);
        exit;
        //$timestamp = time() + $live_info['time_length'] + 1800;
        //$timestamp = 1479292030;
        //$rand = 0;
        //$uid = 0;
        //$aliyun_cfg = DI()->config->get("app.aliyun");
        //
        //$HashValue = $timestamp . "-" . $rand . "-" . $uid;
        //$md5hash = md5($filename. "-" . $HashValue . "-" . $aliyun_cfg['private_key']);
        //echo '92aed270b56ea09701850aa3f38bff53','<br/>';
        //echo $md5hash;exit;
        //$auth_key = $HashValue . "-" . $md5hash;
    }

    /**
     * @ignore
     */
    public function getAuthkey($filename) {
        //echo $filename;exit;

        $time = time() + 7200;
        $time = 1479292030;

        $aliyun_private_key = DI()->config->get("app.aliyun.private_key");

        //$domain="http://www.a.com";

        //$filename="/mulu/1.jpg";

        //$sstring = "URI-Timestamp-rand-uid-PrivateKey"

        $string = $filename . "-" . $time . "-0-0-" . $aliyun_private_key;

        $md5 = md5($string);

        $auth_key = $time . "-0-0-" . $md5;

        //$url=$domain.$filename."?".$auth_key;

        //echo $url."\n";
        return $auth_key;

    }

    /**
     * @ignore
     */
    public function testSql1() {
        $domain_live = new Domain_Live();
        //$domain_live->no
    }

    /**
     * @ignore
     */
    public function testSql() {
        $num = -10;
        $data = [
            'diamond_num' => new NotORM_Literal('diamond_num + ' . $num),
        ];

        $rs = DI()->notorm->user->where('id', 18)->update($data);
        var_dump($rs);exit;
    }

    /**
     * @ignore
     */
    public function getMsg() {
        $easemob = new Emchat_Lite();
        $ql = "select+*+where+timestamp>1475209244920";//.strtotime('2016-09-30 12:20:00')*1000;
        $rs = $easemob->getChatRecord($ql);
        DI()->logger->info("chat", json_encode($rs));
        var_dump($rs);
        exit;
    }

    /**
     * @ignore
     */
    public function showMsgBody() {
        $msgBody = array(
            'pid'       => 100, //协议ID
            'content'   => "你好！",
            'user_id'   => 14, //发送用户的ID
            'nick_name' => "阿尔卑斯",  //昵称
            'avatar'    => "http://q2.qlogo.cn/g?b=qq&k=eGylu9iaet1zPbB8Pqr9dicw&s=40&t=1437791248",//头像
            'level'     => 1,   //等级
            'sex'       => 1,   //性别
            'signature' => "",  //个性签名
            'extra'     => array(
                'gift_id'          => 1, //礼物的ID
                'gift_thumb_url'   => "http://q2.qlogo.cn/g?b=qq&k=eGylu9iaet1zPbB8Pqr9dicw&s=40&t=1437791248",
                'gift_effect_url'  => "http://q2.qlogo.cn/g?b=qq&k=eGylu9iaet1zPbB8Pqr9dicw&s=40&t=1437791248",
                'give_coin'        => 123, //赠送的金币
                'give_domand'      => 0, //赠送的钻石
                'gift_price'       => 0, //礼物价格
                'game_id'          => 1, //开始或关闭游戏ID
                'gift_send_time'   => round(microtime(true) * 1000), //礼物价格
                'bet_coin'         => 1,
                'dealer_pool_card' => array( //庄家池牌值
                    array(
                        'type'  => "1",
                        'value' => 1,
                        'des'   => "黑桃A",

                    ), array(
                        'type'  => "2",
                        'value' => 2,
                        'des'   => "红桃2",
                    ), array(
                        'type'  => "3",
                        'value' => 10,
                        'des'   => "方块10",
                    )),
                'pool_1_card'      => array( //1号池牌值
                    array(
                        'type'  => "1",
                        'value' => 1,
                    ), array(
                        'type'  => "2",
                        'value' => 1
                    ), array(
                        'type'  => "3",
                        'value' => 1
                    )),
                'pool_2_card'      => array( //2号池牌值
                    array(
                        'type'  => "1",
                        'value' => 1,
                    ), array(
                        'type'  => "2",
                        'value' => 1
                    ), array(
                        'type'  => "3",
                        'value' => 1
                    )),
                'pool_3_card'      => array( //3号池牌值
                    array(
                        'type'  => "1",
                        'value' => 1,
                    ), array(
                        'type'  => "2",
                        'value' => 1
                    ), array(
                        'type'  => "3",
                        'value' => 1
                    )),

            ),

        );


        unset($msgBody['extra']);
        echo json_encode($msgBody);
        exit;
        return $msgBody;

        $requestBody = array(
            'target_type' => "chatrooms",   // users 给用户发消息。chatgroups: 给群发消息，chatrooms: 给聊天室发消息
            'target'      => array("246146462503666088"),   // 注意这里需要用数组，数组长度建议不大于20，即使只有一个用户，
            // 也要用数组 ['u1']，给用户发送时数组元素是用户名，给群组发送时,数组元素是groupid
            'msg'         => array(
                "type" => "txt",
                "msg"  => $msgBody, //消息内容，参考[[start:100serverintegration:30chatlog|聊天记录]]里的bodies内容
            ),
            "from"        => "jma2", //表示消息发送者。无此字段Server会默认设置为"from":"admin"，有from字段但值为空串("")时请求失败
        );

        return $requestBody;
    }

    /**
     * @ignore
     */
    public function testCard() {
        $playCard = new Domain_PSZGame();


        $rs = $playCard->getTonghua();

        var_dump($rs);
//        var_dump($playCard->reqCard());
        exit;

    }

    /**
     * @ignore
     */
    public function createChatroom() {
        $emchat = new Emchat_Lite();
        $options ['name'] = "Testing Chatroom";
        $options ['description'] = "This is a test chatroom for Dallon";
        $options ['maxusers'] = 300;
        $options ['owner'] = "mibokf1000";
        $options['members'] = Array("mibokf1001", "mibokf1002");
        $rs = $emchat->createChatRoom($options);
        var_dump($rs);
        exit;

    }

    /**
     * @ignore
     */
    public function experience() {
        $domain = new Domain_Experience();
        $domain->setSeeLiveExperience(18, 2);
    }

    /**
     * @ignore
     */
    public function addLevel() {
        $model = new Model_User();
        $model->addUserExperience(27, 10);
    }

    /**
     * @ignore
     */
    public function insertUpdate() {
        $add_data = array(
            'user_id'    => 14,
            'to_user_id' => 15,
        );
        DI()->notorm->follow_list->insert($add_data);
        $rs = DI()->notorm->follow_list->insert_id();
        var_dump($rs);
    }

    /**
     * @ignore
     */
    public function getCity() {

        $citys = DI()->redis->get("citys");

        if (empty($citys)) {
            $sql = "select m.*,n.CityName from mb_region_province as m LEFT JOIN mb_region_city  as n ON m.ProvinceID=n.ProvinceID";
            $rs = DI()->notorm->region_district->queryAll($sql);
            DI()->redis->set("citys", json_encode($rs));
        }

        $citys = json_decode($citys, true);

        $rand = rand(1, 345);

        $row = $citys[$rand - 1];
        $pos = strpos($row['ProvinceName'], "省");
        if ($pos > 0) {
            $row['ProvinceName'] = substr($row['ProvinceName'], 0, $pos);
        }
        $last_1 = iconv_substr($row['CityName'], -1, 1, 'utf-8');
        if ($last_1 == "市" || $last_1 == "县") {
            $row['CityName'] = mb_substr($row['CityName'], 0, -1);
        }

        return $row['ProvinceName'] . " " . $row['CityName'];
    }

    /**
     * @ignore
     */
    public function registerIm() {
        $im_id = DI()->r_notorm->user->where('id', 14260)->fetchOne('im_id');
        $im_pass = '6eee4d33c03c8b23cb8d6d3e8a3a45a8';
        $im = new Emchat_Lite();
        $rs = $im->createUser($im_id, $im_pass);
        var_dump($rs);exit;

        //$rs = $im->getUser($im_id);

        for($i = 10833; $i <= 14264; $i += 20 ) {
            $im_ids = DI()->r_notorm->user->select('im_id')->order('id asc')->limit($i, 20)->fetchAll();
            $options = array();
            foreach($im_ids as $key => $id) {
                $options[$key]['username'] = $id['im_id'];
                $options[$key]['password'] = '6eee4d33c03c8b23cb8d6d3e8a3a45a8';
            }
            //$options = array(
            //    array(
            //        'username'=>$im_id,
            //        'password'=>'6eee4d33c03c8b23cb8d6d3e8a3a45a8',
            //    ),
            //);

            $im = new Emchat_Lite();

            $rs = $im->createUsers($options);
            //$rs = $im->getUser($im_id);
            DI()->logger->info('注册环信', $rs);
        }


    }

    /**
     * @ignore
     */
    public function selUser() {
        set_time_limit(0);
        $robot_list = DI()->notorm->user->where("id>448 and user_type=9")->fetchAll();
        $cfg = DI()->config->get('app.easemob2');
        $password = $cfg['im_password'];
        $easemob = new Emchat_Lite();

        $users = array();
        $noUser = array();
        foreach ($robot_list as $user) {
            $rs = $easemob->getUser($user['im_id']);

            if (empty($rs) || !isset($rs['application'])) {
                $users[] = array($user['im_id'], $user['im_pwd']);
                if (count($users) == 30) {
                    $easemob->createUsers(array($users));
                    unset($noUser);
                    unset($users);
                } else {
                    $noUser[] = array($user['im_id'], $user['im_pwd']);
                }
            }

        }

        print_r($noUser);
        exit();

    }

    /**
     * @ignore
     */
    public function getImUser() {
        $cfg = DI()->config->get('app.easemob2');
        $password = $cfg['im_password'];
        $easemob = new Emchat_Lite();
        $rs = $easemob->getUser('mb102586');
        var_dump($rs);
        exit;

    }


    /**
     * @ignore
     */
    public function selUser2() {
        set_time_limit(0);

        $cfg = DI()->config->get('app.easemob2');
        $password = $cfg['im_password'];
        $easemob = new Emchat_Lite();


        $users = array(
            array('mb102696', $password),
            array('mb102697', $password),
            array('mb102698', $password),
            array('mb102699', $password),
            array('mb102700', $password),
            array('mb102701', $password),
        );

        //$rs = $easemob->createUsers($users);
        $rs = $easemob->getUser("mb102499");
        var_dump($rs);
        exit();

    }

    /**
     * @ignore
     */
    public function dealRobotUser() {
        set_time_limit(0);
        $robot_list = DI()->notorm->user->where("id>448 and user_type=9")->fetchAll();
        $cfg = DI()->config->get('app.easemob2');
        $password = $cfg['im_password'];
        $easemob = new Emchat_Lite();

        foreach ($robot_list as $user) {

            usleep(100);
            $rs = $easemob->createUser($user['im_id'], $user['im_pwd']);
            $level = rand(1, 35);
            $send_num = pow($level + 1, 3) * 20 + rand(-300, 300);
            $update_data = array(
                'address'    => $this->getCity(),
                'is_anchor'  => 0,
                'level'      => $level,
                'experience' => $send_num + rand(1, 1000),
                'send_num'   => $send_num,
            );
            DI()->notorm->user->where('id=' . $user['id'])->update($update_data);

        }


    }

    /**
     * @ignore
     */
    function croot3($num) {
        $guess = $num / 3;
        while (abs($guess * $guess * $guess - $num) >= 0.0000000001) {
            $guess = ($num / $guess / $guess + 2 * $guess) / 3;
        }
        return $guess;
    }

    /**
     * @ignore
     */
    public function dealRobotUser2() {
        set_time_limit(0);
        $robot_list = DI()->notorm->user->where("id>448 and user_type=9")->fetchAll();

        foreach ($robot_list as $user) {

            usleep(10);
            $update_data = array(

                'level' => floor($this->croot3($user['experience'] / 20)),
            );
            var_dump($update_data);
            DI()->notorm->user->where('id=' . $user['id'])->update($update_data);

        }


    }

    /**
     * @ignore
     */
    public function addRobotUser() {
        set_time_limit(0);
        $robot_list = DI()->notorm->user->where("id>448")->fetchAll();
        $user_domain = new Domain_User();
        $user_model = new Model_User();
        foreach ($robot_list as $itm) {
            $mb_id = $user_domain->getNewMiboId();
            $im_user = $user_domain->getImIdByMibo($mb_id);
            $user_data = array();
            $user_data['user_type'] = USER_ROBOT;
            $user_data['mb_id'] = $mb_id;
            $user_data['im_id'] = $im_user['im_id'];
            $user_data['im_pwd'] = $im_user['im_pwd'];
            $user_data['sex'] = $itm['sex'];
            $user_data['address'] = "广东 深圳";
            $user_data['channel'] = 'bt';
            $user_data['nick_name'] = $itm['nick_name'];
            $user_data['avatar'] = $itm['avatar'];
//            var_dump($user_data);
            $user_model->addUser($user_data);
            unset($user_data);
            sleep(5);
        }
        exit("ok");
    }

    /**
     * @ignore
     */
    public function getChatRooms() {
        $p = DI()->request->get('p');
        $p = $p ? $p : 1;
        $easemob = new Emchat_Lite();
        $rs = $easemob->getChatRooms($p);
        print_r($rs);exit;
    }

    public function delChats() {
        $p = DI()->request->get('p');
        $p = $p ? $p : 1;
        $easemob = new Emchat_Lite();
        $rs = $easemob->getChatRooms($p);
        $rooms = $rs['data'];
        foreach($rooms as $room) {
            if($room['id'] != '8393704144898' && $room['id'] != '267675055385740868'
                && $room['id'] != '284730189571686936' && $room['id'] != '287700708008919568' && $room['id'] != '6013399924739' &&
                $room['id'] != '5960187838465') {

                $easemob->deleteChatRoom($room['id']);
            }
        }
        return true;
    }

    /**
     * @ignore
     */
    public function getChatRoom() {
        $easemob = new Emchat_Lite();
        $room_data = array();
        for($i = 1; $i<=10; $i++) {
            $rs = $easemob->getChatRooms($i);
            $rooms_num = isset($rs['data']) ? count($rs['data']) : 0;
            if($rooms_num < 100 && is_array($rs['data'])) {
                $room_data = array_merge($room_data,$rs['data']);
                break;
            } else {
                $room_data = array_merge($room_data,$rs['data']);
            }
        }
        exit;
    }


    /**
     * @ignore
     */
    public function getChatRoomDetail() {
        $emchat = new Emchat_Lite();
        var_dump($emchat->getChatRoomDetail('256555794026202700'));
        exit;
    }


    /**
     * @ignore
     */
    public function getRtmpUrl() {

        /*
        {
        "chatroom_id": "256556226127593900",
        "push_url": "rtmp://video-center.alivecdn.com/mibo/mb-6-14?vhost=mibocdn.yahalei.com&auth_key=1478155361-0-0-fd33af2241c2dcbd01bb15ae95ece5ac",
        "look_url": "rtmp://mibocdn.yahalei.com/mibo/mb-6-14?auth_key=1478155361-0-0-fd33af2241c2dcbd01bb15ae95ece5ac",
        "flv_url": "http://mibocdn.yahalei.com/mibo/mb-6-14.flv?auth_key=1478155361-0-0-fd33af2241c2dcbd01bb15ae95ece5ac",
        "m3u8_url": "http://mibocdn.yahalei.com/mibo/mb-6-14.m3u8?auth_key=1478155361-0-0-fd33af2241c2dcbd01bb15ae95ece5ac",
        "status": 2
        }

        VS

        {
            rtmp://mibocdn.yahalei.com/mibo/mb-6-14?auth_key=1477900902-0-0-06567eef771e97a3d8ee74e2322deb6b
            http://mibocdn.yahalei.com/mibo/mb-6-14.flv?auth_key=1477900902-0-0-595043c03114a41101e45d900259855d
            http://mibocdn.yahalei.com/mibo/mb-6-14.m3u8?auth_key=1477900902-0-0-aee0ad8e05a878abf3c97182edece112
        }


         */

        $chatroom_id = '256556226127593900';
        $live_info['anchor_id'] = 14;
        $live_info['id'] = 6;
        $live_info['time_length'] = 72 * 3600;
        $stream_name = "mb-" . $live_info['id'] . '-' . $live_info['anchor_id'];
        $filename = '/' . APP_NAME . "/" . $stream_name;
        $timestamp = time() + $live_info['time_length'] + 1800;
        $rand = 0;
        $uid = 0;
        $aliyun_cfg = DI()->config->get("app.aliyun");

        $HashValue = $timestamp . "-" . $rand . "-" . $uid;
        $md5hash = md5($filename . "-" . $HashValue . "-" . $aliyun_cfg['private_key']);
        $auth_key = $HashValue . "-" . $md5hash;

        $update_data = array(
            'chatroom_id' => $chatroom_id,
            'push_url'    => "rtmp://video-center.alivecdn.com/" . APP_NAME . "/" . $stream_name . "?vhost=" . LIVE_DOMAIN_HOST . "&auth_key=" . $auth_key,
            'look_url'    => 'rtmp://' . LIVE_DOMAIN_HOST . "/" . APP_NAME . "/" . $stream_name . "?auth_key=" . $auth_key,
            'flv_url'     => 'http://' . LIVE_DOMAIN_HOST . "/" . APP_NAME . "/" . $stream_name . ".flv?auth_key=" . $auth_key,
            'm3u8_url'    => 'http://' . LIVE_DOMAIN_HOST . "/" . APP_NAME . "/" . $stream_name . ".m3u8?auth_key=" . $auth_key,
            'status'      => 2, //直播中状态
        );

        return $update_data;
    }


}