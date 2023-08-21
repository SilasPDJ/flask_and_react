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
