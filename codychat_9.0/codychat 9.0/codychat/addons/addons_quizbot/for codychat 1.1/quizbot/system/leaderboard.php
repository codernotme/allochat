<?php
$load_addons = 'quizbot';
require_once('../../../system/config_addons.php');

$leader_list = '';

function quizLeader($lead, $rank){
	global $lang;
	$add_me = '';
	if(!notMe($lead['user_id'])){
		$add_me = 'noview';
	}
	return '<div class="list_element list_item drop_control user_lm_box ' . $add_me . '">
				<div class="ranking_lm">
					' . $rank . '
				</div>
				<div class="get_info user_lm_avatar" data="' . $lead['user_id'] . '">
					<img class="avatar_userlist" src="' . myavatar($lead['user_tumb']) . '"/>
				</div>
				<div class="user_lm_data username ' . $lead['user_color'] . '">
					' . $lead["user_name"] . '
				</div>
				<div class="score_lm">
					' . $lead['quiz_score'] . '
				</div>
			</div>';
}

$get_leader = $mysqli->query("SELECT * FROM boom_users WHERE quiz_score > 0 AND user_bot = 0 ORDER BY quiz_score DESC LIMIT 100");
if($get_leader->num_rows > 0){
	$rank = 1;
	while($lead = $get_leader->fetch_assoc()){
		$leader_list .= quizLeader($lead, $rank);
		$rank++;
	}
}
else {
	$leader_list .= '<div class="pad_box">' . emptyZone($lang['no_data']) . '</div>';
}
?>
<div class="quiz_leaderbox">
	<?php echo $leader_list; ?>
	<div class="clear"></div>
</div>

