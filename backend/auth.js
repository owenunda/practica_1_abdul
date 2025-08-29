import { database } from "./database.js";
import { User } from "./user.js";

export class AuthService {
  constructor() {
    this.db = new database();
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email y contraseña son requeridos");
    }

    const user = await this.db.getUser(email);
    
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (user.password !== password) {
      throw new Error("Contraseña incorrecta");
    }

    return {
      success: true,
      message: "Login exitoso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  async register(name, email, password) {
    if (!User.validateName(name)) {
      throw new Error("el nombre necesita minimo 2 caracteres");
    }

    if (!User.validateEmail(email)) {
      throw new Error("correo invalido");
    }

    if (!User.validatePassword(password)) {
      throw new Error("la contraseña debe minimo 6 caracteres");
    }

    const existingUser = await this.db.getUser(email);
    if (existingUser) {
      throw new Error("ya existe un usuario con ese email");
    }

    const newUser = new User(name.trim(), email.toLowerCase(), password);
    await this.db.addUser(newUser.toJSON());

    return {
      success: true,
      message: "usuario registrado exitosamente",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    };
  }
}