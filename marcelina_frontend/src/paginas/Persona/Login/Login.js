import React, { useState } from 'react'
import { Container, Grid, Paper, Avatar, Typography, TextField, Button, ThemeProvider, createTheme, CssBaseline } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useNavigate } from 'react-router-dom';
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import Logo from '../../../assets/images/Logo.png'
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons'
import axios from 'axios'

const theme = createTheme({
    palette: {
        primary: {
            main: '#2C2C71'
        }
    }
});

const useStyles = makeStyles(theme => ({
    root: {
        backgroundImage: `url(${Logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh'
    },
    container: {
        opacity: '0.9',
        height: '60%',
        marginTop: theme.spacing(10),
        [theme.breakpoints.down(400 + theme.spacing(2) + 2)]: {
            marginTop: 0,
            width: '100%',
            height: '100%',
        }
    },
    div: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
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

    const classes = useStyles();
    const navigate = useNavigate();
    const [showAlertSuccess, setShowAlertSuccess] = useState(false);
    const [showAlertError, setShowAlertError] = useState(false);

    const [alertSuccess, setAlertSuccess] = useState({
        title: 'Correcto', body: 'Inicio de sesión exitoso!', severity: 'success', type: 'description'
    });

    const [alertError, setAlertError] = useState({
        title: 'Error', body: 'Error al iniciar sesión, intente de nuevo.', severity: 'error', type: 'description'
    });

    const redireccionar = () => {
        navigate('/inicio');
    }

    const handleChange = event => {
        const { name, value } = event.target;

        if (name === 'user') {
            const regex = new RegExp("^[A-Za-z0-9]{0,50}$");
            if (regex.test(value)) {
                console.log(value)
                setUsuarioNombre(value);
            }
        }
        else if (name === 'password') {
            const regex = new RegExp("^[a-zA-Z0-9@\\-_\\.]{0,150}$");
            if (regex.test(value)) {
                console.log(value)
                setUsuarioContrasenia(value);
            }
        }
    }

    const checkError = (user, pass) => {
        if (user === undefined || user === null || user === '') {
            return false;
        }
        else if (pass === undefined || pass === null || pass === '') {
            return false;
        }
        return true;
    }

    const updateErrorAlert = (newBody) => {
        setAlertError((prevAlert) => ({
            ...prevAlert,
            body: newBody,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const check = checkError(usuarioNombre, usuarioContrasenia);

        if (check === false) {
            updateErrorAlert(`No deje ninguno de los 2 campos vacíos.`);
            setShowAlertError(true);
            setTimeout(() => {
                setShowAlertError(false);
            }, 5000);
        } else {
            axios.post('/login', { usuarioNombre, usuarioContrasenia },
                {
                    headers: { "Content-Type": "application/json" },
                }
            )
                .then(response => {
                    if (response.status === 200) {
                        window.localStorage.setItem('token', response.data.token);
                        window.localStorage.setItem('user', response.data.usuarioNombre);
                        setShowAlertSuccess(true);
                        setTimeout(() => {
                            setShowAlertSuccess(false);
                            redireccionar();
                        }, 5000);
                    } else {
                        updateErrorAlert(`Error al iniciar sesión, intente de nuevo.`);
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 5000);
                    }
                })
                .catch(error => {
                    if (error.request.status === 401) {
                        updateErrorAlert('Error al iniciar sesión, intente de nuevo.');
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 5000);
                    }
                    else if (error.request.status === 500) {
                        updateErrorAlert('Error al iniciar sesión, intente de nuevo.');
                        setShowAlertError(true);
                        setTimeout(() => {
                            setShowAlertError(false);
                        }, 5000);
                    }
                })
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <Grid container spacing={0}>
                    <Grid item lg={4} md={4} sm={4} xs={4}></Grid>
                    <Grid item lg={4} md={4} sm={4} xs={4}>
                        <AlertasReutilizable alert={alertSuccess} isVisible={showAlertSuccess} />
                        <AlertasReutilizable alert={alertError} isVisible={showAlertError} />
                    </Grid>
                    <Grid item lg={4} md={4} sm={4} xs={4}></Grid>
                </Grid>
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
                                value={usuarioContrasenia}
                                onChange={handleChange}
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant='contained'
                                color='primary'
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
