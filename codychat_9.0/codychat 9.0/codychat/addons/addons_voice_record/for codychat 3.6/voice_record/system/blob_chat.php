<?php
$load_addons = 'voice_record';
require(__DIR__ . '/../../../system/config_addons.php');

function runMainRecorder(){
	global $mysqli, $data, $lang;

	if(!mainVoiceRecord()){
		return 0;
	}
	if(muted() || roomMuted()){ 
		return 0;
	}
	if(checkFlood()){
		return 0;
	}
	if (isset($_FILES["file"])){
		ini_set('memory_limit','128M');
		$info = pathinfo($_FILES["file"]["name"]);
		$extension = 'mp3';
		$origin = escape(filterOrigin($info['filename']) . '.' . $extension);
		if ( fileError() ){
			return 2;
		}
		else if (isMusic($extension)){
			$file_name = encodeFile($extension);
			boomMoveFile('upload/chat/' . $file_name);
			$myfile = $data['domain'] . "/upload/chat/" . $file_name;
			$myfile =  musicProcess($myfile, $lang['voice_message']);
			userPostChatFile($myfile, $file_name, 'music');
			return 5;
		}
		else {
			return 1;
		}
	}
	else {
		return 1;
	}
}
function runPrivateRecorder(){
	global $mysqli, $data, $lang;
	
	if(!privateVoiceRecord()){
		return 0;
	}
	if(muted()){ 
		return 0;
	}
	if(checkFlood()){
		return 0;
	}
	if(!isset($_POST['target'])){
		return 2;
	}

	$target = escape($_POST['target']);
	if(!canSendPrivate($target)){
		return 2;
	}
	if (isset($_FILES["file"])){
		$info = pathinfo($_FILES["file"]["name"]);
		$extension = 'mp3';
		$origin = escape(filterOrigin($info['filename']) . '.' . $extension);
		if ( fileError() ){
			return 0;
		}
		$file_name = encodeFile($extension);	
		if (isMusic($extension)){
			boomMoveFile('upload/private/' . $file_name);
			$myfile = $data['domain'] . "/upload/private/" . $file_name;
			$myfile =  musicProcess($myfile, $lang['voice_message']);
			userPostPrivateFile($myfile, $target, $file_name, 'music');
			return 5;
		}
		else {
			return 1;
		}
	}
	else {
		return 1;
	}
}
if(isset($_POST['private'])){
	echo runPrivateRecorder();
	die();
}
else {
	echo runMainRecorder();
	die();
}
?>