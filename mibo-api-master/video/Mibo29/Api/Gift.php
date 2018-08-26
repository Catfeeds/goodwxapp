<?php

class Api_Gift extends PhalApi_Api {

    public function getRules() {
        return array(
            'sendPackage' => array(
                'user_id'  => array('name' => 'user_id', 'type' => 'int', 'require' => true, 'desc' => '礼包接收用户id'),
                'gift_package_id' => array('name' => 'gift_package_id', 'type' => 'int',
                                           'require' => true, 'desc' => '礼包id,1首充礼包,2挽留礼包,3逆袭礼包一,4专属礼包'),
            ),
            'sendMessageGift'      => array(
                'user_id' => array('name' => 'user_id', 'type' => 'int', 'require' => true, 'desc' => '用户ID'),
                'to_user_id' => array('name' => 'to_user_id', 'type' => 'int', 'require' => true, 'desc' => '接收礼物用户ID'),
                'gift_id' => array('name' => 'gift_id', 'type' => 'int', 'require' => true, 'desc' => '礼物ID'),
                'gift_num' => array('name' => 'gift_num', 'type' => 'int', 'require' => true, 'min' => 1, 'desc' => '礼物数量'),
            ),
        );
    }

    /**
     * 发送礼包，增加米币接口,逆袭礼包一和二的id都是3，不过二不经过这个接口，因为二不送的。
     * @desc 发送礼包，增加米币接口,首先礼包和其他首充都要走这个接口，用以增加首充记录，以后就不弹出首充。从哪里判断是否首充？登录时，有返回一个first_charge_package字段
     * @request http://mibo.yahalei.com/mibo/index.php?service=Gift.SendPackage&user_id=410&gift_package_id=2
     */
    public function sendPackage() {
        $domain = new Domain_GiftPackage();
        return $domain->sendPackage();
    }

    /**
     * 发送私信礼物
     * @desc 发送私信礼物
     */
    public function sendMessageGift() {
        $domain_gift = new Domain_Gift();
        $rs = $domain_gift->sendMessageGift();
        return $rs;
    }


}