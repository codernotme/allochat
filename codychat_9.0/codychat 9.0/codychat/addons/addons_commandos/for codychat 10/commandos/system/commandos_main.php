<?php
$load_addons = 'commandos';
require(__DIR__ . '/../../../system/config_addons.php');

if(mainBlocked()){
	echo boomError('error');
	die();
}

function runCommandos(){
	global $mysqli, $data, $addons;

	$content = escape($_POST['commandos']);

	$this_command = '';
	$target = '';
	$cmd = explode(' ', $content);
	if(isset($cmd[0]) && !empty($cmd[0])){
		$this_command = trim(str_ireplace($addons['custom1'], '', $cmd[0]));
	}
	if(isset($cmd[1]) && !empty($cmd[1])){
		$target = trimCommand($content, $cmd[0]);
	}
	if(empty($this_command)){
		return boomError('invalid_command');
	}
	$get_command = $mysqli->query("SELECT * FROM boom_commandos WHERE command = '$this_command' AND command_rank <= '{$data['user_rank']}' LIMIT 1");
	if($get_command->num_rows > 0){
		$command = $get_command->fetch_assoc();
		if($command['command_mode'] == 1){
			$content = str_ireplace('%me%', $data['user_name'], $command['command_output']);
		}
		else if($command['command_mode'] == 2){
			if(empty($target)){
				return boomError($lang['commandos_require_name']);
			}
			$user = userNameDetails($target);
			if(empty($user)){
				return boomError('no_user');
			}
			$content = str_ireplace(array('%me%', '%user%'), array($data['user_name'], $user['user_name']), $command['command_output']);
		}
		else {
			return boomError('error');
		}
		$content = commandosEscape($content);
		$content = trimContent($content);
		$content = wordFilter($content, 1);
		$content = textFilter($content);
		$logs = userPostChat($content);
		return boomCode(1, array('logs'=> $logs));
	}
	else {
		return boomError('invalid_command');
	}
}
if(isset($_POST['commandos']) && boomAllow($addons['addons_access'])){
	echo runCommandos();
	die();
}
?>