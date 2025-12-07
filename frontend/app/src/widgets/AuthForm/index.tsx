import './index.css';
import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useUserStore } from '../../store/user';

const AuthForm: React.FC = () => {
  const [shown, setShown] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, registration } = useUserStore();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    let msg: string = ""
    if (name.trim().length < 3) {
      msg = 'Имя должно содержать минимум 3 символа';
    }
    else if (password.length < 8) {
      msg = 'Пароль должен содержать минимум 8 символов';
    }
    else if (mode === 'register' && password !== confirmPassword) {
      msg = 'Пароли не совпадают';
    }
    if (msg != "") {
      setError(msg);
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await login(name, password);
      } else {
        await registration(name, password);
      }

      setName('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
        const errorMessage = err?.response?.data?.message || 'Произошла ошибка';
        setError(errorMessage);
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
              type={shown ? "text" : "password"}
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
                type={shown ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </section>
          )}
          <button onClick={() => setShown(!shown)} className='b2' type='button'> 
            {shown ? "Скрыть" : "Показать"} пароль
          </button>

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
