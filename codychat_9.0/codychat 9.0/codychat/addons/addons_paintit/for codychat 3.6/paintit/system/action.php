<?php
$load_addons = 'paintit';
require(__DIR__ . '/../../../system/config_addons.php');

function paintSize($img){
	global $data;
    try{
        $size = ((strlen($img) * 3 / 4) / 1024 ) / 1024;
		if($size > $data['file_weight']){
			return false;
		}
		else {
			return true;
		}
    }
    catch(Exception $e){
        return false;
    }
}

function runPaintMain(){
	global $data, $mysqli, $lang;
	
	if(!boomAllow($data['addons_access'])){
		return 0;
	}
	if(checkFlood()){
		return 0;
	}
	if($data['custom1'] < 1){
		return 0;
	}
	if(muted() || roomMuted()){
		return 0;
	}

	$extension = 'png';
	$fname = encodeFileTumb($extension, $data);
	$file_name = $fname['full'];
	$file_tumb = $fname['tumb'];
	
	$img = $_POST['paint_image'];
	if(!paintSize($img)){
		return 0;
	}
	$img = str_replace('data:image/png;base64,', '', $img);
    $img = imagecreatefromstring(base64_decode($img));
    if (!$img){
        return 0;
    }
	$loc = __DIR__ . '/../../../upload/chat/' . $file_name;
    imagepng($img, $loc);
    $info = getimagesize($loc);
    if ($info[0] > 0 && $info[1] > 0 && $info['mime']) {
		if($info['mime'] != 'image/png'){
			return 0;
		}
    }
	else {
		unlink($loc);
		return 0;
	}

	$img_path = $data['domain'] . '/upload/chat/' . $file_name;
	$myimage = linking($img_path);
	userPostChatFile($myimage, $file_name, 'image');
	return 1;
}
function runPaintPrivate(){
	global $data, $mysqli, $lang;
	$target = escape($_POST['target']);
	
	if(!boomAllow($data['addons_access'])){
		return 0;
	}
	if(checkFlood()){
		return 0;
	}
	if($data['custom2'] < 1){
		return 0;
	}
	if(muted()){
		return 0;
	}
	if(!canSendPrivate($target)){
		return 5;
	}
	
	$extension = 'png';
	$fname = encodeFileTumb($extension, $data);
	$file_name = $fname['full'];
	$file_tumb = $fname['tumb'];
	
	$img = $_POST['paint_image'];
	if(!paintSize($img)){
		return 0;
	}
	$img = str_replace('data:image/png;base64,', '', $img);
    $img = imagecreatefromstring(base64_decode($img));
    if (!$img){
        return 0;
    }
	$loc = __DIR__ . '/../../../upload/private/' . $file_name;
    imagepng($img, $loc);
    $info = getimagesize($loc);
    if ($info[0] > 0 && $info[1] > 0 && $info['mime']) {
		if($info['mime'] != 'image/png'){
			return 0;
		}
    }
	else {
		unlink($loc);
		return 0;
	}
	
	$img_path = $data['domain'] . '/upload/private/' . $file_name;
	$myimage = linking($img_path);
	userPostPrivateFile($myimage, $target, $file_name, 'image');
	return 1;
}




if(isset($_POST['paint_image'], $_POST['type'], $_POST['target'])){
	
	$type = escape($_POST['type']);
	if($type == 1){
		echo boomCode(runPaintMain());
		die();
	}
	else if($type == 2){
		echo boomCode(runPaintPrivate());
		die();
	}
	else {
		echo boomCode(0);
		die();
	}
}

if(isset($_POST['set_paint_access'], $_POST['set_paint_main'], $_POST['set_paint_private'])){
	if(!boomAllow($cody['can_manage_addons'])){
		die();
	}
	$paint_access = escape($_POST['set_paint_access']);
	$paint_main = escape($_POST['set_paint_main']);
	$paint_private = escape($_POST['set_paint_private']);
	$mysqli->query("UPDATE boom_addons set addons_access = '$paint_access', custom1 = '$paint_main', custom2 = '$paint_private' WHERE addons = 'paintit' ");
	echo 5;
}

?>