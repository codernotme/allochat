<?php
$load_addons = 'adnoyer';
require_once(__DIR__ . '/../../../../system/config_cron.php');

if($data['custom1'] == 0){
	die();
}
function adnoyerChatAction($list){
	global $mysqli, $data;
	$list = listThisArray($list);
	$mysqli->query("UPDATE boom_rooms SET rcaction = rcaction + 1, room_action = '" . time() . "', adnoyer_time = '" . time() . "' WHERE room_id IN ($list)");
}
function adnoyerPostChat($adnoyer, $list, $content, $custom = array()){
	global $mysqli, $data;
	$values = '';
	foreach($list as $l){
		$def = array(
			'type'=> 'adnoyer_log',
			'color'=>  escape($adnoyer['bccolor'] . ' ' . $adnoyer['bcbold']),
			'rank'=> $adnoyer['custom3'],
		);
		$c = $content[array_rand($content)];
		$post = array_merge($def, $custom);
		$values .= "('" . time() . "', '{$adnoyer['bot_id']}', '$c', '$l', '{$post['type']}', '{$post['rank']}', '{$post['color']}'),";
	}
	$values = rtrim($values, ',');
	if($values != ''){
		$mysqli->query("INSERT INTO `boom_chat` (post_date, user_id, post_message, post_roomid, type, log_rank, tcolor) VALUES $values");
		adnoyerChatAction($list);
		return true;
	}
}

mysqli_close($mysqli);

function runAdnoyer(){
	global $mysqli, $data;
	
	$prep = '';
	$list = array();
	$room_list = array();
	$adnoyer_data = $mysqli->query("SELECT boom_addons.*, boom_users.* FROM boom_addons, boom_users WHERE addons = 'adnoyer' AND boom_users.user_id = boom_addons.bot_id");
	if($adnoyer_data->num_rows > 0){
		$adnoyer = $adnoyer_data->fetch_assoc();
	}
	else {
		return false;
	}
	$mysqli->query("DELETE FROM boom_chat WHERE user_id = '{$adnoyer['bot_id']}'");
	$get_adnoyer = $mysqli->query("SELECT * FROM boom_adnoyer WHERE adnoyer_id > 0");
	if($get_adnoyer->num_rows > 0){
		while($adno = $get_adnoyer->fetch_assoc()){
			array_push($list, $adno['adnoyer_content']);
		}
	}
	else {
		return false;
	}
	
	$check_room = $mysqli->query("
	SELECT boom_rooms.room_id, boom_rooms.adnoyer_time,
	(SELECT count(post_id) FROM boom_chat WHERE post_date >= boom_rooms.adnoyer_time AND user_id != '{$adnoyer['bot_id']}' AND user_id != '{$data['system_id']}' AND post_roomid = boom_rooms.room_id) AS log_count,
	(SELECT count(user_id) FROM boom_users WHERE user_roomid = boom_rooms.room_id AND last_action >= '" . getDelay() . "') AS user_count
	FROM boom_rooms
	");
	
	$later = time() - $adnoyer['custom2'];
	
	while($room = $check_room->fetch_assoc()){
		if($room['adnoyer_time'] <= $later && $room['log_count'] >= $adnoyer['custom4'] && $room['user_count'] >= $adnoyer['custom5']){
			array_push($room_list, $room['room_id']);
		}
	}
	if(!empty($room_list) && !empty($list)){
		adnoyerPostChat($adnoyer, $room_list, $list);
	}
}

$i = 0;
$max = 3;
while($i <= $max){
	$mysqli = @new mysqli(BOOM_DHOST, BOOM_DUSER, BOOM_DPASS, BOOM_DNAME);
	runAdnoyer();
	$i++;
	mysqli_close($mysqli);
	if($i <= $max){
		sleep(15);
	}
}
die();
?>