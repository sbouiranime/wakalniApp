import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';

export default function Favorites({ favorites }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Favorite Recipes</Text>
      {favorites.map((recipe) => (
        <View key={recipe.id} style={styles.cardContainer}>
          <Card style={styles.card}>
            <Card.Cover source={recipe.image} style={styles.image} />
            <Card.Content>
              <Text style={styles.title}>{recipe.title}</Text>
              <Text style={styles.description}>{recipe.description}</Text>
            </Card.Content>
          </Card>
        </View>
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
