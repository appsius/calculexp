// BUDGET CONTROLLER
const budgetController = (function () {
	//
})();

// UI CONTROLLER
const UIController = (function () {
	//
})();

// GLOBAL APP CONTROLLER
const controller = (function (budgetCtrl, UICtrl) {
	const ctrlAddItem = function () {
		// get the field input data
		// add the item to budget controller
		// add the item to UI
		// calculate budget
		// display budget on UI

		console.log('It works...');
	};

	document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

	document.addEventListener('keypress', function (e) {
		if (e.keyCode === 13 || e.which === 13) {
			ctrlAddItem();
		}
	});
})(budgetController, UIController);
