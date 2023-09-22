import sqlalchemy.orm

from utils.models import OrmTables
from wtforms_sqlalchemy.orm import model_form
from flask import render_template, request, redirect, session
from typing import Type, List
from wtforms import StringField
from flask_wtf import FlaskForm
import pandas as pd
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
            rendered_template = render_template(template_path, form=form, action_url=action_url)

        return rendered_template

    def get_inputs_and_label_properties(self, model: Type[OrmTables], action_url: str, template_path='') -> List[
        dict[str, dict[str, str]]]:
        """
        :param model: any OrmModels in the parent class
        :param action_url: the backend route form's destiny
        :param template_path: in templates' directory
        :return:
        """
        if template_path == '':
            template_path = 'helpers/inputs_fields.html'
        rendered = self.render_form(model, action_url, template_path)
        return self._transtorm_html_string_to_inputs_and_labels_properties(rendered)

    def _transtorm_html_string_to_inputs_and_labels_properties(self, html_code: str, without_value=True) -> List[
        dict[str, dict[str, str]]]:

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
            if without_value:
                del input_properties['value']
            inputs.append(input_properties)

            label_properties = {'for': label_matches[i][0], 'text': label_matches[i][1]}
            input_label_pair = {'input': input_properties, 'label': label_properties}
            input_label_pairs.append(input_label_pair)

        return input_label_pairs

    @staticmethod
    def reorder_df_columns_to_the_end(df: pd.DataFrame, *columns_to_move: str) -> pd.DataFrame:
        """
        :param df: the dataframe that will be changed
        :param columns_to_move:
        :return:
        """
        columns_except = [col for col in df.columns if col not in columns_to_move]
        new_order = columns_except + list(columns_to_move)
        return df[new_order]
