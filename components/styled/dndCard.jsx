import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const containerStyle = {
  textAlign: 'center',
  margin: '0 20px',
};

const cardStyle = {
  border: 'solid 1px #0e4194',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
  width: '130px',
  height: '70px',
  borderRadius: '3px',
  display: 'flex',
  flexDirection: 'column',
};

const buttonContainer = {
  alignSelf: 'end',
};

const buttonStyle = {
  border: 'none',
  color: '#0e4194',
  backgroundColor: 'white',
};

const ItemTypes = {
  CARD: 'cards',
};

const DndCard = ({
  id, text, index, moveCard, deleteCard,
}) => {
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
    },
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div ref={ref} style={containerStyle}>
      {index + 1}
      <div style={{ ...cardStyle, opacity }}>
        <div style={buttonContainer}>
          <button type="button" onClick={() => deleteCard(text)} style={buttonStyle}>X</button>
        </div>
        <div>
          {text}
        </div>
      </div>
    </div>
  );
};

export default DndCard;
