import { ButtonHTMLAttributes} from 'react';
import cx from 'classnames';

import './styles.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
  isDanger?: boolean;
  isSecondary?: boolean;
};

export function Button({isOutlined, isDanger, isSecondary, ...props}: ButtonProps) {
  return (
    <button 
      className={cx(
        'button', 
        { outlined: isOutlined },
        { danger: isDanger },
        { secondary: isSecondary },
      )}
      {...props} />
  )
}