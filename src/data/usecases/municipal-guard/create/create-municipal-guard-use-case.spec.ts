import {
  CheckMunicipalGuardByEmailRepository,
  CheckMunicipalGuardRepository,
  CreateMunicipalGuardRepository,
  MunicipalGuard
} from './create-municipal-guard-protocols'
import { DBCreteMunicipalGuardUseCase } from './create-municipal-guard-use-case'

const makeCheckMunicipalGuardRepositoryStub = () => {
  class CheckMunicipalGuardRepositoryStub
    implements CheckMunicipalGuardRepository
  {
    check(_: string): Promise<boolean> {
      return new Promise(resolve => resolve(false))
    }
  }
  return new CheckMunicipalGuardRepositoryStub()
}

const makeMunicipalGuardData = (): MunicipalGuard =>
  new MunicipalGuard({
    registration: 'any_registration',
    name: 'any_name',
    email: 'any_email@mail.com',
    phone: 'any_phone_number'
  })

const makeCreateMunicipalGuardRepositoryStub = () => {
  class CreateMunicipalGuardRepositoryStub
    implements CreateMunicipalGuardRepository
  {
    create(data: MunicipalGuard): Promise<MunicipalGuard> {
      return new Promise(resolve => resolve(data))
    }
  }
  return new CreateMunicipalGuardRepositoryStub()
}

const makeCheckMunicipalGuardByEmailRepositoryStub = () => {
  class CheckMunicipalGuardByEmailRepositoryStub
    implements CheckMunicipalGuardByEmailRepository
  {
    check(_: string): Promise<boolean> {
      return new Promise(resolve => resolve(false))
    }
  }
  return new CheckMunicipalGuardByEmailRepositoryStub()
}

type SutType = {
  sut: DBCreteMunicipalGuardUseCase
  createMunicipalGuardRepositoryStub: CreateMunicipalGuardRepository
  checkMunicipalGuardRepositoryStub: CheckMunicipalGuardRepository
  checkMunicipalGuardByEmailRepositoryStub: CheckMunicipalGuardByEmailRepository
}

const makeSut = (): SutType => {
  const checkMunicipalGuardRepositoryStub =
    makeCheckMunicipalGuardRepositoryStub()
  const checkMunicipalGuardByEmailRepositoryStub =
    makeCheckMunicipalGuardByEmailRepositoryStub()
  const createMunicipalGuardRepositoryStub =
    makeCreateMunicipalGuardRepositoryStub()
  const sut = new DBCreteMunicipalGuardUseCase(
    createMunicipalGuardRepositoryStub,
    checkMunicipalGuardRepositoryStub,
    checkMunicipalGuardByEmailRepositoryStub
  )
  return {
    sut,
    createMunicipalGuardRepositoryStub,
    checkMunicipalGuardRepositoryStub,
    checkMunicipalGuardByEmailRepositoryStub
  }
}

describe('CreteMunicipal Guard UseCase', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should call CreateMunicipalGuardRepository with correct values', async () => {
    const guardData = makeMunicipalGuardData()
    const { sut, createMunicipalGuardRepositoryStub } = makeSut()
    const createSpy = jest.spyOn(createMunicipalGuardRepositoryStub, 'create')
    await sut.create(guardData)
    expect(createSpy).toHaveBeenCalledTimes(1)
    expect(createSpy).toHaveBeenCalledWith(guardData)
  })

  it('should throws if CreateMunicipalGuardRepository throws', async () => {
    const guardData = makeMunicipalGuardData()
    const { sut, createMunicipalGuardRepositoryStub } = makeSut()
    jest
      .spyOn(createMunicipalGuardRepositoryStub, 'create')
      .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())))
    await expect(sut.create(guardData)).rejects.toThrow(new Error())
  })

  it('should not be able to create an MunicipalGuard with an existent registration', async () => {
    const guardData = makeMunicipalGuardData()
    const {
      sut,
      checkMunicipalGuardRepositoryStub,
      createMunicipalGuardRepositoryStub
    } = makeSut()
    jest
      .spyOn(checkMunicipalGuardRepositoryStub, 'check')
      .mockReturnValueOnce(new Promise(resolve => resolve(true)))

    const createSpy = jest.spyOn(createMunicipalGuardRepositoryStub, 'create')
    await expect(sut.create(guardData)).rejects.toThrow()
    expect(createSpy).toHaveBeenCalledTimes(0)
  })

  it('should not be able to create an MunicipalGuard with an existent email', async () => {
    const guardData = makeMunicipalGuardData()
    const {
      sut,
      checkMunicipalGuardByEmailRepositoryStub,
      createMunicipalGuardRepositoryStub
    } = makeSut()
    const createSpy = jest.spyOn(createMunicipalGuardRepositoryStub, 'create')
    jest
      .spyOn(checkMunicipalGuardByEmailRepositoryStub, 'check')
      .mockReturnValueOnce(new Promise(resolve => resolve(true)))
    await expect(sut.create(guardData)).rejects.toThrow()
    expect(createSpy).toHaveBeenCalledTimes(0)
  })

  it('should return an MunicipalGuard on success', async () => {
    const guardData = makeMunicipalGuardData()
    const { sut } = makeSut()
    const promise = sut.create(guardData)
    await expect(promise).resolves.toBeInstanceOf(Object)
  })
})
