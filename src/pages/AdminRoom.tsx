import { useEffect, useState } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';

import Modal from 'react-modal';

import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import closeImg from '../assets/images/close.svg';

import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { ThemeToggler } from '../components/ThemeToggler';
import { Logo } from '../components/Logo';

import { useRoom } from '../hooks/useRoom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

import '../styles/room.scss'

type AdminRoomParams = {
  id: string;
}

Modal.setAppElement('#root');

export function AdminRoom() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const history = useHistory();
  const params = useParams<AdminRoomParams>();
  const roomId = params.id;
  const [closeRoomModal, setCloseRoomModal] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState('');

  const { title, authorId, closedAt, questions } = useRoom(roomId);

  useEffect(() => {
    if (authorId && authorId !== user?.id) {
      history.push("/");
    }
  }, [user, authorId, history]);

  async function handleCloseRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    });
    history.push('/');
  }

  async function handleCheckQuestionAsAnswered(questionId: string, answered: boolean) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: !answered,
    });
  }

  async function handleHighlighQuestion(questionId: string, highlighted: boolean) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: !highlighted,
    });
  }

  async function handleDeleteQuestion() {
    await database.ref(`rooms/${roomId}/questions/${deleteQuestionId}`).remove();
    setDeleteQuestionId('');
  }

  return (
    <div id="page-room" className={theme}>
      <header>
        <div className="content">
          <Link to="/" className="logo">
            <Logo />
          </Link>
          <div>
            <ThemeToggler />
            <RoomCode code={roomId} />
            <Button 
              isOutlined
              onClick={() => setCloseRoomModal(true)} 
              disabled={closedAt !== undefined}
            >
              { closedAt !== undefined ? 'Sala Encerrada' : 'Encerrar Sala'} 
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>{title}</h1>
          { questions.length > 0 && 
            <span>{questions.length} pergunta{ questions.length !== 1 && 's' } </span>
          }
        </div>

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
                <button
                  type="button"
                  onClick={() => handleCheckQuestionAsAnswered(question.id, question.isAnswered)}
                >
                  <img src={checkImg} alt="Marcar pergunta como respondida" />
                </button>
                  <button
                    type="button"
                    onClick={() => handleHighlighQuestion(question.id, question.isHighlighted)}
                  >
                    <img src={answerImg} alt="Remover pergunta" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteQuestionId(question.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
              </Question>
            );
          })}
        </div>
      </main>
      
      <Modal 
        isOpen={closeRoomModal} 
        className={`modal ${theme}`} 
        overlayClassName="overlay"
      >
        <img src={closeImg} alt="Encerrar sala" />
        <h2>Encerrar sala</h2>
        <p>Tem certeza que você deseja encerrar esta sala?</p>
        <div>
          <Button onClick={() => setCloseRoomModal(false)} isSecondary>
            Cancelar
          </Button>
          <Button onClick={handleCloseRoom} isDanger>
            Sim, encerrar
          </Button>
        </div>
      </Modal>
      
      <Modal 
        isOpen={deleteQuestionId !== ''} 
        className={`modal ${theme}`} 
        overlayClassName="overlay"
      >
        <img src={deleteImg} alt="Excluir pergunta" />
        <h2>Excluir pergunta</h2>
        <p>Tem certeza que você deseja excluir esta pergunta?</p>
        <div>
          <Button onClick={() => setDeleteQuestionId('')} isSecondary>
            Cancelar
          </Button>
          <Button onClick={() => handleDeleteQuestion()} isDanger>
            Sim, excluir
          </Button>
        </div>
      </Modal>
    </div>
  )
}