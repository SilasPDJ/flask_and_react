from flask import jsonify
from flask import Flask, render_template, request, redirect, url_for, session
import pandas as pd
from flask_restx import Api, Resource
import os
from dotenv import load_dotenv
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from utils.db import MySQLInterface
from utils.models import OrmTables
from utils.decorators import DynamicRoutes
from utils.helpers import Helpers

from flask_mysqldb import MySQL

import json
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
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{os.getenv("MYSQL_USER")}:{os.getenv("MYSQL_PASSWORD")}@{os.getenv("MYSQL_HOST")}:{os.getenv("MYSQL_PORT")}/{os.getenv("MYSQL_DB")}'


api = Api(app, doc='/docs')

db_alc = SQLAlchemy(app)
mysql = MySQL(app)
CORS(app)  # Isso habilitará o CORS para todas as rotas

db = MySQLInterface(mysql)
dynamic_routes = DynamicRoutes(app)

@app.route("/api/clients_compt")
def clients_compt():
    query = db.select_query("SELECT * FROM clients_compts", as_df=True)
    json_response = query.to_json(orient='records')
    return json_response


@app.route("/api/cadastro_empresas")
@dynamic_routes.call('cadastro_empresas', OrmTables.MainEmpresas, 'fields_properties')
def cadastro_empresas():
    table_name = 'main_empresas'
    query = db.select_query(f"SELECT * FROM {table_name}", as_df=True)
    json_response = query.to_json(orient='records')
    return json_response


# por padrão chamar fields_properties quando for do input

@app.route("/api/update_empresas", methods=['POST', 'GET', 'DELETE'])
def updatingClientValues():
    table = OrmTables.MainEmpresas
    # table_name = table.__tablename__

    if request.method == 'POST':
        result = db.update_row_in_table_with_dict(table=table, _data_dict=request.json)
        if result:
            return {'update_status': 'success'}
        # print(request.json)
        else:
            print(result)
            return {'update_status': 'failed'}
    # TODO unite in cadastro_empresas

@app.route('/api/cadastro_competencias/<compt>', methods=['GET', 'POST'])
def cadastro_competencias(compt):
    print(compt)
    table_name = OrmTables.ClientsCompts.__tablename__
    query = f"""SELECT e.razao_social, cc.* FROM {table_name} cc
    INNER JOIN main_empresas e ON cc.main_empresa_id = e.id
    WHERE cc.compt = %s"""
    result = db.select_query(query, compt, as_df=True)

    result = result.drop(columns=['compt'])
    json_response = result.to_json(orient='records')
    return json_response


@app.route("/api/update_competencias", methods=['POST', 'GET', 'DELETE'])
def updatadingCompetencias():
    table = OrmTables.ClientsCompts
    if request.method == 'POST':
        result = db.update_row_in_table_with_dict(table=table, _data_dict=request.json)

        if result:
            return {'update_status': 'success'}
        # print(request.json)
        else:
            print(result)
            return {'update_status': 'failed'}
    # TODO unite in cadastro_empresas


@app.route('/api/sql/select', methods=['POST', 'GET'])
def select():
    # o argumento precisa ser string
    if request.method == 'POST' and request.json:
        result = db.select_query(*request.json, as_df=True)
        json_response = result.to_json(orient='records')
        # values_tolist = result.values.tolist()

        # json_response = flattened_list = [item for sublist in values_tolist for item in sublist]
        return json_response
    else:
        return {'status': 'error'}

@app.route('/api/sql/insert/new_client', methods=['POST', 'GET'])
def insert_new_client():
    table_empresas = OrmTables.MainEmpresas

    if request.method == 'GET':
        rendered_form = Helpers.render_form(model=table_empresas)
        obj = {"html": rendered_form}
        return jsonify(obj)

        # return jsonify(form)

    elif request.method == 'POST' and request.json:
        pass

if __name__ == '__main__':
    app.run(debug=True)
