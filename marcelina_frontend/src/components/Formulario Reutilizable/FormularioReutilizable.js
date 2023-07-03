import React, { useState } from 'react';
import { Container, Grid, Paper, Avatar, Typography, TextField, Button, ThemeProvider, createTheme, CssBaseline} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

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
  button: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const FormularioReutilizable = ({ fields }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({});

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();
    console.log('Formulario enviado', formData);
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      {fields.map((field, index) => (
        <div key={index}>
          <TextField
            fullWidth
            autoFocus
             multiline={field.name === 'Obs'}
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
      ))}
    </form>
  );
};

export default FormularioReutilizable;
