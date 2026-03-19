<?php
if($boom['status'] == 'completed'){
	$tag = '<i class="fa fa-check-circle success"></i>';
}
else {
	$tag = '<i class="fa fa-exclamation-triangle warn"></i>';
}
?>
<div onclick="vipDetails(<?php echo $boom['id']; ?>);" class="btable list_element sub_list add_cursor">
	<div class="bcell_mid pad10">
		<p class="bold"><?php echo vipPlanName($boom['plan']); ?></p>
		<p class="text_xsmall sub_text"><?php echo vipDate($boom['vdate']); ?></p>
		<p class="text_xsmall sub_text"><?php echo $boom['price']; ?> <?php echo $boom['currency']; ?></p>
	</div>
	<div class="bcell_mid admin_sm_option">
		<?php echo $tag; ?>
	</div>
</div>