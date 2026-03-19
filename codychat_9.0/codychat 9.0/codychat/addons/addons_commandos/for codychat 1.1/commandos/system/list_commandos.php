<?php
$load_addons = 'commandos';
require_once('../../../system/config_addons.php');

function commandosTemplate($list){
	global $data;
	switch($list['command_mode']){
		case 1:
			$type = '<i class="fa fa-user"></i>';
			break;
		case 2:
			$type = '<i class="fa fa-user success"></i>';
			break;
		default:
			$type = '<i class="fa fa-user"></i>';
	}
	return '
	<div class="tab_element sub_list">
		<div class="admin_sm_content bellips">
			<span class="hpad5">' . $type . '</span> ' . $list['command'] . '
		</div>
		<div onclick="editCommandos(' . $list['id'] . ');" class="admin_sm_option">
			<i class="fa fa-edit"></i>
		</div>
		<div onclick="deleteCommandos(this,' . $list['id'] . ');" class="admin_sm_option">
			<i class="fa fa-times"></i>
		</div>
	</div>
	';
}
if(isset($_POST['list_commandos']) && boomAllow(10)){
	$listing = '';
	$get_list = $mysqli->query("SELECT * FROM boom_commandos WHERE id > 0 ORDER BY COMMAND ASC");
	if($get_list->num_rows > 0){
		while($list = $get_list->fetch_assoc()){
			$listing .= commandosTemplate($list);
		}
	}
	else {
		$listing .= emptyZone($lang['no_data']);
	}
	echo $listing;
}
?>