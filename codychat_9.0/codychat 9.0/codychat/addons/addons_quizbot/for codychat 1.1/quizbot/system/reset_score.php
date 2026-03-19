<?php
$load_addons = 'quizbot';
require_once('../../../system/config_addons.php');
?>
<div class="pad_box">
	<div class="centered_element vpad15">
		<p><?php echo $lang['want_reset_quiz']; ?></p>
	</div>
	<div>
		<div onclick="confirmQuizbotReset();" class="pop_button button_half button_left theme_btn"><?php echo $lang['yes']; ?></div>
		<div class="pop_button cancel_modal button_half default_btn button_right"><?php echo $lang['cancel']; ?></div>
		<div class="clear"></div>
	</div>
</div>

