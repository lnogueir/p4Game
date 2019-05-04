import {Enemy, Gold, P4} from './entities.mjs'
import {Canvas} from './canvas.mjs'
import {Random} from './random.mjs'
import {Sounds} from './sounds.mjs'

class Game{
	constructor(){
		this.gameLive=false
		this.p4 = new P4()
		this.enemies=[new Enemy()]
		this.gold = new Gold()
		this.canvas = new Canvas()
		this.sounds = new Sounds()
		this.restart=false
	}


	handleSpace  = (e) =>{
        if(e.code == "Space" && this.restart)
        {
            // Load and play retry-sound
            this.sounds.retry()

            // Reset player
            this.p4.score = 0;
            this.p4.x = this.p4.xinit;
            this.p4.y = this.p4.yinit;

            // Reset gold
            this.gold.x = this.gold.xinit
            this.gold.y = this.gold.yinit

            // set enemies' length to 1
            this.enemies = [new Enemy()]
            // Reset enemies
            this.gameLive = true;
            this.restart=false
            this.step();
        }
    }

    update() {
	    	
	        // Update player (p4)
	        // World bounds
	       this.p4.updateCoordinates()
	       this.p4.checkBounds()

	        // Update chest
	        if(this.p4.checkCollision(this.gold))
	        {
	            // Load and play gold-sound
	            this.sounds.gold()

	            this.gold.randomSpawn()

	            this.p4.score += 10;
	            this.enemies.push(new Enemy());
	        }

	        // Update rectangles
	        this.enemies.forEach( (elem) => {
	            
	            if(this.p4.checkCollision(elem)) {

	                // Load and play hit-sound
	                this.sounds.hit()

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
	    }

	
    step = () => {    	
		// console.log(this)
        this.update();
        this.canvas.draw(this);

        if(this.gameLive) 
        {
            window.requestAnimationFrame(this.step);
        }
		    
    } 

	run (){
		window.addEventListener("load", ()=> {
			this.gameLive = true
			
			// Event listeners to move player
		    document.addEventListener("keydown", this.p4.move);
		    document.addEventListener("keyup", this.p4.stop);
		    
			this.update()	    
		    this.step();
		});
	  }
}


export {Game}




