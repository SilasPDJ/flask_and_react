from flask import Flask
from utils.models import Base


class DynamicRoutes:
    def __init__(self, app: Flask):
        self.app = app

    def call(self, route_prefix: str, orm: type, *funcs):
        def decorator(func):
            self.app.add_url_rule(
                f'/api/{route_prefix}',
                view_func=func
            )

            for func_name in funcs:
                self.app.add_url_rule(
                    f'/api/{route_prefix}/{func_name}',
                    view_func=getattr(self, func_name)(orm)
                )
            # self.app.add_url_rule(
            #     f'/api/{route_prefix}/fields_properties',
            #     view_func=self.create_fields_properties_route(orm)
            # )

            return func

        return decorator

    def fields_properties(self, orm: Base):
        def fields_properties():
            columns = orm.__table__.columns
            columns_max_length = [col.type.length if hasattr(col.type, 'length') else -1 for col in columns]

            return {
                "inputs_max_length": [str(col) for col in columns_max_length]
            }

        return fields_properties
