from flask import Flask, request, jsonify
from datetime import datetime
import os
import database
import nlp

app = Flask(__name__)

# Load MySQL database details from environment variables
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "admin@123")
DB_DATABASE = os.getenv("DB_DATABASE", "ex_base_03")

# Get port number from environment variable, default to 5000 if not provided
PORT = int(os.getenv("PORT", "5000"))

# Connect to MySQL database
db = database.connect(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE)
cursor = db.cursor()

# Load spaCy model
nlp.load_model()

@app.route('/')
def hello():
    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return f"HELLO {current_datetime}"

# @app.route('/country')
# def country():
#     question = request.args.get("question")
#     current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#     country_name = question
#     if country_name:
#         # Search in MySQL table
#         cursor.execute("SELECT capital FROM country WHERE name = %s", (country_name,))
#         result = cursor.fetchone()
#         if result:
#             capital = result[0]
#             return jsonify({"question": question, "answer": f"The capital of {country_name} is {capital}."})
#         else:
#             return jsonify({"question": question, "error": f"Sorry, I don't know the capital of {country_name}."})
#     else:
#         return jsonify({"question": question, "error": "Sorry, I couldn't identify the country in the question."})

@app.route('/country')
def country():
    question = request.args.get("question")
    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    country_name = question
    if country_name:
        result = database.search_country(cursor, country_name)
        return jsonify(result)
    else:
        return jsonify({"question": question, "error": "Sorry, I couldn't identify the country in the question."})

@app.route('/answers')
def answers():
    question = request.args.get("question")
    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    result = nlp.process_question(cursor, question)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=PORT)
