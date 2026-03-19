<?php
if(boomAllow($addons['addons_access'])){
	require(addonsLang('commandos'));
}
?>
<?php if(boomAllow($addons['addons_access'])){ ?>
<script data-cfasync="false">

$(document).ready(function(){
	$('#main_input').submit(function(event){
		var commandos = $('#content').val();
		if(commandos.match("^<?php echo $addons['custom1']; ?>") ){
			chatInput();
			$.ajax({
				url: "addons/commandos/system/commandos_main.php",
				type: "post",
				cache: false,
				dataType: 'json',
				data: { commandos: commandos},
				success: function(response){
					if(response.code == 1){
						appendSelfChatMessage(response.logs);
					}
					else if(response.code == 2){
						callError(system.invalidCommand);
					}
					else if(response.code == 3){
						callError(system.noUser);
					}
					else if(response.code == 4){
						callError('<?php echo $lang['commandos_require_name']; ?>');
					}
					else{
						callError(system.error);
					}
				},
				error: function(){
					callError(system.error);
				}
			});
			event.stopImmediatePropagation();
			return false;
		}
	});

});

</script>
<?php } ?>