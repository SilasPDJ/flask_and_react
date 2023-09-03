import sqlalchemy.orm

from utils.models import OrmTables
from wtforms_sqlalchemy.orm import model_form
from flask import render_template, request, redirect, session
from typing import Type, List
from wtforms import StringField
from flask_wtf import FlaskForm

import re


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

    def render_forms(self, model: Type[OrmTables], results: List[OrmTables], action_url: str, id_fields_complement=None,
                     template_path=''):
        """
        :param model: comes from OrmTables
        :param results: are the query results TODO make the query here
        :param action_url: the form action attribute destiny
        :param id_fields_complement: a list or None, it will full fill the fields.id | defaults => fill with enumerate
        :param template_path:
        :return:
        """
        if id_fields_complement is None:
            id_fields_complement = []
        with self.session() as session:
            ComptForm = model_form(model, db_session=session, exclude='main_empresas')

        forms = []
        for e, row in enumerate(results):
            # form = use_form()
            form = ComptForm()
            for field_name, field in form._fields.items():
                try:
                    field.data = getattr(row, field_name, None)
                except Exception as e:
                    print(e)
                    pass
                if id_fields_complement:
                    field.id = f"{field.id}_{id_fields_complement[e]}"
                    field.name = f"{field.name}_{id_fields_complement[e]}"
                else:
                    field.id = f"{field.id}_{e}"
                    field.name = f"{field.name}_{e}"

            forms.append(form)

        if not template_path:
            rendered_template = render_template('helpers/inputs_fields.html', forms=forms, action_url=action_url)
        else:
            rendered_template = render_template(template_path, forms=forms)

        return rendered_template

    def get_inputs_and_label_properties(self, model: Type[OrmTables], results: List[OrmTables], action_url: str,
                                        id_fields_complement=None, template_path='') -> List[dict[str, dict[str, str]]]:

        rendered = self.render_forms(model, results, action_url, id_fields_complement, template_path)
        return self._transtorm_html_string_to_inputs_and_labels_properties(rendered)

    def _transtorm_html_string_to_inputs_and_labels_properties(self, html_code: str) -> List[dict[str, dict[str, str]]]:

        # Initialize empty lists for labels and inputs
        labels = []
        inputs = []

        # Use regular expressions to find label and input elements and extract their properties
        label_pattern = r'<label for="(.*?)">(.*?)<\/label>'
        input_pattern = r'<input (.*?)>'

        label_matches = re.findall(label_pattern, html_code)
        input_matches = re.findall(input_pattern, html_code)

        # Extract label properties and add them to the labels list
        for match in label_matches:
            label_properties = {'for': match[0], 'text': match[1]}
            labels.append(label_properties)

            # Extract input properties and label properties and create pairs
        input_label_pairs = []

        for i in range(len(input_matches)):
            input_properties = {}
            attributes = input_matches[i].split(' ')
            for attribute in attributes:
                parts = attribute.split('=')
                if len(parts) == 2:
                    key, value = parts
                    input_properties[key] = value.strip('\'"')
            inputs.append(input_properties)

            label_properties = {'for': label_matches[i][0], 'text': label_matches[i][1]}
            input_label_pair = {'input': input_properties, 'label': label_properties}
            input_label_pairs.append(input_label_pair)

        return input_label_pairs
