import React, { useState, useRef, useEffect } from 'react';
import { TextField, createTheme, FormControl, InputLabel, Button, Grid, Box, Container, Typography, Select } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import InputAdornment from '@material-ui/core/InputAdornment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ValidacionReutilizable from './ValidacionReutilizable';
import * as Yup from 'yup';

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
  auto: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  }
}));

const FormularioReutilizable = ({ fields, onSubmit, selectOptions, onSubmitModal }) => {

  const classes = useStyles();
  const [formData, setFormData] = useState({});
  const [formDataModal, setFormDataModal] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [telefonos, setTelefonos] = useState([{ telefono: "" }]);
  const [dynamicMultiple, setDynamicMultiple] = useState([{ selectValue: "", textFieldValue: "" }]);
  const campoReadOnly = useRef();
  const [stockAgregado, setStockAgregado] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [opcion, setOpcion] = useState([
    { label: ' ', value: null },
  ]);
  const createOption = (carneNombre) => ({
    label: carneNombre,
    value: carneNombre,
  });

  const [carneCorteOptions, setCarneCorteOptions] = useState([]);

  const fieldsWithValidation = fields.filter((field) => field.validation);
  const validationSchema = ValidacionReutilizable(fieldsWithValidation);

  useEffect(() => {
    if (formDataModal['carneTipo'] === 'Porcino') {
      setCarneCorteOptions(selectOptions.carneCortePorcino);
    } else if (formDataModal['carneTipo'] === 'Bovino') {
      setCarneCorteOptions(selectOptions.carneCorteBovino);
    }
  }, [formDataModal['carneTipo']]);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));

    try {
      validationSchema.validateSyncAt(name, { [name]: value });
      setFormErrors((prevFormErrors) => ({ ...prevFormErrors, [name]: undefined }));
    } catch (error) {
      setFormErrors((prevFormErrors) => ({ ...prevFormErrors, [name]: error.message }));
    }
    console.log(formData);
  };

  const handleChangeLista = (fieldName, newValue) => {
    setFormData(prevState => ({
      ...prevState,
      [fieldName]: newValue,
    }));
    console.log(formData);
  };

  const handleAddTelefono = async () => {
    setTelefonos([...telefonos, { telefono: "" }]);
  };

  const handleChangeTelefono = async (index, telefono) => {
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

  const handleAddDynamic = () => {
    setDynamicMultiple([...dynamicMultiple, { selectValue: "", textFieldValue: "" }]);
  }

  const handleChangeDynamic = (index, field, value) => {
    setDynamicMultiple(prevDynamicMultiple => {
      const updateFields = [...prevDynamicMultiple];
      updateFields[index][field] = value;
      return updateFields;
    })
    setFormData(prevFormData => ({
      ...prevFormData,
      'cantidad': dynamicMultiple,
    }));
    console.log(formData);
  }

  const handleRemoveDynamic = (index) => {
    const updatedFields = [...dynamicMultiple];
    updatedFields.splice(index, 1);
    setDynamicMultiple(updatedFields);

    setFormData(prevFormData => ({
      ...prevFormData,
      'cantidad': dynamicMultiple,
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

  const handleChangeModalStock = event => {
    setStockAgregado(event.target.value);
    console.log(stockAgregado);
  };

  const handleChangeSelectMultiple = (fieldName, newValue) => {
    if (newValue.label !== undefined) {
      setSelectedOptions(newValue);

      setFormData(prevState => ({
        ...prevState,
        [fieldName]: newValue,
      }));
      console.log(formData);
    } else {
      console.log("No intente usar las opciones, no son validas.");
    }
  };

  const handleChangeSelectModal = event => {
    const { name, value } = event.target;
    setFormDataModal(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmitSelectModal = async event => {
    event.preventDefault();
    try {
      await validationSchema.validateSync(formDataModal, { abortEarly: false });
      console.log(formDataModal);

      setFormData(prevState => ({
        ...prevState,
        carnesAgregadas: prevState.carnesAgregadas ? [...prevState.carnesAgregadas, formDataModal] : [formDataModal],
      }));

      console.log(formData);
      const newOption = createOption(formDataModal.carneNombre);
      setSelectedOptions(prevSelectedOptions => [...prevSelectedOptions, newOption]);
      console.log(selectedOptions);
      setFormDataModal({});

      setOpen(false);
    } catch (error) {
      console.error('Error de validacion: ', error.message);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await validationSchema.validateSync(formData, { abortEarly: false });
      onSubmit(formData);
    } catch (error) {
      console.error('Error de validacion: ', error.message);
    }
  };

  const handleSubmitModal = async event => {
    event.preventDefault();
    try {
      await validationSchema.validateSync(formData, { abortEarly: false });
      onSubmitModal(formDataModal);
      setOpen(false);
    } catch (error) {
      console.error('Error de validacion: ', error.message);
    }
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
            ) : field.type === 'selector' && field.multiple !== 'si' && selectOptions && selectOptions[field.name] ? (
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
                        onChange={handleChange}
                        label={field.label}
                        inputProps={{
                          name: field.name,
                          id: `outlined-${field.name}-native-simple`,
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
            ) : field.type === 'selector' && field.multiple === 'si' ? (
              <div key={index}>
                <Grid
                  container
                  justifyContent='flex-start'
                  alignItems="center"
                >
                  <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                  <Grid item lg={8} md={8} sm={8} xs={8}>
                    <Autocomplete
                      multiple
                      className={classes.auto}
                      options={selectOptions[field.name]}
                      getOptionLabel={(option) => option.label}
                      value={formData[field.name] || []}
                      onChange={(event, newValue) => handleChangeLista(field.name, newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label={field.label}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                </Grid>
              </div>
            ) : field.type === 'selectorMultiple' ? (
              <div key={index}>
                <Grid
                  container
                  justifyContent='flex-start'
                  alignItems="center"
                >
                  <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                  <Grid item lg={8} md={8} sm={8} xs={8}>
                    <Autocomplete
                      multiple
                      className={classes.auto}
                      options={opcion}
                      getOptionLabel={(option) => option.label}
                      value={selectedOptions}
                      onChange={(event, newValue) => handleChangeSelectMultiple(field.name, newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label={field.label}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />
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
                                  altaCampo.name === 'carneTipo' ? (
                                    <div key={index}>
                                      <FormControl variant="outlined" className={classes.formControl} >
                                        <InputLabel htmlFor={`outlined-${altaCampo.name}-native-simple`}>{altaCampo.label}</InputLabel>
                                        <Select
                                          className={classes.select}
                                          native
                                          value={formDataModal[altaCampo.name] || ''}
                                          onChange={handleChangeSelectModal}
                                          label={altaCampo.label}
                                          inputProps={{
                                            name: altaCampo.name,
                                            id: `outlined-${altaCampo.name}-native-simple`,
                                          }}
                                        >
                                          <option value="Seleccionar" > Seleccionar </option>
                                          {selectOptions[altaCampo.name].map((option, ind) => (
                                            <option key={ind} value={option.value}>
                                              {option.label}
                                            </option>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    </div>
                                  ) : altaCampo.name === 'carneCorte' ? (
                                    <div key={index}>
                                      <FormControl variant="outlined" className={classes.formControl} >
                                        <InputLabel htmlFor={`outlined-${altaCampo.name}-native-simple`}>{altaCampo.label}</InputLabel>
                                        <Select
                                          className={classes.select}
                                          native
                                          value={formDataModal[altaCampo.name] || ''}
                                          onChange={handleChangeSelectModal}
                                          label={altaCampo.label}
                                          inputProps={{
                                            name: altaCampo.name,
                                            id: `outlined-${altaCampo.name}-native-simple`,
                                          }}
                                        >
                                          <option value="Seleccionar" > Seleccionar </option>
                                          {carneCorteOptions.map((option, ind) => (
                                            <option key={ind} value={option.value}>
                                              {option.label}
                                            </option>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    </div>
                                  ) : (
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
                                        onChange={handleChangeSelectModal}
                                      />
                                    </div>
                                  )

                                ))}
                                <Button className={classes.modalButton} type="submit" variant="contained" color="primary" onClick={handleSubmitSelectModal}>Enviar</Button>
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
                        InputProps={{ startAdornment: <InputAdornment position="start">+598</InputAdornment>, }}
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
            ) : field.disabled === 'si' ? (
              <div key={index}>
                <Grid
                  container
                  justifyContent='center'
                  alignItems='center'
                >
                  <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                  <Grid item lg={8} md={8} sm={8} xs={8}>
                    <TextField
                      fullWidth
                      autoFocus
                      readOnly
                      inputRef={campoReadOnly}
                      multiline={field.multi === '3'}
                      rows={field.multi}
                      color="primary"
                      margin="normal"
                      variant="outlined"
                      label={field.label}
                      id={field.name}
                      type={field.type}
                      name={field.name}
                      value={field.disabled === 'si' ? field.value : formData[field.name] || ''}
                      InputProps={field.adornment === 'si' ? { startAdornment: <InputAdornment position="start">{field.unit}</InputAdornment>, } : {}}
                    />
                  </Grid>
                  <Grid item lg={2} md={2} sm={2} xs={2}>
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
                            <Typography component='h1' variant='h5'>Ingrese la cantidad que quiere sumar al stock</Typography>
                            <div key={index}>
                              <TextField
                                fullWidth
                                autoFocus
                                color="primary"
                                margin="normal"
                                variant="outlined"
                                className={classes.campos}
                                label="Cantidad"
                                id='StockAgregar'
                                type='text'
                                name='StockAgregar'
                                value={stockAgregado}
                                onChange={handleChangeModalStock}
                              />
                            </div>
                            <Button className={classes.modalButton} type="submit" variant="contained" color="primary" onClick={handleCloseModal}>Enviar</Button>
                          </div>
                        </Fade>
                      </Modal>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            ) : field.type === 'cantidadMultiple' && selectOptions && selectOptions[field.name] ? (
              <div key={index}>
                {dynamicMultiple.map((dynamic, idx) => (
                  <Grid
                    container
                    justifyContent='flex-start'
                    alignItems="center"
                    key={idx}>
                    <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                    <Grid item lg={8} md={8} sm={8} xs={8}>
                      <FormControl variant="outlined" className={classes.formControl} >
                        <InputLabel htmlFor={`outlined-${field.name}-native-simple`}>{field.label}</InputLabel>
                        <Select
                          className={classes.select}
                          native
                          value={dynamic.selectValue}
                          onChange={(e) => handleChangeDynamic(idx, "selectValue", e.target.value)}
                          label={field.label}
                          inputProps={{
                            name: field.name,
                            id: `outlined-${field.name}-native-simple`,
                          }}
                        >
                          <option value="Seleccionar" > Seleccionar </option>
                          {selectOptions[field.name].map((option, ind) => (
                            <option key={ind} value={option.value}>
                              {`${option.label} - ${option.label2}`}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={2} md={2} sm={2} xs={2}>
                      {idx === 0 && (
                        <Grid className={`${classes.addButton} align-left`}>
                          <Button className={classes.iconButton} onClick={handleAddDynamic}>
                            <AddIcon color='primary' fontSize='large' />
                          </Button>
                        </Grid>
                      )}

                      {idx !== 0 && (
                        <Grid className={`${classes.addButton} align-left`}>
                          <Button className={classes.iconButton} onClick={() => handleRemoveDynamic(idx)}>
                            <CloseIcon color='primary' fontSize='large' />
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                    <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
                    <Grid item lg={8} md={8} sm={8} xs={8}>
                      <TextField
                        fullWidth
                        autoFocus
                        color="primary"
                        margin="normal"
                        variant="outlined"
                        label={field.campo.label}
                        id={`${field.campo.name}-${idx}`}
                        type="text"
                        name={field.campo.name}
                        value={dynamic.textFieldValue}
                        onChange={(e) => handleChangeDynamic(idx, "textFieldValue", e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start">Kg</InputAdornment>, }}
                      />
                    </Grid>
                    <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
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
                      helperText={field.validation ? formErrors[field.name] : ''}
                      error={field.validation ? Boolean(formErrors[field.name]) : ''}
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