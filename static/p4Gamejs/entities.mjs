import { Random } from "./random.mjs";
import { Canvas } from "./canvas.mjs";
import { Bot } from "./bot.mjs"

class Entities {
	constructor(height, width, x, y, xspeed, yspeed) {
		this.height = height;
		this.width = width;
		this.x = x;
		this.y = y;
		this.xspeed = xspeed;
		this.yspeed = yspeed;
	}

	randomSpawn() {
		this.x = Random.getX(this.width);
		this.y = Random.getY(this.height);
	}

    check_x_coordinate(ent2){
        return this.x + this.width > ent2.x && this.x < ent2.x + ent2.width   
    }

    check_y_coordinate(ent2){
        return this.y + this.height > ent2.y && this.y < ent2.y + ent2.height;
    }

	checkCollision(ent2)
    {
        return this.check_x_coordinate(ent2) && this.check_y_coordinate(ent2)
    }
}

class Enemy extends Entities {
	constructor() {
		const flag=Random.getBoolean()
		super(
			15, 10,
			Random.getX(10),
			Random.getY(15),
			flag ? Random.getSpeed():0,
			!flag ? Random.getSpeed():0
			)
		this.color=Random.getColor()		
	}
}

class P4 extends Entities {
	constructor() {
		super(
				15, 25,
				10, (Canvas.dimensions().height/2),
				4, 4
			)
		this.score = 0;
		this.sprite = new Image();
		this.sprite.src = "http://127.0.0.1:5000/static/assets/hero-face.png";
		this.xinit = 10;
		this.yinit = Canvas.dimensions().height/2;
		this.isMovingLeft = false;
		this.isMovingRight = false;
		this.isMovingUp = false;
		this.isMovingDown = false;
        this.bot = null
        this.dangerVertical=false
        this.dangerHorizontal=false
        this.danger = false
	}

    initializeBot(){
        if(!this.bot){
            this.bot = new Bot()
        }
    }

    checkDanger(elem){
        if(this.bot){
            let xdiff = Math.abs(elem.x - this.x)
            let ydiff = Math.abs(elem.y - this.y)
            var distance_to_enemy = Math.sqrt(Math.pow(xdiff,2)+Math.pow(ydiff,2))
            if(distance_to_enemy <=60){
                if(this.check_x_coordinate(elem)){
                    this.dangerVertical = true
                }if(this.check_y_coordinate(elem)){
                    this.dangerHorizontal = true
                }
                this.danger = true
            }
        }
    }

	move = (e) => {
       if(e.code == "ArrowRight") 
        {
            this.isMovingRight = true;
        }
        if(e.code == "ArrowLeft")
        {
            this.isMovingLeft = true;
        }
        if(e.code == "ArrowUp")
        {
            this.isMovingUp = true;
        }
        if(e.code == "ArrowDown")
        {
            this.isMovingDown = true;
        }
	}

	stop = (e) => {
		if(e.code == "ArrowRight") 
        {
            this.isMovingRight = false;
        }
        if(e.code == "ArrowLeft")
        {
            this.isMovingLeft = false;
        }
        if(e.code == "ArrowUp")
        {
            this.isMovingUp = false;
        }
        if(e.code == "ArrowDown")
        {
            this.isMovingDown = false;
        }
    }

    updateCoordinates() {
    	if(this.isMovingRight) 
        {
            this.x += this.xspeed;
        }
        if(this.isMovingLeft)
        {
            this.x -= this.xspeed;
        }
        if(this.isMovingUp)
        {
            this.y -= this.yspeed;
        }
        if(this.isMovingDown)
        {
            this.y += this.yspeed;
        }
    }

    checkBounds() {
    	if(this.x + this.width > Canvas.dimensions().width)
        {
            this.x -= this.xspeed; 
        }
        if (this.x < 0)
        {
            this.x += this.xspeed;
        } 
        
        if(this.y + this.height > Canvas.dimensions().height)
        {
            this.y -= this.yspeed;
        }
        if(this.y < 0)
        {
            this.y += this.yspeed;
        }
    }
}

class Gold extends Entities {
	constructor() {
		super(
			18, 40,
			Canvas.dimensions().width - 46,
			(Canvas.dimensions().height/2) - 15/4,
			0, 0
			)
		this.xinit = Canvas.dimensions().width - 46;  
		this.yinit = (Canvas.dimensions().height/2) - 15/4;
		this.sprite = new Image();
		this.sprite.src = "http://127.0.0.1:5000/static/assets/gold.png";
	}
}

export {Enemy,P4,Gold};