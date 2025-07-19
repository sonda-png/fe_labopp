import { AxiosInstance } from 'axios'
import {
  AssignmentListResponse,
  // MUTATION_TYPE_IMPORTS
} from './assignment.types'
import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions';


const getAssignment = (client: AxiosInstance) => async () => {
  return ((await client.get<AssignmentListResponse>('/head_subject/assignment/list')));
};

export const getAssignmentList = {
  all: () => ['assignments'],
  get: () =>
    queryFactoryOptions({
      queryKey: [...getAssignmentList.all(), 'get'],
      queryFn: getAssignment,
      enabled: true,
    }),
};