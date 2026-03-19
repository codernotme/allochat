<?php
$load_addons = 'youtube';
require(__DIR__ . '/../../../system/config_addons.php');

if(muted()){
	die();
}	
if(checkFlood()){
	die();
}

function postChatYoutube(){
	global $data, $mysqli, $lang;
	
	$target = escape($_POST['target']);
	$type = escape($_POST['type']);
	
	$youid = escape($_POST['id']);
	if(!preg_match('/^[A-Za-z0-9_-]{11}$/', $youid)){
		return false;
	}
	$content = linking('https://youtube.com/watch?v=' . $youid);
	if($type == 1 && !roomMuted()){
		userPostChat($content);	
	}
	else if($type == 2){
		if(!canSendPrivate($target)){
			return 20;
		}
		else {
			postPrivateContent($data['user_id'], $target, $content);
		}
	}
	else {
		return false;
	}
}
function saveYoutube(){
	global $mysqli, $data, $lang;
	$youtube_access = escape($_POST['set_youtube_access']);
	$youtube_key = escape($_POST['set_youtube_key']);
	$mysqli->query("UPDATE boom_addons SET addons_access = '$youtube_access', custom1 = '$youtube_key' WHERE addons = 'youtube'");
	return 5;
}
if(isset($_POST['id'], $_POST['type'], $_POST['target']) && boomAllow($data['addons_access'])){
	postChatYoutube();
	die();
}
else if(isset($_POST['set_youtube_access'], $_POST['set_youtube_key']) && boomAllow($cody['can_manage_addons'])){
	echo saveYoutube();
	die();
}
else {
	die();
}
?>