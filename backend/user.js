export class User {
  constructor(name, email, password) {
    this.id = Date.now().toString();
    this.name = name;
    this.email = email;
    this.password = password; 
    this.createdAt = new Date().toISOString();
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    return password && password.length >= 6;
  }

  static validateName(name) {
    return name && name.trim().length >= 2;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt
    };
  }
}
