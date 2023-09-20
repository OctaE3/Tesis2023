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
  

  return (
    <Container className={classes.root}>
      <Box className={classes.container}>
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
                      native
                      value={filterValues[filter.id] || ''}
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
                    className={classes.textField}
                    variant="outlined"
                    label={`Desde ${filter.label}`}
                    type="datetime-local"
                    value={filterValues[`${filter.id}-desde`] || ''}
                    onChange={(event) => handleFilterChange(event, `${filter.id}-desde`)}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={3} lg={2} className={classes.filters}>
                  <TextField
                    fullWidth
                    className={classes.textField}
                    variant="outlined"
                    label={`Hasta ${filter.label}`}
                    type="datetime-local"
                    value={filterValues[`${filter.id}-hasta`] || ''}
                    onChange={(event) => handleFilterChange(event, `${filter.id}-hasta`)}
                  />
                </Grid>
              </>
            ) : filter.type === 'date' ? ( // Modificación para los filtros de tipo datetime
            <>
              <Grid item xs={12} sm={4} md={3} lg={2} className={classes.filters}>
                <TextField
                  className={classes.textField}
                  variant="outlined"
                  label={`Desde ${filter.label}`}
                  type="date"
                  value={filterValues[`${filter.id}-desde`] || ''}
                  onChange={(event) => handleFilterChange(event, `${filter.id}-desde`)}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={3} lg={2} className={classes.filters}>
                <TextField
                  className={classes.textField}
                  variant="outlined"
                  label={`Hasta ${filter.label}`}
                  type="date"
                  value={filterValues[`${filter.id}-hasta`] || ''}
                  onChange={(event) => handleFilterChange(event, `${filter.id}-hasta`)}
                />
              </Grid>
            </>
          ) :(
                <Grid item xs={12} sm={4} md={3} lg={2} className={classes.filters}>
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
          <Grid
            container
          >
            <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
            <Grid item lg={8} md={8} sm={8} xs={8} className={classes.sendButton}>
              <Button type="submit" variant="contained" color="primary" onClick={handleApplyFilter}>Aplicar Filtro</Button>
            </Grid>
            <Grid item lg={2} md={2} sm={2} xs={2}></Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default FiltroReutilizable;
