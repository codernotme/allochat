<?php
include(addonsLang('quizbot'));
?>
<script data-cfasync="false">
var quizbotVersion = <?php echo $setting['version']; ?>;

quizLeaderboard = function(){
	$.ajax({
		url: "addons/quizbot/system/leaderboard.php",
		type: "post",
		cache: false,
		dataType: 'json',
		data: { 
		},
		beforeSend: function(){
			prepareLeft(380);
		},
		success: function(response){
			showLeftPanel(response.content, 380, response.title);
		}
	});
}

$(document).ready(function(){
	if(quizbotVersion > 6){
		appLeadMenu('addons/quizbot/files/top_quiz.svg', '<?php echo $lang['quiz_leaderboard']; ?>', 'quizLeaderboard();');
	}
	else {
		appLeftMenu('question-circle', '<?php echo $lang['quiz_leaderboard']; ?>', 'quizLeaderboard();');
	}	
	boomAddCss('addons/quizbot/files/quizbot.css');
});
</script>