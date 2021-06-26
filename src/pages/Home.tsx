import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';

import illustrationImg from '../assets/images/illustration.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { ThemeToggler } from '../components/ThemeToggler';

import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

import '../styles/auth.scss';
import 'react-toastify/dist/ReactToastify.css';

export function Home() {
  const history = useHistory();
  const { theme } = useTheme();
  const { user, signInWithGoogle } = useAuth();
  const [ roomCode, setRoomCode ] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push('rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      toast.error('Essa sala não existe.');
      return;
    }

    if (roomRef.val().closedAt) {
      toast.error('Essa sala já foi encerrada.');
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth" className={theme}>
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <ThemeToggler />
          <Logo />
          <Button onClick={handleCreateRoom} isDanger>
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </Button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text" 
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na salas
            </Button>
          </form>
        </div>
      </main>
      <ToastContainer hideProgressBar />
    </div>
  )
}