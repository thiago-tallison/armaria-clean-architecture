export class MunicipalGuard {
  registration: string
  name: string
  email: string
  phone?: string

  constructor(params: MunicipalGuard) {
    this.registration = params.registration
    this.name = params.name
    this.email = params.email
    this.phone = params.phone
  }
}
