from flask import Flask,jsonify,request,render_template
# import pyautogui

app = Flask(__name__)


@app.route('/')
def homepage():
    return render_template("index.html")


@app.route('/game')
def game():
    return render_template("game.html")

@app.route('/bot',methods=['POST'])
def instructions():
	request_data = request.get_json()
	if request_data['prev_key']:
		pyautogui.keyUp(request_data['prev_key'])
		
	pyautogui.keyDown(request_data['new_key'])
	return jsonify({"message":"Instruction passed successfully"}), 200




app.run(port=5000)
