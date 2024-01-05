import os
from typing import List

from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin, expose
from flask_admin.contrib.sqla import ModelView

from models import ClientsCompts, MainEmpresas
from utils.compt_utils import get_compt, ate_atual_compt, compt_to_date_obj, get_dates_sequence

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
    can_create = False
    can_delete = False
    page_size = 100

    column_filters = [
        CustomEqualFilter(column=ClientsCompts.compt, name='Compt', options=[
            (date, date) for date in sorted(get_dates_sequence(), reverse=True)
        ], )
    ]

    column_list = ['main_empresas.razao_social', 'declarado', 'nf_saidas', 'nf_entradas', 'sem_retencao',
                   'com_retencao',
                   'valor_total', 'anexo', 'envio', 'imposto_a_calcular', 'pode_declarar']

    column_labels = {
        'main_empresas.razao_social': 'Razão Social',
    }

    # forms
    form_excluded_columns = ['main_empresas', 'valor_total']

    edit_template = 'forms/clients-compts.html'

    def get_query(self):
        return super().get_query().join(MainEmpresas).order_by(ClientsCompts.imposto_a_calcular,
                                                               MainEmpresas.razao_social,
                                                               )

    def on_model_change(self, form, model, is_created):
        # Calculate valor_total based on sem_retencao and com_retencao
        model.valor_total = model.sem_retencao + model.com_retencao
        model.pode_declarar = True

        db.session.commit()
        return super(ClientsComptsView, self).on_model_change(form, model, is_created)

    def render(self, template, **kwargs):
        # Add main_empresas_razao_social to the template context
        razao_social = self._get_main_empresas()
        if razao_social:
            kwargs['main_empresas_razao_social'] = razao_social
            kwargs['main_empresas'] = razao_social
        return super(ClientsComptsView, self).render(template, **kwargs)

    def get_url(self, endpoint, **kwargs):
        if not kwargs.get("flt1_0") or "flt1_0" not in request.args:
            kwargs['flt1_0'] = get_dates_sequence(1)[0]
        else:
            return super().get_url(endpoint, **kwargs)

    def _get_main_empresas(self):
        # Implement the logic to get main_empresas.razao_social here
        # For example, if it's a column in the model, you can retrieve it like this:
        _client_id = request.args.get('id')
        is_there_id = _client_id is not None
        if is_there_id:
            model = self.get_one(_client_id)

            # return getattr(getattr(model, 'main_empresas'), 'razao_social', None)
            return getattr(model, 'main_empresas')
        return


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
