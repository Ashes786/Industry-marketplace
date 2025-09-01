'use client'

import { useState, useEffect } from 'react'
import { useAuth, ProtectedRoute } from '@/lib/simple-auth'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { 
  Users, 
  Search, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  Eye,
  Loader2
} from 'lucide-react'

function UsersPageContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Fetch real users from API
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users')
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users || [])
        } else {
          const errorData = await response.json().catch(() => ({}))
          const errorMessage = errorData.error || 'Failed to fetch users'
          
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          })
          
          // Fallback to empty array if API fails
          setUsers([])
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error fetching users'
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        
        console.error('Error fetching users:', error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'BUYER': return 'bg-blue-100 text-blue-800'
      case 'SELLER': return 'bg-green-100 text-green-800'
      case 'BOTH': return 'bg-purple-100 text-purple-800'
      case 'ADMIN': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleUserApproval = async (userId: string, approve: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/${approve ? 'approve' : 'reject'}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        // Refresh the users list
        const fetchUsers = async () => {
          const response = await fetch('/api/admin/users')
          if (response.ok) {
            const data = await response.json()
            setUsers(data.users || [])
          }
        }
        fetchUsers()
        
        // Show success toast
        toast({
          title: "Success",
          description: `User ${approve ? 'approved' : 'rejected'} successfully`,
        })
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `Failed to ${approve ? 'approve' : 'reject'} user`
        
        // Show error toast
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        
        console.error(`Failed to ${approve ? 'approve' : 'reject'} user:`, errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Error ${approve ? 'approving' : 'rejecting'} user`
      
      // Show error toast
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      
      console.error(`Error ${approve ? 'approving' : 'rejecting'} user:`, error)
    }
  }

  const filteredUsers = users.filter((user: any) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout user={user} title="User Management" subtitle="Manage all platform users">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user} title="User Management" subtitle="Manage all platform users">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>Manage all platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.roles)}>
                        {user.roles}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.companyName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {user.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.createdAt}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!user.isApproved && (
                          <>
                            <Button size="sm" className="h-7 w-7 p-0" onClick={() => handleUserApproval(user.id, true)}>
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => handleUserApproval(user.id, false)}>
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

export default function UsersPage() {
  return (
    <ProtectedRoute>
      <UsersPageContent />
    </ProtectedRoute>
  )
}