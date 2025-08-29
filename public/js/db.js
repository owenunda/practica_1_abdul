import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"


  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

export class database {
  getUSers(){
    const filePath = path.join(__dirname, "../db/users.json")
    const rawData = fs.readFileSync(filePath, "utf-8")
    const users = JSON.parse(rawData)
    return users  
  }

  getUser(email){
    const users = this.getUSers()

    const user = users.find(u => u.email === email)

    if(user){
      return user
    }else{
      console.log("usuario no encontrado - db.js:25")
    }
  }
}

