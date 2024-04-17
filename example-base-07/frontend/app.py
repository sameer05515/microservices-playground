from flask import Flask, render_template
import requests
import logging

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# GraphQL endpoint URL
graphql_endpoint = "http://docker.for.win.localhost:4000/graphql"

@app.route('/')
def index():
    # GraphQL query to fetch data
    graphql_query = """
    {
      getAllResumes {
        uniqueId
        summary
        introduction
      }
    }
    """

    try:
        # Fetch data from GraphQL endpoint
        response = requests.post(graphql_endpoint, json={"query": graphql_query})
        data = response.json()

        # Log successful request
        logger.info("Successfully fetched data from GraphQL endpoint")

        # Render data in HTML template
        return render_template('index.html', resumes=data['data']['getAllResumes'])

    except Exception as e:
        # Log error if request fails
        logger.error(f"Error fetching data from GraphQL endpoint: {str(e)}")
        return "Error: Failed to fetch data from GraphQL endpoint"

if __name__ == '__main__':
    app.run(debug=True)
