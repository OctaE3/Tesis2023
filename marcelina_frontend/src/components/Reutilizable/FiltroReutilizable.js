import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { TextField, Container, Box, Grid, Typography } from '@material-ui/core';

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
    minWidth: '100%',
  },
  textField: {
    minWidth: '100%'
  },
  container: {
    marginTop: theme.spacing(2),
    minWidth: '100%'
  },
  filters: {
    margin: theme.spacing(1),
  },
  sendButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  btnFilter: {
    marginLeft: '1%',
    marginRight: '1%'
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
    const validFilterValues = Object.keys(filterValues).reduce((acc, key) => {
      if (filterValues[key] && filterValues[key] !== 'Seleccionar') {
        if (key.includes('fecha')) {
          const formattedDate = filterValues[key].replace('T', ' ');
          acc[key] = formattedDate;
        } else {
          acc[key] = filterValues[key];
        }
      }
      return acc;
    }, {});

    handleFilter(validFilterValues);
  };

  const handleCleanFilter = () => {
    setFilterValues({});
    handleFilter({});
  }

  return (
    <Container className={classes.root}>
      <Box className={classes.container}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'center', marginBottom: '1%', }}>
            <Typography variant="h6">
              Filtros
            </Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent='center' alignContent='center'>
          {filters.map((filter) => (
            <React.Fragment key={filter.id}>
              {filter.type === 'select' ? (
                <Grid item xs={12} sm={4} md={3} lg={2} className={classes.filters}>
                  <FormControl variant="outlined" className={classes.select}>
                    <InputLabel htmlFor={`outlined-${filter.name}-native-simple`}>
                      {filter.label}
                    </InputLabel>
                    <Select
                      id={filter.id}
                      native
                      value={filterValues[filter.id] || 'Seleccionar'}
                      onChange={(event) => handleFilterChange(event, filter.id)}
                      label={filter.label}
                      inputProps={{
                        name: filter.name,
                        id: `outlined-${filter.name}-native-simple`,
                      }}
                    >
                      <option value="Seleccionar">Seleccionar</option>
                      {filter.options.map((option, ind) => (
                        <option key={ind} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ) : filter.type === 'datetime' ? ( // Modificación para los filtros de tipo datetime
                <>
                  <Grid item xs={12} sm={4} md={3} lg={2} className={classes.filters}>
                    <TextField
                      fullWidth
                      id={filter.id}
                      className={classes.textField}
                      variant="outlined"
                      label={`Desde ${filter.label}`}
                      type="datetime-local"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={filterValues[`${filter.id}-desde`] || null}
                      onChange={(event) => handleFilterChange(event, `${filter.id}-desde`)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} lg={2} className={classes.filters}>
                    <TextField
                      fullWidth
                      id={filter.id}
                      className={classes.textField}
                      variant="outlined"
                      label={`Hasta ${filter.label}`}
                      type="datetime-local"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={filterValues[`${filter.id}-hasta`] || ''}
                      onChange={(event) => handleFilterChange(event, `${filter.id}-hasta`)}
                    />
                  </Grid>
                </>
              ) : filter.type === 'date' ? ( // Modificación para los filtros de tipo datetime
                <>
                  <Grid item xs={12} sm={4} md={3} lg={2} className={classes.filters}>
                    <TextField
                      id={filter.id}
                      className={classes.textField}
                      variant="outlined"
                      label={`Desde ${filter.label}`}
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={filterValues[`${filter.id}-desde`] || undefined}
                      onChange={(event) => handleFilterChange(event, `${filter.id}-desde`)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} lg={2} className={classes.filters}>
                    <TextField
                      id={filter.id}
                      className={classes.textField}
                      variant="outlined"
                      label={`Hasta ${filter.label}`}
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={filterValues[`${filter.id}-hasta`] || ''}
                      onChange={(event) => handleFilterChange(event, `${filter.id}-hasta`)}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item xs={12} sm={4} md={3} lg={2} className={classes.filters}>
                  <TextField
                    id={filter.id}
                    className={classes.textField}
                    variant="outlined"
                    label={filter.label}
                    value={filterValues[filter.id] || ''}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(event) => handleFilterChange(event, filter.id)}
                  />
                </Grid>
              )}
            </React.Fragment>
          ))}
          <Grid
            container
          >
            <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
            <Grid item lg={8} md={8} sm={8} xs={8} className={classes.sendButton}>
              <Button type="submit" variant="contained" color="primary" onClick={handleApplyFilter} className={classes.btnFilter}>Aplicar Filtros</Button>
              <Button type="submit" variant="contained" color="primary" onClick={handleCleanFilter} className={classes.btnFilter}>Limpiar Filtros</Button>
            </Grid>
            <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default FiltroReutilizable;
