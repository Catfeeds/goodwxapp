<?php

class Api_User extends PhalApi_Api {

    private $userDomain;
    private $commonDomain;

    public function __construct() {
        $this->userDomain = new Domain_User();
        $this->commonDomain = new Domain_Common();
    }


    public function getRules() {
        return array(
            'register'        => array(
                'channel'   => array('name' => 'channel', 'type' => 'string', 'require' => true, 'desc' => '渠道ID'),
                'user_type' => array('name' => 'user_type', 'type' => 'int', 'require' => true, 'desc' => '用户类型 1: 手机用户  2:微信用户  3:微博用户  4:QQ用户  9:机器人'),
                'phone'     => array('name' => 'phone', 'type' => 'string', 'require' => true, 'regex' => '#^13[\d]{9}$|^14[5,7]{1}\d{8}$|^15[^4]{1}\d{8}$|^17[0,6,7,8]{1}\d{8}$|^18[\d]{9}$#', 'desc' => '手机号码'),
            ),
            'login'           => array(
                'channel'      => array('name' => 'channel', 'type' => 'string', 'require' => true, 'desc' => '渠道ID'),
                'user_type'    => array('name' => 'user_type', 'type' => 'int', 'require' => true, 'desc' => '用户类型 1: 手机用户  2:微信用户  3:微博用户  4:QQ用户 7：内部人员 8:米播小妹等  9:机器人'),
                'phone'        => array('name' => 'phone', 'type' => 'string', 'require' => false, 'desc' => '手机号码'),
                'login_name'   => array('name' => 'login_name', 'type' => 'string', 'require' => false, 'desc' => '登陆名'),
                'password'     => array('name' => 'password', 'type' => 'string', 'require' => false, 'desc' => '登录密码'),
                'open_id'      => array('name' => 'open_id', 'type' => 'string', 'require' => false, 'desc' => '微信的open_id'),
                'access_token' => array('name' => 'access_token', 'type' => 'string', 'require' => false, 'desc' => '微信/微博的access_token'),
                'uid'          => array('name' => 'uid', 'type' => 'string', 'require' => false, 'desc' => '微博的UID'),
                'version_name' => array('name' => 'version_name', 'type' => 'string', 'require' => false, 'desc' => '版本名'),
                'version_code' => array('name' => 'version_code', 'type' => 'string', 'require' => false, 'desc' => '版本号'),
                'device'       => array('name' => 'device', 'type' => 'string', 'require' => false, 'desc' => '设备名'),
                'ratio'        => array('name' => 'ratio', 'type' => 'string', 'require' => false, 'desc' => '分辩率'),
                'os'           => array('name' => 'os', 'type' => 'string', 'require' => false, 'desc' => '系统 android/ios'),
                'imei'           => array('name' => 'imei', 'type' => 'string', 'require' => false, 'desc' => 'imei'),
            ),
            'getUserInfo' => array(
                'user_id' => array('name' => 'user_id', 'type' => 'string', 'require' => true, 'desc' => '用户id'),
                'self_user_id' => array('name' => 'self_user_id', 'type' => 'string', 'require' => true, 'desc' => '本机登录用户id'),
            ),
            'getUserInfoByImId' => array(
                'im_id' => array('name' => 'im_id', 'type' => 'string', 'require' => true, 'desc' => '用户环信id'),
            ),
            'modifyUserInfo'  => array(
                'channel'   => array('name' => 'channel', 'type' => 'string', 'require' => true, 'desc' => '渠道ID'),
                'user_id'   => array('name' => 'user_id', 'type' => 'int', 'require' => true, 'desc' => '用户id'),
                'nick_name' => array('name' => 'nick_name', 'type' => 'string', 'require' => true, 'desc' => '用户昵称'),
                'sex'       => array('name' => 'sex', 'type' => 'int', 'require' => true, 'desc' => '性别 0保密  1:男 2：女'),
                'avatar'    => array('name' => 'avatar', 'type' => 'string', 'require' => false, 'desc' => '用户头像'),
                'address'   => array('name' => 'address', 'type' => 'string', 'require' => true, 'desc' => '所在地'),
                'signature' => array('name' => 'signature', 'type' => 'string', 'require' => false, 'desc' => '个性签名'),
            ),
            'setPassword'   => array(
                'phone' => array('name' => 'phone', 'type' => 'string', 'require' => true, 'desc' => '手机号码'),
                'password' => array('name' => 'password', 'type' => 'string', 'require' => true, 'desc' => '密码'),
            ),
            'bindPhone' => array(
                'user_id' => array('name' => 'user_id', 'type' => 'int', 'require' => true, 'desc' => '用户id'),
                'phone' => array('name' => 'phone', 'type' => 'string', 'require' => true, 'desc' => '手机号码'),
                'password' => array('name' => 'password', 'type' => 'string', 'require' => true, 'desc' => '绑定后的密码'),
            ),
            'updateWealth' => array(
                'user_id' => array('name' => 'user_id', 'type' => 'int', 'require' => true, 'desc' => '用户id'),
                'num' => array('name' => 'num', 'type' => 'int', 'require' => true, 'desc' => '数量'),
                'type' => array('name' => 'type', 'type' => 'int', 'default' => 1, 'desc' => '修改类型，1米币，2米钻'),
                'mid' => array('name' => 'mid', 'type' => 'int', 'require' => true, 'desc' => '模块id, 201活动赠送'),
            ),
        );
    }

    /**
     * 用户注册
     * @request http://mibo.yahalei.com/mibo/index.php?service=User.register&channel=bt&user_type=1&phone=12510129004&password=12345&sign=d86f32816bb97c9d058eedd48298f07b
     */
    public function register() {
        $user_info = $this->userDomain->registerByPhone();

        if (empty($user_info)) {
            throw new PhalApi_Exception("注册失败", 420);
        }

        return $user_info;
    }


    /**
     * 用户登陆
     * @desc 用户登陆接口
     * @return int user_type 用户类型   1: 手机用户  2:微信用户  3:微博用户  4:QQ用户
     * @return int mb_id 米播号
     * @return string third_id 第三方唯一标识码
     * @return int sex 性别 0:未知   1:男  2:女
     * @return string address 地址
     * @return string third_extra 第三方扩展信息 如微信为unionid
     * @return string channel 渠道号
     * @return string nick_name 昵称
     * @return string login_name 登录名，只能为手机
     * @return string avatar 头像
     * @request http://mibo.yahalei.com/mibo/index.php?phone=15577974142&login_name=15577974142&password=123456&open_id=&service=User.Login&access_token=&channel=bt&user_type=1
     */
    public function login() {
        //登陆日志
        $rs = $this->userDomain->login();
        if (empty($rs)) {
            throw new PhalApi_Exception("登陆失败", 420);
        }

        return $rs;
    }

    public function loginOut() {

        //登陆日志
        $rs = $this->userDomain->loginOut();
        if (empty($rs)) {
            throw new PhalApi_Exception("退出登陆失败", 423);
        }

        return $rs;
    }

    /**
     * 获取某用户资料
     * @desc 获取某用户资料
     * @request http://mibo.yahalei.com/mibo/index.php?service=User.getUserInfo&user_id=14
     */
    public function getUserInfo() {
        $rs = $this->userDomain->getUserInfo();

        if (empty($rs)) {
            throw new PhalApi_Exception("没有这些用户的信息", 421);
        }
        return $rs;
    }

    /**
     * 获取某用户资料
     * @desc 获取某用户资料通过环信id
     * @request http://mibo.yahalei.com/mibo/index.php?service=User.getUserInfo&user_id=14
     */
    public function getUserInfoByImId() {
        $rs = $this->userDomain->getUserInfoByImId();

        if (empty($rs)) {
            throw new PhalApi_Exception("没有这些用户的信息", 421);
        }
        return $rs;
    }

    /**
     * 修改用户资料
     * @request http://mibo.yahalei.com/mibo/index.php?service=User.modifyUserInfo&channel=bt&user_id=14&nick_name=Dallon@%E5%A4%A7%E9%BE%99&sex=1&address=%E6%B1%9F%E8%A5%BF%20%E8%B5%A3%E5%B7%9E&signature=%E6%88%91%E7%88%B1%E6%88%91%E5%AE%B6
     */
    public function modifyUserInfo() {
        $rs = $this->userDomain->modifyUserInfo();
        if (empty($rs)) {
            throw new PhalApi_Exception("更新失败", 422);
        }
        return $rs;
    }

    /**
     * 手机号码设置新密码
     * @desc 手机号码设置新密码
     */
    public function setPassword() {
        return $this->userDomain->setPassword();
    }

    /**
     * 绑定手机号
     * @desc 绑定手机号
     */
    public function bindPhone() {
        $domain_mobile = new Domain_Mobile();
        $domain_mobile->bindPhone();
    }

    /**
     * 更新用户财富
     * @desc 更新用户财富
     * @ignore
     * @request https://mibo.yahalei.com/mibo30/index.php?service=User.UpdateWealth&user_id=100&num=100&mid=201
     */
    public function updateWealth() {
        $req['user_id'] = $this->user_id;
        $req['num'] = $this->num;
        $req['type'] = $this->type;
        $req['mid'] = $this->mid;

        if($req['user_id'] <= 0) throw new PhalApi_Exception('参数错误');

        $domain = new Domain_User();
        return $domain->updateWealth($req);
    }

}