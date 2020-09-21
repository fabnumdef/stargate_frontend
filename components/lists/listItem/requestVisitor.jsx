import React, { useMemo } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { format } from 'date-fns';
import {
  VISITOR_STATUS,
  WORKFLOW_BEHAVIOR,
} from '../../../utils/constants/enums';
import findRejectedRole from '../../../utils/mappers/findRejectedRole';
import findVisitorStatus from '../../../utils/mappers/findVisitorStatus';


export default function RequestVisitorItem({ requestVisitor }) {
  const status = useMemo(() => (requestVisitor.status === WORKFLOW_BEHAVIOR
    .VALIDATION.RESPONSE.negative
    ? `${VISITOR_STATUS[requestVisitor.status]} par ${findRejectedRole(requestVisitor.units)}`
    : findVisitorStatus(requestVisitor.units)),
  [requestVisitor.status, requestVisitor.units]);

  return (
    <ListItem>
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
          <Grid container spacing={2}>
            <Grid item sm={6}>
              <Typography variant="body1" color="primary">
                Nom de naissance, Prenom :
                {' '}
              </Typography>
              <Typography variant="body2" color="primary">
                {`${requestVisitor.lastname.toUpperCase()} ,${requestVisitor.firstname}`}
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
                {format(new Date(requestVisitor.birthplace), 'dd/MM/yyyy')}
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
