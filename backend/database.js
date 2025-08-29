import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class database {
  constructor() {
    if (database.instance) {
      return database.instance;
    }
    
    this.filePath = path.join(__dirname, "../db/users.json");
    database.instance = this;
    
    console.log("nueva instancia de la db creada - database.js:17");
  }

  async getUsers() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error("error leyendo usuarios: - database.js:25", error);
      return [];
    }
  }

  async getUser(email) {
    const users = await this.getUsers();
    return users.find(user => user.email === email);
  }

  async saveUsers(users) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(users, null, 2));
      return true;
    } catch (error) {
      console.error("error guardando usuarios: - database.js:40", error);
      throw error;
    }
  }

  async addUser(userData) {
    const users = await this.getUsers();
    users.push(userData);
    await this.saveUsers(users);
  }
}
