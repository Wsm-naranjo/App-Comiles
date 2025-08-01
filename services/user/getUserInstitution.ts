import { InstitutionResponse } from '@/interfaces/institution/Institutionresponse';
import api from '../api';

export const getUserInstitution = async (institutionId:number|null): Promise<InstitutionResponse|undefined>=>{

  if(!institutionId) return

  const res = await api.get(`institucion/${institutionId}`)
  return res.data
}