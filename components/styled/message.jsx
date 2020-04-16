import React from 'react';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

function Message(props) {
  const {
    data, isMine, startsSequence, endsSequence, showTimestamp,
  } = props;

  const friendlyTimestamp = format(data.timestamp, 'PPPpp', { locale: frLocale });

  return (
    <div
      className={[
        'message',
        `${isMine ? 'mine' : ''}`,
        `${startsSequence ? 'start' : ''}`,
        `${endsSequence ? 'end' : ''}`,
      ].join(' ')}
    >
      {showTimestamp && <div className="timestamp">{friendlyTimestamp}</div>}

      <div className="bubble-container">
        <div className="icon-message">
          <AccountCircleIcon color="primary" />
          <Typography variant="body2">{data.author}</Typography>
        </div>
        <div className="bubble" title={friendlyTimestamp}>
          {data.message}
        </div>
      </div>
      <style jsx>
        {`
        .message {
          display: flex;
          flex-direction: column;
        }

        .message .timestamp {
          display: flex;
          justify-content: center;
          color: #999;
          font-weight: 600;
          font-size: 12px;
          margin: 10px 0px;
          text-transform: uppercase;
        }

        .message .bubble-container {
          font-size: 14px;
          display: flex;
        }

        .message.mine .bubble-container {
          flex-direction: row-reverse;
        }

        .message.start .bubble-container .bubble {
          /* margin-top: 10px; */
          border-top-left-radius: 20px;
        }

        .message.end .bubble-container .bubble {
          border-bottom-left-radius: 20px;
          /* margin-bottom: 10px; */
        }

        .message.mine.start .bubble-container .bubble {
          margin-top: 10px;
          border-top-right-radius: 20px;
        }

        .message.mine.end .bubble-container .bubble {
          border-bottom-right-radius: 20px;
          margin-bottom: 10px;
        }

        .message .bubble-container .bubble {
          margin: 1px 0px;
          background: #f4f4f8;
          padding: 10px 15px;
          border-radius: 20px;
          max-width: 75%;
          border-top-left-radius: 2px;
          border-bottom-left-radius: 2px;
          border-top-right-radius: 20px;
          border-bottom-right-radius: 20px;
        }

        .message.mine .bubble-container .bubble {
          background: #007aff;
          color: white;
          border-top-left-radius: 20px;
          border-bottom-left-radius: 20px;
          border-top-right-radius: 2px;
          border-bottom-right-radius: 2px;
        }

        .icon-message {
          margin: 5px;
          display: flex;
          flex-direction: column;
          align-content: center;
          max-width: 5vw;
        }
      `}
      </style>
    </div>
  );
}

export default Message;
