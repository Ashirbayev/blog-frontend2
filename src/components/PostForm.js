import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './PostForm.css';  // Не забудьте добавить стили для центрации
const apiUrl = 'https://blog-backend-production-2333.up.railway.app'; //process.env.REACT_APP_API_URL;

const PostForm = () => {
    const { id } = useParams(); // Получаем id из URL
    const [post, setPost] = useState({ message: '', media: '' });
    const [isEdit, setIsEdit] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            setIsEdit(true); // Мы редактируем существующий пост
            const token = localStorage.getItem('token'); // Получаем токен из localStorage

            // Запрашиваем данные поста по ID с токеном в заголовках
            axios
                .get(`${apiUrl}/api/posts/posts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }, // Добавляем токен
                })
                .then((response) => {
                    setPost(response.data); // Заполняем состояние данными поста
                })
                .catch((error) => {
                    console.error('Error fetching post for editing:', error);
                });
        }
    }, [id]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const authorId = localStorage.getItem('id'); // Получаем ID автора из localStorage

        // Добавляем authorId в данные поста для нового поста
        const postData = isEdit
            ? post
            : { ...post, authorId }; // Добавляем authorId только если добавляем новый пост

        if (isEdit) {
            // Если редактируем пост
            axios
                .put(`${apiUrl}/api/posts/posts/${id}`, postData, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => {
                    alert('Пост отредактирован');
                    navigate('/posts'); // Переход к списку постов
                })
                .catch((error) => {
                    console.error('Error updating post:', error);
                });
        } else {
            // Если добавляем новый пост

            axios
                .post(`${apiUrl}/api/posts/posts`, postData, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => {
                    alert('Пост добавлен');
                    navigate('/posts'); // Переход к списку постов
                })
                .catch((error) => {
                    console.error('Error adding post:', error);
                });
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost((prev) => ({ ...prev, [name]: value }));
    };

    const handleBack = () => {
        navigate('/posts'); // Переход обратно к списку
    };

    return (
        <div className="post-form-container">
            <h2>{isEdit ? 'Редактировать пост' : 'Добавить пост'}</h2>
            <form onSubmit={handleSubmit} className="post-form">
                <div className="input-group">
                    <label htmlFor="message">Сообщение</label>
                    <textarea
                        id="message"
                        name="message"
                        value={post.message}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="media">Медиа описание</label>
                    <textarea
                        id="media"
                        name="media"
                        value={post.media}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>
                <div className="button-group">
                    <button type="submit" className="submit-btn">
                        {isEdit ? 'Сохранить изменения' : 'Добавить пост'}
                    </button>
                    <button type="button" className="back-btn" onClick={handleBack}>
                        Назад к списку
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;
