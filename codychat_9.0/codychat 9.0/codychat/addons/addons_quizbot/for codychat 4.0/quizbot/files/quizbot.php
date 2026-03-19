<?php
include(addonsLang('quizbot'));
?>
<script data-cfasync="false">

quizLeaderboard = function(){
	$.ajax({
		url: "addons/quizbot/system/leaderboard.php",
		type: "post",
		cache: false,
		dataType: 'json',
		data: { 
		},
		beforeSend: function(){
			prepareLeft(280);
		},
		success: function(response){
			showLeftPanel(response.content, 280, response.title);
		},
		error: function(){
			callError(system.error);
		}
	});
}

$(document).ready(function(){
	appLeftMenu('question-circle', '<?php echo $lang['quiz_leaderboard']; ?>', 'quizLeaderboard();');
	boomAddCss('addons/quizbot/files/quizbot.css');
});
</script>