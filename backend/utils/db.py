import pandas as pd
import flask_mysqldb
from utils.models import OrmTables, Base

# Python types corresponding to MySQL FIELD_TYPE constants
MYSQL_TYPE_TO_PYTHON = {
    0: float,  # DECIMAL
    1: bool,  # TINY
    2: int,  # SHORT
    3: int,  # LONG
    4: float,  # FLOAT
    5: float,  # DOUBLE
    6: None,  # NULL
    7: str,  # TIMESTAMP
    8: int,  # LONGLONG
    9: int,  # INT24
    10: str,  # DATE
    11: str,  # TIME
    12: str,  # DATETIME
    13: int,  # YEAR
    15: str,  # VARCHAR
    16: int,  # BIT
    245: str,  # JSON
    246: float,  # NEWDECIMAL
    247: str,  # ENUM
    248: str,  # SET
    249: bytes,  # TINY_BLOB
    250: bytes,  # MEDIUM_BLOB
    251: bytes,  # LONG_BLOB
    252: bytes,  # BLOB
    253: str,  # VAR_STRING
    254: str,  # STRING
    255: bytes,  # GEOMETRY
}


class MySQLInterface:
    def __init__(self, mysql: flask_mysqldb.MySQL):
        self.mysql = mysql

    def select_query(self, query, *args, as_df=False):
        """
        Execute a database query and return the results.

        :param query: The SQL query to execute.
        :param args: Optional parameters to be passed to the query.
        :param as_df: If True, return the results as a pandas DataFrame. If False, return a list of tuples.
        :return: The query results. If as_df is True, a DataFrame; otherwise, a list of tuples.
        """
        with self.mysql.connection.cursor() as cursor:
            cursor.execute(query, args)
            result = cursor.fetchall()

            columns_types = [MYSQL_TYPE_TO_PYTHON[column[1]] for column in cursor.description]
            print()

            if as_df:
                # Obtendo os nomes das colunas
                columns = [desc[0] for desc in cursor.description]
                df = pd.DataFrame(result, columns=columns)
                for col, col_type in zip(df.columns, columns_types):
                    try:
                        df[col] = df[col].astype(col_type)
                    except (pd.errors.IntCastingNaNError, Exception) as e:
                        print(e)
                return df
            else:
                return result

    def execute_data_manipulation(self, query, *args) -> bool:
        """
        Execute a database query and commit the transaction.

        :param query: The SQL query to execute.
        :param args: Optional parameters to be passed to the query.
        """
        try:
            with self.mysql.connection.cursor() as cursor:
                cursor.execute(query, args)
            self.mysql.connection.commit()
            return True
        except Exception as e:
            print("Error:", e)
            self.mysql.connection.rollback()
            return False

    def update_row_in_table_with_dict(self, table: Base, _data_dict: dict) -> bool:
        table_name = table.__tablename__
        data_dict = self._convert_types_to_sql(_data_dict)

        # check if key is in table to avoid errors
        updated_data = {key: value for key, value in data_dict.items() if hasattr(table, key)}

        anula_venc_das = False
        if 'venc_das' in updated_data:
            # TO.DO esse backend desse frontend ta meio feio
            if updated_data['venc_das'] == "" or updated_data['venc_das'] == "None":
                del updated_data['venc_das']
                anula_venc_das = True

        # Prepare the dictionary of columns and values
        id_value = updated_data.pop('id')
        if not id_value:
            return False
        columns = ', '.join([f"{column} = %s" for column in updated_data.keys()])
        values = list(updated_data.values())

        # Create the SQL query with placeholders and arguments
        if anula_venc_das:
            query = f"UPDATE {table_name} SET {columns}, venc_das = NULL WHERE id = %s"
        else:
            query = f"UPDATE {table_name} SET {columns}  WHERE id = %s"
        values.append(id_value)  # Add the id_value to the arguments

        # Execute the update query
        return self.execute_data_manipulation(query, *values)

    def _convert_types_to_sql(self, data_dict: dict) -> dict:
        """
        :param data_dict: the dict that you'll be converted to be allowed to be inserted/updated in sql
        :return: the new_data_dictionary with the required convertions
        """
        # Convert bool to tiny int
        new_data_dict = {key: int(value) if isinstance(value, bool) else value for key, value in data_dict.items()}
        return new_data_dict

if __name__ == '__main__':
    import os
    import pymysql
    from dotenv import load_dotenv
    from sqlalchemy import create_engine

    load_dotenv()
    # Obtenha os valores das variáveis de ambiente
    MYSQL_HOST = os.getenv('MYSQL_HOST')
    MYSQL_USER = os.getenv('MYSQL_USER')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
    MYSQL_DB = os.getenv('MYSQL_DB')
    MYSQL_PORT = int(os.getenv('MYSQL_PORT'))
    # Crie a URL de conexão
    database_url = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"

    # Crie a conexão do SQLAlchemy
    engine = create_engine(database_url)
    teste = MySQLInterface(engine.connect())
    models_obj = OrmTables().get_classes()
    # cols_length = [col.type.length if hasattr(col.type, 'length') else -1 for col in list(models_obj.values())[0].__table__.columns]

    print(models_obj)

    print(teste)
