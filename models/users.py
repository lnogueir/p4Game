import sqlite3
from db import db

class UserModel(db.Model):
    __tablename__='users'
    id = db.Column(db.Integer,primary_key = True)
    username=db.Column(db.String(80))
    password=db.Column(db.String(80))

    def __init__(self,username,password):
        self.username=username
        self.password=password

    def json(self):
        return {
            "username":self.username,
            "id":self.id
            }

    @classmethod        
    def all_users(cls):
        return cls.query.all()


    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_username(cls,username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def find_game_in_user(cls,game_name):
        return cls.query.filter_by()

    @classmethod
    def find_by_id(cls,_id):
        return cls.query.filter_by(id=_id).first()



class UserStatus(db.Model): # VOU FAZER ISSO AQUI PARA FICAR ASSOCIADO AOS JOGOS, CADA JOGO TERA VARIOS PLAYERS, ASSOCIADO AO MAIN JOGO, DEPOIS FAZER UMA CLASSE DESSA PARA ASSOCIAR OS JOGOS AO PLAYER
    __tablename__='user_status'
    id = db.Column(db.Integer,primary_key = True)
    username=db.Column(db.String(80)) 
    game_name=db.Column(db.String(80),db.ForeignKey('games.game_name'))
    score=db.Column(db.Integer)

    def __init__(self,username,game_name):
        self.username = username        
        self.game_name=game_name
        self.score=0                                  #TO FIND THE GAMES USER PLAY, I JUST FIND ALL THE USERS WITH SAME NAME AND THE GAMES PLAYED

    def json(self):
        return {"username":self.username,"score":self.score}


    @classmethod    
    def find_user_by_game_name(cls,game_name,username):
        print([n for n in cls.query.filter_by(game_name=game_name)])        
        return cls.query.filter_by(game_name=game_name).filter_by(username=username).first()


    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()     

    @classmethod
    def update_score(cls,game_name,username,new_score):
        user = cls.find_user_by_game_name(game_name,username)
        if user:
            if new_score > user.score:
                user.score=new_score
                user.save_to_db()
                return {"message":"User score updated successfully","new_score":user.score}
            return {"message":"Not best score"}    
        return {"message":"User or game not found"}

    @classmethod     
    def find_user_games(cls,username):
        return cls.query.filter_by(username=username)
        








    















