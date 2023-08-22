import pandas as pd
import flask_mysqldb

# Python types corresponding to MySQL FIELD_TYPE constants
MYSQL_TYPE_TO_PYTHON = {
    0: float,     # DECIMAL
    1: bool,      # TINY
    2: int,       # SHORT
    3: int,       # LONG
    4: float,     # FLOAT
    5: float,     # DOUBLE
    6: None,      # NULL
    7: str,       # TIMESTAMP
    8: int,       # LONGLONG
    9: int,       # INT24
    10: str,      # DATE
    11: str,      # TIME
    12: str,      # DATETIME
    13: int,      # YEAR
    15: str,      # VARCHAR
    16: int,      # BIT
    245: str,     # JSON
    246: float,   # NEWDECIMAL
    247: str,     # ENUM
    248: str,     # SET
    249: bytes,   # TINY_BLOB
    250: bytes,   # MEDIUM_BLOB
    251: bytes,   # LONG_BLOB
    252: bytes,   # BLOB
    253: str,     # VAR_STRING
    254: str,     # STRING
    255: bytes,   # GEOMETRY
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
            cursor.execute(self, query, *args)
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

    def execute_data_manipulation(self, query, *args):
        """
        Execute a database query and commit the transaction.

        :param query: The SQL query to execute.
        :param args: Optional parameters to be passed to the query.
        """
        try:
            with self.mysql.connection.cursor() as cursor:
                cursor.execute(query, args)
            self.mysql.connection.commit()
        except Exception as e:
            print("Error:", e)
            self.mysql.connection.rollback()

    def update_row_with_dict(self, table_name: str, updated_data: dict) -> bool:

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
        if self.execute_data_manipulation(query, *values):
            return True
        print()
