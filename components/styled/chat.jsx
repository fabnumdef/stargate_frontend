import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { toDate, differenceInHours } from 'date-fns';
import Message from './message';

const MY_USER_ID = 'Demandeur du Truc';

export default function MessageList() {
  const [messages] = useState([
    {
      id: 1,
      author: 'Demandeur du Truc',
      message:
        'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
      timestamp: new Date().getTime(),
    },
    {
      id: 2,
      author: 'orange',
      message:
        'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
      timestamp: new Date().getTime(),
    },
    {
      id: 3,
      author: 'orange',
      message:
        'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
      timestamp: new Date().getTime(),
    },
  ]);

  const renderMessages = () => {
    let i = 0;
    const messageCount = messages.length;
    const tempMessages = [];

    while (i < messageCount) {
      const previous = messages[i - 1];
      const current = messages[i];
      const next = messages[i + 1];
      const isMine = current.author === MY_USER_ID;
      const currentMoment = toDate(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        const previousMoment = toDate(previous.timestamp);
        const previousDuration = differenceInHours(currentMoment, previousMoment);
        prevBySameAuthor = previous.author === current.author;

        if (prevBySameAuthor && previousDuration < 1) {
          startsSequence = false;
        }

        if (previousDuration < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        const nextMoment = toDate(next.timestamp);
        const nextDuration = differenceInHours(nextMoment, currentMoment);
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration < 1) {
          endsSequence = false;
        }
      }

      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />,
      );

      // Proceed to the next message.
      i += 1;
    }

    return tempMessages;
  };

  return (
    <div className="message-list">
      <div className="message-list-container">{renderMessages()}</div>
      <TextField id="outlined-basic" label="Ajouter un message" variant="outlined" fullWidth />
      <style jsx>
        {`
        .message-list-container {
          height: 30vh;
          padding: 10px;
          padding-bottom: 70px;
          overflow: auto;
        }
      `}
      </style>
    </div>
  );
}
