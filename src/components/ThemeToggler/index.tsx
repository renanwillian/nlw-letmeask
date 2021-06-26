import moonImg from '../../assets/images/moon.svg';
import sunImg from '../../assets/images/sun.svg';

import { useTheme } from '../../hooks';

import './styles.scss';

export function ThemeToggler() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="themeToggler">
      <input 
        type="checkbox" 
        id="chk" 
        onChange={toggleTheme}
        defaultChecked={theme === 'dark'}
      />
      <label htmlFor="chk">
        <img src={moonImg} className="moon" alt="Tema Escuro" />
        <img src={sunImg} className="sun" alt="Tema Claro" />
        <div className="ball"></div>
      </label>
    </div>
  )
}