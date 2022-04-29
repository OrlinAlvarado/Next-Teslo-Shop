import type { NextPage, GetServerSideProps } from 'next';
import { Box, Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products/ProductList';
import { getProductsByTerm, getAllProducts } from '../../database/dbProducts';
import { IProduct } from '../../interfaces/products';


interface Props {
  products: IProduct[],
  foundProducts: boolean,
  query: string,
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  
  return (
    <ShopLayout title={'Teslo-Shop - Home'} pageDescription={'Encuentra los mejores productos de Teslo'} >
      <Typography variant='h1' component='h1'>Buscar producto</Typography>
      {
        foundProducts 
          ? <Typography variant='h2' sx={{ mb: 1 }} textTransform="capitalize">Termino: { query }</Typography>
          : (
            <Box display="flex">
              <Typography variant='h2' sx={{ mb: 1 }}>No se encontraron productos</Typography>
              <Typography variant='h2' sx={{ ml: 1 }} color="secondary" textTransform="capitalize">{ query }</Typography>
            </Box>
          )
      }
      
      <ProductList products={products} />
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  
  const { query } = params as { query: string };

  if( query.length === 0 ) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      }
    }
  }
  
  
  // si no hay productos
  let products = await getProductsByTerm( query )
  
  const foundProducts = products.length > 0;
  
  if( !foundProducts ) {
    products = await getProductsByTerm('shirts');  
  }
  
  return {
    props: {
      products,
      foundProducts,
      query
    }
  }
}

export default SearchPage;
