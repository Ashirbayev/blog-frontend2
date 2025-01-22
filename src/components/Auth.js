import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import './Auth.css'; // Импортируем стили
const apiUrl = 'https://blog-backend-production-2333.up.railway.app';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true); // Состояние для переключения между логином и регистрацией
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Хук для навигации

    // Обработчик смены формы
    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError(''); // Сбрасываем ошибку при переключении
    };

    // Обработчик изменения значений в формах
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isLogin ? `${apiUrl}/api/users/login` : `${apiUrl}/api/users/register`;
        const data = isLogin
            ? { email: formData.email, password: formData.password }
            : { username: formData.username, email: formData.email, password: formData.password };

        axios
            .post(url, data)
            .then((response) => {
                if (isLogin) {
                    localStorage.setItem('token', response.data.token); // Сохраняем токен
                    localStorage.setItem('id', response.data.id); // Сохраняем токен
                    localStorage.setItem('email', response.data.email); // Сохраняем токен
                    navigate('/posts'); // Переходим на страницу списка постов
                } else {
                    setIsLogin(true); // Переключаем на форму входа после успешной регистрации
                    setFormData({ username: '', email: '', password: '' });
                }
            })
            .catch(() => {
                setError('Ошибка при авторизации или регистрации. Попробуйте снова.');
            });
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <div className="tabs">
                    <button onClick={toggleForm} className={isLogin ? 'active' : ''}>
                        Вход
                    </button>
                    <button onClick={toggleForm} className={!isLogin ? 'active' : ''}>
                        Регистрация
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Ваш email"
                        />
                    </div>
                    <div className="input-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Ваш пароль"
                        />
                    </div>

                    {error && <div className="error">{error}</div>}

                    <button type="submit" className="btn">
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;
