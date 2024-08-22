from flask import Flask, request, jsonify, render_template
from ultralytics import YOLO
from PIL import Image
import pandas as pd
from fuzzywuzzy import process
from flask_cors import CORS
import requests
from io import BytesIO
import logging
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Load the pre-trained YOLOv8 model
model = YOLO('yolov8n-seg.pt')  # Ensure you have the appropriate model variant

# Load the Excel file
df = pd.read_excel('RecipeData.xlsx')

# Define the similarity function
def find_similar(query, choices, limit=5):
    return process.extract(query, choices, limit=limit)

# Function to get matching recipes
def get_matching_recipes(ingredient_query, df, top_n=3):
    choices = df['Ingredients'].tolist()
    similar_entries = find_similar(ingredient_query, choices, limit=top_n)
    
    # Extract the top matches
    top_matches = [entry[0] for entry in similar_entries]
    
    # Filter the DataFrame for the top matches
    matched_recipes = df[df['Ingredients'].isin(top_matches)]
    
    return matched_recipes[['Title', 'Ingredients', 'Instructions','Pictures']].to_dict(orient='records')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.form and 'file' not in request.files:
        logging.error('No file part in request')
        return jsonify({'error': 'No file part in request'}), 400

    file = request.form.get('file') or request.files.get('file')
    if not file:
        logging.error('No selected file')
        return jsonify({'error': 'No selected file'}), 400

    try:
        if isinstance(file, str) and file.startswith('data:image'):
            # Handle base64 string
            header, base64_data = file.split(',', 1)
            img_data = base64.b64decode(base64_data)
            img = Image.open(BytesIO(img_data)).convert('RGB')
        elif isinstance(file, str):  # URI case
            response = requests.get(file)
            img = Image.open(BytesIO(response.content)).convert('RGB')
        else:
            img = Image.open(file.stream).convert('RGB')

        results = model(img)

        # Parse the results
        object_names = []
        for result in results:
            for box in result.boxes:
                object_names.append(result.names[int(box.cls)])
        
        # Join the object names into a single string
        ingredient_query = ", ".join(object_names)
        logging.debug(f'Detected ingredients: {ingredient_query}')
        
        # Find the top 3 recipes with ingredients similar to the detected objects
        matching_recipes = get_matching_recipes(ingredient_query, df, top_n=3)
        logging.debug(f'Matching recipes: {matching_recipes}')
        
        return jsonify({'matching_recipes': matching_recipes})
    except Exception as e:
        logging.error(f'Error processing file: {e}')
        return jsonify({'error': 'Error processing file'}), 500

@app.route('/predict_ingredients', methods=['POST'])
def predict_ingredients():
    data = request.get_json()
    if not data or 'ingredients' not in data:
        logging.error('No ingredients provided in request')
        return jsonify({'error': 'No ingredients provided in request'}), 400

    ingredients = data['ingredients']
    try:
        # Find the top 3 recipes with ingredients similar to the provided ingredients
        matching_recipes = get_matching_recipes(ingredients, df, top_n=3)
        logging.debug(f'Matching recipes: {matching_recipes}')
        
        return jsonify({'matching_recipes': matching_recipes})
    except Exception as e:
        logging.error(f'Error processing ingredients: {e}')
        return jsonify({'error': 'Error processing ingredients'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
