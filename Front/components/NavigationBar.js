import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import Home from './Home';
import Favorites from './Favorites';
import Search from './Search';
import Profile from './Profile';

const NavigationBar = () => {
  const [index, setIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [routes] = useState([
    { key: 'home', title: 'Home', focusedIcon: 'home-circle', unfocusedIcon: 'home-circle-outline' },
    { key: 'search', title: 'Search', focusedIcon: 'file-search', unfocusedIcon: 'file-search-outline' },
    { key: 'favorites', title: 'Favorites', focusedIcon: 'cards-heart', unfocusedIcon: 'cards-heart-outline' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account-cog', unfocusedIcon: 'account-cog-outline' },
  ]);

  const addFavorite = (recipe) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some(fav => fav.id === recipe.id)) {
        return prevFavorites.filter(fav => fav.id !== recipe.id);
      } else {
        return [...prevFavorites, recipe];
      }
    });
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'home':
        return <Home addFavorite={addFavorite} />;
      case 'search':
        return <Search />;
      case 'favorites':
        return <Favorites favorites={favorites} />;
      case 'profile':
        return <Profile />;
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default NavigationBar;
