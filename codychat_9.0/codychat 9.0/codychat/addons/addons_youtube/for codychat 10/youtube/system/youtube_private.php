<?php
$load_addons = 'youtube';
require(__DIR__ . '/../../../system/config_addons.php');

if(privateBlocked()){
	echo boomError('error');
	die();
}

function postPrivateYoutube(){
	global $data, $mysqli, $lang;
	
	$target = escape($_POST['target'], true);
	
	$user = userRelationDetails($target);
	if(!canSendPrivate($user)){
		return boomCode(99);
	}
	
	$youid = escape($_POST['id']);
	if(!preg_match('/^[A-Za-z0-9_-]{11}$/', $youid)){
		return boomError('error');
	}
	
	$content = youtubeProcess($youid);
	$logs = userPostPrivate($user, $content);
	return boomCode(1, array('logs'=> $logs));
}
if(isset($_POST['id'], $_POST['target']) && boomAllow($addons['addons_access'])){
	echo postPrivateYoutube();
	die();
}
else {
	echo boomError('error');
	die();
}
?>