from flask import Flask, render_template, request
import logging

app = Flask(__name__)
logging.basicConfig(encoding='utf-8', level=logging.INFO)

@app.route('/')
def home():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(5000))