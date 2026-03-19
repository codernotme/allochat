<?php
$load_addons = 'paintit';
require(__DIR__ . '/../../../system/config_addons.php');

if(privateBlocked()){
	echo boomError('error');
	die();
}

function runPaintPrivate(){
	global $mysqli, $data, $addons, $lang;
	$target = escape($_POST['target'], true);
	
	$user = userRelationDetails($target);
	if(!canSendPrivate($user)){
		return boomCode(99);
	}
	
	if(!boomAllow($addons['addons_access'])){
		return boomError('error');
	}
	if($addons['custom2'] < 1){
		return boomError('error');
	}
	
	$extension = 'png';
	$fname = encodeFileTumb($extension, $data);
	$file_name = $fname['full'];
	$file_tumb = $fname['tumb'];
	
	$img = $_POST['paint_image'];
	if(!paintSize($img)){
		return boomError('error');
	}
	$img = str_replace('data:image/png;base64,', '', $img);
    $img = imagecreatefromstring(base64_decode($img));
    if (!$img){
        return boomError('error');
    }
	$loc = __DIR__ . '/../../../upload/private/' . $file_name;
    imagepng($img, $loc);
    $info = getimagesize($loc);
    if ($info[0] > 0 && $info[1] > 0 && $info['mime']) {
		if($info['mime'] != 'image/png'){
			return boomError('error');
		}
    }
	else {
		unlink($loc);
		return boomError('error');
	}
	
	$img_path = 'upload/private/' . $file_name;
	$content = uploadProcess('image', $img_path);
	$logs = userPostPrivate($user, $content, array('file'=> $file_name, 'filetype'=> 'image'));
	return boomCode(1, array('logs'=> $logs));
}

if(isset($_POST['paint_image'], $_POST['target'])){
	echo runPaintPrivate();
	die();
}
?>