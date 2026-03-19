<?php
$load_addons = 'voice_record';
require(__DIR__ . '/../../../system/config_addons.php');

function saveVoiceRecord(){
	global $mysqli, $data, $lang;
	$voice_access = escape($_POST['set_voice_access']);
	$voice_main = escape($_POST['set_voice_main']);
	$voice_main_time = escape($_POST['set_voice_main_time']);
	$voice_private = escape($_POST['set_voice_private']);
	$voice_private_time = escape($_POST['set_voice_private_time']);
	$mysqli->query("UPDATE boom_addons SET addons_access = '$voice_access', custom2 = '$voice_main', custom3 = '$voice_private', custom4 = '$voice_main_time', custom5 = '$voice_private_time' WHERE addons = 'voice_record'");
	return 5;
}
if(isset($_POST['set_voice_access'], $_POST['set_voice_main'], $_POST['set_voice_main_time'], $_POST['set_voice_private'], $_POST['set_voice_private_time']) && boomAllow($cody['can_manage_addons'])){
	echo saveVoiceRecord();
	die();
}
else {
	die();
}
?>