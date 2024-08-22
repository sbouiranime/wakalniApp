import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { Button, Card } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { REACT_APP_PORT } from '../constant/cst';

export default function Search() {
  const [method, setMethod] = useState(null);
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      fetchRecipes(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        fetchRecipes(result.assets[0].uri);
      }
    } else {
      alert('Camera permission is required to use this feature');
    }
  };

  const handleSearchByIngredients = () => {
    fetchRecipes(null, ingredients);
  };

  const fetchRecipes = async (imageUri = null, ingredientsText = null) => {
    setLoading(true);
    try {
      let response;
      if (imageUri) {
        const fileUri = imageUri;
        const fileName = fileUri.split('/').pop();
        const fileType = fileName.split('.').pop();

        const formData = new FormData();
        formData.append('file', {
          uri: fileUri,
          name: fileName,
          type: `image/${fileType}`,
        });

        response = await fetch('http://192.168.1.3:5000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
          body: formData,
        });
      } else if (ingredientsText) {
        response = await fetch('http://192.168.1.3:5000/predict_ingredients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ ingredients: ingredientsText }),
        });
      }
      console.log(ingredients)

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setRecipes(data.matching_recipes || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Search for Recipes</Text>
      <View style={styles.buttonContainer}>
        <Button mode="contained" style={styles.button} onPress={() => { setMethod('gallery'); handleChoosePhoto(); }}>
          Upload from Gallery
        </Button>
        <Button mode="contained" style={styles.button} onPress={() => { setMethod('camera'); handleTakePhoto(); }}>
          Take a Picture
        </Button>
        <Button mode="contained" style={styles.button} onPress={() => setMethod('text')}>
          Enter Ingredients
        </Button>
      </View>
      {method === 'text' && (
        <TextInput
          style={styles.input}
          placeholder="Enter ingredients..."
          value={ingredients}
          onChangeText={setIngredients}
          onSubmitEditing={handleSearchByIngredients}
        />
      )}
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Text style={styles.resultsHeader}>Recipes</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : recipes.length > 0 ? (
        recipes.map((recipe, index) => (
          <View key={index} style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.title}>{recipe.Title}</Text>
                {recipe.Pictures && <Image source={{ uri: `${REACT_APP_PORT}${recipe.Pictures}` }} style={styles.recipeImage} />}
                <Text style={styles.sectionHeader}>Ingredients</Text>
                <Text style={styles.description}>{recipe.Ingredients}</Text>
                <Text style={styles.sectionHeader}>Instructions</Text>
                <Text style={styles.description}>{recipe.Instructions}</Text>
              </Card.Content>
            </Card>
          </View>
        ))
      ) : (
        <Text>No recipes found</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 10,
    paddingVertical: 8,
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  resultsHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#444',
  },
  description: {
    fontSize: 16,
    marginTop: 5,
    color: '#666',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
});
