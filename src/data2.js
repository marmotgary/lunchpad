const axios = require("axios");

module.exports = class Data{
	constructor( data ){
		let categories = Object.getOwnPropertyNames( data );
		this.restaurants = [];
		//let index = 0;
		categories.forEach( element => {
			//Single restaurant from API.
			let e = data[ element ];
			if( e.days !== null ){
				//For supporting many days
				//this.restaurants.push( [] )
				//"Reflection" is used because objects are not in array and keys are unknown;
				let days = Object.getOwnPropertyNames( e.days );

				let restaurant = null;
				//For multiple days, return at the bottom keeps it for one-day only for this prototype
				days.forEach( d => {
					let day = e.days[ d ];
					restaurant = {};
					restaurant.name = e.name;
					restaurant.link = e.link;
					restaurant.hasStudentDiscounts = e.student_discounts;
					restaurant.date = d;
					restaurant.startTime = day.lunch_times.start;
					restaurant.endTime = day.lunch_times.end;

					restaurant.foods = [];
					day.foods.forEach( food => {
						let f = {};
						f.name = food.title_fi;
						f.description = food.description;
						f.diet = food.diet;
						f.category = food.category;
						restaurant.foods.push( f );
					})
					//Just todays data "break"
					return;
				});
				if( restaurant != null )
					this.restaurants.push( restaurant );
					//For supporting many days
					//this.restaurants[ index++ ].push( restaurant );
			}
		})
	}

	//Returns array of all restaurants.
	getRestaurants(){
		return this.restaurants;
	}

	//Returns filtered array of restaurants. Day is not yet implemented.
	//filterStr filters food name by users input
	//filterCategories filter by things like diets.
	filterRestaurants( day, filterStr = "", filterCategories = null ){
		if( filterStr !== "" || filterCategories !== null ){
			// Make a deep copy
			const filtered = JSON.parse(JSON.stringify(this.restaurants))
			filtered.forEach( restaurant => {
				restaurant.foods = restaurant.foods.filter( food => {
					//Indicates if particular food fits in filter.
					let fitting = 1;
					if( filterStr !== "" ){
						fitting = food.name.toLowerCase().includes( filterStr.toLowerCase()) ? 1 : 0;
					}

					if( filterCategories !== null && fitting !== 0 ){
						for (let i = 0; i < filterCategories.length; i++) {
							let filter = filterCategories[i];
							fitting = food.diet.toLowerCase().includes( filter.toLowerCase()) ? 1 : 0;
							console.log(food.name);
							if( fitting === 0 ){
								console.log(food.name);
								break;
							}
						}
					}
					return fitting;
				})
			})
			//Moves restaurants with empty lists to the end
			filtered.sort( ( a, b ) => {
				if( a.foods.length === 0 )
					return 1
				return 0
			})
			return filtered;
		}
		return this.restaurants;
	}
}
