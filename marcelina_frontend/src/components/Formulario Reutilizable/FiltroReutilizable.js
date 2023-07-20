import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { TextField, Container, Box, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  select: {
    marginRight: theme.spacing(2),
    minWidth: '150px',
  },
  container: {
    marginTop: theme.spacing(2),
  },
}));

function FiltroReutilizable({ filters, handleFilter }) {
  const classes = useStyles();
  const [filterValues, setFilterValues] = useState({});

  const handleFilterChange = (event, filterId) => {
    const value = event.target.value;
    setFilterValues((prevValues) => ({
      ...prevValues,
      [filterId]: value,
    }));
  };

  const handleApplyFilter = () => {
    handleFilter(filterValues);
  };

  return (
    <Container className={classes.root}>
      <Box className={classes.container}>
        <Grid container alignItems="center" justifyContent="center">
          {filters.map((filter) => (
            <React.Fragment key={filter.id}>
              {filter.type === 'select' ? (
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <FormControl variant="outlined" className={classes.select}>
                    <InputLabel htmlFor={`outlined-${filter.name}-native-simple`}>
                      {filter.label}
                    </InputLabel>
                    <Select
                      native
                      value={filterValues[filter.id] || ''}
                      onChange={(event) => handleFilterChange(event, filter.id)}
                      label={filter.label}
                      inputProps={{
                        name: filter.name,
                        id: `outlined-${filter.name}-native-simple`,
                      }}
                    >
                      <option value="">Seleccionar</option>
                      {filter.options.map((option, ind) => (
                        <option key={ind} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ) : (
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    className={classes.textField}
                    variant="outlined"
                    label={filter.label}
                    value={filterValues[filter.id] || ''}
                    onChange={(event) => handleFilterChange(event, filter.id)}
                  />
                </Grid>
              )}
            </React.Fragment>
          ))}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Button variant="contained" color="primary" onClick={handleApplyFilter}>
              Aplicar filtro
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default FiltroReutilizable;
