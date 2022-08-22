import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material'
import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import { SummaryTile } from '../../components/admin';
import { AdminLayout } from '../../components/layouts'
import { DashboardSummaryResponse } from '../../interfaces';

const DashboardPage = () => {
  const { data, error } =  useSWR<DashboardSummaryResponse>('/api/admin/dashboard', { 
    refreshInterval: 300 * 1000 
  });
  
  const [refreshIn, setRefreshIn] = useState(30)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn(refreshIn => refreshIn > 0 ?  refreshIn - 1 : 30 )
    } , 1000);
  
    return () => {
      clearInterval(interval);
    }
  }, [])
  
  
  if(!error && !data) {
    return <div>Loading...</div>
  }
  
  if (error) {
    console.log(error);
    return <Typography>Error al cargar la informacion</Typography>
  }
  
  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  } = data!;
  
  return (
    <AdminLayout 
        title="Dashboard"
        subtitle="Estadisticas generales"
        icon={<DashboardOutlined />}
    >
        <Grid container spacing={ 2 }>
          <SummaryTile 
            title={numberOfOrders}
            subtitle="Ordenes totales"
            icon={ <CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} />} 
          />
          <SummaryTile 
            title={paidOrders}
            subtitle="Ordenes pagadas"
            icon={ <AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />} 
          />
          <SummaryTile 
            title={notPaidOrders}
            subtitle="Ordenes pendientes"
            icon={ <CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />} 
          />
          <SummaryTile 
            title={numberOfClients}
            subtitle="Clientes"
            icon={ <GroupOutlined color="primary" sx={{ fontSize: 40 }} />} 
          />
          <SummaryTile 
            title={numberOfProducts}
            subtitle="Productos"
            icon={ <CategoryOutlined color="warning" sx={{ fontSize: 40 }} />} 
          />
          <SummaryTile 
            title={productsWithNoInventory}
            subtitle="Sin existencias"
            icon={ <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />} 
          />
          <SummaryTile 
            title={ lowInventory }
            subtitle="Bajo inventario"
            icon={ <ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 40 }} />} 
          />
          <SummaryTile 
            title={refreshIn}
            subtitle="Actualización en"
            icon={ <AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />} 
          />
        </Grid>
    </AdminLayout>
  )
}

export default DashboardPage