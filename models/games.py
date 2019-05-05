import sqlite3
from db import db

class GameModel(db.Model):
	__tablename__='games'
	id = db.Column(db.Integer,primary_key = True)
	game_name=db.Column(db.String(80))
	gamers=db.relationship('UserModel') 

	def __init__(self,game_name):
		self.game_name=game_name

	def json(self):
		return {"id":self.id,"game_name":self.game_name,"best_players":[gamer.json() for gamer in sorted(self.gamers, key=lambda gamer: gamer.score)[:10]]}

	@classmethod
	def find_by_id(cls,_id):
		return cls.query.filter_by(id=_id)

	def save_to_db(self):
		db.session.add(self)
		db.session.commit()

	def delete_from_db(self):
		db.session.delete(self)
		db.session.commit()	