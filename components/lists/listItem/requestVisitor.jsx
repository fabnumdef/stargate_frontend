/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import PropTypes from 'prop-types';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';

import { format } from 'date-fns';
import findValidationStep from '../../../utils/mappers/findValidationStep';
import findVisitorStatus from '../../../utils/mappers/findVisitorStatus';
import { ID_DOCUMENT } from '../../../utils/constants/enums';
import { IconButton } from '@material-ui/core';
import { AttachFile } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    listItem: {
        backgroundColor: theme.palette.common.white,
        marginBottom: 20,
        borderRadius: 4
    },
    title: {
        marginBottom: 20,
        '& h5': {
            fontWeight: 'bold',
            fontSize: '1.2rem'
        }
    },
    subtitles: {
        fontWeight: 'bold'
    },
    information: {
        marginLeft: '4px'
    },
    iconButton: {
        position: 'relative',
        bottom: 3,
        padding: 0
    }
}));

const createItem = ({
    request,
    units,
    birthLastname,
    usageLastname,
    firstname,
    birthday,
    birthplace,
    company,
    nationality,
    identityDocuments,
    generateIdentityFileExportLink
}) => ({
    title: { label: '#Demande', value: request.id },
    visitor: [
        {
            label: 'Nom de naissance (usage), Prénom',
            value: `${birthLastname.toUpperCase()} (${usageLastname}), ${firstname}`
        },
        {
            label: 'Date de venue',
            value: `Du
                ${format(new Date(request.from), 'dd/MM/yyyy')} au
                ${format(new Date(request.to), 'dd/MM/yyyy')} inclus`
        },
        {
            label: 'Né le',
            value: format(new Date(birthday), 'dd/MM/yyyy')
        },
        {
            label: 'Status de la demande',
            value: findVisitorStatus(units) ? findVisitorStatus(units) : findValidationStep(units)
        },
        {
            label: 'Ville de naissance',
            value: birthplace
        },
        {
            label: 'Unité/Société',
            value: company
        },
        {
            label: 'Nationalité',
            value: nationality
        },
        {
            label: 'Demandeur',
            value: `${request.owner.rank || ''}
                  ${request.owner.lastname.toUpperCase()}
                  ${request.owner.firstname}`
        },
        {
            label: "Pièce d'identité",
            value: `${ID_DOCUMENT[identityDocuments[0].kind].label} n° ${
                identityDocuments[0].reference
            }`,
            fileLink:
                identityDocuments[0].file && identityDocuments[0].file.id
                    ? generateIdentityFileExportLink.link
                    : null
        }
    ]
});
export default function RequestVisitorItem({ requestVisitor }) {
    const item = createItem(requestVisitor);

    const classes = useStyles();

    return (
        <ListItem className={classes.listItem}>
            <ListItemText>
                <Grid container>
                    <Grid container item sm={12} className={classes.title}>
                        <Typography variant="h5">{item.title.label} : </Typography>
                        <Typography variant="h5" color="primary" className={classes.information}>
                            {item.title.value}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container>
                    {item.visitor.map((v) => (
                        <Grid container key={v.label} sm={6}>
                            <Typography variant="body2" className={classes.subtitles}>
                                {v.label} :
                            </Typography>
                            <Typography variant="body2" className={classes.information}>
                                {v.value}{' '}
                                {v.fileLink && (
                                    <a href={v.fileLink} download>
                                        <IconButton
                                            className={classes.iconButton}
                                            aria-label="AttachFileIcon">
                                            <AttachFile />
                                        </IconButton>
                                    </a>
                                )}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </ListItemText>
        </ListItem>
    );
}

RequestVisitorItem.propTypes = {
    requestVisitor: PropTypes.shape({
        units: PropTypes.array.isRequired,
        request: PropTypes.shape({
            id: PropTypes.string.isRequired,
            from: PropTypes.instanceOf(Date).isRequired,
            to: PropTypes.instanceOf(Date).isRequired,
            owner: PropTypes.shape({
                rank: PropTypes.string,
                firstname: PropTypes.string.isRequired,
                lastname: PropTypes.string.isRequired
            }).isRequired
        }).isRequired,
        birthLastname: PropTypes.string.isRequired,
        usageLastname: PropTypes.string.isRequired,
        firstname: PropTypes.string.isRequired,
        birthday: PropTypes.instanceOf(Date).isRequired,
        birthplace: PropTypes.string.isRequired,
        nationality: PropTypes.string.isRequired,
        identityDocuments: PropTypes.shape({
            kind: PropTypes.string,
            reference: PropTypes.string
        })
    }).isRequired
};
