import { LoginMutationResponse } from '@/api/actions/auth/auth.types';
import { testQueries } from '@/api/actions/test/test.query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StandardizedApiError } from '@/context/apiClient/apiClientContextController/apiError/apiError.types';
import { useMutation, useQuery } from '@/hooks';

export default function CatFact() {
  // Get cat fact from API
  const { data } = useQuery({
    ...testQueries.get(),
  });

  // Post mutation (unchanged)
  const { mutateAsync: Handlelogin } = useMutation('loginMutation', {
    onSuccess: (res: LoginMutationResponse) => {},
    onError: (error: StandardizedApiError) => {},
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100">
      <Card className="w-[500px] border-2 border-orange-200 shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-orange-200 rounded-full flex items-center justify-center">
              <span className="text-4xl">🐱</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-orange-800">
            Cat Fact of the Day
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-lg text-orange-700 leading-relaxed">
              {data?.fact || 'Loading cat fact...'}
            </p>
            {data?.length && (
              <p className="text-sm text-orange-600">
                Fact length: {data.length} characters
              </p>
            )}
            <div className="flex justify-center space-x-2">
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                #CatFacts
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                #EarFurnishings
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}