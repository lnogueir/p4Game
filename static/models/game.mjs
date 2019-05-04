import { Enemy, Gold, P4 } from "./entities.mjs";
import { Canvas } from "./canvas.mjs";
import { Random } from "./random.mjs";
import { Sounds } from "./sounds.mjs";

class Game {
	constructor() {
		this.gameLive = false;
		this.p4 = new P4();
		this.enemies = [new Enemy()];
		this.gold = new Gold();
		this.canvas = new Canvas();
		this.sounds = new Sounds();
		this.restart = false;
	}
	
	find_instruction(){
		var shouldY = this.p4.check_y_coordinate(this.gold)

		let xdiff = this.gold.x - this.p4.x;
		let xinstruction=null;
		if(xdiff > 0){
			xinstruction="right"
		}else{
			xinstruction="left"
		}

		let ydiff = this.gold.y - this.p4.y;
		let yinstruction=null;
		if(ydiff > 0){
			yinstruction="down"
		}else{
			yinstruction="up"
		}
		let instruction
		if(!shouldY){
			instruction = {
				prev_key:this.p4.bot.prev_key,
				new_key:yinstruction 
			}
		}else{
			instruction = {
				prev_key:this.p4.bot.prev_key,
				new_key:xinstruction 
			}
		}
		return instruction
	}


	handleSpace = (e) => {

        if(e.code == "Space" && this.restart)
        {
            // Load and play retry-sound
            this.sounds.retry();
            
            // Reset player
            this.p4.score = 0;
            this.p4.x = this.p4.xinit;
            this.p4.y = this.p4.yinit;

            //reset player Bot
            if(this.p4.bot){
            	this.p4.bot.get_instructions({
            		prev_key:this.p4.bot.prev_key,
            		new_key:'restart'
            	})
            }

            // Reset gold
            this.gold.x = this.gold.xinit;
            this.gold.y = this.gold.yinit;

            // set enemies' length to 1
            this.enemies = [new Enemy()];
            // Reset enemies
            this.gameLive = true;
            this.restart = false;
            this.step();
        }
    }

    update() {
	    	
	    // Update player (p4)
	    // World bounds
	    this.p4.updateCoordinates();
	    this.p4.checkBounds();	    

	    // Update chest
	    if(this.p4.checkCollision(this.gold))
	    {
	    	
	        // Load and play gold-sound
	        this.sounds.gold();

	        this.gold.randomSpawn();
	        if(this.p4.bot){
	        	let instruction = this.find_instruction()	    	
	    		this.p4.bot.prev_key = instruction.new_key
	    		if(instruction.prev_key!=this.p4.bot.prev_key){
	    			this.p4.bot.get_instructions(instruction)    		
	    		}
	        }

	        this.p4.score += 10;
	        this.enemies.push(new Enemy());
	    }

	    // Update rectangles
	    this.enemies.forEach((elem) => {

	    	

			if(this.p4.checkCollision(elem)) 
			{
				// Load and play hit-sound
				this.sounds.hit();

				// Stop game
				this.gameLive = false;

				// Handle space
				this.restart=true
				document.addEventListener("keydown", this.handleSpace);
			
	        }

	        elem.y += elem.yspeed;
	        elem.x += elem.xspeed;

	        if(elem.y + elem.height >= this.canvas.height - 3 || elem.y <= 5)
	        {
	            elem.yspeed = -elem.yspeed;
	            elem.color = Random.getColor();
	        }
	        if(elem.x + elem.width >= this.canvas.width - 3 || elem.x <= 5)
	        {
	            elem.xspeed = -elem.xspeed;
	            elem.color = Random.getColor();
	        }
	    });

	    //In case there is a bot, it finds the instructions for the bot to move.
	    if(this.p4.bot && 
	    (this.p4.check_x_coordinate(this.gold) || this.p4.check_y_coordinate(this.gold))){
	    	let instruction = this.find_instruction()
	    	// console.log(instruction)
	    	this.p4.bot.prev_key = instruction.new_key
	    	if(instruction.prev_key!=this.p4.bot.prev_key){
	    		this.p4.bot.get_instructions(instruction)    		
	    	}

	    }
	}



    step = () => {    	
        this.update();
        this.canvas.draw(this);

        if(this.gameLive) 
        {
            window.requestAnimationFrame(this.step);
        }
		    
    } 

	run () {
		window.addEventListener("load", ()=> {
			this.gameLive = true
			

			// Event listeners to move player
		    document.addEventListener("keydown", this.p4.move);
		    document.addEventListener("keyup", this.p4.stop);

		    this.p4.initializeBot()
		    if(this.p4.bot){
				this.find_instruction()	
			}


			this.update()	    
		    this.step();
		});
	  }
}


export {Game}




