<?php
$load_addons = 'youtube';
require(__DIR__ . '/../../../system/config_addons.php');

if(mainBlocked()){
	return boomError('error');
}

function postMainYoutube(){
	global $data, $mysqli, $lang;
	
	$youid = escape($_POST['id']);
	if(!preg_match('/^[A-Za-z0-9_-]{11}$/', $youid)){
		return boomError('error');
	}
	$content = youtubeProcess($youid);
	$logs = userPostChat($content);	
	return boomCode(1, array('logs'=> $logs));
}
if(isset($_POST['id']) && boomAllow($addons['addons_access'])){
	echo postMainYoutube();
	die();
}
else {
	echo boomError('error');
	die();
}
?>