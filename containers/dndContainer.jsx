import React, { useCallback, useState } from 'react';
import update from 'immutability-helper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import DndCard from '../components/styled/dndCard';

const style = {
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
};

const buttonStyle = {
  color: 'white',
  fontSize: '80px',
  height: '70px',
  width: '130px',
  borderRadius: '4px',
  backgroundColor: '#0e4194',
  boxShadow: '5px 3px 6px 0 rgba(0, 0, 0, 0.16)',
  margin: '20px 0 0 25px',
};

const DndContainer = ({ cards, setCards, allCards }) => {
  const [openMenu, toggleMenu] = useState(false);
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

  const addCard = (value) => {
    const newCards = cards.map((card) => card);
    newCards.push(value);
    return setCards(newCards);
  };

  const deleteCard = (text) => {
    const newCards = cards.filter((card) => card.text !== text);
    return setCards(newCards);
  };

  const renderCard = (card, index) => (
    <DndCard
      key={card.id}
      index={index}
      id={card.id}
      text={card.text}
      moveCard={moveCard}
      deleteCard={deleteCard}
    />
  );
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={style}>
        {cards.map((card, i) => renderCard(card, i))}
        {cards.length < allCards.length && (
          <FormControl>
            <Button id="selectWorkflow" onClick={() => toggleMenu(!openMenu)} style={buttonStyle}>+</Button>
            <Select
              variant="outlined"
              labelId="create-unit-workflow"
              id="workFlow"
              disabled={null}
              open={openMenu}
              onClose={() => toggleMenu(false)}
              onChange={(evt) => addCard(evt.target.value)}
              style={{ display: 'none' }}
              MenuProps={{
                anchorEl: document.getElementById('selectWorkflow'),
                style: { marginTop: 60 },
              }}
            >
              {allCards.filter((card) => !cards.find((c) => c.text === card.text)).map((card) => (
                <MenuItem key={card.id} value={card}>
                  {card.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
    </DndProvider>
  );
};

DndContainer.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.shape)).isRequired,
  setCards: PropTypes.func.isRequired,
  allCards: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.shape)).isRequired,
};

export default DndContainer;
