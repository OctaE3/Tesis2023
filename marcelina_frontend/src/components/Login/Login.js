import React, {useState} from 'react'
import { Container, Grid, Paper, Avatar, Typography, TextField, Button, ThemeProvider, createTheme, CssBaseline} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Logo from '../../assets/images/Logo.png'
import { LockOutlined as LockOutlinedIcon} from '@material-ui/icons'

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
    const [body, setBody] = useState({user: '', password: ''})
    const classes = useStyles();
    const handleChange = event => {
        console.log(event.target.value)
        setBody({
            ...body,
            [event.target.name]: event.target.value
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
            <form className={classes.form}>
                <TextField 
                    fullWidth
                    autoFocus
                    color='primary'
                    margin='normal'
                    variant='outlined'
                    label='Usuario'
                    name='user'
                    value={body.user}
                    onChange={handleChange}
                />
                <TextField 
                    fullWidth
                    type='password'
                    color='primary'
                    margin='normal'
                    variant='outlined'
                    label='Contraseña'
                    name='password'
                    value={body.password}
                    onChange={handleChange}
                />
                <Button
                fullWidth
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
