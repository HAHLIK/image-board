import './AuthForm.css'

import React, { useState} from 'react';
import type { FormEvent } from 'react';

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        alert(`Вход: ${name}, ${password}`);
      } else {
        alert(`Регистрация: ${name}, ${password}`);
      }
    } catch (err) {
      setError('Ошибка при отправке формы!');
    }
  };

  return (
  <div className='wrapper'>
    <div className='authForm'>
    <p>{mode === 'login' ? 'Войти' : 'Регистрация'}</p>
    <form onSubmit={handleSubmit}>
    <section>
      <input
        placeholder='Имя'
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
    </section>
    <section>
      <input
        placeholder='Пароль'
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        />
    </section>
    {error && <div style={{ color: 'red' }}>{error}</div>}
    <button type="submit" className='b1'>
        {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
    </button>
    </form>
    <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className='b2'>
        {mode === 'login' ? 'Создать аккаунт' : 'У меня есть аккаунт'}
    </button>
    </div>
  </div>
  );
};

export default AuthForm;