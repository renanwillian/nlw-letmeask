import logoImg from '../../assets/images/logo.svg';
import logoDarkImg from '../../assets/images/logo-dark.svg';

import { useTheme } from '../../hooks/useTheme';

export function Logo() {
  const { theme } = useTheme();

  return (
    <img src={theme === 'dark' ? logoDarkImg : logoImg} alt="Letmeask" />
  )
}