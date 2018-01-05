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

// Component for a single restaurant
const Restaurant = (props) => {
    const restaurant = props.restaurant;
    // Error correction
    if (restaurant === undefined){
      return <div></div>;
    }
    let foods = restaurant.foods;
    if (foods !== undefined && foods.length > 0){
      foods  = foods.map((food, index) =>
        <div className="text-left mt-2" key={index}>
          <div className="font-weight-bold">{food.category}</div>
          <div className="">{food.name} ({food.diet})</div>
        </div>
      );
    } else {
      foods = <div>Ei ruokaa</div>
    }
    return (
      <div className="card restaurant col-md-6 col-lg-4">
        <h2 className="card-title">{restaurant.name}</h2>
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
    return <div className="row">{restaurantList}</div>
}

const Navbar = (props) => {
  return <nav className="navbar navbar-expand-md navbar-light bg-light">
      <a className="navbar-brand" href="#">LunchPad</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <form className="form-inline my-2 my-lg-0 mr-2">
          <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
        <form className="form-inline my-2 my-lg-0">



          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className="btn btn-primary">
              <input type="checkbox" autocomplete="off" id="dairy-free" name="dairy-free" value="true"> M</input>
            </label>
            <label className="btn btn-primary">
              <input type="checkbox" autocomplete="off" id="lactose-free" name="lactose-free" value="true"> L</input>
            </label>
            <label className="btn btn-primary">
              <input type="checkbox" autocomplete="off" id="low-lactose" name="low-lactose" value="true"> VL</input>
            </label>
            <label className="btn btn-primary">
              <input type="checkbox" autocomplete="off" id="gluten-free" name="gluten-free" value="true"> G</input>
            </label>
            <label className="btn btn-primary">
              <input type="checkbox" autocomplete="off" id="vegan" name="vegan" value="true"> V</input>
            </label>
            <label className="btn btn-primary">
              <input type="checkbox" autocomplete="off" id="recommended" name="recommended" value="true"> +</input>
            </label>
          </div>




        </form>
      </div>
    </nav>
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
    console.log(search, filters);
    const restaurants = this.state.data.filterRestaurants( 0, search, filters);
    this.setState({filters:filters, search:search, restaurants:restaurants});
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar navbar-expand-md navbar-light bg-light">
          <a className="navbar-brand text-primary" href="#">LunchPad</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
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
