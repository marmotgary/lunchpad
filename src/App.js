import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import restaurantJson from './restaurants.json'
const axios = require("axios");
const Data = require( "./data2.js" );


// const data = new Data();
// data.getRestaurants(); //lista
// data.filterByString( "str" );
// data.filterByCategory( ["G", "+", "f" ]);
// data.filterByStringAndCategory( "str", []);

function loadData(){
    return axios.get( "https://skinfo.dy.fi/api/restaurants.json" )
    .then( response => {
        return response.data;
    });
}

class Restaurant extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {restaurant: props.restaurant}
  }

  render() {
    const restaurant = this.props.restaurant;
    // console.log(restaurant);
    if (restaurant === undefined){
      return <div></div>;
    }
    let foods = restaurant.foods;
    // console.log(foods);
    if (foods !== undefined && foods.length > 0){
      // console.log(foods);
      foods  = foods.map((food, index) =>
        <div key={index}>
          <div>{food.category}</div>
          <div>{food.name}</div>
        </div>
      );
    } else {
      foods = <div>Ei ruokaa</div>
    }
    // console.log(restaurant);
    return (
      <div className="restaurant">
        <h2>{restaurant.name}</h2>
        {foods}
      </div>
    )
  }
}

class RestaurantData extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { search: "",
    //                filters: []}
  }

  render() {
    if (!this.props.restaurants) {
      return ""
    }
    const restaurants = this.props.restaurants;
    // console.log(restaurants);
    // for(let restaurant in restaurants) {
    //   console.log(restaurant.days);
    // }
    const restaurantList = restaurants.map((restaurant, index) =>
      <Restaurant key={index} restaurant={restaurant}/>
    );
    // console.log(restaurantList);
    return <div>{restaurantList}</div>
    // return <div></div>

  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {data: null,
                  restaurants: null,
                  search: "",
                  filters: []}
    this.filter = this.filter.bind(this)
  }

  componentDidMount(){
    // this.setState({restaurants:restaurantJson})
    let data = null;
    loadData().then( res => {
        data = new Data( res );
        let restaurants = data.getRestaurants();
        this.setState({data:data, restaurants:restaurants})
    })
  }
  filter(evt) {
    const val = evt.target.value;
    let filters = this.state.filters;
    let search = this.state.search;
    if (evt.target.type == "checkbox"){
      const index = filters.indexOf(val);
      if (index > -1){
        filters.splice(index, 1)
      } else{
        filters.push(val)
      }
    }

    if (evt.target.type == "text"){
      search = val;
    }
    const restaurants = this.state.data.filterRestaurants( 0, search, filters);
    this.setState({filters:filters, search:search, restaurants:restaurants});
    console.log(0, search, filters);
    console.log(this.state.data.getRestaurants());
    // console.log(restaurants);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <input type="text" value={this.state.value} onChange={this.filter}></input>
        <input type="checkbox" value="g" onChange={this.filter}></input>
        <input type="checkbox" value="m" onChange={this.filter}></input>
        <input type="checkbox" value="+" onChange={this.filter}></input>
        <RestaurantData restaurants={this.state.restaurants}/>
      </div>
    );
  }
}

export default App;
