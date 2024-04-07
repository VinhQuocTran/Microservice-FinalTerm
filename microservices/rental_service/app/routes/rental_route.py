from app.controllers.transaction_controller import TransactionController
from app.controllers.wallet_controller import WalletController
from flask import Blueprint
from flask_jwt_extended import jwt_required
from app.controllers.withdraw_controller import WithdrawController

rental_blueprint = Blueprint('rental', __name__)

transaction_controller = TransactionController()
wallet_controller = WalletController()
withdraw_controller = WithdrawController()

@jwt_required
@rental_blueprint.route('/api/rental_income_wallet', methods=['POST'])
def create_rental_income_wallet():
    return wallet_controller.create_rental_income_wallet()

@jwt_required
@rental_blueprint.route('/api/rental_income_wallet', methods=['GET'])
def get_all_rental_income_wallets():
    return wallet_controller.get_all_rental_income_wallets()

@jwt_required
@rental_blueprint.route('/api/rental_income_wallet/<id>', methods=['GET'])
def get_rental_income_wallet(id):
    return wallet_controller.get_rental_income_wallet(id)

@jwt_required
@rental_blueprint.route('/api/rental_income_wallet', methods=['PUT'])
def update_rental_income_wallet():
    return wallet_controller.update_rental_income_wallet()

@jwt_required
@rental_blueprint.route('/api/transactions/<account_id>', methods=['POST'])
def create_transaction(account_id):
    return transaction_controller.create_transaction(account_id)

@jwt_required
@rental_blueprint.route('/api/transactions', methods=['GET'])
def get_all_transactions():
    return transaction_controller.get_all_transactions()

@jwt_required
@rental_blueprint.route('/api/transactions/<account_id>', methods=['GET'])
def get_transaction_by_account_id(account_id):
    return transaction_controller.get_transaction_by_account_id(account_id)

@jwt_required
@rental_blueprint.route('/api/withdraw/<account_id>/cash', methods=['GET'])
def create_withdraw(account_id):
    return withdraw_controller.create_withdraw(account_id)
@jwt_required
@rental_blueprint.route('/api/withdraw/<account_id>', methods=['GET'])
def get_all_withdraws(account_id):
    return withdraw_controller.get_withdraws_by_account_id(account_id)