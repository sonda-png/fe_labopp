import { Badge } from '../../components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'

export default function About() {
  const technologies = [
    'React 18',
    'TypeScript',
    'Vite',
    'Tailwind CSS',
    'ShadCN UI',
    'Zustand',
    'TanStack Query',
    'TanStack Router',
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">About</h1>
        <p className="text-muted-foreground">
          Learn about this React Vite boilerplate
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Technologies Used</CardTitle>
          <CardDescription>
            This boilerplate includes the following modern technologies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {technologies.map(tech => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>🚀 Fast development with Vite</li>
            <li>⚡ Modern React with TypeScript</li>
            <li>🎨 Beautiful UI with Tailwind CSS and ShadCN UI</li>
            <li>🔄 State management with Zustand</li>
            <li>🌐 Data fetching with TanStack Query</li>
            <li>🛣️ Type-safe routing with TanStack Router</li>
            <li>📱 Responsive design</li>
            <li>🌙 Dark mode support</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
