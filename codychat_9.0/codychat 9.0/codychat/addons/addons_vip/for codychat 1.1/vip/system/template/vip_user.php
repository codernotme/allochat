<div class="tab_element sub_list vipuserelem"  id="pvip<?php echo $boom['user_id']; ?>">
	<div class="admin_sm_avatar">
		<img class="admin_user<?php echo $boom['user_id']; ?> avatar_userlist" src="<?php echo myavatar($boom['user_tumb']); ?>"/>
	</div>
	<div class="bcell_mid vpad10">
		<p class="bold <?php echo $boom['user_color']; ?> bellpis"><?php echo $boom['user_name']; ?></p>
		<p class="text_xsmall sub_text"><?php echo vipEndingDate($boom['vip_end']); ?></p>
	</div>
	<div onclick="getProfile(<?php echo $boom['user_id']; ?>);" class="admin_edit_user admin_sm_option">
		<i class="fa fa-user-circle-o"></i>
	</div>
	<div onclick="vipCancelPlan(<?php echo $boom['user_id']; ?>);" class="admin_edit_user admin_sm_option">
		<i class="fa fa-times"></i>
	</div>
</div>