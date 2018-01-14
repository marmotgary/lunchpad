import React, { Component } from 'react';
import './App.css';
import Cookies from 'universal-cookie';
const axios = require("axios");
const Data = require( "./data.js" );

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

// Component for a single restaurant
const Restaurant = (props) => {
    const restaurant = props.restaurant;
    // Error correction
    if (restaurant === undefined){
      return <div></div>;
    }
    let foods = restaurant.foods;
    if (foods !== undefined && foods.length > 0){
      foods =foods.filter(function(food) {
        if (food.name == "") {
          return false;
        }
        return true;
      }).map((food, index) =>
        <div className="text-left mt-2" key={index}>
          <div className="category">{food.category}</div>
          <div className="food">{food.name} {(food.diet !== "" ? (food.diet) : '')}</div>
        </div>
      );
    } else {
      foods = <div>Ei ruokaa</div>
    }
    return (
      <div className="card mx-2 my-2 restaurant col-lg-5 col-xl-3">
        <h2 className="card-title restaurant"><a target="_blank" href={restaurant.link}>{restaurant.name}</a></h2>
        {foods}
      </div>
    )
}

// Component which helds all of the Restaurant components
const RestaurantData = (props) => {
    if (!props.restaurants) {
      return ""
    }
    const restaurantList = props.restaurants.map((restaurant, index) =>
      <Restaurant key={index} restaurant={restaurant}/>
    );
    return <div className="row justify-content-center" id="google_translate_element">{restaurantList}</div>
}

class App extends Component {
  constructor(props) {
    let cookies = new Cookies();
    let filters = cookies.get("filters");
    filters = filters === undefined ? [] : filters;
    super(props)
    this.state = {data: null,
                  restaurants: null,
                  search: "",
                  filters: filters,
                  cookies: cookies}
    this.filter = this.filter.bind(this);
  }

  componentDidMount(){
    // this.setState({restaurants:restaurantJson})
    let data = null;
    loadData().then( res => {
        data = new Data( res );
        let restaurants = data.getRestaurants();
        this.setState({data:data, restaurants:restaurants});
        console.log(restaurants);
        this.filter();
    })
  }
  filter(evt=null) {
    let filters = this.state.filters;
    let search = this.state.search;

    if (evt == null){
      // Filters loaded from cookies
      const restaurants = this.state.data.filterRestaurants( 0, search, filters);
      this.setState({filters:filters, search:search, restaurants:restaurants});
      return;
    }
    // Update filters or search
    const val = evt.target.value;
    if (evt.target.type === "checkbox"){
      const index = filters.indexOf(val);
      if (index > -1){
        filters.splice(index, 1)
      } else{
        filters.push(val)
      }
    }

    if (evt.target.type === "text"){
      search = val;
    }
    console.log(search, filters);
    this.state.cookies.set('filters', filters, {path:'/'});
    const restaurants = this.state.data.filterRestaurants( 0, search, filters);
    this.setState({filters:filters, search:search, restaurants:restaurants});
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar navbar-expand-md navbar-light bg-light">
          <a className="navbar-brand text-primary" href="">LunchPad</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="row filterContainer">
            <form className="form-inline my-2 my-lg-0 mr-2">
              <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" value={this.state.value} onChange={this.filter}></input>
            </form>
            <form className="form-inline my-2 my-lg-0">
              <div className="btn-group btn-group-toggle" data-toggle="buttons">
              <label className={"btn btn-primary " + (this.state.filters.indexOf('m') > -1 ? 'active' : '')}>
                <input type="checkbox" id="dairy-free" name="dairy-free" value="m" onChange={this.filter}></input> M
              </label>
              <label className={"btn btn-primary " + (this.state.filters.indexOf('l') > -1 ? 'active' : '')}>
                <input type="checkbox" id="lactose-free" name="lactose-free" value="l" onChange={this.filter}></input> L
              </label>
              <label className={"btn btn-primary " + (this.state.filters.indexOf('vl') > -1 ? 'active' : '')}>
                <input type="checkbox" id="low-lactose" name="low-lactose" value="vl" onChange={this.filter}></input> VL
              </label>
              <label className={"btn btn-primary " + (this.state.filters.indexOf('g') > -1 ? 'active' : '')}>
                <input type="checkbox" id="gluten-free" name="gluten-free" value="g" onChange={this.filter}></input> G
              </label>
              <label className={"btn btn-primary " + (this.state.filters.indexOf('v') > -1 ? 'active' : '')}>
                <input type="checkbox" id="vegan" name="vegan" value="v" onChange={this.filter}></input> V
              </label>
              <label className={"btn btn-primary " + (this.state.filters.indexOf('+') > -1 ? 'active' : '')}>
                <input type="checkbox" id="recommended" name="recommended" value="+" onChange={this.filter}></input> +
              </label>
              </div>
            </form>
          </div>
        </nav>
        <div className="container-fluid">
          <RestaurantData restaurants={this.state.restaurants}/>
        </div>
    </div>
    );
  }
}

export default App;
