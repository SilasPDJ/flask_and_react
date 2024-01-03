from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Boolean, Column, ForeignKey
from sqlalchemy import Integer, String, Numeric, Date
from sqlalchemy.orm import relationship

db = SQLAlchemy()


class MainEmpresas(db.Model):
    __tablename__ = 'main_empresas'

    id = db.Column(db.Integer, primary_key=True)
    razao_social = db.Column(db.String(255))
    cnpj = db.Column(db.String(18), unique=True)
    cpf = db.Column(db.String(14))
    codigo_simples = db.Column(db.String(12))
    email = db.Column(db.String(255))
    gissonline = db.Column(db.String(500))
    giss_login = db.Column(db.String(50))
    ginfess_cod = db.Column(db.String(100))
    ginfess_link = db.Column(db.String(500))
    ha_procuracao_ecac = db.Column(db.String(15))
    status_ativo = db.Column(db.Boolean())

    clients_compts = db.relationship("ClientsCompts", back_populates="main_empresas")

    def __repr__(self):
        return f"<MainEmpresas(cnpj='{self.cnpj}', razao_social='{self.razao_social}')>"


class ClientsCompts(db.Model):
    __tablename__ = 'clients_compts'

    id = db.Column(db.Integer, primary_key=True)
    main_empresa_id = db.Column(db.Integer, db.ForeignKey('main_empresas.id'))
    main_empresas = db.relationship("MainEmpresas", back_populates="clients_compts")
    declarado = db.Column(db.Boolean())
    nf_saidas = db.Column(db.String(30))
    nf_entradas = db.Column(db.String(30))
    sem_retencao = db.Column(db.Numeric(precision=10, scale=2))
    com_retencao = db.Column(db.Numeric(precision=10, scale=2))
    valor_total = db.Column(db.Numeric(precision=10, scale=2))
    anexo = db.Column(db.String(3))
    envio = db.Column(db.Boolean())
    imposto_a_calcular = db.Column(db.String(7))
    compt = db.Column(db.Date())
    pode_declarar = db.Column(db.Boolean())
    venc_das = db.Column(db.Date())

    def __repr__(self):
        return f"{self.id} - {self.main_empresa_id:03d} - {self.main_empresas.razao_social}"
