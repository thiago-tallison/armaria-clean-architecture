import { EmailValidator } from '@/presentation/protocols/email-validator'
import { emailSchema } from './email-schema'

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    try {
      emailSchema.parse(email)
      return true
    } catch (err) {
      return false
    }
  }
}
