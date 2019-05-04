class Sounds{
	constructor(){
		this.hitSound=null
		this.goldSound=null
		this.retrySound=null
	}

	hit(){
		if(!this.hitSound){
			this.hitSound = new Audio();
        	this.hitSound.src = "http://127.0.0.1:5000/static/assets/hit-sound.wav";	
		}
        this.hitSound.load();
        this.hitSound.play()
    }
    gold(){
    	if(!this.goldSound){
    		this.goldSound = new Audio();
        	this.goldSound.src = "http://127.0.0.1:5000/static/assets/gold-sound.wav";	
    	}
        this.goldSound.load();
        this.goldSound.play()
    }
    
    retry(){
    	if(!this.retrySound){
    		this.retrySound = new Audio();
        	this.retrySound.src = "http://127.0.0.1:5000/static/assets/retry-sound.wav";
    	}
        this.retrySound.load();	
        this.retrySound.play()
    }       
}


export {Sounds}