import { queryFactoryOptions } from '@/api/utils/queryFactoryOptions'
import { AxiosInstance } from 'axios'
import { StudentSemester } from './student-semester.type'

const getCurrentSemester = () => (client: AxiosInstance) => async () => {
  return (await client.get<StudentSemester>(`/semester/current-semester`))
}

export const studentSemesterQueries = {
  all: () => ['student-semester'],
  getCurrentSemester: () =>
    queryFactoryOptions({
      queryKey: ['student-semester', 'current'],
      queryFn: getCurrentSemester(),
    }),
}
