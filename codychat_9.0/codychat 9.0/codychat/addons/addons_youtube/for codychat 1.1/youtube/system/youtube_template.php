<?php 
require('../../../system/config_session.php');
?>
<div class="btable top_mod">
	<div class="bcell_mid">
		<div class="mod_select1"><i class="fa fa-youtube"></i> Youtube</div>
	</div>
	<div class="mod_close close_modal bcell_mid">
		<i class="fa fa-times"></i>
	</div>
</div>
<div class="btable tmargin5">
	<div class="bcell_mid hpad10">
		<input class="full_input" onkeydown="youtubeSearch(event, this);" placeholder="&#xf002;" id="find_youtube" type="text"/>
	</div>
</div>
<div class="pad10">
	<div class="giphy_results mod_results" id="youtube_results"></div>
</div>