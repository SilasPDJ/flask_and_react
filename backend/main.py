from flask import jsonify
from flask import Flask, render_template, request, redirect, url_for, session
import pandas as pd
from flask_restx import Api, Resource
import os
from dotenv import load_dotenv
from flask_cors import CORS

from utils.db import MySQLInterface
from utils.models import OrmTables

from flask_mysqldb import MySQL
import MySQLdb.cursors
import re

# from backend.config import DevConfig

load_dotenv()
app = Flask(__name__)
app.secret_key = 'dsaDDDLDSlkffsdkmg34er95834u58934532$%%%$#@@$567i96tsdfkjmdslkcvmfdDKSALD,009543gbfdnd.,vffxcvbmvn'

# app.config.from_object(DevConfig)

app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')
app.config['MYSQL_PORT'] = int(os.getenv('MYSQL_PORT'))

api = Api(app, doc='/docs')

mysql = MySQL(app)
CORS(app)  # Isso habilitará o CORS para todas as rotas

db = MySQLInterface(mysql)


@app.route("/api/clients_compt")
def clients_compt():
    query = db.select_query("SELECT * FROM clients_compts", as_df=True)
    json_response = query.to_json(orient='records')
    return json_response


@app.route("/api/cadastro_empresas")
def cadastro_empresas():
    table_name = 'main_empresas'
    query = db.select_query(f"SELECT * FROM {table_name}", as_df=True)
    json_response = query.to_json(orient='records')
    return json_response


# por padrão chamar fields_properties quando for do input
@app.route('/api/cadastro_empresas/fields_properties')
def cadastro_empresas_fields():
    table_name = 'main_empresas'
    orm = OrmTables.MainEmpresas
    columns = orm.__table__.columns
    columns_python_types = [col.type.python_type for col in columns]
    columns_max_length = [col.type.length if hasattr(col.type, 'length') else -1 for col in columns]

    return {
        # "columns": columns,
        # "columns_python_types": columns_python_types,
        "inputs_max_length": [str(col) for col in columns_max_length]
    }


@app.route("/api/empresas", methods=['POST', 'GET', 'DELETE'])
def updatingClientValues():
    table_name = 'main_empresas'

    if request.method == 'POST':
        result = db.update_row_with_dict(table_name=table_name, updated_data=request.json['data'])
        if result:
            return {'update_status': 'success'}
        # print(request.json)
        else:
            print(result)
            return {'update_status': 'failed'}


@app.route("/api/test")
def test():
    data = {"message": "Test endpoint working!"}
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
