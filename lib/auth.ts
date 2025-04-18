// Simple encryption function for passwords
function encrypt(text: string): string {
  return btoa(text.split("").reverse().join(""))
}

// Simple decryption function for passwords
function decrypt(text: string): string {
  return atob(text).split("").reverse().join("")
}

export type TempPassword = {
  password: string
  expiresAt: number
  createdBy: string
}

export class AuthSystem {
  private static instance: AuthSystem
  private masterPassword: string
  private adminPassword: string
  private tempPasswords: TempPassword[] = []

  private constructor() {
    // Initialize with encrypted default passwords
    this.masterPassword = encrypt("master123") // Change this in production
    this.adminPassword = encrypt("admin456") // Change this in production

    // Clean up expired temporary passwords every minute
    setInterval(() => this.cleanupTempPasswords(), 60000)
  }

  static getInstance(): AuthSystem {
    if (!AuthSystem.instance) {
      AuthSystem.instance = new AuthSystem()
    }
    return AuthSystem.instance
  }

  verifyPassword(password: string): { isValid: boolean; level: "master" | "admin" | "temp" | "none" } {
    // Check master password
    if (password === decrypt(this.masterPassword)) {
      return { isValid: true, level: "master" }
    }

    // Check admin password
    if (password === decrypt(this.adminPassword)) {
      return { isValid: true, level: "admin" }
    }

    // Check temporary passwords
    const validTemp = this.tempPasswords.find((tp) => tp.password === password && tp.expiresAt > Date.now())

    if (validTemp) {
      return { isValid: true, level: "temp" }
    }

    return { isValid: false, level: "none" }
  }

  createTempPassword(createdBy: string, expiresIn: number = 24 * 60 * 60 * 1000): string {
    const password = Math.random().toString(36).substring(2, 8)

    this.tempPasswords.push({
      password,
      expiresAt: Date.now() + expiresIn,
      createdBy,
    })

    return password
  }

  private cleanupTempPasswords() {
    this.tempPasswords = this.tempPasswords.filter((tp) => tp.expiresAt > Date.now())
  }

  getTempPasswords(): TempPassword[] {
    return this.tempPasswords
  }
}
