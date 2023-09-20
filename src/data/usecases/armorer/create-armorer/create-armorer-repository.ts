import { ArmorerModel } from '@/domain/models/armorer'

export interface CreateArmorerRepository {
  create(data: ArmorerModel): Promise<ArmorerModel>
}
