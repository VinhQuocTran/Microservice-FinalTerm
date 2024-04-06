from flask import request, jsonify
from app.models.rental import RentalIncomeWallet,db

class WalletController():
    # Function to create a new rental income wallet
    def create_rental_income_wallet(self):
        data = request.json
        new_wallet = RentalIncomeWallet(id=data.get('account_id'), total_current_balance=data.get('total_current_balance', 0))
        db.session.add(new_wallet)
        db.session.commit()
        return jsonify({'message': 'Rental income wallet created successfully'}), 201

    def get_all_rental_income_wallets(self):
        filters = request.args.to_dict()
        query = RentalIncomeWallet.query
        if 'id' in filters:
            ids = filters['id'].split(',')
            query = query.filter_by(id=ids)
        if 'min_balance' in filters:
            query = query.filter(RentalIncomeWallet.total_current_balance >= float(filters['min_balance']))
        if 'max_balance' in filters:
            query = query.filter(RentalIncomeWallet.total_current_balance <= float(filters['max_balance']))
        wallets = query.all()
        result = [{'account_id': wallet.id, 'total_current_balance': wallet.total_current_balance} for wallet in wallets]
        return jsonify(result), 200

    # Function to retrieve a specific rental income wallet by ID
    def get_rental_income_wallet(self,id):
        wallet = RentalIncomeWallet.query.get(id)
        if wallet:
            return jsonify({'account_id': wallet.id, 'total_current_balance': wallet.total_current_balance}), 200
        else:
            return jsonify({'message': 'Rental income wallet not found'}), 404

    # Function to update a rental income wallet by ID
    def update_rental_income_wallet(self, id):
        wallet = RentalIncomeWallet.query.get(id)
        if wallet:
            data = request.json
            wallet.total_current_balance = data.get('total_current_balance', wallet.total_current_balance)
            db.session.commit()
            return jsonify({'message': 'Rental income wallet updated successfully'}), 200
        else:
            return jsonify({'message': 'Rental income wallet not found'}), 404