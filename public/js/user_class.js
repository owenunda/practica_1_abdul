import { database } from "./db.js";


export class user{
  constructor(name, email, password){
    this.name = name
    this.email = email
    this.password = password
  }

  login(){
    const db = new database()
    const user = db.getUser(this.email)
    if(this.email != user.email || this.password != user.password){
      return false
    }else{
      return true
    }
  }
}

const new_user = new user("Juan", "juan@example.com", "123456")

if(new_user.login()){
  console.log("iniciaste sesion - user_class.js:25");
}else{
  console.log("pailas - user_class.js:27");
}
