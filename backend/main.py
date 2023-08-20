from flask import Flask
from flask import jsonify
from flask import Flask, render_template, request, redirect, url_for, session
import pandas as pd
from flask_restx import Api, Resource
import os
from dotenv import load_dotenv
from flask_cors import CORS

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


def execute_query(query, *args, as_df=False):
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
        if as_df:
            columns = [desc[0] for desc in cursor.description]  # Obtendo os nomes das colunas
            df = pd.DataFrame(result, columns=columns)
            return df
        else:
            return result


# Members API Route
@app.route("/members")
def members():
    # return {"members": ["Member1", "Member2", "Member3"]}
    query = execute_query("SELECT * FROM clients_compts", as_df=True)
    dict_query = query.to_dict(orient='records')
    return dict_query


@app.route("/api/test")
def test():
    data = {"message": "Test endpoint working!"}
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
