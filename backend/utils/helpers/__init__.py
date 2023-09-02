import sqlalchemy.orm

from utils.models import OrmTables
from wtforms_sqlalchemy.orm import model_form
from flask import render_template, request, redirect, session
from typing import Type, List
from wtforms import StringField
from flask_wtf import FlaskForm



class Helpers:

    def __init__(self, session):
        self.session = session

    @staticmethod
    def render_form(model: Type[OrmTables], action_url: str, template_path=''):
        use_form = model_form(model)
        form = use_form()
        if not template_path:
            rendered_template = render_template('helpers/get_form.html', form=form, action_url=action_url)
        else:
            rendered_template = render_template(template_path, form=form)

        return rendered_template

    def render_forms(self, model: Type[OrmTables], results: List[OrmTables], action_url: str, template_path=''):
        with self.session() as session:
            ComptForm = model_form(model, db_session=session, exclude='main_empresas')

        forms = []
        for row in results:
            # form = use_form()
            form = ComptForm()
            for field_name, field in form._fields.items():
                try:
                    field.data = getattr(row, field_name, None)
                except Exception as e:
                    print(e)
                    pass
            forms.append(form)

        if not template_path:
            rendered_template = render_template('helpers/many_forms.html', forms=forms, action_url=action_url)
        else:
            rendered_template = render_template(template_path, forms=forms)

        return rendered_template