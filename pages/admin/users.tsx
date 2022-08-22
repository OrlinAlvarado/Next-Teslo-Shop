import { useEffect, useState } from 'react'
import { PeopleOutline } from '@mui/icons-material';
import { Grid, MenuItem, Select } from '@mui/material';
import { AdminLayout } from '../../components/layouts/AdminLayout';

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';

const UsersPage = () => {
    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    const [users, setUsers] = useState<IUser[]>([]);
    
    useEffect(() => {
      if( data ) {
        setUsers(data);
      }
      
    }, [data])
    
    
    if( !data && !error ) return <div>Cargando...</div>
    
    const onRoleUpdated = async (userId: string, newRole: string) => {
        const previousUsers = users.map( user => ({...user}));
        const updatedUsers = users.map( user => ({
            ...user,
            role: user._id === userId ? newRole : user.role
        }))
        setUsers(updatedUsers);
        
        try {
            await tesloApi.put('/admin/users', {
                userId,
                role: newRole
            })
        } catch (error) {
            setUsers(previousUsers);
            alert('No se pudo actualizar el role del usuario')
        }
    }
    
    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'name', headerName: 'Nombre completo', width: 300 },
        { 
            field: 'role', 
            headerName: 'Rol', 
            width: 300,
            renderCell: ({ row }: GridValueGetterParams) => {
                return (
                    <Select
                        value={ row.role }
                        label="Role"
                        onChange={ ({ target }: any) => onRoleUpdated(row.id, target.value) }
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="client">Cliente</MenuItem>
                        <MenuItem value="super-user">Super User</MenuItem>
                        <MenuItem value="SEO">SEO</MenuItem>
                    </Select>
                )
            } 
        },
    ]
    
    const rows = users.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }))
    
    
  return (
    <AdminLayout
        title="Usuarios"
        subtitle="Mantenimiento de usuarios"
        icon={ <PeopleOutline />}
    >
        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                <DataGrid
                    rows={ rows }
                    columns={ columns }
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10, 20, 50, 100] }
                />
                    
                
            </Grid>
        </Grid>
    </AdminLayout>
  )
}

export default UsersPage