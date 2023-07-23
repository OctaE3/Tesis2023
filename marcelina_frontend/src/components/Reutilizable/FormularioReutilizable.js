import React, { useState } from 'react';
import { TextField, createTheme, FormControl, InputLabel, Button, Grid, Box, Container, Typography, Select } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import InputAdornment from '@material-ui/core/InputAdornment';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2C2C71'
    }
  }
});

const useStyles = makeStyles(theme => ({
  root: {
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
      width: '100%',
      height: '100%',
    }
  },
  containerForm: {
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
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
  formControl: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    minWidth: '100%',
    marginBottom: theme.spacing(1)
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: '40%',
    width: '100%',
    maxHeight: '80vh',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90%',
    },
    textAlign: 'center',
  },
  select: {
    width: '100%',
  },
  selectContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  addButton: {
    justifyContent: 'flex-start',
  },
  iconButton: {
    minWidth: '50px',
  },
  modalButton: {
    marginTop: 8,
  },
  sendButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  checkboxBorder: {
    border: '1px solid #999999',
    borderRadius: '4px',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  title: {
    marginTop: 3,
    marginLeft: 6,
    fontWeight: 'normal'
  },
  checkbox: {
    marginLeft: 4,
  }
}));

const FormularioReutilizable = ({ fields, onSubmit, selectOptions, onSubmitModal }) => {

  const classes = useStyles();
  const [formData, setFormData] = useState({});
  const [formDataModal, setFormDataModal] = useState({});
  const [open, setOpen] = useState(false);
  const [telefonos, setTelefonos] = useState([{ telefono: "" }]);


  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    console.log(formData);
  };

  const handleChangeLista = event => {
    const { name, options } = event.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);

    setFormData(prevState => ({
      ...prevState,
      [name]: selectedValues,
    }));
  };

  const handleAddTelefono = () => {
    setTelefonos([...telefonos, { telefono: "" }]);
  };

  const handleChangeTelefono = (index, telefono) => {
    setTelefonos(prevTelefonos => {
      const nuevosTelefonos = [...prevTelefonos];
      nuevosTelefonos[index] = { telefono };
      return nuevosTelefonos;
    });

    setFormData(prevFormData => ({
      ...prevFormData,
      [fields.find(field => field.type === 'phone').name]: telefonos.map(tel => tel.telefono),
    }));
    console.log(formData);
  };

  const handleRemoveTelefono = (index) => {
    const nuevosTelefonos = [...telefonos];
    nuevosTelefonos.splice(index, 1);

    setTelefonos(nuevosTelefonos);

    console.log(nuevosTelefonos);

    setFormData(prevFormData => ({
      ...prevFormData,
      [fields.find(field => field.type === 'phone').name]: nuevosTelefonos,
    }));
    console.log(formData);
  };

  const handleChangeModal = event => {
    const { name, value } = event.target;
    setFormDataModal(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(formData);
  };

  const handleSubmitModal = event => {
    event.preventDefault();
    onSubmitModal(formDataModal);
    setOpen(false);
  };

  const handleOpenModal = () => {
    setOpen(true);
  }

  const handleCloseModal = () => {
    setOpen(false);
  }

  return (
    <form className={classes.form}>
      <Container className={classes.containerForm} style={{ marginTop: 20 }}>
        <Box>
          {fields.map((field, index) => (
            field.type === 'date' || field.type === 'datetime-local' ? (
              <div key={index}>
                <Grid
                  container
                >
                  <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                  <Grid item lg={8} md={8} sm={8} xs={8}>
                    <TextField
                      fullWidth
                      color="primary"
                      margin="normal"
                      variant="outlined"
                      label={field.label}
                      id={field.name}
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ''}
                      format={field.format}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                </Grid>
              </div>
            ) : field.type === 'selector' && selectOptions && selectOptions[field.name] ? (
              <div key={index}>
                <Grid
                  container
                  justifyContent='flex-start'
                  alignItems="center"
                >
                  <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                  <Grid item lg={8} md={8} sm={8} xs={8}>
                    <FormControl variant="outlined" className={classes.formControl} >
                      <InputLabel htmlFor={`outlined-${field.name}-native-simple`}>{field.label}</InputLabel>
                      <Select
                        className={classes.select}
                        native
                        value={formData[field.name] || ''}
                        onChange={field.multiple ? handleChangeLista : handleChange}
                        label={field.label}
                        inputProps={{
                          name: field.name,
                          id: `outlined-${field.name}-native-simple`,
                          multiple: field.multiple,
                        }}
                      >
                        <option value="Seleccionar" > Seleccionar </option>
                        {selectOptions[field.name].map((option, ind) => (
                          <option key={ind} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item lg={2} md={2} sm={2} xs={2}>
                    {field.alta === 'si' && (
                      <div key={index}>
                        <Grid className={`${classes.addButton} align-left`}>
                          <Button className={classes.iconButton} onClick={handleOpenModal}>
                            <AddIcon color='primary' fontSize='large' />
                          </Button>
                        </Grid>
                        <Grid>
                          <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            className={classes.modal}
                            open={open}
                            onClose={handleCloseModal}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                              timeout: 500,
                            }}
                          >
                            <Fade in={open}>
                              <div className={classes.paper}>
                                <Typography component='h1' variant='h5'>Agregar {field.label}</Typography>
                                {field.altaCampos.map((altaCampo, index) => (
                                  <div key={index}>
                                    <TextField
                                      fullWidth
                                      autoFocus
                                      color="primary"
                                      margin="normal"
                                      variant="outlined"
                                      className={classes.campos}
                                      label={altaCampo.label}
                                      id={altaCampo.name}
                                      type={altaCampo.type}
                                      name={altaCampo.name}
                                      value={formDataModal[altaCampo.name] || ''}
                                      onChange={handleChangeModal}
                                    />
                                  </div>
                                ))}
                                <Button className={classes.modalButton} type="submit" variant="contained" color="primary" onClick={handleSubmitModal}>Enviar</Button>
                              </div>
                            </Fade>
                          </Modal>
                        </Grid>
                      </div>

                    )}
                  </Grid>
                </Grid>
              </div>
            ) : field.type === 'phone' ? (
              <div key={index}>
                {telefonos.map((tel, idx) => (
                  <Grid
                    container
                    justifyContent='flex-start'
                    alignItems="center"
                    key={idx}>
                    <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                    <Grid item lg={8} md={8} sm={8} xs={8}>
                      <TextField
                        fullWidth
                        autoFocus
                        color="primary"
                        margin="normal"
                        variant="outlined"
                        label={field.label}
                        id={`${field.name}-${idx}`}
                        type="text"
                        name={field.name}
                        value={tel.telefono || ''}
                        onChange={(e) => handleChangeTelefono(idx, e.target.value)}
                      />
                    </Grid>
                    <Grid item lg={2} md={2} sm={2} xs={2}>
                      {idx === 0 && (
                        <Grid className={`${classes.addButton} align-left`}>
                          <Button className={classes.iconButton} onClick={handleAddTelefono}>
                            <AddIcon color='primary' fontSize='large' />
                          </Button>
                        </Grid>
                      )}

                      {idx !== 0 && (
                        <Grid className={`${classes.addButton} align-left`}>
                          <Button className={classes.iconButton} onClick={() => handleRemoveTelefono(idx)}>
                            <CloseIcon color='primary' fontSize='large' />
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                ))}

              </div>
            ) : (
              <div key={index}>
                <Grid
                  container
                >
                  <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                  <Grid item lg={8} md={8} sm={8} xs={8}>
                    <TextField
                      fullWidth
                      autoFocus
                      multiline={field.multi === '3'}
                      rows={field.multi}
                      color="primary"
                      margin="normal"
                      variant="outlined"
                      label={field.label}
                      id={field.name}
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      InputProps={field.adornment === 'si' ? { startAdornment: <InputAdornment position="start">{field.unit}</InputAdornment>, } : {}}
                    />
                  </Grid>
                  <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                </Grid>
              </div>
            )
          ))}
          <Grid
            container
          >
            <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
            <Grid item lg={8} md={8} sm={8} xs={8} className={classes.sendButton}>
              <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>Enviar</Button>
            </Grid>
            <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
          </Grid>
        </Box>
      </Container>
    </form >
  );
};

export default FormularioReutilizable;