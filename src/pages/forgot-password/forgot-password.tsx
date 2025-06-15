import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { forgotPassword } from '../../services/slices/userSlice';
import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forgotPasswordRequest, forgotPasswordSuccess } = useSelector(
    (state) => state.user
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  if (forgotPasswordSuccess) {
    localStorage.setItem('resetPassword', 'true');
    navigate('/reset-password', { replace: true });
  }

  return (
    <ForgotPasswordUI
      errorText=''
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
