import { FormEvent, useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import likeImg from '../assets/images/like.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/room.scss'
import { useRoom } from '../hooks/useRoom';
import { useEffect } from 'react';

type RoomParams = {
  id: string;
}

export function Room() {
  const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const roomId = params.id;

  const { title, closedAt, questions } = useRoom(roomId);

  useEffect(() => {
    if (closedAt) {
      history.push("/");
    }
  }, [closedAt, history]);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (likeId) {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id
      });
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/" className="logo">
            <img src={logoImg} alt="Letmeask" />
          </Link>
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>{title}</h1>
          { questions.length > 0 && 
            <span>{questions.length} pergunta{ questions.length !== 1 && 's' } </span>
          }
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea 
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            ) }
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                { !question.isAnswered && (
                  <button
                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                    type="button"
                    aria-label="Marcar como gostei"
                    onClick={() => handleLikeQuestion(question.id, question.likeId)}
                  >
                    { question.likeCount > 0 && <span>{question.likeCount}</span> }
                    <img src={likeImg} alt="Curtir" />
                  </button>
                )}
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  )
}