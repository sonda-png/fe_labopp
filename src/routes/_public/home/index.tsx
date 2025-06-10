import { createFileRoute } from '@tanstack/react-router'
import Home from '../../../pages/home'
import About from '@/pages/about'

export const Route = createFileRoute('/_public/home/')({
  component: About,
})
