from app.controllers.withdraw_controller import WithdrawController
from flask import Blueprint
from flask_jwt_extended import jwt_required

withdraw_blueprint = Blueprint('withdraw', __name__)
withdraw_controller = WithdrawController()

@withdraw_blueprint.route('/api/withdraw/<account_id>', methods=['POST'])
def create_withdraw(account_id):
    return withdraw_controller.create_withdraw(account_id)

@withdraw_blueprint.route('/api/withdraw/<account_id>', methods=['GET'])
def get_all_withdraws(account_id):
    return withdraw_controller.get_withdraws_by_account_id(account_id)