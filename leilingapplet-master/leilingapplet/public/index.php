<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

// [ 应用入口文件 ]

// 定义应用目录
define('APP_PATH', __DIR__ . '/../application/');
define('UPLOAD_DEFAULT_DIR','/var/www/html/ltb_static_files/levin/img/');

// define('DEBUG_ON_LOCALHOST_OR_201TESTINGSERVER' , TRUE); //在本机测试或者在测试服务器时为TRUE
define('DEBUG_ON_LOCALHOST_OR_201TESTINGSERVER' , FALSE); //在正式服务器运行时，必须设为FALSE
if(DEBUG_ON_LOCALHOST_OR_201TESTINGSERVER){
	define('IMGURL', 'https://uat.zwmedia.com.cn/ltb_static_files/levin/icon/');
}else{
	define('IMGURL', 'https://cdn.zwmedia.com.cn/ltb_static_files/levin/icon/');
}
// 加载框架引导文件
require __DIR__ . '/../thinkphp/start.php';