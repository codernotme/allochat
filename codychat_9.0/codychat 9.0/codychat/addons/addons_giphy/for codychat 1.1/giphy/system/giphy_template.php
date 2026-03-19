<?php 
require('../../../system/config_session.php');
?>
<div class="btable top_mod">
	<div class="bcell_mid">
		<div class="mod_select mod_selected" onclick="giphySelect(this, 1);">Gifs</div>
		<div class="mod_select" onclick="giphySelect(this, 2);">stickers</div>
	</div>
	<div class="mod_close close_modal bcell_mid">
		<i class="fa fa-times"></i>
	</div>
</div>
<div class="btable tmargin5">
	<div class="bcell_mid hpad10">
		<input class="full_input" onkeydown="startGiphySearch(event, this);" placeholder="&#xf002;" id="find_giphy" type="text"/>
	</div>
</div>
<div class="pad10">
	<div class="giphy_results mod_results" id="giphy_gifs"></div>
	<div class="giphy_results mod_results hidden" id="giphy_stickers"></div>
</div>