/* eslint-disable react/jsx-wrap-multilines */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';

import { format } from 'date-fns';
import findValidationStep from '../../../utils/mappers/findValidationStep';
import findVisitorStatus from '../../../utils/mappers/findVisitorStatus';

const useStyles = makeStyles(() => ({
  subtitles: {
    fontWeight: 'bold',
  },
  gridFlex: {
    display: 'flex',
  },
  information: {
    marginLeft: '4px',
    marginBottom: '2%',
  },
}));

export default function RequestVisitorItem({ requestVisitor }) {
  // console.log(requestVisitor.units);
  const status = useMemo(
    () => (findVisitorStatus(requestVisitor.units) ? findVisitorStatus(requestVisitor.units)
      : findValidationStep(requestVisitor.units)
    ),
    [requestVisitor.units],
  );

  const classes = useStyles();

  return (
    <ListItem divider>
      <ListItemText
        primary={
          <Grid container>
            <Grid item sm={12} className={classes.gridFlex}>
              <Typography variant="h5" color="primary">
                # Demandes :
              </Typography>
              <Typography variant="subtitle2" color="primary" className={classes.information}>
                {requestVisitor.request.id}
              </Typography>
            </Grid>
          </Grid>
        }
        secondary={
          <Grid container>
            <Grid item sm={6}>
              <Grid item sm={12} className={classes.gridFlex}>
                <Typography variant="body1" color="primary" className={classes.subtitles}>
                  Nom de naissance(usage), Prénom :
                </Typography>
                <Typography variant="body1" color="primary" className={classes.information}>
                  {`${requestVisitor.birthLastname.toUpperCase()} (${
                    requestVisitor.usageLastname
                  }) ,${requestVisitor.firstname}`}
                </Typography>
              </Grid>
              <Grid item sm={12} className={classes.gridFlex}>
                <Grid item sm={12} className={classes.gridFlex}>
                  <Typography variant="body1" color="primary" className={classes.subtitles}>
                    Née le :
                  </Typography>
                  <Typography variant="body1" color="primary" className={classes.information}>
                    {format(new Date(requestVisitor.birthday), 'dd/MM/yyyy')}
                  </Typography>
                </Grid>
                <Grid item sm={12} className={classes.gridFlex}>
                  <Typography variant="body1" color="primary" className={classes.subtitles}>
                    à :
                  </Typography>
                  <Typography variant="body1" color="primary" className={classes.information}>
                    {requestVisitor.birthplace}
                  </Typography>
                </Grid>
              </Grid>

              <Grid item sm={12} className={classes.gridFlex}>
                <Typography variant="body1" color="primary" className={classes.subtitles}>
                  Nationalité :
                </Typography>
                <Typography variant="body1" color="primary" className={classes.information}>
                  {requestVisitor.nationality.toUpperCase()}
                </Typography>
              </Grid>
            </Grid>
            <Grid item sm={6}>
              <Grid item sm={12} className={classes.gridFlex}>
                <Typography variant="body1" color="primary" className={classes.subtitles}>
                  Date venue :
                </Typography>
                <Typography variant="body1" color="primary" className={classes.information}>
                  {`Du
                ${format(new Date(requestVisitor.request.from), 'dd/MM/yyyy')} au
                ${format(new Date(requestVisitor.request.to), 'dd/MM/yyyy')} inclus`}
                </Typography>
              </Grid>
              <Grid item sm={12} className={classes.gridFlex}>
                <Typography variant="body1" color="primary" className={classes.subtitles}>
                  Status de la demande :
                </Typography>
                <Typography variant="body1" color="primary" className={classes.information}>
                  {status}
                </Typography>
              </Grid>
              <Grid item sm={12} className={classes.gridFlex}>
                <Typography variant="body1" color="primary" className={classes.subtitles}>
                  Demandeur :
                </Typography>
                <Typography variant="body1" color="primary" className={classes.information}>
                  {
                    `${requestVisitor.request.owner.rank || ''}
                  ${requestVisitor.request.owner.lastname.toUpperCase()}
                  ${requestVisitor.request.owner.firstname}`
                    /* @todo tel */
                  }
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        }
      />
    </ListItem>
  );
}

RequestVisitorItem.propTypes = {
  requestVisitor: PropTypes.shape({
    status: PropTypes.string.isRequired,
    request: PropTypes.shape({
      id: PropTypes.string.isRequired,
      from: PropTypes.instanceOf(Date).isRequired,
      to: PropTypes.instanceOf(Date).isRequired,
      owner: PropTypes.shape({
        rank: PropTypes.string,
        firstname: PropTypes.string.isRequired,
        lastname: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    birthLastname: PropTypes.string.isRequired,
    usageLastname: PropTypes.string.isRequired,
    firstname: PropTypes.string.isRequired,
    birthday: PropTypes.instanceOf(Date).isRequired,
    birthplace: PropTypes.string.isRequired,
    nationality: PropTypes.string.isRequired,
  }).isRequired,
};
