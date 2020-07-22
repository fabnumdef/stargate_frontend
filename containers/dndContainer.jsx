import React, { useCallback } from 'react';
import update from 'immutability-helper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DndCard from '../components/styled/dndCard';

const style = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
};
const DndContainer = ({ cards, setCards }) => {
  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cards[dragIndex];
      setCards(
        update(cards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        }),
      );
    },
    [cards],
  );
  const renderCard = (card, index) => (
    <DndCard
      key={card.id}
      index={index}
      id={card.id}
      text={card.text}
      moveCard={moveCard}
    />
  );
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
    </DndProvider>
  );
};

export default DndContainer;
