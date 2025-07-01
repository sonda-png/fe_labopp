import { FC } from 'react'
import { 
  useParams, 
  useSearch, 
  useNavigate, 
  Link,
  createFileRoute 
} from '@tanstack/react-router'

// Example 1: Route with path parameters
// Route file: src/routes/_auth/user/$userId.tsx
export const UserProfileRoute = createFileRoute('/_auth/user/$userId/')({
  component: UserProfilePage,
})

const UserProfilePage: FC = () => {
  // Get path parameters (e.g., /user/123 -> { userId: "123" })
  const { userId } = useParams({ from: '/_auth/user/$userId/' })
  
  return (
    <div>
      <h1>User Profile: {userId}</h1>
    </div>
  )
}

// Example 2: Route with search parameters
// Route file: src/routes/_auth/search.tsx
export const SearchRoute = createFileRoute('/_auth/search/')({
  component: SearchPage,
})

const SearchPage: FC = () => {
  const navigate = useNavigate()
  
  // Get search parameters (e.g., /search?q=react&page=2 -> { q: "react", page: "2" })
  const searchParams = useSearch({ from: '/_auth/search/' })
  
  const handleSearch = (query: string) => {
    // Navigate with search parameters
    navigate({ 
      to: '/_auth/search/',
      search: { 
        q: query, 
        page: '1' 
      }
    })
  }
  
  return (
    <div>
      <h1>Search Results</h1>
      <p>Query: {searchParams.q}</p>
      <p>Page: {searchParams.page}</p>
      
      <button onClick={() => handleSearch('new query')}>
        Search for "new query"
      </button>
    </div>
  )
}

// Example 3: Route with both path and search parameters
// Route file: src/routes/_auth/product/$productId.tsx
export const ProductRoute = createFileRoute('/_auth/product/$productId/')({
  component: ProductPage,
})

const ProductPage: FC = () => {
  // Get both path and search parameters
  const { productId } = useParams({ from: '/_auth/product/$productId/' })
  const searchParams = useSearch({ from: '/_auth/product/$productId/' })
  
  return (
    <div>
      <h1>Product: {productId}</h1>
      <p>Variant: {searchParams.variant}</p>
      <p>Color: {searchParams.color}</p>
    </div>
  )
}

// Example 4: Using Link component with parameters
const NavigationExample: FC = () => {
  return (
    <div>
      {/* Link with path parameters */}
      <Link 
        to="/_auth/user/$userId/" 
        params={{ userId: '123' }}
      >
        User 123 Profile
      </Link>
      
      {/* Link with search parameters */}
      <Link 
        to="/_auth/search/"
        search={{ q: 'react', page: '1' }}
      >
        Search for React
      </Link>
      
      {/* Link with both path and search parameters */}
      <Link 
        to="/_auth/product/$productId/"
        params={{ productId: 'abc' }}
        search={{ variant: 'large', color: 'blue' }}
      >
        Product ABC - Large Blue
      </Link>
    </div>
  )
}

// Example 5: Programmatic navigation with parameters
const NavigationWithParams: FC = () => {
  const navigate = useNavigate()
  
  const handleNavigate = () => {
    // Navigate with path parameters
    navigate({ 
      to: '/_auth/user/$userId/',
      params: { userId: '456' }
    })
    
    // Navigate with search parameters
    navigate({ 
      to: '/_auth/search/',
      search: { q: 'typescript', page: '2' }
    })
    
    // Navigate with both
    navigate({ 
      to: '/_auth/product/$productId/',
      params: { productId: 'xyz' },
      search: { variant: 'small', color: 'red' }
    })
  }
  
  return (
    <button onClick={handleNavigate}>
      Navigate with Parameters
    </button>
  )
}

// Example 6: Type-safe parameters (recommended approach)
// Define types for your parameters
interface UserParams {
  userId: string
}

interface SearchParams {
  q?: string
  page?: string
}

interface ProductParams {
  productId: string
}

interface ProductSearchParams {
  variant?: string
  color?: string
}

// Use typed parameters
const TypedParameterExample: FC = () => {
  const { userId } = useParams<UserParams>({ from: '/_auth/user/$userId/' })
  const searchParams = useSearch<SearchParams>({ from: '/_auth/search/' })
  
  return (
    <div>
      <p>User ID: {userId}</p>
      <p>Search Query: {searchParams.q}</p>
      <p>Page: {searchParams.page}</p>
    </div>
  )
}

export default NavigationExample 