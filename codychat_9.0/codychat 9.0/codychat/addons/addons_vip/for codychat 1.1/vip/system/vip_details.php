<?php
$load_addons = 'vip';
require_once('../../../system/config_addons.php');

if(!isset($_POST['tdetails'])){
	die();
}
$order = escape($_POST['tdetails']);
$get_order = $mysqli->query("
SELECT *,
(SELECT user_name FROM boom_users WHERE user_id = userid) as buyer,
(SELECT user_name FROM boom_users WHERE user_id = userp) as processor
FROM vip_transaction
WHERE id = '$order' 
LIMIT 1
");
if($get_order->num_rows < 1){
	echo 0;
	die();
}
$result = $get_order->fetch_assoc();
if(empty($result['buyer'])){
	$result['buyer'] = 'N/A';
}
if(empty($result['processor'])){
	$result['processor'] = 'N/A';
}
?>
<div class="btable">
	<div class="bcell_mid">
	</div>
	<div class="modal_top_element bcell_mid close_modal">
		<i class="fa fa-times"></i>
	</div>
</div>
<div class="hpad15 bpad15">
	<div>
		<div class="list_element vpad10">
			<p class="text_small bold">Buyer</p>
			<p class="sub_text text_small"><?php echo $result['buyer']; ?></p>
		</div>
		<?php if($result['userp'] != ''){ ?>
		<div class="list_element vpad10">
			<p class="text_small bold">Process by</p>
			<p class="sub_text text_small"><?php echo $result['processor']; ?></p>
		</div>
		<?php } ?>
		<div class="list_element vpad10">
			<p class="text_small bold">Purchase description</p>
			<p class="sub_text text_small"><?php echo vipPlanName($result['plan']); ?></p>
		</div>
		<div class="list_element vpad10">
			<p class="text_small bold">Purchase price</p>
			<p class="sub_text text_small"><?php echo $result['price']; ?> <?php echo $result['currency']; ?></p>
		</div>
		<div class="list_element vpad10">
			<p class="text_small bold">Order number</p>
			<p class="sub_text text_small"><?php echo $result['order_id']; ?></p>
		</div>
		<div class="list_element vpad10">
			<p class="text_small bold">Invoice number</p>
			<p class="sub_text text_small"><?php echo $result['invoice']; ?></p>
		</div>
		<div class="list_element vpad10">
			<p class="text_small bold">Account id</p>
			<p class="sub_text text_small"><?php echo $result['email']; ?></p>
		</div>
		<div class="list_element vpad10">
			<p class="text_small bold">Payment source</p>
			<p class="sub_text text_small"><?php echo $result['gateaway']; ?></p>
		</div>
		<div class="list_element vpad10">
			<p class="text_small bold">Transaction status</p>
			<p class="sub_text text_small"><?php echo $result['status']; ?></p>
		</div>
		<div class="list_element vpad10">
			<p class="text_small bold">Transaction date</p>
			<p class="sub_text text_small"><?php echo vipDate($result['vdate']); ?></p>
		</div>
	</div>
</div>