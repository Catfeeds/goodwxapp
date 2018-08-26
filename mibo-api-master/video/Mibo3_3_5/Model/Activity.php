<?php

class Model_Activity extends PhalApi_Model_NotORM {

    protected function getTableName($id) {
        return 'activity';
    }

    public function getList() {
        $activity = DI()->redis->get_time('get_activity');
        if(isset($activity) && !empty($activity)) {
            $activity = json_decode($activity, true);
        } else {
            $activity = DI()->notorm->activity->where('status = 1')->order('id DESC')->fetchOne();
            DI()->redis->set_time('get_activity', json_encode($activity), 60 * 60 * 3);
        }
        return $activity ? $activity : NULL;
    }




}