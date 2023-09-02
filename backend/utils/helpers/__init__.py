from utils.models import OrmTables
from wtforms_sqlalchemy.orm import model_form
from flask import render_template, request, redirect, session
from typing import Type

class Helpers:
    @staticmethod
    def render_form(model: Type[OrmTables], action_url: str, template_path=''):
        use_form = model_form(model)
        form = use_form()
        if not template_path:
            rendered_template = render_template('helpers/get_form.html', form=form, action_url=action_url)
        else:
            rendered_template = render_template(template_path, form=form)

        return rendered_template
