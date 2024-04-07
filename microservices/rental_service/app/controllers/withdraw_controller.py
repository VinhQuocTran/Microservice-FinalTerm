from flask import request, jsonify
from app.models.rental import WithdrawIncome, RentalIncomeWallet, RentalDailyIncomeTransaction,db
from datetime import datetime

class WithdrawController():
    def create_withdraw(self, account_id):
        data = request.json
        withdraw_amount = data.get('withdraw_amount')
        if not account_id:
            return jsonify(message='Account ID is required'), 400
        if withdraw_amount is None or withdraw_amount < 0:
            return jsonify(message='Invalid income amount'), 400
        wallet = RentalIncomeWallet.query.get(account_id)
        if not wallet:
            return jsonify(message='Rental income wallet not found'), 404

        if withdraw_amount > wallet.total_current_balance:
            return jsonify(message='Insufficient balance in the rental income wallet'), 400
        # Create the new transaction
 
        new_withdraw = WithdrawIncome(
            id=account_id + '_WITHDRAW_' + datetime.now().strftime('%m_%d_%Y_%H_%M_%S'),
            withdraw_amount=withdraw_amount,
            withdraw_type_option=data.get('withdraw_type_option', 'Bank Transfer'),
            account_id=account_id
        )
        # Update the wallet balance
        wallet.total_current_balance -= withdraw_amount
        db.session.commit()
        # Update the transaction status
        transactions_to_update = RentalDailyIncomeTransaction.query.filter(
            RentalDailyIncomeTransaction.account_id == account_id, 
            RentalDailyIncomeTransaction.created_at < datetime.now()).all()
        for transaction in transactions_to_update:
            transaction.is_withdrawn = True
        db.session.commit()
        # Add the new WITHDRAW transaction
        db.session.add(new_withdraw)
        db.session.commit()
        return jsonify(message='Rental daily income transaction created successfully'), 200
    
    def get_withdraws_by_account_id(self, account_id):
        withdraws = WithdrawIncome.query.filter_by(account_id=account_id).all()
        result = [{'id': w.id, 'withdraw_amount': w.withdraw_amount, 'withdraw_type_option': w.withdraw_type_option, 'account_id': w.account_id} for w in withdraws]
        return jsonify(result), 200