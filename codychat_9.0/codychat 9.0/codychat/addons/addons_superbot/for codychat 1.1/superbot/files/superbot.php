<?php if(boomAllow($addons['addons_access'])){ ?>
<script data-cfasync="false" type="text/javascript">
var requestType = 'reg';
var superbot = '<?php echo $addons['bot_name']; ?>';
var superLow = '<?php echo strtolower($addons['bot_name']); ?>';
var superbotId = '<?php echo $addons['bot_id']; ?>';

$(document).ready(function(){

	$('#main_input').submit(function(event){
		var checkbot = $('#content').val();
		var checkbotLow = $('#content').val().toLowerCase();
		if( checkbot.match(superbot) || checkbotLow.match(superLow) ){
			$.post('addons/superbot/system/superbot_main.php', { 
				search: checkbot,
				name: superbot,
				type: requestType,
				token: utk,
				}, function(response) {

			});
		}
	});
	$('#private_input').submit(function(event){
		var uPrivate = $('#get_private').attr('value');
		var privBot = $('#message_content').val();
		if(privBot == '' || /^\s+$/.test($('#message_content').val()) ){
			event.preventDefault();
		}
		else {
			if(uPrivate == superbotId){
				$.post('addons/superbot/system/superbot_private.php', { 
					search: privBot,
					name: superbot,
					bid: uPrivate,
					token: utk,
					}, function(response) {

				});
			}
		}
	});
});
</script>
<?php } ?>