import { EmailValidator } from '@/presentation/protocols/email-validator'
import { z } from 'zod'

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    const emailSchema = z.string().email()
    try {
      emailSchema.parse(email)
      return true
    } catch (err) {
      return false
    }
  }
}
