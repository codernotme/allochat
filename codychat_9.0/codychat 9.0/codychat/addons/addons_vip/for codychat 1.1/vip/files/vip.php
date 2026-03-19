<?php if($addons['custom6'] > 0){ ?>
<script data-cfasync="false" type="text/javascript">
var vipGuest = 1;
openVip = function(){
	$.post('addons/vip/system/vip_box.php', { 
		token: utk,
		}, function(response) {
			showEmptyModal(response, 460);
	});
}
vipClean = function(){
	if(user_rank > 1){
		$.post('addons/vip/system/vip_clean.php', { 
			clean_vip: 1,
			token: utk,
			}, function(response) {
		});
	}
}
vipRecover = function(){
	$.post('addons/vip/system/vip_recover.php', { 
		vip_recover: 1,
		token: utk,
		}, function(response) {
	});
}
$(document).ready(function(){
	boomAddCss('addons/vip/files/vip.css');
	<?php if(!boomAllow(2)){ ?>
	appLeftMenu('diamond', '<?php echo $lang['vip']; ?>', 'openVip();', 'vip_addons_menu');
	<?php } ?>
	cleanVip = setInterval(vipClean, 1200000);
	vipClean();
	<?php if($data['vip_end'] > time() && boomAllow(1) && !boomAllow(2)){ ?>
	vipRecover();
	<?php } ?>
});
</script>
<?php } ?>