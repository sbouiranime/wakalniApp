import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

const recipes = [
  { 
    id: 1,
    title: 'Spaghetti Carbonara', 
    description: 'A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.', 
    image: require('../assets/spaghetti.jpg')
  },
  { 
    id: 2,
    title: 'Chicken Curry', 
    description: 'A flavorful and spicy chicken curry made with a blend of aromatic spices and coconut milk.', 
    image: require('../assets/chicken_curry.jpg')
  },
  { 
    id: 3,
    title: 'Vegetable Stir-fry', 
    description: 'A quick and healthy stir-fry with a mix of fresh vegetables and a savory sauce.', 
    image: require('../assets/spaghetti.jpg')     
  },
];

export default function Home({ addFavorite }) {
  const [favoriteIds, setFavoriteIds] = useState([]);

  const toggleFavorite = (recipe) => {
    if (favoriteIds.includes(recipe.id)) {
      setFavoriteIds(favoriteIds.filter(id => id !== recipe.id));
    } else {
      setFavoriteIds([...favoriteIds, recipe.id]);
    }
    addFavorite(recipe);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Delicious Recipes to Try</Text>
      {recipes.map((recipe, index) => (
        <Animatable.View 
          key={recipe.id} 
          animation="fadeInUp" 
          duration={1000} 
          delay={index * 300}
          style={styles.cardContainer}
        >
          <Card style={styles.card}>
            <Card.Cover source={recipe.image} style={styles.image} />
            <Card.Content>
              <Text style={styles.title}>{recipe.title}</Text>
              <Text style={styles.description}>{recipe.description}</Text>
            </Card.Content>
            <Card.Actions>
              <IconButton 
                icon={favoriteIds.includes(recipe.id) ? "heart" : "heart-outline"} 
                color="red" 
                size={24} 
                onPress={() => toggleFavorite(recipe)} 
              />
            </Card.Actions>
          </Card>
        </Animatable.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#444',
  },
  description: {
    fontSize: 16,
    marginTop: 5,
    color: '#666',
  },
});
