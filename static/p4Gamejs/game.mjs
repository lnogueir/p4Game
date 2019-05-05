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
	
	// find_instruction(){
	// 	var shouldY = this.p4.check_y_coordinate(this.gold)
	// 	var shouldX = this.p4.check_x_coordinate(this.gold)
	// 	let xdiff = this.gold.x - this.p4.x;
	// 	let xinstruction=null;
	// 	let ydiff = this.gold.y - this.p4.y;
	// 	let yinstruction=null;

	// 	if(xdiff > 0 || (this.dangerLeft && this.dangerUp && this.dangerDown)){
	// 		xinstruction = 'right'
	// 	}else if(xdiff < 0 || (this.dangerRight && this.dangerUp && this.dangerDown)){
	// 		xinstruction = 'left'
	// 	}
		
	// 	return instruction
	// }


	horizontal_instruction(){
		let instruction
		if((this.gold.x - this.p4.x) > 0){
			instruction = "right"
		}else{
			instruction = "left"
		}
		return {prev_key:this.p4.bot.prev_key,new_key:instruction}
	}

	vertical_instruction(){
		let instruction
		if((this.gold.y - this.p4.y) > 0){
			instruction = "down"
		}else{
			instruction = "up"
		}	
		return {prev_key:this.p4.bot.prev_key,new_key:instruction}
	}

	find_gold(){
		var shouldY = this.p4.check_y_coordinate(this.gold)
		var shouldX = this.p4.check_x_coordinate(this.gold)
		if(shouldY){
			return this.horizontal_instruction()
		}else{
			return this.vertical_instruction()
		}
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



	        if(this.p4.bot){
	    		this.p4.checkDanger(elem)	
	    	}

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


	    if(this.p4.bot){
	    	// let instruction = this.find_gold()
	    	let instruction
	    	if(this.p4.isMovingRight || this.p4.isMovingLeft){
	    		if(this.p4.danger){
	    			if(!this.p4.dangerHorizontal && !this.p4.dangerVertical){
	    				instruction = {prev_key:this.p4.bot.prev_key,new_key:'pause'}
	    				console.log("PAUSEI IF HORIZONTAL")
			    	}else if(this.p4.dangerHorizontal && !this.p4.dangerVertical){
			    		instruction = this.vertical_instruction()
			    	}else if(this.p4.dangerVertical){
			    		instruction = this.horizontal_instruction()
			    	}//else move diagonal..later
	    		}else{ //not dangerous
		    		instruction = this.find_gold()
		    	}
	    	}else if(this.p4.isMovingUp || this.p4.isMovingDown){
	    		if(this.p4.danger){
	    			if(!this.p4.dangerVertical && !this.p4.dangerHorizontal){
		    			instruction = {prev_key:this.p4.bot.prev_key,new_key:'pause'}
		    			console.log("PAUSEI IF VERTICAL")
		    		}else if(this.p4.dangerVertical && !this.p4.dangerHorizontal){
		    			instruction=this.horizontal_instruction()
		    		}else if(this.p4.dangerHorizontal){
		    			instruction = this.vertical_instruction()
		    		}
	    		}else{
	    			instruction = this.find_gold()
	    		}
	    	}else{ //if paused
	    		if(this.p4.danger){
	    			if(this.p4.dangerHorizontal && !this.p4.dangerVertical){
	    				instruction=this.vertical_instruction()
	    			}else if(this.p4.dangerVertical && !this.p4.dangerHorizontal){
	    				instruction=this.horizontal_instruction()
	    			}else{
	    				instruction = {prev_key:this.p4.bot.prev_key,new_key:'pause'}
	    				console.log("PAUSEI IF PAUSED")
	    			}
	    		}else{
	    			instruction = this.find_gold()	
	    		}
	    	}
	    	if(instruction){
	    		this.p4.bot.prev_key = instruction.new_key
		    	if(instruction.prev_key!=this.p4.bot.prev_key){
		    		this.p4.bot.get_instructions(instruction)
		    	}
	    	}
	    	// //reset danger
	    	this.danger = this.dangerHorizontal = this.dangerVertical = false
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
				this.horizontal_instruction()	
			}


			this.update()	    
		    this.step();
		});
	  }
	}


export {Game}




