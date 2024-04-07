from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, Float, Boolean
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class RentalIncomeWallet(db.Model):
    __tablename__ = 'rental_income_wallet'
    id = db.Column(String(50), primary_key=True)
    total_current_balance = db.Column(Float, default=0)
    transactions = relationship('RentalDailyIncomeTransaction', backref='wallet', lazy=True)
    withdrawals = relationship('WithdrawIncome', backref='wallet', lazy=True)

class RentalDailyIncomeTransaction(db.Model):
    __tablename__ = 'rental_daily_income_transaction'
    id = db.Column(String(50), primary_key=True)
    income_amount = db.Column(Float, nullable=False)
    is_withdrawn = db.Column(Boolean, nullable=False, default=False)
    created_at = db.Column(DateTime, default=datetime.now)
    account_id = db.Column(String(50), ForeignKey('rental_income_wallet.id'), nullable=False)

class WithdrawIncome(db.Model):
    __tablename__ = 'withdraw_income'
    id = db.Column(String(50), primary_key=True)
    withdraw_amount = db.Column(Float, nullable=False)
    withdraw_type_option = db.Column(String(50), nullable=False)  # Specify length for VARCHAR column
    withdraw_date = db.Column(DateTime, nullable=False, default=datetime.now)
    account_id = db.Column(String(50), ForeignKey('rental_income_wallet.id'), nullable=False)


