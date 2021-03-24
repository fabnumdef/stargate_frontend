import React from 'react';
// Import Material
import { makeStyles } from '@material-ui/core/styles';

import { useQuery } from '@apollo/client';
import { GET_ACTIVE_ROLE, GET_ME } from '../../lib/apollo/queries';
import Avatar from '@material-ui/core/Avatar';
import { ROLES } from '../../utils/constants/enums/index';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import MenuArrow from './MenuArrow';
import MenuRole from './MenuRole';

const useStyles = makeStyles((theme) => ({
    yellow: {
        backgroundColor: theme.palette.secondary.main
    },
    userInfos: {
        fontWeight: 700
    },
    iconButtonStyle: {
        marginTop: 8
    }
}));

export default function MenuIcon() {
    const classes = useStyles();

    const {
        loading: l1,
        data: { me }
    } = useQuery(GET_ME);

    const {
        loading: l2,
        data: { activeRoleCache }
    } = useQuery(GET_ACTIVE_ROLE);

    if (l1 || l2) {
        return '';
    }

    return (
        <Card elevation={0}>
            <CardHeader
                avatar={
                    <Avatar className={classes.yellow}>
                        {ROLES[activeRoleCache.role].shortLabel}
                    </Avatar>
                }
                action={
                    <>
                        <MenuArrow />
                        {me.roles.length > 1 && <MenuRole roles={me.roles} />}
                    </>
                }
                title={
                    <Typography component="h6" variant="h6">
                        {`${me.rank ? me.rank + ' ' : ''}${me.firstname} ${me.lastname}
                        ${activeRoleCache.unitLabel ? ` - ${activeRoleCache.unitLabel}` : ''}`}
                    </Typography>
                }
            />
        </Card>
    );
}
