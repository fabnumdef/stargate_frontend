import React from 'react';
// Import Material
import { makeStyles } from '@material-ui/core/styles';

import { gql, useQuery } from '@apollo/client';
import Avatar from '@material-ui/core/Avatar';
import { ROLES } from '../../utils/constants/enums/index';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import MenuArrow from './MenuArrow';
import MenuRole from './MenuRole';

const useStyles = makeStyles((theme) => ({
    avatar: {
        backgroundColor: theme.palette.common.yellow,
        color: 'inherit'
    },
    iconButtonStyle: {
        margin: '5px 4px 0 4px'
    }
}));

export const GET_MENU_ICON = gql`
    query getMenu {
        activeRoleCache @client {
            role
            unit
            unitLabel
        }
        me {
            id
            firstname
            lastname
            roles {
                role
                campuses {
                    id
                    label
                }
                units {
                    id
                    label
                }
            }
            email {
                original
            }
        }
    }
`;

export default function MenuIcon() {
    const classes = useStyles();

    const { loading, data } = useQuery(GET_MENU_ICON);

    if (loading) {
        return '';
    }

    const transformLabel = () => {
        const label = ROLES[data.activeRoleCache.role].shortLabel;
        if (label.length <= 3) return label;
        return label.match(/\b(\w)/g).join('');
    };

    return (
        <Card elevation={0}>
            <CardHeader
                avatar={
                    <Avatar className={classes.avatar}>
                        <Typography component="h6" variant="subtitle2">
                            {transformLabel()}
                        </Typography>
                    </Avatar>
                }
                action={
                    <>
                        <MenuArrow />
                        {data.me.roles.length > 1 && <MenuRole roles={data.me.roles} />}
                    </>
                }
                title={
                    <Typography component="h6" variant="subtitle2">
                        {`${data.me.rank ? data.me.rank + ' ' : ''}${data.me.firstname} ${
                            data.me.lastname
                        }`}
                    </Typography>
                }
            />
        </Card>
    );
}
