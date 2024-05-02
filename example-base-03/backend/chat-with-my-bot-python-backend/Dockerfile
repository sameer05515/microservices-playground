# Dockerfile
FROM python:3.9

WORKDIR /app

COPY requirements.txt requirements.txt
# RUN pip install -r requirements.txt
# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Download and install spaCy language model
RUN python -m spacy download en_core_web_sm

COPY . .

# CMD ["python", "app.py"]
CMD ["python", "src/app.py"]
