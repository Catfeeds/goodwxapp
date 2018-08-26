<?php
class Domain_RoomAdmin extends Domain_Common {
    public function __construct() {
        parent::__construct();
    }

    public function addAdmin($req) {

        $had_been_admin = DI()->notorm->room_admin->where('admin_id', $req['admin_id'])
            ->where('anchor_id', $req['anchor_id'])->fetchOne();

        if (!empty($had_been_admin)) throw new PhalApi_Exception('已经是房管了', 450);

        $model_room_admin = new Model_RoomAdmin();
        return $model_room_admin->addAdmin($req);
    }

    public function delAdmin($req) {

        $rs = DI()->notorm->room_admin->where('admin_id', $req['admin_id'])
                ->where('anchor_id', $req['anchor_id'])->delete();

        return $rs ? true : false;
    }

    public function getAdminList($req) {
        $offset = ($req['page_no'] - 1) * $req['page_size'];
        $admin_list = DI()->notorm->room_admin->select('admin_id')->where('anchor_id', $req['anchor_id'])
            ->order('id desc')->limit($offset, $req['page_size'])->fetchPairs('admin_id');

        if(empty($admin_list)) return array();

        $admin_id_arr = array_keys($admin_list);
        $admin_ids = implode(',', $admin_id_arr);

        $model_user = new Model_User();
        $user_list = $model_user->getUsersInfoByIds($admin_ids);

        $final_data = array();
        foreach($admin_list as $admin) {
            foreach($user_list as $user) {
                if($user['id'] == $admin['admin_id']) {
                    array_push($final_data, $user);
                }
            }
        }

        return $final_data;

    }

    public function adminEntryLive($admin, $anchor, $live_info) {
        $model = new Model_RoomAdmin();
        $is_admin = $model->isAdmin($admin['id'], $anchor['id']);

        if($is_admin) {
            $emchat = new Emchat_Lite();
            $emchat->addChatRoomAdmin($live_info['chatroom_id'], $admin['im_id']);
        }

        return $is_admin;
    }

    public function searchUser($req) {
        $offset = ($req['page_no'] - 1) * $req['page_size'];

        $model_user = new Model_User();
        $user_list = $model_user->searchUser($req['key_word'], $offset, $req['page_size']);

        if(empty($user_list)) return array();

        $user_id_arr = array_keys($user_list);

        $model_admin = new Model_RoomAdmin();
        $admin_list = $model_admin->getAdminByAdminIds($user_id_arr, $req['anchor_id']);

        foreach($user_list as $key => &$user) {
            $user['is_admin'] = false;

            //过滤掉自身
            if($user['id'] == $req['anchor_id']) {
                unset($user_list[$key]);
                continue;
            }

            foreach($admin_list as $admin) {
                if($admin['admin_id'] == $user['id']) {
                    $user['is_admin'] = true;
                    break;
                }
            }
        }

        $user_list = array_values($user_list);
        return $user_list;

    }

    public function getRoomUserInfo($req) {

        $user_info = DI()->notorm->user->select('id,mb_id,im_id,nick_name,sex,anchor_type,
            address,signature,level,avatar,coin_num,diamond_num,send_num,receive_num,vip_level')
            ->where('id', $req['user_id'])->fetchOne();

        if(empty($user_info)) return NULL;

        $is_follow = DI()->notorm->follow_list->where('user_id = ?', $req['self_user_id'])
            ->where('to_user_id = ?', $this->req['user_id'])->where('is_cancel = 0')
            ->fetchOne();

        //如果不是机器人通过关注表取得关注数据，否则直接用用户表中的fans_num,follow_num
        if($user_info['user_type'] != 9) {
            $user_info['fans_num'] = DI()->notorm->follow_list->where('to_user_id = ?', $this->req['user_id'])
                ->where('is_cancel = 0')->count();

            $user_info['follow_num'] = DI()->notorm->follow_list->where('user_id = ?', $this->req['user_id'])
                ->where('is_cancel = 0')->count();
        }

        //是否关注
        if(!empty($is_follow)) {
            $user_info['is_followed'] = true;
        } else {
            $user_info['is_followed'] = false;
        }

        //是否管理员
        $domain_im = new Domain_IM();
        $is_admin = $domain_im->isRoomAdmin($user_info['im_id'], $req['chatroom_id']);
        $user_info['is_admin'] = $is_admin;


        //是否被禁言
        $is_mute = $domain_im->isMute($user_info['im_id'], $req['chatroom_id']);
        $user_info['is_mute'] = $is_mute;

        return $user_info;
    }


}