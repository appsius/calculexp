// BUDGET CONTROLLER
const budgetController = (function () {
	const Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function (totalIncome) {
		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function () {
		return this.percentage;
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

		deleteItem: function (type, id) {
			let ids, index;

			ids = data.allItems[type].map(function (current) {
				return current.id;
			});

			index = ids.indexOf(id);

			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},

		calculateBudget: function () {
			// calculate total income & expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// calculate budgets: income - expense
			data.budget = data.totals.inc - data.totals.exp;

			// calculate the spent income percentage
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

		calculatePercentages: function () {
			data.allItems.exp.forEach(function (cur) {
				cur.calcPercentage(data.totals.inc);
			});
		},

		getPercentages: function () {
			const allPerc = data.allItems.exp.map(function (cur) {
				return cur.getPercentage();
			});

			return allPerc;
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
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month',
	};

	const formatNumber = function (num, type) {
		let numSplit, int, dec;

		// "+" or "-" in front of number, 2 decimal points,
		// comma seperating thousands

		num = Math.abs(num);
		num = num.toFixed(2);

		numSplit = num.split('.');

		int = numSplit[0];
		if (int.length > 3) {
			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
		}

		dec = numSplit[1];

		return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
	};

	const nodeListForEach = function (list, callback) {
		for (let i = 0; i < list.length; i++) {
			callback(list[i], i);
		}
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
					'<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMStrings.expensesContainer;

				html =
					'<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// replace the placeholder text with actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

			// insert HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		deleteListItem: function (selectorID) {
			const el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
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

		displayBudget: function (obj) {
			let type;

			obj.budget > 0 ? (type = 'inc') : (type = 'exp');

			document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(
				obj.budget,
				type
			);
			document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(
				obj.totalInc,
				'inc'
			);
			document.querySelector(
				DOMStrings.expensesLabel
			).textContent = formatNumber(obj.totalExp, 'exp');

			if (obj.percentage > 0) {
				document.querySelector(DOMStrings.percentageLabel).textContent =
					obj.percentage + '%';
			} else {
				document.querySelector(DOMStrings.percentageLabel).textContent = '---';
			}
		},

		displayPercentages: function (percentages) {
			const fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

			nodeListForEach(fields, function (current, index) {
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});
		},

		displayMonth: function () {
			let now, day, month, months, year;

			now = new Date();

			day = now.getDay();
			days = [
				'Sunday',
				'Monday',
				'Tuesday',
				'Wednesday',
				'Thursday',
				'Friday',
				'Saturday',
			];

			months = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December',
			];
			month = now.getMonth();

			year = now.getFullYear();
			document.querySelector(DOMStrings.dateLabel).textContent =
				days[day] + ' ' + months[month] + ' ' + year;
		},

		changedType: function () {
			const fields = document.querySelectorAll(
				DOMStrings.inputType +
					',' +
					DOMStrings.inputDescription +
					',' +
					DOMStrings.inputValue
			);

			nodeListForEach(fields, function (cur) {
				cur.classList.toggle('red-focus');
			});

			document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
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
		document.addEventListener('keypress', function (event) {
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});
		document
			.querySelector(DOM.container)
			.addEventListener('click', ctrlDeleteItem);
		document
			.querySelector(DOM.inputType)
			.addEventListener('change', UICtrl.changedType);
	};

	const updateBudget = function () {
		// calculate budget
		budgetCtrl.calculateBudget();

		// return budget
		const budget = budgetCtrl.getBudget();

		// display budget on UI1
		UICtrl.displayBudget(budget);
	};

	const updatePercentages = function () {
		// calculate percentages
		budgetCtrl.calculatePercentages();

		// read the percentages form budget controller
		const percentages = budgetCtrl.getPercentages();

		// update UI with new percentages
		UICtrl.displayPercentages(percentages);
	};

	const ctrlAddItem = function () {
		let input, newItem;

		// get the field input data
		input = UICtrl.getInput();

		// confirms there is inputs value
		if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
			// add the item to budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 1. add the item to UI
			UICtrl.addListItem(newItem, input.type);

			// 2. clear the fields
			UICtrl.clearFields();

			// 3. calculate and update budget
			updateBudget();

			// 4. calculate and update percentages
			updatePercentages();
		}
	};

	const ctrlDeleteItem = function (event) {
		let itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID) {
			// inc-1
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			// delete item from data structure
			budgetCtrl.deleteItem(type, ID);

			// delete the item from the UI
			UICtrl.deleteListItem(itemID);

			// update and show the new budget
			updateBudget();
		}
	};

	return {
		init: function () {
			console.log('Application has started');
			UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1,
			});
			setupEventListeners();
		},
	};
})(budgetController, UIController);

controller.init();
