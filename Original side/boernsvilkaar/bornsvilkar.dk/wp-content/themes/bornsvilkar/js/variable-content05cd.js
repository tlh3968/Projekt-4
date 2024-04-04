function updateVariableContent(amount, frequency) {
	var toShow = jQuery('.of-variable-content[data-amount="'+amount+'"][data-frequency="'+frequency+'"');
	if (toShow.length == 0) {
		toShow = jQuery('.of-variable-content[data-amount="default"]');
	}
	jQuery('.of-variable-content').hide();
	toShow.show();
}

window.addEventListener('message', function (event) {
	if (event.data.state === 'inputsChanged') {
		var amount = event.data.amount;
		var type = event.data.paymentType;
		if (type == 'Recurring') {
			type = 'agreement';
		} else {
			type = 'payment';
		}
		updateVariableContent(amount, type);
	}
});
var u = new URL(window.location.href);
if (u.searchParams.has('pre_amount')) {
	updateVariableContent(u.searchParams.get('pre_amount'), u.searchParams.get('pre_method'));
}

jQuery(document).on('change', 'form.donation', function() {
	var values = jQuery(this).serializeArray();
	var selected = {};
	values.forEach(function(obj) {
		if (obj.name.startsWith("input_")) {
			if (!isNaN(obj.value)) {
				if (!selected.amount) {
					selected.amount = obj.value;
				}
			}
			if (obj.value == 'agreement' || obj.value == 'payment') {
				selected.method = obj.value;
			}
		}
	});
	if (selected.amount && selected.method) {
		updateVariableContent(selected.amount, selected.method)
	}
});