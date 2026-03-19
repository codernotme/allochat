<?php
if(isset($_POST['search'], $_POST['name'], $_POST['type'])){
	usleep(2000000);
	$load_addons = 'superbot';
	require_once('../../../system/config_addons.php');
	if(!boomAllow($data['addons_access'])){
		die();
	}
	if(muted() || roomMuted()){
		die();
	}
	$search = escape($_POST['search']);
	$name = escape($_POST['name']);
	$type = escape($_POST['type']);
	if($name == $data['bot_name'] && $name != ''){
		$result = superbotParse(superbotReg($search));
		if($result != ''){
			postChat($data['bot_id'], $data['user_roomid'], $result);
		}
	}
}
?>