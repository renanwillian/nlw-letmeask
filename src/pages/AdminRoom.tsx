import { useHistory, useParams, Link } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss'
import { database } from '../services/firebase';

type AdminRoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<AdminRoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);

  async function handleCloseRoom() {
    if (window.confirm("Tem certeza que você deseja encerrar esta sala?")) {
      await database.ref(`rooms/${roomId}`).update({
        closedAt: new Date(),
      });

      history.push('/');
    }
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

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/" className="logo">
            <img src={logoImg} alt="Letmeask" />
          </Link>
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleCloseRoom}>Encerrar Sala</Button>
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
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  )
}