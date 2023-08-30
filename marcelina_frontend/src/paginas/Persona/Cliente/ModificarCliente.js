import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, makeStyles, createTheme, TextField, FormControl, Select, InputLabel } from '@material-ui/core'
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2C2C71'
        }
    }
});

const useStyles = makeStyles(theme => ({
    title: {
        textAlign: 'center',
    },
    formControl: {
        marginTop: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        minWidth: '100%',
        marginBottom: theme.spacing(1)
    },
    select: {
        width: '100%',
    },
    sendButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
}));

const ModificarCliente = () => {

    const classes = useStyles();
    const { id } = useParams();
    const [cliente, setCliente] = useState({});
    const [clientes, setClientes] = useState({});
    const [clienteLocalidad, setClienteLocalidad] = useState({});
    const [localidades, setLocalidades] = useState({});
    const [localidadesSelect, setLocalidadesSelect] = useState([]);
    const [telefonos, setTelefonos] = useState([]);


    useEffect(() => {
        const obtenerClientes = () => {
            axios.get('/listar-clientes', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const clientes = response.data;
                    setClientes(clientes);
                    const clienteEncontrado = clientes.find((cliente) => cliente.clienteId.toString() === id.toString());
                    setCliente(clienteEncontrado);
                    setTelefonos(clienteEncontrado.clienteContacto);
                    setClienteLocalidad({
                        value: clienteEncontrado.clienteLocalidad.localidadId,
                        label: clienteEncontrado.clienteLocalidad.localidadCiudad,
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        };

        const obtenerLocalidades = () => {
            axios.get('/listar-localidades', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    setLocalidades(response.data);
                    setLocalidadesSelect(
                        response.data.map((localidad) => ({
                            value: localidad.localidadId,
                            label: localidad.localidadCiudad,
                        }))
                    );
                })
                .catch(error => {
                    console.error(error);
                });
        };

        obtenerClientes();
        obtenerLocalidades();
    }, []);

    const handleChange = event => {
        const { name, value } = event.target;
        setCliente(prevState => ({
            ...prevState,
            [name]: value,
        }));
        console.log(cliente);
    }

    const handleChangeTelefono = (index, telefono) => {
        setTelefonos(prevTelefonos => {
            const nuevosTelefonos = [...prevTelefonos];
            nuevosTelefonos[index] = telefono;
            return nuevosTelefonos;
        });

        setCliente(prevFormData => ({
            ...prevFormData,
            "clienteContacto": telefonos.map(tel => tel),
        }));
    }

    const checkTelefono = (telefonos) => {
        const telefonosClientes = [];
        clientes.forEach(cliente => {
            cliente.clienteContacto.forEach(telefono => {
                telefonosClientes.push(telefono);
            })
        })

        const telefonosEncontrados = telefonos.filter(tel => {
            return telefonosClientes.includes(tel);
        });

        return telefonosEncontrados.length > 0 ? telefonosEncontrados : null;
    }

    const checkEmail = (email) => {
        const emailClientes = [];
        clientes.forEach(cliente => {
            emailClientes.push(cliente.clienteEmail);
        })

        const emailEncontrado = emailClientes.includes(email);
        return emailEncontrado;
    }

    const handleFormSubmit = () => {
        const localidadCompleta = localidades.find((localidad) => localidad.localidadId.toString() === clienteLocalidad.toString());
        const data = {
            ...cliente,
            clienteLocalidad: localidadCompleta,
        };
        console.log(data);

        const telefonoCheck = checkTelefono(data.clienteContacto);
        const emailCheck = checkEmail(data.clienteEmail);

        if (telefonoCheck === null && emailCheck === false) {
            axios.post(`/modificar-cliente/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        console.log("Modificado");
                    } else {
                        console.log("No modificado")
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        } else {
            if (telefonoCheck !== null) {
                console.log(`El/Los teléfono/teléfonos: ${telefonoCheck} están repetidos`);
            }
            if (emailCheck === true) {
                console.log(`El email: ${data.clienteEmail} ya esta asignado a otro cliente`);
            }
        }
    };

    return (
        <div>
            <CssBaseline>
                <Grid>
                    <Navbar />
                    <Container style={{ marginTop: 30 }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={0}>
                                <Grid item lg={2} md={2}></Grid>
                                <Grid item lg={8} md={8} sm={12} xs={12} className={classes.title} >
                                    <Typography component='h1' variant='h4'>Modificar Cliente</Typography>

                                </Grid>
                                <Grid item lg={2} md={2}></Grid>
                            </Grid>
                            <Grid container >
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Nombre"
                                            defaultValue="Nombre"
                                            type="text"
                                            name="clienteNombre"
                                            value={cliente.clienteNombre}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Email"
                                            defaultValue="Nombre"
                                            type="email"
                                            name="clienteEmail"
                                            value={cliente.clienteEmail}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    {telefonos.map((telefono, index) => (
                                        <Grid item lg={12} md={12} sm={12} xs={12} key={index}>
                                            <TextField
                                                fullWidth
                                                autoFocus
                                                margin="normal"
                                                variant="outlined"
                                                label={`Teléfono ${index + 1}`}
                                                type="text"
                                                name={`clienteContacto-${index}`}
                                                value={telefono}
                                                onChange={(e) => handleChangeTelefono(index, e.target.value)}
                                            />
                                        </Grid>
                                    ))}
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            minRows={3}
                                            multiline
                                            autoFocus
                                            margin="normal"
                                            variant="outlined"
                                            label="Observaciones"
                                            defaultValue="Observaciones"
                                            type="text"
                                            name="clienteObservaciones"
                                            value={cliente.clienteObservaciones ? cliente.clienteObservaciones : ''}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel htmlFor={`outlined-localidad-native-simple`}>Localidad</InputLabel>
                                            <Select
                                                className={classes.select}
                                                native
                                                value={clienteLocalidad.value}
                                                label="Localidad"
                                                inputProps={{
                                                    name: "clienteLocalidad",
                                                    id: `outlined-localidad-native-simple`,
                                                }}
                                                onChange={(e) => setClienteLocalidad(e.target.value)}
                                            >
                                                <option>Seleccionar</option>
                                                {localidadesSelect.map((option, ind) => (
                                                    <option key={ind} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                            </Grid>
                            <Grid container justifyContent='flex-start' alignItems="center">
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                                <Grid item lg={8} md={8} sm={8} xs={8} className={classes.sendButton}>
                                    <Button type="submit" variant="contained" color="primary" onClick={handleFormSubmit}>Modificar</Button>
                                </Grid>
                                <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                            </Grid>
                        </Box>
                    </Container>
                </Grid>
            </CssBaseline>
        </div>
    );
};

export default ModificarCliente;