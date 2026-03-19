<?php
$load_addons = 'giphy';
require(__DIR__ . '/../../../system/config_addons.php');

if(muted()){
	die();
}
if(checkFlood()){
	die();
}
function sendGiphyChat(){
	global $mysqli, $data;
	
	$gid = escape($_POST['id']);
	$chat = escape($_POST['chat']);
	$origin = escape($_POST['origin']);
	$type = escape($_POST['type']);
	$target = escape($_POST['target']);
	
	if(stripos($chat, $gid) === false){
		return false;
	}
	if(!preg_match('@^https?:\/\/(www\.)?media([0-9]+)?.giphy.com/([\w/_\.\%\+#\-\?:\=\&\;\(\)]*)?@ui', $origin)){
		return false;
	}
	
	$content = customChatImg($origin, $chat);
	
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
function saveGiphy(){
	global $mysqli, $data;
	$giphy_access = escape($_POST['set_giphy_access']);
	$giphy_key = escape($_POST['set_giphy_key']);
	$giphy_gifs = escape($_POST['set_giphy_gifs']);
	$giphy_stickers = escape($_POST['set_giphy_stickers']);
	if(!is_numeric($giphy_gifs) || !is_numeric($giphy_gifs) || !is_numeric($giphy_gifs)){
		return false;
	}
	$mysqli->query("UPDATE boom_addons SET addons_access = '$giphy_access', custom1 = '$giphy_key', custom2 = '$giphy_gifs', custom3 = '$giphy_stickers' WHERE addons = 'giphy'");
	return 5;
}

if(isset($_POST['origin'], $_POST['chat'], $_POST['type'], $_POST['target'], $_POST['id']) && boomAllow($data['addons_access'])){
	sendGiphyChat();
	die();
}
else if(isset($_POST['set_giphy_access'], $_POST['set_giphy_key'], $_POST['set_giphy_gifs'], $_POST['set_giphy_stickers']) && boomAllow($cody['can_manage_addons'])){
	echo saveGiphy();
	die();
}
else {
	die();
}
?>