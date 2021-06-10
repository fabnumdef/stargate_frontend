import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';
import ItemCard from './itemCard';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import SelectedBadge from './common/TabBadge';

const useStyles = makeStyles(() => ({
    cardHeader: {
        width: 137,
        paddingTop: 2
    },
    buttonStyle: {
        height: 8
    },
    removeIcon: {
        height: 12,
        cursor: 'pointer',
        zIndex: 1000
    },
    cardContent: {
        position: 'relative',
        top: '-8px'
    }
}));

const ItemTypes = {
    CARD: 'cards'
};

const DndCard = ({ id, text, index, moveCard, deleteCard }) => {
    const classes = useStyles();
    const ref = useRef(null);
    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            // eslint-disable-next-line no-param-reassign
            item.index = hoverIndex;
        }
    });
    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.CARD, id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });
    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));
    return (
        <div ref={ref}>
            <ItemCard opacity={opacity} style={{ cursor: 'move', opacity }}>
                <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    className={classes.cardHeader}>
                    <SelectedBadge small>{index + 1}</SelectedBadge>
                    <CloseIcon onClick={() => deleteCard(text)} className={classes.removeIcon} />
                </Grid>
                <Grid className={classes.cardContent}>{text}</Grid>
            </ItemCard>
        </div>
    );
};

DndCard.propTypes = {
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    moveCard: PropTypes.func.isRequired,
    deleteCard: PropTypes.func.isRequired
};

export default DndCard;
