from flask import Blueprint

main_bp = Blueprint('main', __name__)

@main_bp.post('/news')
def news():
    pass

@main_bp.post('/summary')
def summary():
    pass

@main_bp.post('/register')
def register():
    pass

@main_bp.post('/login')
def login():
    pass