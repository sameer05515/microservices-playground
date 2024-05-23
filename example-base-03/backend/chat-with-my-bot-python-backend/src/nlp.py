import spacy

nlp = None

def load_model():
    global nlp
    nlp = spacy.load("en_core_web_sm")

def process_question(cursor, question):
    doc = nlp(question)
    country_name = None
    for ent in doc.ents:
        if ent.label_ == "GPE":  # GPE: Geopolitical Entity
            country_name = ent.text
            break

    if country_name:
        cursor.execute("SELECT capital FROM country WHERE name = %s", (country_name,))
        result = cursor.fetchone()
        if result:
            return {"question": question, "answer": f"The capital of {country_name} is {result[0]}."}
        else:
            return {"question": question, "error": f"Sorry, I don't know the capital of {country_name}."}
    else:
        return {"question": question, "error": "Sorry, I couldn't identify the country in the question."}
