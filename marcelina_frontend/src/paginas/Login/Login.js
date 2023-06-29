import React, {useState} from 'react'
import { Container, Grid, Paper, Avatar, Typography, TextField, Button, ThemeProvider, createTheme, CssBaseline} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Logo from '../../assets/images/Logo.png'
import { LockOutlined as LockOutlinedIcon} from '@material-ui/icons'
import axios from 'axios';

const theme = createTheme({
    palette: {
      primary: {
        main: '#2C2C71'
      }
    }
  });

const useStyles = makeStyles(theme=>({
    root: {
        backgroundImage: `url(${Logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh'
    },
    container:{
        opacity: '0.9',
        height: '60%',
        marginTop: theme.spacing(10),
        [theme.breakpoints.down(400 + theme.spacing(2) + 2)]:{
            marginTop: 0,
            width: '100%',
            height: '100%',
        }
    },
    div:{
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'    
    },
    avatar:{
        margin: theme.spacing(1),
        backgroundColor: '#2C2C71'
    },
    form: {
        opacity: '1',
        width: '100%',
        marginTop: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(3, 0, 2)
    }
}));



const Login = () => {
    const [usuarioNombre, setUsuarioNombre] = useState("");
    const [usuarioContrasenia, setUsuarioContrasenia] = useState("");
    const [error, setError] = useState(null);

    const classes = useStyles();

    const handleSubmit = async (event) => {
        event.preventDefault();

        axios.post('/login', { usuarioNombre, usuarioContrasenia },
            {
                headers: { "Content-Type": "application/json" },
            }
        )
        .then(response => {
            window.localStorage.setItem('token', response.data.token);
            console.log(response.data.token);
        })
        .catch(error => {
            console.error(error);
        })
    }

  return (
    <ThemeProvider theme={theme}>
        <CssBaseline>
    <Grid container component='main' className={classes.root}>
        <Container component={Paper} elevation={5} maxWidth='xs' className={classes.container}>
            <div className={classes.div}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>Iniciar sesión</Typography>
            </div>
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField 
                    fullWidth
                    autoFocus
                    color='primary'
                    margin='normal'
                    variant='outlined'
                    label='Usuario'
                    name='user'
                    value={usuarioNombre}
                    onChange={(event) => setUsuarioNombre(event.target.value)}
                />
                <TextField 
                    fullWidth
                    type='password'
                    color='primary'
                    margin='normal'
                    variant='outlined'
                    label='Contraseña'
                    name='password'
                    value={usuarioContrasenia}
                    onChange={(event) => setUsuarioContrasenia(event.target.value)}
                />
                <Button
                fullWidth
                type="submit"
                variant='contained'
                color= 'primary'
                className={classes.button}
                >
                    Iniciar
                </Button>
            </form>
        </Container>
    </Grid>
    </CssBaseline>
    </ThemeProvider>
  )
}
export default Login
