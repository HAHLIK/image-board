import './index.css';
import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useUserStore } from '../../store/user';

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const { login, registration } = useUserStore();

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 3) {
      const msg = 'Имя должно содержать минимум 3 символа';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    if (password.length < 8) {
      const msg = 'Пароль должен содержать минимум 8 символов';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      const msg = 'Пароли не совпадают';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await login(name, password);
        showToast(`Добро пожаловать, ${name}!`, 'success');
      } else {
        console.log("registration succefuly")
        await registration(name, password);
        showToast(`Аккаунт создан! Добро пожаловать, ${name}`, 'success');
      }

      setName('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
        const errorMessage = err?.response?.data?.message || 'Произошла ошибка';
        console.log("error: ",err)
        setError(errorMessage);
        showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(prev => (prev === 'login' ? 'register' : 'login'));
    setError('');
    setName('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className='wrapper'>
      <div className={`toast ${toast.type} ${toast.isVisible ? 'show' : ''}`}>
        <div className="toast-content">
          <span className="toast-icon">
            {toast.type === 'success' ? '✓' : '⚠'}
          </span>
          <span className="toast-message">{toast.message}</span>
        </div>
      </div>

      <div className='authForm'>
        <p className="auth-title">{mode === 'login' ? 'Войти' : 'Регистрация'}</p>

        <form onSubmit={handleSubmit}>
          <section>
            <input
              placeholder='Имя'
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={loading}
            />
          </section>

          <section>
            <input
              placeholder='Пароль'
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </section>

          {mode === 'register' && (
            <section>
              <input
                placeholder='Повторите пароль'
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </section>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className='b1' disabled={loading}>
            {loading ? 'Загрузка...' : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <button onClick={switchMode} className='b2' disabled={loading}>
          {mode === 'login' ? 'Создать аккаунт' : 'У меня есть аккаунт'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
