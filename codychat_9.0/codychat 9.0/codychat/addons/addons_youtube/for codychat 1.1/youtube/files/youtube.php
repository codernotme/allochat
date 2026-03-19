<?php if(boomAllow($addons['addons_access'])){ ?>
<script data-cfasync="false" type="text/javascript">

var snippet = 'snippet';
var youtubeLimit = 16;
var youtubeTemplate = '';

// define youtube content templates

getYoutube = function(){
	hideEmoticon();
	if(youtubeTemplate == ''){
		$.post('addons/youtube/system/youtube_template.php', {
			token: utk,
			}, function(response) {
				showEmptyModal(response, 400);
				youtubeTemplate = response;
		});
	}
	else {
		showEmptyModal(youtubeTemplate, 400);
	}
}
youtubeMenuTemplate = function(){
	return '<div class="input_item main_item sub_main main_hide sub_options" onclick="getYoutube();"><i class="fa fa-youtube input_icon bblock"></i></div>';
}
youtubeNoDataTemplate = function(){
	return '<div class="pad_box"><p class="centered_element text_med sub_text">'+system.noResult+'</p></div>';
}
youtubeItemTemplate = function(youId, youTitle, youTumb){
	ytmp = '';
	ytmp += '<div onclick="sendYoutube(\''+youId+'\');" class="btable you_result">';
	ytmp += '<div class="bcell pad5">';
	ytmp += '<img class="you_tumb" src="'+youTumb+'" autoplay loop/>';
	ytmp += '<div class="you_text"><p class="bold">'+youTitle+'</p></div>';
	ytmp += '</div>';
	ytmp += '</div>';
	return ytmp;
}

startYoutubeSearch = function(event, item){
	var youtubeContent = $(item).val();
	if(event.keyCode == 13 && event.shiftKey == 0){
		if (/^\s+$/.test(youtubeContent) || youtubeContent == ''){
			return false;
		}
		else {
			youtubeSearch(youtubeContent);
		}
	}
}
sendYoutube = function(yid){
	hideModal();
	$.post('addons/youtube/system/action.php', {
		id: yid,
		token: utk,
		}, function(response) {
	});	
}
youtubeSearch = function(event, item){
	if(event.keyCode == 13 && event.shiftKey == 0){
		var youtubeContent = $(item).val();
		$('#find_youtube').val('');
		if (/^\s+$/.test(youtubeContent) || youtubeContent == ''){
			return false;
		}
		else{
			$.ajax({
				url: 'https://www.googleapis.com/youtube/v3/search',
				type: 'GET',
				dataType: 'json',
				data: { part: 'snippet,id', q: youtubeContent, maxResults: 20, type:'video', key:'<?php echo $addons['custom1']; ?>'},
			})
			.done(function(data) { 
				if (data.pageInfo.totalResults > 0 && data.pageInfo.resultsPerPage > 0) {
					$('#youtube_results').html('');
					$('#youtube_results').scrollTop(0);
					for (var i = 0; i < data.items.length; i++) {
						$('#youtube_results').append(youtubeItemTemplate(data.items[i].id.videoId, data.items[i].snippet.title, data.items[i].snippet.thumbnails.medium.url));	
					}
				}
				else{
				$('#youtube_result').html(youtubeNoDataTemplate());
				}
			})
			.fail(function() {
				return false;
			})
		}
	}
}

$(document).ready(function(){
	$(youtubeMenuTemplate()).insertBefore('#main_input_box');
	boomAddCss('addons/youtube/files/youtube.css');
});

</script>
<?php } ?>