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

	const calculateTotal = function (type) {
		let sum = 0;
		data.allItems[type].forEach(function (cur) {
			sum += cur.value;
		});
		data.totals[type] = sum;
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
		budget: 0,
		percentage: -1,
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

		calculateBudget: function () {
			// calculate total income & expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// calculate budgets: income - expense
			data.budget = data.totals.inc - data.totals.exp;

			// calculate the spent income percentage
			if (data.totalInc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

		getBudget: function () {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage,
			};
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
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
	};

	return {
		getInput: function () {
			return {
				type: document.querySelector(DOMStrings.inputType).value,
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
			};
		},

		addListItem: function (obj, type) {
			let html, newHtml, element;

			// create HTML string with placeholder text
			if (type === 'inc') {
				element = DOMStrings.incomeContainer;

				html =
					'<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMStrings.expensesContainer;

				html =
					'<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// replace the placeholder text with actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			// insert HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		clearFields: function () {
			let fields, fieldsArr;

			fields = document.querySelectorAll(
				DOMStrings.inputDescription + ', ' + DOMStrings.inputValue
			);

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function (current, index, array) {
				current.value = '';
			});

			fieldsArr[0].focus();
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

	const updateBudget = function () {
		// calculate budget
		budgetCtrl.calculateBudget();

		// return budget
		const budget = budgetCtrl.getBudget();

		// display budget on UI1
		console.log(budget);
	};

	const ctrlAddItem = function () {
		let input, newItem;

		// get the field input data
		input = UICtrl.getInput();

		// confirms there is inputs value
		if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
			// add the item to budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// add the item to UI
			UICtrl.addListItem(newItem, input.type);

			// clear the fields
			UICtrl.clearFields();

			// calculate and update budget
			updateBudget();
		}
	};

	return {
		init: function () {
			console.log('Application has started');
			setupEventListeners();
		},
	};
})(budgetController, UIController);

controller.init();
