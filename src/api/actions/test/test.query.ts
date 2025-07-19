import { AxiosInstance } from "axios";
import { TestMutationReponse } from "./test.types";
import { queryFactoryOptions } from "@/api/utils/queryFactoryOptions";

const getFact = (client: AxiosInstance) => async () => {
    return ((await client.get<TestMutationReponse>('/')));
  };
  
  export const testQueries = {
    all: () => ['test'],
    get: () =>
      queryFactoryOptions({
        queryKey: [...testQueries.all(), 'get'],
        queryFn: getFact,
        enabled: true,
      }),
  };