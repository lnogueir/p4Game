from flask import Flask,jsonify,request,render_template
from models.users import UserModel,UserStatus
from security import authentication, identity
from flask_jwt import JWT
from db import db
from models.games import GameModel
from security import hash_password
import pyautogui
import os

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = '123456'

db.init_app(app)

@app.before_first_request
def create_tables():
    db.create_all()


jwt = JWT(app,authentication,identity)


@app.route('/')
def homepage():
    return render_template("index.html")


@app.route('/game')
def game():
    return render_template("game.html")

@app.route('/bot',methods=['POST'])
def statistics():
	request_data = request.get_json()	
	statistic = None
	if not os.path.isfile('bot_statistics.txt'):
		open('bot_statistics.txt','w').close()
	statistic = open('bot_statistics.txt','a')
	statistic.write(str(request_data['score'])+'\n')
	statistic.close()
	scores = open('bot_statistics.txt','r')
	i = mean = 0
	for score in scores:
		mean+=int(score)
		i+=1
	mean=float(mean)/i
	scores.close()	
	pyautogui.press('space')
	return jsonify({"message":"Bot average score: {}".format(mean)})


@app.route('/users')
def users():
	users = UserModel.all_users()
	return jsonify({"users":[user.username for user in users]})


@app.route('/register',methods=['POST'])
def register():
	newUser = request.get_json()
	if UserModel.find_by_username(newUser['username']):
		return {'message':'Username already exists'}, 400
	user = UserModel(newUser['username'],hash_password(newUser['password']))
	user.save_to_db()
	return jsonify({'message':'User created successfully'})


@app.route('/api/makegame')
def makegame():
	GameModel("P4Golden").save_to_db()
	return jsonify({'message':'New game {} added'.format("P4Golden")})


@app.route('/api/game',methods=['POST'])
def game_info():
	json = request.get_json()
	user = UserStatus.find_user_by_game_name(json['game_name'],json['username'])
	if not user:
		UserStatus(json['username'],json['game_name']).save_to_db()
	game = GameModel.find_by_game_name(json['game_name'])
	if game:
		return jsonify(game.json())
	return jsonify({'message':'Game not found'})


@app.route('/api/rank',methods=['POST'])
def update_score():
	player = request.get_json()
	return jsonify(UserStatus.update_score(player['game_name'],player['username'],player['new_score']))



if __name__=='__main__':
	app.run(port=5000)











