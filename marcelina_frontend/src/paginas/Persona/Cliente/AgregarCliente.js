import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { Container, Typography, Grid, Box, CssBaseline, Button, Dialog, IconButton, makeStyles, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from '@material-ui/core/styles';
import FormularioReutilizable from '../../../components/Reutilizable/FormularioReutilizable'
import AlertasReutilizable from '../../../components/Reutilizable/AlertasReutilizable';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  title: {
    textAlign: 'center',
  },
  customTooltip: {
    maxWidth: 800,
    fontSize: 16,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '80vw',
    },

    [theme.breakpoints.up('md')]: {
      maxWidth: 800,
    },
  },
  text: {
    color: '#2D2D2D',
  },
  liTitleBlue: {
    color: 'blue',
    fontWeight: 'bold',
  },
  liTitleRed: {
    color: 'red',
    fontWeight: 'bold',
  },
  blinkingButton: {
    animation: '$blink 1s infinite',
  },
  '@keyframes blink': {
    '0%': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    '50%': {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.main,
    },
    '100%': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  },
}));

const AgregarCliente = () => {
  const formFieldsModal = [
    { name: 'localidadDepartamento', label: 'Departamento', obligatorio: true, pattern: "^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\\s]{0,40}$", type: 'text', color: 'primary' },
    { name: 'localidadCiudad', label: 'Ciudad', type: 'text', obligatorio: true, pattern: "^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\\s]{0,50}$", color: 'primary' },
  ];

  const formFields = [
    { name: 'clienteNombre', label: 'Nombre', type: 'text', obligatorio: true, pattern: "^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s]{0,50}$", color: 'primary' },
    { name: 'clienteEmail', label: 'Email', type: 'text', pattern: "^[A-Za-z0-9.@]{0,50}$", color: 'secondary' },
    { name: 'clienteContacto', label: 'Contacto', type: 'phone', obligatorio: true, pattern: "^[0-9]{0,9}$", color: 'primary' },
    { name: 'clienteObservaciones', label: 'Observaciones', type: 'text', pattern: "^[A-Za-z0-9ÁáÉéÍíÓóÚúÜüÑñ\\s,.]{0,250}$", multi: '3', color: 'secondary' },
    { name: 'clienteLocalidad', label: 'Localidad *', type: 'selector', alta: 'si', altaCampos: formFieldsModal, color: 'primary' }
  ];

  const [alertSuccess, setAlertSuccess] = useState({
    title: 'Correcto', body: 'Cliente agregado con éxito!', severity: 'success', type: 'description'
  });

  const [alertError, setAlertError] = useState({
    title: 'Error', body: 'No se logró agregar el cliente, revise los datos ingresados.', severity: 'error', type: 'description'
  });

  const [alertWarning] = useState({
    title: 'Advertencia', body: 'Expiró el inicio de sesión para renovarlo, inicie sesión nuevamente.', severity: 'warning', type: 'description'
  });

  const classes = useStyles();
  const navigate = useNavigate();
  const [clientes, setClientes] = useState({});
  const [localidades, setLocalidades] = useState([]);
  const [localidadesSelect, setLocalidadesSelect] = useState([]);
  const [reloadLocalidades, setReloadLocalidades] = useState(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertWarning, setShowAlertWarning] = useState(false);
  const [checkToken, setCheckToken] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [formKeyModal, setFormKeyModal] = useState(0);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [blinking, setBlinking] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/')
    } else {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));

      const tokenExpiration = payload.exp * 1000;
      const currentTime = Date.now();

      if (tokenExpiration < currentTime) {
        setShowAlertWarning(true);
        setTimeout(() => {
          setShowAlertWarning(false);
          navigate('/')
        }, 2000);
      }
      setCheckToken(false)
    }
  }, [checkToken]);

  useEffect(() => {
    const obtenerClientes = () => {
      axios.get('/listar-clientes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          setClientes(response.data);
        })
        .catch(error => {
          if (error.request.status === 401) {
            setCheckToken(true);
          } else {
            updateErrorAlert('No se logró cargar los clientes, intente nuevamente.')
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 2000);
          }
        });
    };

    const obtenerLocalidades = () => {
      axios.get('/listar-localidades', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          const localidadesT = response.data;
          const localidadesNoEliminadas = localidadesT.filter((localidad) => localidad.localidadEliminado === false);
          setLocalidades(localidadesNoEliminadas);
          setLocalidadesSelect(
            localidadesNoEliminadas.map((localidad) => ({
              value: localidad.localidadId,
              label: localidad.localidadCiudad,
            }))
          );
        })
        .catch(error => {
          if (error.request.status === 401) {
            setCheckToken(true);
          } else {
            updateErrorAlert('No se logró cargar las localidades, intente nuevamente.')
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 2000);
          }
        });
    };

    obtenerClientes();
    obtenerLocalidades();

    if (reloadLocalidades) {
      obtenerLocalidades();
      setReloadLocalidades(false);
    }
  }, [reloadLocalidades]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking((prevBlinking) => !prevBlinking);
    }, 500);

    setTimeout(() => {
      clearInterval(blinkInterval);
      setBlinking(false);
    }, 5000);

    return () => {
      clearInterval(blinkInterval);
    };
  }, []);

  const updateErrorAlert = (newBody) => {
    setAlertError((prevAlert) => ({
      ...prevAlert,
      body: newBody,
    }));
  };

  const updateSuccessAlert = (newBody) => {
    setAlertSuccess((prevAlert) => ({
      ...prevAlert,
      body: newBody,
    }));
  };

  const checkTelefono = (telefonos) => {
    const telefonosClientes = [];
    if (telefonos === undefined || telefonos === null || telefonos.length === 0) {
      return false;
    } else {
      clientes.forEach(cliente => {
        cliente.clienteContacto.forEach(telefono => {
          telefonosClientes.push(telefono);
        })
      })

      let telCheck = false;

      telefonosClientes.forEach((telC) => {
        telefonos.forEach((tel) => {
          if (telC.toString() === tel.telefono.toString()) {
            telCheck = true;
          }
        });
        if (telCheck) {
          return;
        }
      });

      return telCheck;
    }
  }

  const checkEmail = (email) => {
    if (email) {
      const emailClientes = [];
      clientes.forEach(cliente => {
        if (cliente.clienteEmail !== undefined && cliente.clienteEmail !== null && cliente.clienteEmail !== '') {
          emailClientes.push(cliente.clienteEmail);
        }
      })

      const emailEncontrado = emailClientes.includes(email);
      return emailEncontrado;
    }
  }

  const checkError = (nombre, email, localidad) => {
    if (nombre === undefined || nombre === null || nombre === '') {
      return false;
    }

    if (email) {
      if (email === undefined || email === null || email === '') {
        return false;
      } else {
        if (!email.includes(".") && !email.includes("@")) {
          return false;
        }
      }
    }

    if (localidad === undefined || localidad === null || localidad === "Seleccionar") {
      return false;
    }
    return true;
  }

  const checkErrorTelefono = (telefonos) => {
    let resp = true;
    if (telefonos === undefined || telefonos === null || telefonos.length === 0) {
      return false;
    } else {
      const regex = /^\d{8,9}$/;
      telefonos.forEach((tel) => {
        if (regex.test(tel.telefono)) {
          const primerNum = tel.telefono[0];
          const longitud = tel.telefono.length;
          if (parseInt(primerNum) === 0 && parseInt(longitud) === 9 || parseInt(primerNum) === 4 && parseInt(longitud) === 8) { }
          else { resp = false }
        }
        else { resp = false }
      })
    }
    return resp;
  }

  const handleFormSubmit = (formData, telefonos) => {
    console.log(formData);
    const localidadSeleccionadaObj = localidades.filter((localidad) => localidad.localidadId.toString() === formData.clienteLocalidad)[0];

    const clienteConLocalidad = {
      ...formData,
      clienteContacto: telefonos,
      clienteLocalidad: localidadSeleccionadaObj ? localidadSeleccionadaObj : null
    };

    const nombre = clienteConLocalidad.clienteNombre;
    const email = !clienteConLocalidad.clienteEmail || clienteConLocalidad.clienteEmail === '' ? undefined : clienteConLocalidad.clienteEmail;
    const tel = clienteConLocalidad.clienteContacto;
    const localidad = clienteConLocalidad.clienteLocalidad;

    const check = checkError(nombre, email, tel, localidad);
    const emailCheck = checkEmail(email);
    const telefonoCheck = checkTelefono(tel);
    const telefonoErrorCheck = checkErrorTelefono(tel);

    if (check === false) {
      updateErrorAlert(`Revise los datos ingresados en cliente y no deje campos vacíos, no se permite seleccionar la opción "Seleccionar".`);
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 3000);
    } else {
      if (telefonoErrorCheck === false) {
        updateErrorAlert(`Los teléfonos ingresados tienen que empezar con el número 0 y tener una longitud de 9 digitos, en caso de agregar otro campo de contacto, no lo deje vacío.`);
        setShowAlertError(true);
        setTimeout(() => {
          setShowAlertError(false);
        }, 3000);
      } else {
        if (email && email !== '' && email !== undefined && email !== null) {
          const regex = /^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (regex.test(email)) {
            if (telefonoCheck === false && emailCheck === false) {
              const telefonosConvertidos = clienteConLocalidad.clienteContacto.map((tel) => tel.telefono);
              const data = {
                ...clienteConLocalidad,
                clienteContacto: telefonosConvertidos,
              };
              axios.post('/agregar-cliente', data, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  "Content-Type": "application/json"
                }
              })
                .then(response => {
                  if (response.status === 201) {
                    setFormKey(prevKey => prevKey + 1);
                    setReloadLocalidades(true);
                    updateSuccessAlert('Cliente registrado con éxito!')
                    setShowAlertSuccess(true);
                    setTimeout(() => {
                      setShowAlertSuccess(false);
                    }, 2500);
                  } else {
                    updateErrorAlert('No se logró registrar el cliente, revise los datos ingresados.')
                    setShowAlertError(true);
                    setTimeout(() => {
                      setShowAlertError(false);
                    }, 2500);
                  }
                })
                .catch(error => {
                  if (error.request.status === 401) {
                    setCheckToken(true);
                  }
                  else if (error.request.status === 500) {
                    updateErrorAlert('No se logró registrar el cliente, revise los datos ingresados.');
                    setShowAlertError(true);
                    setTimeout(() => {
                      setShowAlertError(false);
                    }, 2500);
                  }
                })
            } else {
              updateErrorAlert('Revise los datos ingresados, no puede coincidir el email o los teléfonos, con los clientes ya registrados.');
              setShowAlertError(true);
              setTimeout(() => {
                setShowAlertError(false);
              }, 3000);
            }
          } else {
            updateErrorAlert(`El mail ingresado no es válido.`);
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 2500);
          }
        } else {
          if (telefonoCheck === false) {
            const telefonosConvertidos = clienteConLocalidad.clienteContacto.map((tel) => tel.telefono);
            const data = {
              ...clienteConLocalidad,
              clienteEmail: '',
              clienteContacto: telefonosConvertidos,
            };
            axios.post('/agregar-cliente', data, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
              }
            })
              .then(response => {
                if (response.status === 201) {
                  setFormKey(prevKey => prevKey + 1);
                  setReloadLocalidades(true);
                  updateSuccessAlert('Cliente registrado con éxito!')
                  setShowAlertSuccess(true);
                  setTimeout(() => {
                    setShowAlertSuccess(false);
                  }, 2500);
                } else {
                  updateErrorAlert('No se logró registrar el cliente, revise los datos ingresados.')
                  setShowAlertError(true);
                  setTimeout(() => {
                    setShowAlertError(false);
                  }, 2500);
                }
              })
              .catch(error => {
                if (error.request.status === 401) {
                  setCheckToken(true);
                }
                else if (error.request.status === 500) {
                  updateErrorAlert('No se logro registrar el cliente, revise los datos ingresados.');
                  setShowAlertError(true);
                  setTimeout(() => {
                    setShowAlertError(false);
                  }, 2500);
                }
              })
          } else {
            updateErrorAlert('Revise los datos ingresados, no puede coincidir los teléfonos, con los clientes ya registrados.');
            setShowAlertError(true);
            setTimeout(() => {
              setShowAlertError(false);
            }, 3000);
          }
        }
      }
    }
  }

  const checkErrorLocalidad = (ciudad, departamento) => {
    if (ciudad === undefined || ciudad === null || ciudad === '') {
      return false;
    }
    else if (departamento === undefined || departamento === null || departamento === '') {
      return false;
    }
    return true;
  }

  const handleFormSubmitModal = (formDataModal) => {

    const localidadDepartamento = formDataModal.localidadDepartamento;
    const localidadCiudad = formDataModal.localidadCiudad;

    const localidadesExisten = localidades.some(localidad => {
      return localidad.localidadDepartamento.toLowerCase().toString() === localidadDepartamento.toLowerCase().toString() && localidad.localidadCiudad.toLowerCase().toString() === localidadCiudad.toLowerCase().toString();
    });

    const check = checkErrorLocalidad(localidadCiudad, localidadDepartamento);

    if (check === false) {
      updateErrorAlert(`Revise los datos ingresados en localidad y no deje campos vacíos.`);
      setShowAlertError(true);
      setTimeout(() => {
        setShowAlertError(false);
      }, 2500);
    } else {
      if (!localidadesExisten) {
        axios.post('/agregar-localidad', formDataModal, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json"
          }
        })
          .then(response => {
            if (response.status === 201) {
              setFormKeyModal(prevKey => prevKey + 1);
              setReloadLocalidades(true);
              updateSuccessAlert('Localidad registrada con éxito!')
              setShowAlertSuccess(true);
              setTimeout(() => {
                setShowAlertSuccess(false);
              }, 2500);
            } else {
              updateErrorAlert('No se logró registrar la localidad, revise los datos ingresados.')
              setShowAlertError(true);
              setTimeout(() => {
                setShowAlertError(false);
              }, 2500);
            }
          })
          .catch(error => {
            if (error.request.status === 401) {
              setCheckToken(true);
            }
            else if (error.request.status === 500) {
              updateErrorAlert('No se logró registrar la localidad, revise los datos ingresados.');
              setShowAlertError(true);
              setTimeout(() => {
                setShowAlertError(false);
              }, 2500);
            }
          })
      } else {
        updateErrorAlert('Esa localidad ya existe.')
        setShowAlertError(true);
        setTimeout(() => {
          setShowAlertError(false);
        }, 2500);
      }
    }
  }

  const redirect = () => {
    navigate('/listar-cliente')
  }

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
                  <Typography component='h1' variant='h4'>Agregar Cliente</Typography>
                  <div>
                    <IconButton className={blinking ? classes.blinkingButton : ''} onClick={handleClickOpen}>
                      <HelpOutlineIcon fontSize="large" color="primary" />
                    </IconButton>
                    <Dialog
                      fullScreen={fullScreen}
                      fullWidth
                      maxWidth='md'
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="responsive-dialog-title"
                    >
                      <DialogTitle id="responsive-dialog-title">Explicación del formulario.</DialogTitle>
                      <DialogContent>
                        <DialogContentText className={classes.text}>
                          <span>
                            En esta página puedes registrar los clientes, asegúrate de completar los campos necesarios para registrar el estado.
                          </span>
                          <br />
                          <span>
                            Este formulario cuenta con 5 campos:
                            <ul>
                              <li>
                                <span className={classes.liTitleBlue}>Nombre</span>: En este campo se debe ingresar el nombre de la empresa o del cliente,
                                este campo solo acepta palabras y números, a su vez cuenta con una longitud máxima de 40 caracteres.
                              </li>
                              <li>
                                <span className={classes.liTitleRed}>Email</span>: En este campo se puede ingresar el mail del cliente,
                                este campo solo acepta palabras, números, arroba y punto, a su vez cuenta con un máximo de 50 caracteres.
                              </li>
                              <li>
                                <span className={classes.liTitleBlue}>Contacto</span>: En este campo se ingresa el número de teléfono del cliente,
                                en caso de que tenga más de un teléfono, se puede agregar más al darle click al icono de más a la derecha del campo
                                y si desea eliminar el campo, consta en darle click a la X a la derecha del campo generado, los campos de teléfono aceptan solo números y
                                cuentan con una longitud máxima de 9 caracteres.
                              </li>
                              <li>
                                <span className={classes.liTitleRed}>Observaciones</span>: En este campo se puede ingresar infomación adicional del cliente,
                                este campo acepta palabras y números, a su vez cuenta con una longitud máxima de 250 caracteres.
                              </li>
                              <li>
                                <span className={classes.liTitleBlue}>Localidad</span>: En este campo se debe seleccionar la localidad en donde esta ubicado el cliente o su empresa,
                                en caso de querer añadir una localidad nueva, es posible dandole al icono de más a la derecha del campo.
                              </li>
                            </ul>
                          </span>
                          <span>
                            Campos obligatorios y no obligatorios:
                            <ul>
                              <li>
                                <span className={classes.liTitleBlue}>Campos con contorno azul y con asterisco en su nombre</span>: Los campos con contorno azul y asterisco son obligatorios, se tienen que completar sin excepción.
                              </li>
                              <li>
                                <span className={classes.liTitleRed}>Campos con contorno rojo</span>: Los campos con contorno rojo no son obligatorios, se pueden dejar vacíos de ser necesario.
                              </li>
                            </ul>
                          </span>
                          <span>
                            Aclaraciones:
                            <br />
                            - No se permite dejar los campos vacíos, excepto los de contorno rojo.
                            <br />
                            - Una vez registre el cliente, no se le redirigirá al listar. Se determinó así por si está buscando registrar otro cliente.
                            <br />
                            - Los campos para dar de alta una localidad solo aceptan palabras y cuentan con una longitud máxima de 40 caracteres.
                            <br />
                            - En el campo de teléfono también se acepta números de teléfono fijo, en caso de que quiera agregar un teléfono fijo ingréselo todo junto.
                            <br />
                            - Los clientes se eliminan lógicamente.
                          </span>
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose} color="primary" autoFocus>
                          Cerrar
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                </Grid>
                <Grid item lg={2} md={2}></Grid>
              </Grid>
              <Grid container spacing={0}>
                <Grid item lg={4} md={4} sm={4} xs={4}></Grid>
                <Grid item lg={4} md={4} sm={4} xs={4}>
                  <AlertasReutilizable alert={alertSuccess} isVisible={showAlertSuccess} />
                  <AlertasReutilizable alert={alertError} isVisible={showAlertError} />
                  <AlertasReutilizable alert={alertWarning} isVisible={showAlertWarning} />
                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={4}></Grid>
              </Grid>
            </Box>
          </Container>
          <FormularioReutilizable
            fields={formFields}
            key={formKey}
            keyModal={formKeyModal}
            onSubmit={handleFormSubmit}
            onSubmitModal={handleFormSubmitModal}
            handleRedirect={redirect}
            selectOptions={{ clienteLocalidad: localidadesSelect }}
          />
        </Grid>
      </CssBaseline>
    </div>
  );
};

export default AgregarCliente;
