import { FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface User {
  id: string
  name: string
  email: string
  role: string
}

export const UsersPage: FC = () => {
  const [users, setUsers] = useState<User[]>([
    // Sample data - replace with actual data from your API
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  ])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'user',
  })

  // Create User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    // Lấy dữ liệu từ form
    const form = e.target as HTMLFormElement
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const email = (form.elements.namedItem('email') as HTMLInputElement).value

    const role = (form.elements.namedItem('role') as HTMLInputElement).value
    // Thêm user mới (giả lập id)
    setUsers(prev => [
      ...prev,
      { id: Date.now().toString(), name, email, role },
    ])
    // Đóng dialog
    form.reset()
  }

  // Edit User
  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setEditForm({ name: user.name, email: user.email, role: user.role })
    setIsEditDialogOpen(true)
  }
  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    setUsers(prev =>
      prev.map(u => (u.id === selectedUser.id ? { ...u, ...editForm } : u))
    )
    setIsEditDialogOpen(false)
  }

  // Delete User
  const openDeleteDialog = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }
  const handleDeleteUser = () => {
    if (!selectedUser) return
    setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Create New User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new user account
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select name="role">
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Create User
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditUser}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name}
                    onChange={e =>
                      setEditForm(f => ({ ...f, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    value={editForm.email}
                    onChange={e =>
                      setEditForm(f => ({ ...f, email: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={editForm.role}
                    onValueChange={value =>
                      setEditForm(f => ({ ...f, role: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete user <b>{selectedUser?.name}</b>
                ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleDeleteUser}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-orange-500 font-semibold">
                Name
              </TableHead>
              <TableHead className="text-orange-500 font-semibold">
                Email
              </TableHead>
              <TableHead className="text-orange-500 font-semibold">
                Role
              </TableHead>
              <TableHead className="text-right text-orange-500 font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-500 hover:underline"
                    onClick={() => openEditDialog(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:underline"
                    onClick={() => openDeleteDialog(user)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
