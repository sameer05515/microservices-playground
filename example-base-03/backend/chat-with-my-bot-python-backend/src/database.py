import mysql.connector

def connect(host, user, password, database):
    return mysql.connector.connect(
        host=host,
        user=user,
        password=password,
        database=database
    )

def search_country(cursor, country_name):
    cursor.execute("SELECT capital FROM country WHERE name = %s", (country_name,))
    result = cursor.fetchone()
    if result:
        return {"question": question, "answer": f"The capital of {country_name} is {result[0]}."}
    else:
        return {"question": question, "error": f"Sorry, I don't know the capital of {country_name}."}
