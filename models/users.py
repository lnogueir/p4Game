import sqlite3
from db import db

class UserModel(db.Model):
    __tablename__='users'
    id = db.Column(db.Integer,primary_key = True)
    username=db.Column(db.String(80))
    password=db.Column(db.String(80))
    score=db.Column(db.Integer)
    game_name=db.Column(db.String(80),db.ForeignKey('games.game_name'))
    games=db.relationship('GameModel')
    

    def __init__(self,username,password):
        self.username=username
        self.password=password
        self.score=None
        self.game_name=None

    def json(self):
        return {
            "username":self.username,
            "best_score":self.score,
            "games":[game.game_name for game in self.games]
            }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_username(cls,username):
        return cls.query.filter_by(username=username).first()


    @classmethod
    def find_by_id(cls,_id):
        return cls.query.filter_by(id=_id).first()












