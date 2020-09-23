import React, { useMemo } from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';

import { format } from 'date-fns';
import {
  VISITOR_STATUS,
  STATE_REQUEST,
} from '../../../utils/constants/enums';
import findValidationStep from '../../../utils/mappers/findValidationStep';


export default function RequestVisitorItem({ requestVisitor }) {
  const status = useMemo(() => (requestVisitor.status === STATE_REQUEST.STATE_CANCELED.state
    ? VISITOR_STATUS.CANCELED
    : findValidationStep(requestVisitor.units)),
  [requestVisitor.status, requestVisitor.units]);

  return (
    <ListItem divider>
      <ListItemText
        primary={(
          <>
            <Typography variant="h5" color="primary">
              # Demandes :
            </Typography>
            <Typography variant="subtitle2" color="primary">
              {requestVisitor.request.id}
            </Typography>
          </>
            )}

        secondary={(
          <Grid container>
            <Grid item sm={6}>
              <Typography variant="body1" color="primary">
                Nom de naissance, Prenom :
                {' '}
              </Typography>
              <Typography variant="body2" color="primary">
                {`${requestVisitor.birthLastname.toUpperCase()}, ${requestVisitor.firstname}`}
              </Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="body1" color="primary">
                Date venue :
              </Typography>
              <Typography variant="body2" color="primary">
                {`Du
                ${format(new Date(requestVisitor.request.from), 'dd/MM/yyyy')} au
                ${format(new Date(requestVisitor.request.to), 'dd/MM/yyyy')} inclus`}
              </Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="body1" color="primary">
                Née le :
              </Typography>
              <Typography variant="body2" color="primary">
                {format(new Date(requestVisitor.birthday), 'dd/MM/yyyy')}
              </Typography>
              <Typography variant="body1" color="primary">
                À :
              </Typography>
              <Typography variant="body2" color="primary">
                {requestVisitor.birthplace}
              </Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="body1" color="primary">
                Status de la demande :
              </Typography>
              <Typography variant="body2" color="primary">
                {status}
              </Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="body1" color="primary">
                Nationalité :
              </Typography>
              <Typography variant="body2" color="primary">
                {requestVisitor.nationality.toUpperCase()}
              </Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="body1" color="primary">
                Demandeur :
              </Typography>
              <Typography variant="body2" color="primary">
                {
                  `${requestVisitor.request.owner.rank || ''}
                  ${requestVisitor.request.owner.lastname.toUpperCase()}
                  ${requestVisitor.request.owner.firstname}`
                /* @todo tel */}
              </Typography>
            </Grid>
          </Grid>
          )}
      />
    </ListItem>
  );
}
