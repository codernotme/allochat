<?php
$load_addons = 'commandos';
require(__DIR__ . '/../../../system/config_addons.php');

function addCommandos(){
	global $mysqli, $data;
	
	$command = escape($_POST['commandos_add_command']);
	$output = softEscape($_POST['commandos_add_output']);
	$mode = escape($_POST['commandos_add_mode'], true);
	$rank = escape($_POST['commandos_add_rank'], true);
	
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
	$mode = escape($_POST['commandos_edit_mode'], true);
	$rank = escape($_POST['commandos_edit_rank'], true);
	$id = escape($_POST['commandos_edit_id'], true);
	
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
if(isset($_POST['set_commandos_access'], $_POST['set_commandos_prefix']) && canManageAddons()){
	$commandos_access = escape($_POST['set_commandos_access'], true);
	$commandos_prefix = escape($_POST['set_commandos_prefix']);
	$mysqli->query("UPDATE boom_addons SET addons_access = '$commandos_access', custom1 = '$commandos_prefix' WHERE addons = 'commandos'");
	redisUpdateAddons('commandos');
	echo 1;
	die();
}
else if(isset($_POST['delete_commandos']) && canManageAddons()){
	$delete_commandos = escape($_POST['delete_commandos'], true);
	$mysqli->query("DELETE FROM boom_commandos WHERE id = '$delete_commandos'");
	echo 1;
	die();
}
else if(isset($_POST['commandos_add_command'], $_POST['commandos_add_output'], $_POST['commandos_add_mode'], $_POST['commandos_add_rank']) && canManageAddons()){
	echo addCommandos();
	die();
}
else if(isset($_POST['commandos_edit_command'], $_POST['commandos_edit_output'], $_POST['commandos_edit_mode'], $_POST['commandos_edit_rank'], $_POST['commandos_edit_id']) && canManageAddons()){
	echo editCommandos();
	die();
}
else {
	die();
}
?>