# React Vite Boilerplate

A modern React development boilerplate built with Vite and TypeScript, featuring the latest tools and best practices.

## ✨ Features

- ⚡ **Vite** - Lightning fast build tool
- ⚛️ **React 18** - Latest React with TypeScript
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧱 **ShadCN UI** - Beautiful and accessible UI components
- 🐻 **Zustand** - Lightweight state management
- 🔄 **TanStack Query** - Powerful data fetching and caching
- 🛣️ **TanStack Router** - Type-safe routing
- 🛠️ **TypeScript** - Full type safety
- 📱 **Responsive Design** - Mobile-first approach
- 🌙 **Dark Mode Support** - Built-in theme system
- 🔍 **ESLint** - Code linting and quality checks
- 💅 **Prettier** - Automatic code formatting
- 🐕 **Husky** - Git hooks for pre-commit validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd react-vite-boilerplate
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # ShadCN UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── pages/              # Page components
├── stores/             # Zustand stores
└── router.tsx          # Route definitions
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## 🎯 Technologies Used

### Core

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool

### Styling

- **Tailwind CSS** - Utility-first CSS
- **ShadCN UI** - Component library

### State Management

- **Zustand** - Simple state management

### Data Fetching

- **TanStack Query** - Server state management
- **TanStack Query Devtools** - Development tools

### Routing

- **TanStack Router** - Type-safe routing
- **TanStack Router Devtools** - Development tools

### Development Tools

- **ESLint** - Code linting and quality checks
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Run linters on staged files

## 📚 Usage Examples

### State Management with Zustand

```tsx
import { useCounterStore } from '@/stores/counterStore'

function Counter() {
  const { count, increment, decrement } = useCounterStore()

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

### Data Fetching with TanStack Query

```tsx
import { useQuery } from '@tanstack/react-query'

function Posts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(res => res.json()),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error occurred</div>

  return <div>{data?.map(post => <div key={post.id}>{post.title}</div>)}</div>
}
```

### Routing with TanStack Router

```tsx
import { Link } from '@tanstack/react-router'

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  )
}
```

## 🔧 Configuration

### Adding New Routes

1. Create your page component in `src/pages/`
2. Add the route to `src/router.tsx`

### Adding ShadCN Components

Use the ShadCN CLI to add new components:

```bash
npx shadcn-ui@latest add button
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url_here
```

### Code Quality and Git Hooks

This project includes automated code quality checks:

**Pre-commit hooks:**

- Branch protection warning for main/master
- TypeScript type checking
- ESLint linting with auto-fix
- Prettier code formatting
- Only staged files are processed

**Pre-push hooks:**

- Prevents direct push to protected branches (main, master, develop)
- Forces use of feature branches and pull requests

**Prepare-commit-msg hooks:**

- Automatically adds branch name to commit messages
- Works with feature/, bugfix/, hotfix/, chore/ branch naming

**Commit message validation:**

- Enforces conventional commit format
- Format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert

**Example commit messages:**

```bash
feat(auth): add login functionality
fix(ui): resolve button styling issue
docs: update README with setup instructions
```

**Branch Protection:**

```bash
# ❌ This will be blocked
git checkout main
git commit -m "fix: some changes"
git push origin main

# ✅ Recommended workflow
git checkout -b feature/user-authentication
git commit -m "feat(auth): add login functionality"
git push origin feature/user-authentication
# Then create Pull Request

# 🚨 Emergency bypass (use sparingly)
git push --no-verify origin main
git commit --no-verify -m "hotfix: critical bug"
```

**VS Code Integration:**

- Auto-format on save
- ESLint errors highlighted
- Recommended extensions list

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack Query](https://tanstack.com/query)
- [TanStack Router](https://tanstack.com/router)
