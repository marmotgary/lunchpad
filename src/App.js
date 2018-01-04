import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import restaurantJson from './restaurants.json'

// const data = new Data();
// data.getRestaurants(); //lista
// data.filterByString( "str" );
// data.filterByCategory( ["G", "+", "f" ]);
// data.filterByStringAndCategory( "str", []);

class Restaurant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {restaurant: props.restaurant}
  }

  render() {

    return (
      const restaurant = this.props.restaurant;
      <div className="restaurant">
        <h2>{restaurant.name}
      </div>
    )
  }
}

class RestaurantData extends React.Component {
  constructor(props) {
    super(props);
    this.state = { search: "",
                   filters: []}
  }

  render() {
    if (!this.props.restaurants) {
      return "Ei ravintoloita"
    }
    const restaurants = this.props.restaurants;
    console.log(restaurants);
    // for(let restaurant in restaurants) {
    //   console.log(restaurant.days);
    // }
    // const restaurantList = restaurants.map((restaurant) =>
    //   <Restaurant restaurant={restaurant}/>
    // );
    // return <div>{restaurantList}</div>
    return <div></div>

  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {restaurants: null}
  }

  componentDidMount(){
    this.setState({restaurants:restaurantJson})
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <RestaurantData restaurants={this.state.restaurants}/>
      </div>
    );
  }
}

export default App;
