from flask import request, jsonify
from app.models.rental import RentalDailyIncomeTransaction, RentalIncomeWallet,db
from datetime import datetime

class TransactionController():
    def create_transaction(self, account_id):
        data = request.json
        income_amount = data.get('income_amount')
        if not account_id:
            return jsonify(message='Account ID is required'), 400
        if income_amount is None or income_amount < 0:
            return jsonify(message='Invalid income amount'), 400
        wallet = RentalIncomeWallet.query.get(account_id)
        if not wallet:
            return jsonify(message='Rental income wallet not found'), 404

        wallet.total_current_balance += income_amount
        db.session.commit()
        
        # Create the new transaction
        new_transaction = RentalDailyIncomeTransaction(
            id=account_id + '_TRANS_' + datetime.now().strftime('%m_%d_%Y_%H_%M_%S'),
            income_amount=income_amount,
            is_withdrawn=False,
            account_id=account_id
        )
        db.session.add(new_transaction)
        db.session.commit()
        return jsonify(message='Rental daily income transaction created successfully'), 200

    def get_all_transactions(self):
        transactions = RentalDailyIncomeTransaction.query.all()
        result = [{'id': t.id, 'income_amount': t.income_amount, 'is_withdrawn': t.is_withdrawn, 'account_id': t.account_id} for t in transactions]
        return jsonify(result), 200

    def get_transaction_by_account_id(self, account_id):
        transaction = RentalDailyIncomeTransaction.query.get(account_id)
        if transaction:
            return jsonify({'id': transaction.id, 'income_amount': transaction.income_amount, 'is_withdrawn': transaction.is_withdrawn, 'account_id': transaction.account_id}), 200
        else:
            return jsonify(message='User not have rental daily income transaction'), 404