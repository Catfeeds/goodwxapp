<?php

class Domain_User extends Domain_Common {

    private $userModel;
    private $imConfig;
    private $register_send_coin_num = 100000;

    public function __construct() {
        parent::__construct();
        $this->userModel = new Model_User();
        $this->imConfig = DI()->config->get('app.easemob2');
    }

    public function setUserInfoBean($user_info = array()) {
        return array(
            'id'          => isset($user_info['id']) ? $user_info['id'] : "0",
            'mb_id'       => isset($user_info['mb_id']) ? $user_info['mb_id'] : "0",
            'im_id'       => isset($user_info['im_id']) ? $user_info['im_id'] : "0",
            'user_type'   => isset($user_info['user_type']) ? $user_info['user_type'] : "0",
            'nick_name'   => isset($user_info['nick_name']) ? $user_info['nick_name'] : "",
            'login_name'  => isset($user_info['login_name']) ? $user_info['login_name'] : "",
            'sex'         => isset($user_info['sex']) ? $user_info['sex'] : "0",
            'is_anchor'   => isset($user_info['is_anchor']) ? $user_info['is_anchor'] : "0",
            'address'     => !isset($user_info['address']) || empty($user_info['address']) ? "火星" : $user_info['address'],
            'signature'   => !isset($user_info['signature']) || empty($user_info['signature']) ? "这家伙太懒了，什么也没留下" : $user_info['signature'],
            'level'       => isset($user_info['level']) ? $user_info['level'] : "0",
            'avatar'      => isset($user_info['avatar']) ? $user_info['avatar'] : "",
            'coin_num'    => isset($user_info['coin_num']) ? $user_info['coin_num'] : "0",
            'diamond_num' => isset($user_info['diamond_num']) ? $user_info['diamond_num'] : "0",
            'send_num'    => isset($user_info['send_num']) ? $user_info['send_num'] : "0",
            'fans_num'    => isset($user_info['fans_num']) ? $user_info['fans_num'] : "0",
            'follow_num'  => isset($user_info['follow_num']) ? $user_info['follow_num'] : "0",
        );
    }

    public function setSimpleUserInfoBean($user_info = array()) {
        return array(
            'id'          => isset($user_info['id']) ? $user_info['id'] : "0",
            'nick_name'   => isset($user_info['nick_name']) ? $user_info['nick_name'] : "",
            'sex'         => isset($user_info['sex']) ? $user_info['sex'] : "0",
            'address'     => !isset($user_info['address']) || empty($user_info['address']) ? "火星" : $user_info['address'],
            'signature'   => !isset($user_info['signature']) || empty($user_info['signature']) ? "这家伙太懒了，什么也没留下" : $user_info['signature'],
            'level'       => isset($user_info['level']) ? $user_info['level'] : "0",
            'avatar'      => isset($user_info['avatar']) ? $user_info['avatar'] : "",
            'coin_num'    => isset($user_info['coin_num']) ? $user_info['coin_num'] : "0",
            'diamond_num' => isset($user_info['diamond_num']) ? $user_info['diamond_num'] : "0",
            'send_num'    => isset($user_info['send_num']) ? $user_info['send_num'] : "0",
            'receive_num'    => isset($user_info['receive_num']) ? $user_info['receive_num'] : "0",
            'vip_level'    => isset($user_info['vip_level']) ? $user_info['vip_level'] : "0",
            'anchor_type'    => isset($user_info['anchor_type']) ? $user_info['anchor_type'] : "0",
        );
    }

    public function login() {
        $userBean = array();
        switch (DI()->request->get('user_type')) {
            case USER_PHONE:
                $userBean = $this->loginByPhone();
                break;
            case USER_WECHAT:
                $userBean = $this->loginByWechat();
                break;
            case USER_SINA:
                $userBean = $this->loginBySina();
                break;
            case USER_QQ:
                $userBean = $this->loginByQQ();
                break;
            default:
                throw new PhalApi_Exception_BadRequest("异常用户类型", 10);
                break;
        }

        //$this->loginSendCoin($userBean['id']);
        $this->writeLoginLog($userBean['id']);

        $package_log = DI()->notorm->gift_package_log->where('user_id = ?', $userBean['id'])
            ->fetchPairs('gift_package_id');

        if(array_key_exists(1, $package_log)) {
            $userBean['first_charge_package'] = true;
        } else {
            $userBean['first_charge_package'] = false;
        }

        if(array_key_exists(2, $package_log)) {
            $userBean['stay_package'] = true;
        } else {
            $userBean['stay_package'] = false;
        }
        if(array_key_exists(3, $package_log)) {
            $userBean['encourage_package'] = true;
        } else {
            $userBean['encourage_package'] = false;
        }

        return $userBean;
    }

    public function writeLoginLog($user_id) {
        $login_log_data = array(
            'user_id'      => $user_id,
            'channel'      => isset($this->req['channel']) ? $this->req['channel'] : '',
            'user_type'    => $this->req['user_type'],
            'version_name' => isset($this->req['version_name']) ? $this->req['version_name'] : '',
            'version_code' => isset($this->req['version_code']) ? $this->req['version_code'] : '',
            'device'       => isset($this->req['device']) ? $this->req['device'] : '',
            'ratio'        => isset($this->req['ratio']) ? $this->req['ratio'] : '',
            'os'           => isset($this->req['os']) ? $this->req['os'] : '',
            'imei'         => isset($this->req['imei']) ? $this->req['imei'] : '',
            'ip'           => PhalApi_Tool::getClientIp(),
        );

        $insert_id = $this->userModel->insertLoginLog($login_log_data);
        if ($insert_id < 0) {
            throw new PhalApi_Exception_BadRequest("登陆日志写入失败", 10);
        }
    }

    //每天登录送金币5w
    public function loginSendCoin($user_id) {
        $today = date('Y-m-d', time());
        $had_login = DI()->notorm->user_login->where('user_id = ?', $user_id)
            ->where('login_time >= ?', $today)->fetchOne();
        if(empty($had_login)) {
            $this->userModel->updateUserDiamondCoin($user_id, 0, 50000);
            $domain_im = new Domain_IM();
            $msg = '今日首次登录，系统再次赠送您50000米币，记得悠着点玩哦！在体验的过程中如果您遇到任何问题，欢迎点击查看把问题反馈给我们，您宝贵的建议是我们提升产品体验的动力！';
            $extra = array('type' => 4, 'value' => 'com.heju.mibo.ui.activity.FeedbackActivity');
            $domain_im->sendUserMsg(1, $user_id, $msg, $extra);

        }
    }

    /**
     * 登出时做清理操作
     */
    public function loginOut() {

        $user_info = $this->checkUser();
        $user_info_key = "user_info_" . $user_info['id'];
        if (DI()->redis->get_exists($user_info_key)) {
            DI()->redis->del($user_info_key);
        }
        return true;
    }

    public function getImIdByMibo($mb_id) {

        $easemob = new Emchat_Lite();

        $user_name = "mb" . $mb_id;

        $cfg = DI()->config->get('app.easemob2');
        $password = $cfg['im_password'];
        $response = $easemob->getUser($user_name);
        if (!isset($response['application'])) {
            $response_string = $easemob->createUser($user_name, $password);
            if (!isset($response_string['application'])) {
                DI()->logger->error("注册 IM失败", json_encode($response_string));
            }
        }

        return array(
            'im_id'  => $user_name,
            'im_pwd' => $password,
        );
    }

    public function getNewMiboId() {

        $last_user_info = $this->userModel->getLastUser();

//        $last_mibo_id = DI()->redis->get_forever("last_mibo_id");
//        if (empty($last_mibo_id) || $last_mibo_id <= 0) {
//            $last_user_info = $this->userModel->getLastUser();
//            if (empty($last_user_info)) {
//                DI()->redis->set_forever("last_mibo_id", 100000);
//                $last_mibo_id = 100000;
//            } else {
//                DI()->redis->set_forever("last_mibo_id", $last_user_info['mb_id']);
//                $last_mibo_id = $last_user_info['mb_id'];
//            }
//        }

        return intval($last_user_info['mb_id']) + 1;
    }

    public function registerByPhone() {
        if (empty($this->req['phone'])) {
            throw new PhalApi_Exception_BadRequest("手机号不能为空", 11);
        } else if (empty($this->req['password'])) {
            throw new PhalApi_Exception_BadRequest("密码不能为空", 12);
        }

        $user_info = $this->userModel->getUserInfoByPhone($this->req['phone']);
        if (!empty($user_info)) {
            throw new PhalApi_Exception_BadRequest("此号码已被注册，您可以通过忘记密码重置密码", 13);
        }

        $mb_id = $this->getNewMiboId();
        $im_user = $this->getImIdByMibo($mb_id);
        $user_data['phone'] = $this->req['phone'];
        $user_data['user_type'] = USER_PHONE;
        $user_data['mb_id'] = $mb_id;
        $user_data['im_id'] = $im_user['im_id'];
        $user_data['im_pwd'] = $im_user['im_pwd'];
        $user_data['channel'] = $this->req['channel'];
        $user_data['login_name'] = $this->req['phone'];
        $user_data['nick_name'] = g_hidtel($this->req['phone']);
        $user_data['password'] = md5($this->req['password']);
        $user_data['avatar'] = 'http://image.cdn.mibolive.com/img/default/default-phone-user.jpg';
        $user_data['coin_num'] = $this->register_send_coin_num;        //注册赠送的
        $user_data['diamond_num'] = 0;        //注册赠送的

        $id = $this->userModel->addUser($user_data);
        if ($id > 0) {

            DI()->redis->set_forever("last_mibo_id", intval($mb_id) + 1);
            $this->writeLoginLog($id);     //注册成功写进登录日记，不然注册这一天又会送金币
            $user_data['id'] = $id;
            $user_bean = $this->setUserBean($user_data);
            //用于前端发送新手大礼包
            $user_bean['is_new'] = true;
            return $user_bean;
        }

        return false;
    }

    //礼物经验
    public function setSendGiftExperience($uid, $live_id, $gift_id, $experience, $mid = MOUDEL_LIVE_GIFT) {
        $rs = $this->userModel->addUserExperience($uid, $experience);
        if ($rs == 1) {
            $data = array(
                'user_id'    => $uid,
                'mid'        => $mid,
                'value'      => $live_id,
                'extra'      => $gift_id,
                'experience' => $experience,
            );
            $exp_model = new Model_Experience();
            $insert_id = $exp_model->addUserExperienceLog($data);
        }
    }

    //分享直播经验,每天最多累积5条经验
    public function setShareExperience($uid, $live_id, $share_type, $experience = 10) {
        //$share_log = DI()->notorm->share_log->where('user_id = ?', $uid)
        //            ->where('share_time >= ?', date('Y-m-d', time()))->fetchAll();
        //$share_num = count($share_log);
        $share_num = DI()->notorm->share_log->where('user_id = ?', $uid)
                    ->where('share_time >= ?', date('Y-m-d', time()))->count();
        if($share_num <= 2) {
            $rs = $this->userModel->addUserExperience($uid, $experience);
            if($rs == 1) {
                $data = array(
                    'user_id'    => $uid,
                    'mid'        => MOUDEL_LIVE_SHARE,
                    'value'      => $live_id,
                    'extra'      => $share_type,
                    'experience' => $experience,
                );
                $exp_model = new Model_Experience();
                $insert_id = $exp_model->addUserExperienceLog($data);
            }
        }

    }

    public function loginByPhone() {
        $phone = $this->req['phone'] ? $this->req['phone'] : $this->req['login_name'];
        $user_info = $this->userModel->getUserInfoByPhone($phone);
        if (empty($user_info)) {
            throw new PhalApi_Exception_BadRequest("用户名不存在", 14);
        }

        //if ($user_info['password'] == $this->req['password']) {
        //    return $this->setUserBean($user_info);
        //}
        $this->req['password'] = trim($this->req['password']);

        if ($user_info['password'] == md5($this->req['password'])) {
            $this->isSealed($user_info['is_limit']);
            return $this->setUserBean($user_info);
        }

        if($user_info['password'] == $this->req['password']) {
            $this->isSealed($user_info['is_limit']);
            if($this->req['version_code'] > 20) {
                $user_info['password'] = md5($user_info['password']);
                $rs = DI()->notorm->user->where('id', $user_info['id'])->update($user_info);
                if($rs >= 1) {
                    return $this->setUserBean($user_info);
                }
            } else {
                return $this->setUserBean($user_info);
            }

        }

        throw new PhalApi_Exception_BadRequest("密码错误", 15);
    }

    public function loginByWechat() {
        //app自动登录，通过系统设置的密码
        if(isset($this->req['open_id']) && isset($this->req['password']) && !empty($this->req['password'])) {
            $user_info = DI()->notorm->user->where('third_id = ?', $this->req['open_id'])
                ->where('password = ?', $this->req['password'])->fetchOne();
            if(empty($user_info)) {
                throw new PhalApi_Exception('自动登录，密码错误', 357);
            }

        } else {
            if (empty($this->req['open_id']) || empty($this->req['access_token'])) {
                throw new PhalApi_Exception_BadRequest("缺少必要的参数", 15);
            }

            $wechat = new Wechat_Lite();
            $wechat_info = json_decode($wechat->get_user_info($this->req['access_token'], $this->req['open_id']), true);

            if (!isset($wechat_info['openid']) || $wechat_info['openid'] != $this->req['open_id']) {
                throw new PhalApi_Exception_BadRequest("无效的openid或失效的access_token", 16);
            }

            $user_info = $this->userModel->getUserInfoByThirdId($this->req['open_id'], USER_WECHAT);
        }

        if (empty($user_info)) {
            //新用户
            $mb_id = $this->getNewMiboId();
            $im_user = $this->getImIdByMibo($mb_id);
            $user_data['user_type'] = USER_WECHAT;
            $user_data['mb_id'] = $mb_id;
            $user_data['im_id'] = $im_user['im_id'];
            $user_data['im_pwd'] = $im_user['im_pwd'];
            $user_data['third_id'] = $wechat_info['openid'];
            $user_data['third_extra'] = $wechat_info['unionid'];
            $user_data['sex'] = $wechat_info['sex'];
            $user_data['address'] = $wechat_info['province'] . $wechat_info['city'];
            $user_data['channel'] = $this->req['channel'];
            $user_data['nick_name'] = mb_substr($wechat_info['nickname'], 0, 12, 'utf-8');
            $user_data['password'] = substr(md5($wechat_info['openid']), 0, 12);
            $user_data['avatar'] = $wechat_info['headimgurl'];
            $user_data['coin_num'] = $this->register_send_coin_num;
            $user_data['diamond_num'] = 0;
            $user_id = $this->userModel->addUser($user_data);
            if ($user_id > 0) {

                $this->writeLoginLog($user_id);     //注册成功写进登录日记，不然注册这一天又会送金币

                DI()->redis->set_forever("last_mibo_id", intval($mb_id) + 1);
                $user_data['id'] = $user_id;
                $user_info = $this->setUserBean($user_data);
                $user_info['is_new'] = true;
                return $user_info;
            }
            throw new PhalApi_Exception_BadRequest("创建微信用户失败", 3);
        }

        $this->isSealed($user_info['is_limit']);
        return $this->setUserBean($user_info);
    }

    public function loginBySina() {
        //app自动登录
        if(isset($this->req['uid']) && isset($this->req['password']) && !empty($this->req['password'])) {
            $user_info = DI()->notorm->user->where('third_id = ?', $this->req['uid'])
                ->where('password = ?', $this->req['password'])->fetchOne();
            if(empty($user_info)) {
                throw new PhalApi_Exception('自动登录，密码错误', 357);
            }
        } else {
            if (empty($this->req['uid']) || empty($this->req['access_token'])) {
                throw new PhalApi_Exception_BadRequest("缺少必要的参数", 15);
            }

            $sina = new Sina_Lite();
            $wb_user_info = $sina->getUserinfo($this->req['access_token'], $this->req['uid']);
            if (empty($wb_user_info)) {
                throw new PhalApi_Exception_BadRequest("获取微博用户信息失败", 15);
            }

            $user_info = $this->userModel->getUserInfoByThirdId($this->req['uid'], USER_SINA);
        }

        if (empty($user_info)) {
            //新用户
            $mb_id = $this->getNewMiboId();
            $im_user = $this->getImIdByMibo($mb_id);

            if ($wb_user_info['gender'] == 'm') {
                $sex = 1;
            } else if ($wb_user_info['gender'] == 'f') {
                $sex = 2;
            } else {
                $sex = 0;
            }
            $user_data['user_type'] = USER_SINA;
            $user_data['mb_id'] = $mb_id;
            $user_data['im_id'] = $im_user['im_id'];
            $user_data['im_pwd'] = $im_user['im_pwd'];
            $user_data['third_id'] = $wb_user_info['id'];
            $user_data['third_extra'] = $wb_user_info['idstr'];
            $user_data['sex'] = $sex;
            $user_data['address'] = $wb_user_info['location'];
            $user_data['signature'] = $wb_user_info['description'];
            $user_data['channel'] = $this->req['channel'];
            $user_data['nick_name'] = mb_substr($wb_user_info['screen_name'], 0, 12, 'utf-8');
            $user_data['password'] = substr(md5($wb_user_info['id']), 0, 12);
            $user_data['avatar'] = $wb_user_info['avatar_large'];//profile_image_url, avatar_large,avatar_hd
            $user_data['coin_num'] = $this->register_send_coin_num;
            $user_data['diamond_num'] = 0;
            $user_id = $this->userModel->addUser($user_data);
            if ($user_id > 0) {

                $this->writeLoginLog($user_id);     //注册成功写进登录日记，不然注册这一天又会送金币

                DI()->redis->set_forever("last_mibo_id", intval($mb_id) + 1);
                $user_data['id'] = $user_id;
                $user_info = $this->setUserBean($user_data);
                $user_info['is_new'] = true;
                return $user_info;
            }
            throw new PhalApi_Exception_BadRequest("创建微信用户失败", 3);
        }
        $this->isSealed($user_info['is_limit']);
        return $this->setUserBean($user_info);
    }

    public function loginByQQ() {
        //app自动登录，通过系统设置的密码
        if(isset($this->req['open_id']) && isset($this->req['password']) && !empty($this->req['password'])) {
            $user_info = DI()->notorm->user->where('third_id = ?', $this->req['open_id'])
                ->where('password = ?', $this->req['password'])->fetchOne();
            if(empty($user_info)) {
                throw new PhalApi_Exception('自动登录，密码错误', 357);
            }

        } else {
            if (empty($this->req['open_id']) || empty($this->req['access_token'])) {
                throw new PhalApi_Exception_BadRequest("缺少必要的参数", 15);
            }

            //https://graph.qq.com/user/get_user_info?access_token=YOUR_ACCESS_TOKEN&oauth_consumer_key=YOUR_APP_ID&openid=YOUR_OPENID
            $get_user_info_url = 'https://graph.qq.com/user/get_user_info?';
            $qq_info = json_decode(
                        file_get_contents($get_user_info_url.'access_token='.$this->req['access_token'].
                        '&oauth_consumer_key='.DI()->config->get("app.thirdLogin.qq.APP_ID").
                        '&openid='.$this->req['open_id'])
                        , true);

            if (!isset($qq_info['nickname'])) {
                throw new PhalApi_Exception_BadRequest("无效的openid或失效的access_token", 16);
            }

            $user_info = $this->userModel->getUserInfoByThirdId($this->req['open_id'], USER_QQ);
        }

        if (empty($user_info)) {
            //新用户
            $mb_id = $this->getNewMiboId();
            $im_user = $this->getImIdByMibo($mb_id);
            $user_data['user_type'] = USER_QQ;
            $user_data['mb_id'] = $mb_id;
            $user_data['im_id'] = $im_user['im_id'];
            $user_data['im_pwd'] = $im_user['im_pwd'];
            $user_data['third_id'] = $this->req['open_id'];
            $user_data['sex'] = $qq_info['gender'] == '男' ? 1 : 2;
            $user_data['address'] = $qq_info['province'] . $qq_info['city'];
            $user_data['channel'] = $this->req['channel'];
            $user_data['nick_name'] = mb_substr($qq_info['nickname'], 0, 12, 'utf-8');
            $user_data['password'] = substr(md5($qq_info['openid']), 0, 12);
            $user_data['avatar'] = $qq_info['figureurl_qq_2'];
            $user_data['coin_num'] = $this->register_send_coin_num;
            $user_data['diamond_num'] = 0;
            $user_id = $this->userModel->addUser($user_data);
            if ($user_id > 0) {

                $this->writeLoginLog($user_id);     //注册成功写进登录日记，不然注册这一天又会送金币

                DI()->redis->set_forever("last_mibo_id", intval($mb_id) + 1);
                $user_data['id'] = $user_id;
                $user_info = $this->setUserBean($user_data);
                $user_info['is_new'] = true;
                return $user_info;
            }
            throw new PhalApi_Exception_BadRequest("创建qq用户失败", 3);
        }

        //$this->setLoginExperience($user_info['id'], $this->req['user_type'], 200);

        $this->isSealed($user_info['is_limit']);
        return $this->setUserBean($user_info);
    }

    public function isSealed($limit = 0) {
        if($limit) {
            throw new PhalApi_Exception('您的号异常，已经被封禁！联系客服微信mibokf申诉!', 110);
        }
    }

    public function getSearchResult() {

        $page_no = $this->req['page_no'];
        if($page_no > 3) {
            return false;
        }
        $page_size = isset($this->req['page_size']) ? $this->req['page_size'] : 20;

        $this->req['key_word'] = addslashes($this->req['key_word']);
        $search_list = $this->userModel->getSearchResult($this->req['key_word'], $page_no, $page_size, $this->req['user_id']);
        if (empty($search_list)) {
            return false;
        }

        $result = array();
        foreach ($search_list as $item) {
            $user = $this->setUserBean($item);

            $user['is_followed'] = isset($item['is_followed']) ? true : false;
            $result[] = $user;
        }
        return $result;
    }

    public function getUsersInfoById($uid) {
        $user_info = $this->userModel->getUsersInfoById($uid);

        if (empty($user_info)) {
            return false;
        }

        return $user_info;
    }

    public function getUsersInfoByIds($ids) {
        $user_list = $this->userModel->getUsersInfoByIds($ids);

        if (empty($user_list)) {
            return false;
        }

        return $user_list;
    }

    public function getUserInfo() {

        $user_info = $this->userModel->getUsersInfoById($this->req['user_id']);
        $user_info = $this->setUserBean($user_info);

        $is_follow = DI()->notorm->follow_list->where('user_id = ?', $this->req['self_user_id'])
            ->where('to_user_id = ?', $this->req['user_id'])->where('is_cancel = 0')
            ->fetchOne();

        if(!empty($is_follow)) {
            $user_info['is_followed'] = true;
        } else {
            $user_info['is_followed'] = false;
        }

        //如果不是机器人通过关注表取得关注数据，否则直接用用户表中的fans_num,follow_num
        if($user_info['user_type'] != 9) {
            $user_info['fans_num'] = DI()->notorm->follow_list->where('to_user_id = ?', $this->req['user_id'])
                ->where('is_cancel = 0')->count();

            $user_info['follow_num'] = DI()->notorm->follow_list->where('user_id = ?', $this->req['user_id'])
                ->where('is_cancel = 0')->count();
        }

        if (empty($user_info)) {
            return false;
        }

        return $user_info;
    }

    public function getUserInfoByImId() {

        $im_id = $this->req['im_id'];
        $user_info = DI()->notorm->user->where('im_id', $im_id)->fetchOne();

        if (empty($user_info)) {
            return false;
        }

        return $user_info;
    }

    public function updateUserDiamondNumReduce($uid, $diamond_num, $is_send, $coin = 0) {
        $rs = $this->userModel->updateUserDiamondNumReduce($uid, $diamond_num, $is_send, $coin);
        if ($rs === 1) {
            DI()->redis->del("user_info_" . $uid);
            return true;
        }
        return false;
    }

    public function updateAnchorDiamondNumPlus($uid, $diamond_num) {
        $rs = $this->userModel->updateAnchorDiamondNumPlus($uid, $diamond_num);
        if ($rs === 1) {
            return true;
        }
        return false;
    }

    public function modifyUserInfo() {
        $user_info = $this->getUsersInfoById($this->req['user_id']);

        $update_data = array();
        if ($user_info['nick_name'] != $this->req['nick_name']) {
            $update_data['nick_name'] = mb_substr($this->req['nick_name'], 0, 22);
            $had_nick_name = DI()->notorm->user->where('nick_name = ?', $update_data['nick_name'])->fetchOne('id');
            if($had_nick_name) {
                throw new PhalApi_Exception('昵称已存在，请使用其他。', 533);
            }
        }
        if (isset($this->req['avatar']) && $user_info['avatar'] != $this->req['avatar']) {
            $update_data['avatar'] = $this->req['avatar'];
        }
        if ($user_info['sex'] != $this->req['sex']) {
            $update_data['sex'] = $this->req['sex'];
        }
        if ($user_info['address'] != $this->req['address']) {
            $update_data['address'] = $this->req['address'];
        }
        if ($user_info['signature'] != $this->req['signature']) {
            $update_data['signature'] = empty($this->req['signature']) ? '这家伙太懒！' : $this->req['signature'];
        }
        //无改动
        if (empty($update_data)) {
            throw new PhalApi_Exception("资料无改动", 418);
        }


        DI()->redis->del('user_user_id_'.$this->req['user_id']);
        $rs = $this->userModel->update($this->req['user_id'], $update_data);
        if ($rs === 1) {
            DI()->redis->del("user_info_" . $this->req['user_id']);
            return $update_data;
        }
        return false;
    }

    public function setPassword() {
        $password = $this->req['password'];
        $data = array('password' => md5($password));
        $rs = DI()->notorm->user->where('phone = ?', $this->req['phone'])->update($data);
        if($rs === false) throw new PhalApi_Exception('密码更改错误', 533);

        $phone = $this->req['phone'];
        $url = 'http://mibo.yahalei.com/mibo/index.php?phone=' . $phone .
                '&login_name=' . $phone . '&password=' . $password . '&service=User.Login&channel=bt&user_type=1';
        $request_data = json_decode(file_get_contents($url), true);
        $login_data = $request_data['data'];

        return $login_data;

    }

}