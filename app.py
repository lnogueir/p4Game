from flask import Flask,jsonify,request,render_template
from models.users import UserModel
from security import authentication, identity
from flask_jwt import JWT
from db import db
from models.games import GameModel
from security import hash_password
import pyautogui

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
def instructions():
	possibilities = ["right","left","up","down"]
	request_data = request.get_json()
	# print(request_data)
	if request_data['new_key']!='pause' and request_data['new_key']!='restart':
		pyautogui.keyDown(request_data['new_key'])
	for p in possibilities:
		if p!=request_data["new_key"]:
			pyautogui.keyUp(p)
	return jsonify({"message":"Instruction passed successfully"}), 200


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


@app.route('/api/game')
def game_info():
	game = GameModel.find_by_game_name("P4Golden")
	if game:
		return jsonify(game.json())
	return jsonify({'message':'Game not found'})



if __name__=='__main__':
	app.run(port=5000)











