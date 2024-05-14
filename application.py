# May need to create virtual env
# pip install virtualenv
# To create: virtualenv venv
# To activate: source ./venv/bin/activate
# To deactivate: deactivate

# pip install flask
from flask import Flask, jsonify, request, send_from_directory
# pip install mysql-connector-python
import mysql.connector
import os
from api import api
from flask_cors import CORS

application = Flask(__name__, static_folder='./matx-react-master/build')
application.register_blueprint(api, url_prefix="/api")
cors = CORS(application)
application.config['CORS_HEADERS'] = 'Content-Type'


@application.route('/')
def serve_react_app():
    return send_from_directory(application.static_folder, "index.html")


@application.route("/<path:path>")
def static_proxy(path):
    file_name = path.split("/")[-1]
    dir_name = os.path.join(application.static_folder,
                            "/".join(path.split("/")[:-1]))
    return send_from_directory(dir_name, file_name)

@application.errorhandler(404)
def handle_404(e):
    if request.path.startswith("/api/"):
        return jsonify(message="Resource not found"), 404
    return send_from_directory(application.static_folder, "index.html")


@application.errorhandler(405)
def handle_405(e):
    if request.path.startswith("/api/"):
        return jsonify(message="Method not allowed"), 405
    return e


@application.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

if __name__ == '__main__':
    application.run(debug=True)
