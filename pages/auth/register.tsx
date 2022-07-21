import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { signIn, getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';

import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material"
import { AuthLayout } from "../../components/layouts"
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/auth/AuthContext';


type FormData = {
    name: string;
    email: string;
    password: string;
}

const LoginPage = () => {
    const router = useRouter();
    const { registerUser} = useContext(AuthContext)
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [ showError, setShowError ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState('')
    const destination = router.query.p?.toString() || '/';
    const onRegisterForm = async ({ email, password, name}: FormData) => {
        setShowError(false)
        const { hasError, message } = await registerUser(name, email, password);
        
        if( hasError ) {
            setShowError(true)
            setErrorMessage(message!)
           setTimeout(() => setShowError(false), 3000);
        }
        
        //TODO: Navegar a la pantalla que el usuario estaba 
        // router.replace(destination);
        
        await signIn( 'credentials', { email, password })
        
    }
  return (
    <AuthLayout title="Registrarse">
        <form onSubmit={ handleSubmit(onRegisterForm)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px'}}>
            <Grid container spacing={2}>
                <Grid item>
                    <Typography variant="h1" component="h1">Crear cuenta</Typography>
                    <Chip 
                        label="No reconocemos ese usuario / contraseña"
                        color="error"
                        icon={ <ErrorOutline />}
                        className="fadeIn"
                        sx={{ display: showError ? 'flex' : 'none' }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField 
                        label="Nombre completo" 
                        variant="filled" 
                        fullWidth
                        { ...register('name', {
                            required: 'Este campo es requerido',
                            minLength: { value: 2, message: 'El nombre debe de ser de al menos 2 caracteres' },
                        })}
                        error={ !!errors.name }
                        helperText={ errors.name?.message} 
                        />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                            type="email"
                            label="Correo"
                            variant="filled"
                            fullWidth
                            { ...register('email', {
                                required: 'Este campo es requerido',
                                validate: validations.isEmail
                            })}
                            error={ !!errors.email }
                            helperText={ errors.email?.message}
                        />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                            label="Contraseña"
                            type="password"
                            variant="filled"
                            fullWidth
                            { ...register('password', {
                                required: 'Este campo es requerido',
                                minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                            })}
                            error={ !!errors.password }
                            helperText={ errors.password?.message}
                        />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        color="secondary"
                        className="circular-btn"
                        size="large"
                        fullWidth
                    >
                       Registrarse
                    </Button>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="end">
                    <NextLink href={`/auth/login?p=${ destination }`} passHref>
                        <Link >
                            ¿Ya tienes cuenta?
                        </Link>
                    </NextLink>
                </Grid>
            </Grid>
        </Box>
        </form>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const session = await getSession({ req });
    const { p = '/' } = query
    if( session ) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }
    return {
        props: {}
    }
}

export default LoginPage