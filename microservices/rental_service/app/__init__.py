from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.routes.rental_route import rental_blueprint
# Custom modules
from .models.rental import db
def create_app():
    app = Flask(__name__)
    # Enable CORS
    CORS(app)
    # Configure SQLAlchemy for MySQL
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://myAdmin:myPasswordaA#@real-estate-soa-mysql.mysql.database.azure.com/real_estate_soa'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    # Initialize JWT
    app.config['JWT_SECRET_KEY'] = 'RQxdYSJnBmguTKfgjAze' 
    jwt = JWTManager(app)
    
    app.register_blueprint(rental_blueprint)

    # Create database tables
    with app.app_context():
        db.create_all()

    return app
