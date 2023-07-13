import React, { useState } from 'react';
import { TextField, createTheme, FormControl, InputLabel, Select, Button, Grid, Box, Container, Popover, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

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
  button: {
    margin: theme.spacing(3, 0, 2)
  },
  addButton: {
    height: '5vh',
    width: '4vh',
    marginLeft: 10,
    marginTop: 6,
  },
  selectContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  campos: {
    margin: 10,
    minWidth: '70vh'
  },
  titlePopover: {
    minWidth: '100%',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonPopover: {
    minWidth: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  }
}));

const FormularioReutilizable = ({ fields, onSubmit, selectOptions, onSubmitPopover }) => {

  const classes = useStyles();
  const [formData, setFormData] = useState({});
  const [formDataPopover, setFormDataPopover] = useState({});
  const [open, setOpen] = useState(false);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleChangePopover = event => {
    const { name, value } = event.target;
    setFormDataPopover(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(formData);
  };

  const handleSubmitPopover = event => {
    event.preventDefault();
    onSubmitPopover(formDataPopover);
  };

  const handleOpenPopover = () => {
    setOpen(true);
  }

  const handleClosePopover = () => {
    setOpen(false);
  }

  return (
    <form className={classes.form}>
      <Container style={{ marginTop: 30 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={0}>
            <Grid item lg={2} md={2} sm={1} xs={1}></Grid>
            <Grid item lg={8} md={8} sm={10} xs={10} >
              {fields.map((field, index) => (
                field.type === 'fecha' ? (
                  <div key={index}>
                    <TextField
                      fullWidth
                      color="primary"
                      margin="normal"
                      variant="outlined"
                      label={field.label}
                      id={field.name}
                      type="date"
                      name={field.name}
                      value={formData[field.name] || ''}
                      format={'yyyy-MM-dd'}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                ) : field.type === 'selector' && selectOptions && selectOptions[field.name] ? (
                  <div key={index} className={classes.selectContainer}>
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
                          <option key={ind} value={option.value} > {option.label} </option>
                        ))}
                      </Select>
                    </FormControl>
                    {field.alta === 'si' && (
                      <div>
                        <Button className={classes.addButton} onClick={handleOpenPopover}>
                          <AddIcon color='primary' fontSize='large' />
                        </Button>

                        <Popover
                          open={open}
                          onClose={handleClosePopover}
                          className={classes.popover}
                          anchorOrigin={{
                            vertical: 'center',
                            horizontal: 'center'
                          }}
                          transformOrigin={{
                            vertical: 'center',
                            horizontal: 'center'
                          }}
                        >
                          <form style={{ display: 'flex', flexDirection: 'column' }}>
                            <Grid className={classes.titlePopover}>
                              <Typography component='h1' variant='h5'>Agregar {field.label}</Typography>
                            </Grid>
                            {field.altaCampos.map((altaCampo, index) => (
                              <div key={index}>
                                <Grid container>
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
                                  value={formDataPopover[altaCampo.name] || ''}
                                  onChange={handleChangePopover}
                                />
                                </Grid>
                              </div>
                            ))}
                            <Grid className={classes.buttonPopover}>
                              <Button type="submit" variant="contained" color="primary" onClick={handleSubmitPopover}>Enviar</Button>
                            </Grid>
                          </form>
                        </Popover>
                      </div>
                    )}
                  </div>
                ) : (
                  <div key={index}>
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
                    />
                  </div>
                )

              ))}
              <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>Enviar</Button>
            </Grid>
            <Grid item lg={2} md={2} sm={1} xs={1}></Grid>
          </Grid>
        </Box>
      </Container>
    </form>
  );
};

export default FormularioReutilizable;
