<?php
if(isset($_POST['search'], $_POST['name'], $_POST['bid'])){
	usleep(1000000);
	$load_addons = 'superbot';
	require_once('../../../system/config_addons.php');
	
	if(!boomAllow($data['addons_access'])){
		die();
	}
	
	$search = escape($_POST['search']);
	$name = escape($_POST['name']);
	$bot_id = escape($_POST['bid']);
	
	if($name == $data['bot_name'] && $bot_id == $data['bot_id']){
		$result = superbot(superbotReg($search));
		if($result != ''){
			postPrivate($data['bot_id'], $data['user_id'], $result);
			echo 1;
		}
	}
}
?>