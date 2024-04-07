from app.models.rental import db, RentalIncomeWallet, RentalDailyIncomeTransaction, WithdrawIncome
from app import create_app

# Create some sample data
def create_sample_data():
    # Create rental income wallets
    wallet1 = RentalIncomeWallet(id='wallet1', total_current_balance=1000.0)
    wallet2 = RentalIncomeWallet(id='wallet2', total_current_balance=2000.0)
    
    # Create rental daily income transactions
    transaction1 = RentalDailyIncomeTransaction(id='transaction1', income_amount=500.0, account_id='wallet1')
    transaction2 = RentalDailyIncomeTransaction(id='transaction2', income_amount=800.0, account_id='wallet2')

    # Create withdraw incomes
    withdraw1 = WithdrawIncome(id='withdraw1', withdraw_amount=200.0, withdraw_type_option='Bank Transfer', account_id='wallet1')
    withdraw2 = WithdrawIncome(id='withdraw2', withdraw_amount=300.0, withdraw_type_option='Cash', account_id='wallet2')

    # Add instances to the session
    db.session.add_all([wallet1, wallet2, transaction1, transaction2, withdraw1, withdraw2])

    # Commit the changes
    db.session.commit()

if __name__ == '__main__':
    # Create the Flask app
    app = create_app()

    # Context creation for the app
    with app.app_context():
        # Call the function to create sample data
        create_sample_data()
