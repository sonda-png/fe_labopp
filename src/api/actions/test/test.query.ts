import { AxiosInstance } from "axios";
import { TestMutationReponse } from "./test.types";
import { queryFactoryOptions } from "@/api/utils/queryFactoryOptions";
import { ENV } from "@/config/env";

const getFact = (client: AxiosInstance) => async () => {
    return ((await client.get<TestMutationReponse>('/')).data);
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