<?php
$load_addons = 'superbot';
require('../../../system/config_addons.php');

if(privateBlocked()){
	echo boomError('error');
	die();
}

if(!boomAllow($addons['addons_access'])){
	echo boomError('error');
	die();
}

if(isset($_POST['search'], $_POST['name'], $_POST['bid'])){	
	$search = escape($_POST['search']);
	$name = escape($_POST['name']);
	$bot_id = escape($_POST['bid'], true);
	
	if($name == $addons['bot_name'] && $bot_id == $addons['bot_id']){
		$result = superbot(superbotReg($search));
		if($result != ''){
			botPostPrivate($addons['bot_id'], $data['user_id'], $result);
			echo boomCode(1);
		}
	}
}
?>