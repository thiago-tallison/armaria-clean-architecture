import { ArmorerModel } from '@/domain/models/armorer'

export interface CreateArmorerUseCase {
  create(data: CreateArmorerUseCase.Input): Promise<CreateArmorerUseCase.Output>
}

export namespace CreateArmorerUseCase {
  export type Input = ArmorerModel
  export type Output = ArmorerModel
}
