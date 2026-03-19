<?php
$load_addons = 'commandos';
require(__DIR__ . '/../../../system/config_addons.php');

function runCommandos(){
	global $mysqli, $data;

	$content = escape($_POST['commandos']);
	
	if(muted() || roomMuted()){
		return '';
	}
	if(checkFlood()){
		return '';
	}
	$this_command = '';
	$target = '';
	$cmd = explode(' ', $content);
	if(isset($cmd[0]) && !empty($cmd[0])){
		$this_command = trim(str_ireplace($data['custom1'], '', $cmd[0]));
	}
	if(isset($cmd[1]) && !empty($cmd[1])){
		$target = trimCommand($content, $cmd[0]);
	}
	if(empty($this_command)){
		return 2;
	}
	$get_command = $mysqli->query("SELECT * FROM boom_commandos WHERE command = '$this_command' AND command_rank <= '{$data['user_rank']}' LIMIT 1");
	if($get_command->num_rows > 0){
		$command = $get_command->fetch_assoc();
		if($command['command_mode'] == 1){
			$content = str_ireplace('%me%', $data['user_name'], $command['command_output']);
		}
		else if($command['command_mode'] == 2){
			if(empty($target)){
				return 4;
			}
			$user = nameDetails($target);
			if(empty($user)){
				return 3;
			}
			$content = str_ireplace(array('%me%', '%user%'), array($data['user_name'], $user['user_name']), $command['command_output']);
		}
		else {
			return 99;
		}
		$content = commandosEscape($content);
		$content = trimContent($content);
		$content = wordFilter($content, 1);
		$content = textFilter($content);
		userPostChat($content);
		return 1;
	}
	else {
		return 2;
	}
}
function addCommandos(){
	global $mysqli, $data;
	
	$command = escape($_POST['commandos_add_command']);
	$output = softEscape($_POST['commandos_add_output']);
	$mode = escape($_POST['commandos_add_mode']);
	$rank = escape($_POST['commandos_add_rank']);
	
	$check_exist = $mysqli->query("SELECT * FROM boom_commandos WHERE command = '$command'");
	if(empty($command) || empty($output) || empty($mode)){
		return 3;
	}
	if($check_exist->num_rows > 0){
		return 2;
	}
	if($mode != 1 && $mode != 2){
		return 99;
	}
	$mysqli->query("INSERT INTO boom_commandos (command, command_output, command_mode, command_rank) VALUES ('$command', '$output', '$mode', '$rank')");
	return 1;
}
function editCommandos(){
	global $mysqli, $data;
	
	$command = escape($_POST['commandos_edit_command']);
	$output = softEscape($_POST['commandos_edit_output']);
	$mode = escape($_POST['commandos_edit_mode']);
	$rank = escape($_POST['commandos_edit_rank']);
	$id = escape($_POST['commandos_edit_id']);
	
	$check_exist = $mysqli->query("SELECT * FROM boom_commandos WHERE command = '$command' AND id != '$id'");
	if(empty($command) || empty($output) || empty($mode)){
		return 3;
	}
	if($check_exist->num_rows > 0){
		return 2;
	}
	if($mode != 1 && $mode != 2){
		return 99;
	}
	$mysqli->query("UPDATE boom_commandos SET command = '$command', command_output = '$output', command_mode = '$mode', command_rank = '$rank' WHERE id = '$id'");
	return 1;
}
if(isset($_POST['commandos']) && boomAllow($data['addons_access'])){
	echo runCommandos();
	die();
}
else if(isset($_POST['set_commandos_access'], $_POST['set_commandos_prefix']) && boomAllow($cody['can_manage_addons'])){
	$commandos_access = escape($_POST['set_commandos_access']);
	$commandos_prefix = escape($_POST['set_commandos_prefix']);
	$mysqli->query("UPDATE boom_addons SET addons_access = '$commandos_access', custom1 = '$commandos_prefix' WHERE addons = 'commandos'");
	echo 1;
	die();
}
else if(isset($_POST['delete_commandos']) && boomAllow($cody['can_manage_addons'])){
	$delete_commandos = escape($_POST['delete_commandos']);
	$mysqli->query("DELETE FROM boom_commandos WHERE id = '$delete_commandos'");
	echo 1;
	die();
}
else if(isset($_POST['commandos_add_command'], $_POST['commandos_add_output'], $_POST['commandos_add_mode'], $_POST['commandos_add_rank']) && boomAllow($cody['can_manage_addons'])){
	echo addCommandos();
	die();
}
else if(isset($_POST['commandos_edit_command'], $_POST['commandos_edit_output'], $_POST['commandos_edit_mode'], $_POST['commandos_edit_rank'], $_POST['commandos_edit_id']) && boomAllow($cody['can_manage_addons'])){
	echo editCommandos();
	die();
}
else {
	die();
}
?>