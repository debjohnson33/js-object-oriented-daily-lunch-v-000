let store = { customers: [], meals: [], deliveries: [], employers: [] };

let customerId = 0;
let mealId = 0;
let deliveryId = 0;
let employerId = 0;

class Customer {
	constructor(name, employer = {} ) {
		this.name = name;
		this.id = ++customerId;
		this.employerId = employer.id
		store.customers.push(this);
	}

	meals() {
		return this.deliveries().map((delivery) => {
			return delivery.meal();
		})
	}

	deliveries() {
		return store.deliveries.filter(delivery => {
			return delivery.customerId === this.id
		})
	}

	totalSpent() {
		return this.meals().reduce(function(sum, meal) {
			return sum + meal.price	}, 0)
	}
}

class Delivery {
	constructor(meal = {}, customer = {}) {
		this.mealId = meal.id;
		this.customerId = customer.id;
		this.id = ++deliveryId;
		store.deliveries.push(this);
	}
	
	meal() {
		return store.meals.find(meal => {
			return meal.id === this.mealId;
		})
	}

	customer() {
		return store.customers.find(customer => {
			return customer.id === this.customerId;
		})
	}
}

class Meal {
	constructor(title, price) {
		this.title = title;
		this.price = price;
		this.id = ++mealId;
		store.meals.push(this);
	}

	deliveries() {
		return store.deliveries.filter(delivery => {
			return delivery.mealId === this.id;
		})
	}

	customers() {
		return this.deliveries().map(delivery => {
			return delivery.customer();
		})
	}

	static byPrice(){
     	return store.meals.sort((meal) => { return meal.price });
 	}
}

class Employer {
	constructor(name) {
		this.name = name;
		this.id = ++employerId;
		store.employers.push(this);
	}

	mealTotals() {
		let allMeals = this.deliveries().map((delivery) => {
			return delivery.meal();
		})

		let summaryObject = {};
		allMeals.forEach(function(meal) {
			summaryObject[meal.id] = 0;
		})
		allMeals.forEach(function(meal){
			summaryObject[meal.id] += 1;
		})
		return summaryObject;
	}

	employees() {
		return store.customers.filter((customer) => {
			return customer.employerId == this.id;
		})
	}

	deliveries() {
		let allDeliveries = this.employees().map((employee) => {
			return employee.deliveries()
		})
		let merged = [].concat.apply([], allDeliveries);
		return merged;
	}

	meals(){
		let allMeals = this.deliveries().map((delivery) => {
			return delivery.meal()
		})
		let uniqueMeals = [...new Set(allMeals)]
		return uniqueMeals;
	}
}