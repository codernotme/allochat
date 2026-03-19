<?php if(boomAllow($addons['addons_access']) && ($addons['custom2'] == 1 || $addons['custom3'] == 1)){ ?>
<script data-cfasync="false">
URL = window.URL || window.webkitURL;

$(document).ready(function(){
	
	let recordingIsActive = false;
	let remainingTime = 0;
	let gumStream;
	let recorder;
	let input;
	let AudioContext = window.AudioContext || window.webkitAudioContext;
	let audioContext;
	
	<?php if($addons['custom2'] == 1){ ?>
	function blinkChat() {
		$('#recording_chat').delay(400).fadeTo(300, 0.2).delay(400).fadeTo(300, 1, blinkChat);
	}
	<?php } ?>
	<?php if($addons['custom3'] == 1){ ?>
	function blinkPrivate() {
		$('#recording_private').delay(400).fadeTo(300, 0.2).delay(400).fadeTo(300, 1, blinkPrivate);
	}
	<?php } ?>
	
	function voiceRecord(type, recTimer) {
		
		recorder = undefined;
		const constraints = {audio: true, video: false};
		
		navigator.mediaDevices.getUserMedia(constraints).then(stream => {
			if (recordingIsActive) return false;
			recordingIsActive = true;
			audioContext = new AudioContext();
			gumStream = stream;
			input = audioContext.createMediaStreamSource(stream);
			
			recorder = new WebAudioRecorder(input, {
				workerDir: "addons/voice_record/files/",
				encoding: 'mp3',
				numChannels: 2,
				onEncoderLoading: (recorder, encoding) => {
				},
				onEncoderLoaded: (recorder, encoding) => {
				}
			});
			
			recorder.onComplete = (recorder, blob) => {
				var formData = new FormData();
				formData.append('file', blob);
				formData.append('token', utk);
				<?php if($addons['custom3'] == 1){ ?>
				if(type == 'private'){
					formData.append('target', $('#get_private').attr('value'));
					formData.append('private', 1);
				}
				<?php } ?>
				$.ajax('addons/voice_record/system/blob_chat.php', {
					method: "POST",
					data: formData,
					processData: false,
					contentType: false,
					success: function (response) {
						if(response == 0){
							callSaved(system.error, 3);
						}
						if(response == 1){
							callSaved(system.wrongFile, 3);
						}
						if(response == 2){
							callSaved(system.cannotContact, 3);
						}
						$('#recording_' + type + '_spin').replaceWith('<i class="fa fa-microphone" id="record_' + type + '"></i>');
					},
					error: function () {
					}
				});
			};
			
			recorder.setOptions({
				timeLimit: recTimer,
				encodeAfterRecord: true,
				mp3: {bitRate: 96}
			});
			
			recorder.startRecording();
			
			if (recTimer !== 0) {
				const time_callback = _RemainingTime => {
					$('#' + type + '_counter').html(_RemainingTime);
					if (_RemainingTime === 0 && recordingIsActive) {
						stopRecording(type);
					}
				};
				voiceTimer(recTimer, time_callback);
			}
			
			$('#record_' + type).replaceWith('<i class="record-circle fa fa-circle" id="recording_' + type + '"><span id="' + type + '_counter" class="counter_text"></span></i>');
			<?php if($addons['custom2'] == 1){ ?>
			if(type == 'chat'){
				blinkChat();
			}
			<?php } ?>
			<?php if($addons['custom3'] == 1){ ?>
			if(type == 'private'){
				blinkPrivate();
			}
			<?php } ?>

		}).catch((errors) => {
			console.log(errors);
			alert('Please allow microphone access!');
		});

	}
	function stopRecording(type) {
		remainingTime = 0;
		recordingIsActive = false;
		$('#recording_' + type).replaceWith('<i class="fa fa-spinner fa-spin fa-fw" id="recording_' + type + '_spin"></i>');
		gumStream.getAudioTracks()[0].stop();
		recorder.finishRecording();
	}
	function voiceTimer(seconds, cb) {
		remainingTime = seconds;
		setTimeout(() => {
			cb(remainingTime);
			if (remainingTime > 0) {
				voiceTimer(remainingTime - 1, cb);
			}
		}, 1000);
	}		

	<?php if($addons['custom2'] == 1){?>
	$('<div class="input_item main_item base_main"><i class="fa fa-microphone record" id="record_chat"></i></div>').insertAfter('#emo_item');
	$(document).on("click", "#record_chat", () => voiceRecord('chat', <?php echo $addons['custom4']; ?>));
	$(document).on("click", "#recording_chat", () => stopRecording('chat'));
	<?php }?>
	<?php if($addons['custom3'] == 1){?>
	$('<div class="input_item main_item base_main"><i class="fa fa-microphone record" id="record_private"></i>').insertAfter('#emo_item_priv');
	$(document).on("click", "#record_private", () => voiceRecord('private', <?php echo $addons['custom5']; ?>));
	$(document).on("click", "#recording_private", () => stopRecording('private'));
	<?php } ?>
	
	boomAddCss('addons/voice_record/files/voice_record.css');
	
});
</script>
<script data-cfasync="false" src="addons/voice_record/files/WebAudioRecorder.min.js"></script>
<?php } ?>