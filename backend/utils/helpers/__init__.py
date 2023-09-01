from utils.models import OrmTables
from wtforms_sqlalchemy.orm import model_form
from flask import render_template, request, redirect, session
class Helpers:
    @staticmethod
    def render_form(model: OrmTables, template_path=''):
        use_form = model_form(model)
        form = use_form()
        if not template_path:
            rendered_template = render_template('helpers/get_form.html', form=form)
        else:
            rendered_template = render_template(template_path, form=form)

        return rendered_template
