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

clients_compts_table = OrmTables.ClientsCompts
main_empresas_table = OrmTables.MainEmpresas
helpers = Helpers(db_alc.session)

@app.route("/api/clients_compt")
def clients_compt():
    # OrmTables.ClientsCompts
    query = db.select_query("SELECT * FROM clients_compts", as_df=True)
    json_response = query.to_json(orient='records')
    return json_response


@app.route("/api/cadastro_empresas")
@dynamic_routes.call('cadastro_empresas', OrmTables.MainEmpresas, 'fields_properties')
def cadastro_empresas():
    table_name = 'main_empresas'
    query = f"SELECT * FROM {table_name}"

    result = db.select_query(query, as_df=True)
    # result = helpers.reorder_df_columns_to_the_end(result, 'id')
    json_response = result.to_json(orient='records')
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

# @dynamic_routes
@app.route('/api/cadastro_competencias/<compt>', methods=['GET', 'POST'])
def cadastro_competencias(compt):
    print(compt)
    table_name = OrmTables.ClientsCompts.__tablename__
    query = f"""SELECT e.razao_social, cc.* FROM {table_name} cc
    INNER JOIN main_empresas e ON cc.main_empresa_id = e.id
    WHERE cc.compt = %s"""
    result = db.select_query(query, compt, as_df=True)

    result = result.drop(columns=['compt'])
    result = helpers.reorder_df_columns_to_the_end(result, 'nf_saidas','nf_entradas','id')

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


@app.route('/api/inputs_properties/<model>', methods=['GET', 'POST'])
def get_inputs_properties(model):
    """
    Constructing to the return the inputs properties to pass to JS
    :param model: empresas vs competencias
    :return:
    """
    this_url = os.path.join(request.url_root, url_for(f'updatadingCompetencias')[1:])

    if model == 'empresas':
        inputs_properties_and_labels = helpers.get_inputs_and_label_properties(OrmTables.MainEmpresas,
                                                                               action_url=this_url)
    elif model == 'competencias':
        inputs_properties_and_labels = helpers.get_inputs_and_label_properties(OrmTables.ClientsCompts,
                                                                               action_url=this_url)

    else:
        inputs_properties_and_labels = {}

    obj = jsonify(inputs_properties_and_labels)
    return obj

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
    """
    Creates the form for creating a new client
    :return:
    """
    table_empresas = OrmTables.MainEmpresas
    this_url = os.path.join(request.url_root, url_for('insert_new_client')[1:])

    if request.method == 'GET':
        rendered_form = Helpers.render_form(model=table_empresas, action_url=this_url)
        obj = {"html": rendered_form}
        return jsonify(obj)

    elif request.method == 'POST':
        data = request.form
        obj = OrmTables.MainEmpresas(**data.to_dict())

        with db_alc.session() as session:
            session.add(obj)
            session.commit()
        return redirect(request.referrer)


if __name__ == '__main__':
    app.run(debug=True)
