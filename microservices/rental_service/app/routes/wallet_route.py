from app.controllers.wallet_controller import WalletController
from flask import Blueprint
from flask_jwt_extended import jwt_required

wallet_blueprint = Blueprint('wallet', __name__)
wallet_controller = WalletController()

@wallet_blueprint.route('/api/rental_income_wallet', methods=['POST'])
@jwt_required
def create_rental_income_wallet():
    return wallet_controller.create_rental_income_wallet()

@wallet_blueprint.route('/api/rental_income_wallet', methods=['GET'])
@jwt_required
def get_all_rental_income_wallets():
    return wallet_controller.get_all_rental_income_wallets()

@wallet_blueprint.route('/api/rental_income_wallet/<id>', methods=['GET'])
@jwt_required
def get_rental_income_wallet(id):
    return wallet_controller.get_rental_income_wallet(id)

@wallet_blueprint.route('/api/rental_income_wallet/<id>', methods=['PUT'])
@jwt_required
def update_rental_income_wallet(id):
    return wallet_controller.update_rental_income_wallet(id)
