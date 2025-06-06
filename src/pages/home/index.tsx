import { useQuery } from '@tanstack/react-query'
import { Button } from '../../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { useCounterStore } from '../../stores/counterStore'

// Sample API call for demonstration
const fetchPosts = async () => {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=5'
  )
  return response.json()
}

export default function Home() {
  const { count, increment, decrement, reset } = useCounterStore()

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">React Vite Boilerplate</h1>
        <p className="text-muted-foreground">
          With Tailwind CSS, ShadCN UI, Zustand, React Query, and TanStack
          Router
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Counter Example (Zustand)</CardTitle>
          <CardDescription>
            This demonstrates state management with Zustand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4">
            <Button onClick={decrement} variant="outline">
              -
            </Button>
            <span className="text-3xl font-bold">{count}</span>
            <Button onClick={increment}>+</Button>
            <Button onClick={reset} variant="secondary">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Posts Example (React Query)</CardTitle>
          <CardDescription>
            This demonstrates data fetching with TanStack Query
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading posts...</p>}
          {error && <p className="text-destructive">Error loading posts</p>}
          {posts && (
            <div className="space-y-2">
              {posts.map((post: any) => (
                <div key={post.id} className="p-3 border rounded">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {post.body.substring(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
