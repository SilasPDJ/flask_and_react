import os
from dotenv import load_dotenv
from flask import Flask
from flask_admin.contrib.mongoengine.filters import FilterEqual
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView

from models import ClientsCompts, MainEmpresas
from utils.compt_utils import get_compt, ate_atual_compt, compt_to_date_obj

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'sua_chave_secreta')

# Configurações do banco de dados
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')
app.config['MYSQL_PORT'] = int(os.getenv('MYSQL_PORT'))
app.config[
    'SQLALCHEMY_DATABASE_URI'] = f'mysql://{os.getenv("MYSQL_USER")}:{os.getenv("MYSQL_PASSWORD")}@{os.getenv("MYSQL_HOST")}:{os.getenv("MYSQL_PORT")}/{os.getenv("MYSQL_DB")}'

# Configurações do Flask-Admin
db = SQLAlchemy(app)
admin = Admin(app, template_mode='bootstrap4', base_template='crud.html')


# admin = Admin(app, template_mode='bootstrap4')


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    age = db.Column(db.Integer)


class UserView(ModelView):
    column_searchable_list = ['name']
    page_size = 2
    can_delete = False


class MainEmpresasView(ModelView):
    column_searchable_list = ['razao_social', 'cnpj', 'email']
    # form_columns = ['razao_social', 'cnpj', 'email', 'giss_login', 'ginfess_cod', 'status_ativo']
    column_list = ['razao_social', 'cnpj', 'email', 'giss_login', 'ginfess_cod', 'status_ativo']
    page_size = 100
    can_delete = False
    can_view_details = True


from flask import request
from flask_admin.contrib.mongoengine.filters import BaseMongoEngineFilter


class CustomEqualFilter(BaseMongoEngineFilter):

    def apply(self, query, value):
        print(self.column)
        if value is None:
            return query
        return query.filter(self.column == value)

    def operation(self):
        return 'equals'



class ClientsComptsView(ModelView):

    dates = list(ate_atual_compt(get_compt(), get_compt(-12)))

    dates = [compt_to_date_obj(d) for d in dates]

    dates = [f"{d.strftime('%Y-%m-%d')}" for d in dates]

    column_filters = [
        CustomEqualFilter(column=ClientsCompts.compt, name='Compt', options=[
            (date, date) for date in sorted(dates, reverse=True)
        ], )
    ]

    column_list = ['main_empresas.razao_social', 'declarado', 'nf_saidas', 'nf_entradas', 'sem_retencao', 'com_retencao',
                   'valor_total', 'anexo', 'envio', 'imposto_a_calcular', 'compt', 'pode_declarar']

    column_labels = {
        'main_empresas.razao_social': 'Razão Social',
    }

    can_set_page_size = True


# admin.add_view(ModelView(User, db.session))
admin.add_view(UserView(User, db.session))
# admin.add_view(ModelView(MainEmpresas, db.session))
admin.add_view(MainEmpresasView(MainEmpresas, db.session))
# admin.add_view(ModelView(ClientsCompts, db.session))
admin.add_view(ClientsComptsView(ClientsCompts, db.session))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
