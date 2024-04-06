from app.controllers.transaction_controller import TransactionController
from flask import Blueprint
from flask_jwt_extended import jwt_required

transaction_blueprint = Blueprint('transaction', __name__)
transaction_controller = TransactionController()

@transaction_blueprint.route('/api/transactions/<account_id>', methods=['POST'])
@jwt_required
def create_transaction(account_id):
    return transaction_controller.create_transaction(account_id)

@transaction_blueprint.route('/api/transactions', methods=['GET'])
@jwt_required
def get_all_transactions():
    return transaction_controller.get_all_transactions()

@transaction_blueprint.route('/api/transactions/<account_id>', methods=['GET'])
@jwt_required
def get_rental_income_wallet(account_id):
    return transaction_controller.get_transaction_by_account_id(account_id)
