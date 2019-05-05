class Bot{
	constructor(){
		this.bot_address = 'http://127.0.0.1:5000/bot'
		this.prev_key = null
	}

	get_instructions(instruction){
		fetch(this.bot_address,{
		      method:'POST',
		      headers:{
		        'Accept':'application/json',
		        'Content-Type':'application/json',
		      },
		      body:JSON.stringify(instruction)
		    })
		//.then(response=>console.log(response))
	}
}

export {Bot}