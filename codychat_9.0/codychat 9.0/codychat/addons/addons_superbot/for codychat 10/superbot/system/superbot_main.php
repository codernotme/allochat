<?php
$load_addons = 'superbot';
require('../../../system/config_addons.php');

function okSuperbot($message){
	global $mysqli, $data;
	$check = $mysqli->query("SELECT post_id, post_message FROM boom_chat WHERE user_id = '{$data['user_id']}' AND post_date > '" . calSecond(2) . "'");
	if($check->num_rows > 0){
		while($c = $check->fetch_assoc()){
			if($c['post_message'] == $message){
				return true;
			}
		}
	}
}

if(mainBlocked()){
	echo boomError('error');
	die();
}

if(!boomAllow($addons['addons_access'])){
	echo boomError('error');
	die();
}
	
if(isset($_POST['search'], $_POST['name'], $_POST['type'])){
	$search = escape($_POST['search']);
	$name = escape($_POST['name']);
	$type = escape($_POST['type'], true);
	
	if(!okSuperbot($search)){
		echo boomError('error');
		die();
	}
	
	if($name == $addons['bot_name'] && $name != ''){
		$result = superbotParse(superbotReg($search));
		if($result != ''){
			botPostChat($addons['bot_id'], $data['user_roomid'], $result);
			echo boomCode(1);
		}
	}
}
?>