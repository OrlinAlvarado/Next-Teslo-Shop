import NextLink from 'next/link';

import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { ShopLayout } from '../../components/layouts';



const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullName', headerName: 'Nombre Completo', width: 300 },
    { 
        field: 'paid', 
        headerName: 'Pagada', 
        description: 'Si la orden esta pagada',
        width: 300,
        renderCell: (params: GridValueGetterParams) => {
            return (
                params.row.paid
                    ? <Chip  color="success" label="Pagada" variant="outlined" />    
                    : <Chip  color="error" label="No Pagada" variant="outlined" />    
            )
        } 
    },
    { 
        field: '', 
        headerName: 'Ver Orden', 
        description: 'Visualizar orden',
        width: 100,
        sortable: false,
        renderCell: (params: GridValueGetterParams) => {
            return (
              <NextLink href={`/orders/${ params.row.id }`} passHref>
                  <Link underline='always'>Ver orden</Link>
              </NextLink>
            )
        } 
    },
]

const rows = [
    { id: '1', paid: true, fullName: 'Orlin Alvarado' },
    { id: '2', paid: false, fullName: 'Yaneth Guzman' },
    { id: '3', paid: false, fullName: 'Junior Guzman' },
    { id: '4', paid: true, fullName: 'Dimas Guzman' },
    { id: '5', paid: false, fullName: 'Douglas Alvarado' },
    { id: '6', paid: true, fullName: 'Neptaly Guzman' },
]

const HistoryPage = () => {
  return (
    <ShopLayout title='Historial de Ordenes' pageDescription='Historial de Ordenes del cliente'>
        <Typography variant='h1' component="h1">Historial de Ordenes</Typography>
        
        <Grid container>
            <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                <DataGrid
                    rows={ rows }
                    columns={ columns }
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10, 20, 50, 100] }
                />
                    
                
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default HistoryPage