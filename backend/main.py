from flask import jsonify
from flask import Flask, render_template, request, redirect, url_for, session
import pandas as pd
from flask_restx import Api, Resource
import os
from dotenv import load_dotenv
from flask_cors import CORS
from utils.db import MYSQL_TYPE_TO_PYTHON


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


def select_query(query, *args, as_df=False):
    """
    Execute a database query and return the results.

    :param query: The SQL query to execute.
    :param args: Optional parameters to be passed to the query.
    :param as_df: If True, return the results as a pandas DataFrame. If False, return a list of tuples.
    :return: The query results. If as_df is True, a DataFrame; otherwise, a list of tuples.
    """
    with mysql.connection.cursor() as cursor:
        cursor.execute(query, *args)
        result = cursor.fetchall()

        columns_types = [MYSQL_TYPE_TO_PYTHON[column[1]] for column in cursor.description]

        if as_df:
            # Obtendo os nomes das colunas
            columns = [desc[0] for desc in cursor.description]
            df = pd.DataFrame(result, columns=columns)
            for col, col_type in zip(df.columns, columns_types):
                df[col] = df[col].astype(col_type)
            return df
        else:
            return result

def execute_data_manipulation(query, *args):
    """
    Execute a database query and commit the transaction.

    :param query: The SQL query to execute.
    :param args: Optional parameters to be passed to the query.
    """
    try:
        with mysql.connection.cursor() as cursor:
            cursor.execute(query, args)
        mysql.connection.commit()
    except Exception as e:
        print("Error:", e)
        mysql.connection.rollback()


def update_row_with_dict(table_name: str, updated_data: dict) -> bool:

    # Prepare the dictionary of columns and values
    id_value = updated_data.pop('id')
    if not id_value:
        return False
    columns = ', '.join([f"{column} = %s" for column in updated_data.keys()])
    values = list(updated_data.values())

    # Create the SQL query with placeholders and arguments
    query = f"UPDATE {table_name} SET {columns} WHERE id = %s"
    values.append(id_value)  # Add the id_value to the arguments

    # Execute the update query
    if execute_data_manipulation(query, *values):
        return True
    print()

@app.route("/api/clients_compt")
def clients_compt():
    query = select_query("SELECT * FROM clients_compts", as_df=True)
    json_response = query.to_json(orient='records')
    return json_response


@app.route("/api/cadastro_empresas")
def cadastro_empresas():
    query = select_query("SELECT * FROM main_empresas", as_df=True)
    json_response = query.to_json(orient='records')
    return json_response


@app.route("/api/empresas", methods=['POST', 'GET', 'DELETE'])
def updatingClientValues():
    table_name = 'main_empresas'

    if request.method == 'POST':
        update_row_with_dict(table_name=table_name, updated_data=request.json['data'], )
        print(request.json)
        # TODO pegar quando teve erro e retornar a mensagem de erro

    return {'message': 'sucesso'}


@app.route("/api/test")
def test():
    data = {"message": "Test endpoint working!"}
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
