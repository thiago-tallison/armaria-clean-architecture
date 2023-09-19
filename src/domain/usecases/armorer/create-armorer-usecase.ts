import { ArmorerModel } from '@/domain/models/armorer'

export interface CreateArmorerUseCase {
  execute(
    data: CreateArmorerUseCase.Input
  ): Promise<CreateArmorerUseCase.Output>;
}

export namespace CreateArmorerUseCase {
  export type Input = {
    registration: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
  };
  export type Output = Promise<ArmorerModel>;
}
