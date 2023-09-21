import { MunicipalGuard } from '@/domain/models/municipal-guard'

export interface CreateMunicipalGuardRepository {
  create(data: MunicipalGuard): Promise<MunicipalGuard>
}
