from flask import Flask, request, jsonify
import requests
import os
import json
import predictionguard as pg
from flask_cors import CORS
from app import create_app

app = create_app()
CORS(app, origins='*')

@app.route('/ask', methods=['POST'])
def python_function():
    return None