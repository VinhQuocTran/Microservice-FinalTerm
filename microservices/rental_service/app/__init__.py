from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.routes.wallet_route import wallet_blueprint
from app.routes.transcation_route import transaction_blueprint
from app.routes.withdraw_route import withdraw_blueprint
# Custom modules
from .models.rental import db
def create_app():
    app = Flask(__name__)
    # Enable CORS
    CORS(app)
    
    # Configure SQLAlchemy for MySQL
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:admin@172.17.0.2/real_estate' 
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    # Initialize JWT
    app.config['JWT_SECRET_KEY'] = 'RQxdYSJnBmguTKfgjAze' 
    jwt = JWTManager(app)
    
    app.register_blueprint(wallet_blueprint)
    app.register_blueprint(transaction_blueprint)
    app.register_blueprint(withdraw_blueprint)

    # Create database tables
    with app.app_context():
        db.create_all()

    return app
