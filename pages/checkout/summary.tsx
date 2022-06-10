import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material';
import { CartList } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import { OrderSummary } from '../../components/cart/OrderSummary';
import { useContext } from 'react';
import { CartContext } from '../../context';
import { getCountry } from '../../utils/contries';

const SummaryPage = () => {
    const { shippingAddress, numberOfItems } = useContext(CartContext)
    
    if( !shippingAddress ){
        return <></>
    }
    
    const { firstName, lastName, address, address2,  city, zip, phone, country } = shippingAddress;

  return (
    <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden'>
        <Typography variant='h1' component='h1'>Resumen de la orden</Typography>
        <Grid container>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList />
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className="summary-card">
                    <CardContent>
                        <Typography variant="h2">Resumen ({numberOfItems} { numberOfItems === 1 ? 'producto' : 'productos' })</Typography>
                        <Divider sx={{ my: 1 }} />
                        
                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            <NextLink href="/checkout/address" passHref>
                                <Link underline='always'>Editar</Link>
                            </NextLink>
                        </Box>
                        
                        {shippingAddress && (
                        <>
                            <Typography>{ firstName } { lastName}</Typography>
                            <Typography>{ address }{ address2 ? `, ${address2}` : '' }</Typography>
                            <Typography>{ city }, { zip }</Typography>
                            <Typography>{ getCountry(country) }</Typography>
                            <Typography>{ phone }</Typography>
                        </>
                        )}
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <Box display='flex' justifyContent='end'>
                            <NextLink href="/cart" passHref>
                                <Link underline='always'>Editar</Link>
                            </NextLink>
                        </Box>
                        <OrderSummary />
                        
                        <Box sx={{ mt: 3}}>
                            <Button color="secondary" className='circular-btn' fullWidth>
                                Confirmar orden
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default SummaryPage