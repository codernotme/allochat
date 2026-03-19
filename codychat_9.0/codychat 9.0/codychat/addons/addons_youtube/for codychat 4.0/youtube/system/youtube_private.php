<?php
$load_addons = 'youtube';
require(__DIR__ . '/../../../system/config_addons.php');

if(privateBlocked()){
	echo boomCode(0);
	die();
}

function postPrivateYoutube(){
	global $data, $mysqli, $lang;
	
	$target = escape($_POST['target'], true);
	
	$youid = escape($_POST['id']);
	if(!preg_match('/^[A-Za-z0-9_-]{11}$/', $youid)){
		return boomCode(0);
	}
	
	$content = youtubeProcess($youid);
	$logs = userPostPrivate($target, $content);
	return boomCode(1, array('logs'=> $logs));
}
if(isset($_POST['id'], $_POST['target']) && boomAllow($addons['addons_access'])){
	echo postPrivateYoutube();
	die();
}
else {
	echo boomCode(0);
	die();
}
?>