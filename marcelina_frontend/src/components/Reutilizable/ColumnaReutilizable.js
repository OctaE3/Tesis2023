import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 40,
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
}));

function renderRow(props) {
  const { index, style, contacts } = props;

  return (
    <ListItem button style={style} key={index}>
      <ListItemText primary={contacts[index]} />
    </ListItem>
  );
}

renderRow.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  contacts: PropTypes.array.isRequired,
};

function ColumnaReutilizable({ contacts }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FixedSizeList height={46} width={300} itemSize={46} itemCount={contacts.length}>
        {({ index, style }) => renderRow({ index, style, contacts })}
      </FixedSizeList>
    </div>
  );
}

ColumnaReutilizable.propTypes = {
  contacts: PropTypes.array.isRequired,
};

export default ColumnaReutilizable;
