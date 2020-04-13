// BUDGET CONTROLLER
const budgetController = (function () {
	const Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	const Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	const data = {
		allItems: {
			exp: [],
			inc: [],
		},

		totals: {
			exp: 0,
			inc: 0,
		},
	};

	return {
		addItem: function (type, des, val) {
			let newItem, ID;

			// create new ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			// compose new item based on exp&inc type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			// push it into our data structure
			data.allItems[type].push(newItem);

			// return the new item
			return newItem;
		},

		testing: function () {
			console.log(data);
		},
	};
})();

// UI CONTROLLER
const UIController = (function () {
	const DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
	};

	return {
		getInput: function () {
			return {
				type: document.querySelector(DOMStrings.inputType).value,
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: document.querySelector(DOMStrings.inputValue).value,
			};
		},
		getDOMStrings: function () {
			return DOMStrings;
		},
	};
})();

// GLOBAL APP CONTROLLER
const controller = (function (budgetCtrl, UICtrl) {
	const setupEventListeners = function () {
		const DOM = UICtrl.getDOMStrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
		document.addEventListener('keypress', function (e) {
			if (e.keyCode === 13 || e.which === 13) {
				ctrlAddItem();
			}
		});
	};

	const ctrlAddItem = function () {
		let input, newItem;

		// get the field input data
		input = UICtrl.getInput();

		// add the item to budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		// add the item to UI
		// calculate budget
		// display budget on UI
	};

	return {
		init: function () {
			console.log('Application has started');
			setupEventListeners();
		},
	};
})(budgetController, UIController);

controller.init();
