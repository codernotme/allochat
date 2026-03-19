<?php
$load_addons = 'adnoyer';
require_once('../../../../system/config_addons.php');

if(!boomAllow($cody['can_manage_addons'])){
	die();
}
?>
<div class="pad_box">
	<div class="boom_form">
		<div class="setting_element ">
			<p class="label"><?php echo $lang['adnoyer_title']; ?></p>
			<input id="adnoyer_title" class="full_input" type="text"/>
		</div>
		<div class="setting_element ">
			<p class="label"><?php echo $lang['adnoyer_content']; ?></p>
			<textarea id="adnoyer_content" class="full_textarea large_textarea" type="text"></textarea>
		</div>
	</div>
	<button id="add_adnoyer" onclick="addAdnoyerData();" type="button" class="reg_button theme_btn"><i class="fa fa-plus"></i> <?php echo $lang['add']; ?></button>
</div>