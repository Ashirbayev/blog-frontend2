import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import './PostList.css';
const apiUrl = 'https://blog-backend-production-2333.up.railway.app';

const PostList = () => {
    const navigate = useNavigate(); // Хук для навигации
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const id = localStorage.getItem('id'); // Получаем ID пользователя из localStorage

        if (token) {
            axios
                .get(`${apiUrl}/api/posts/posts`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setPosts(response.data.reverse()); // Сортировка: новые сверху
                })
                .catch((error) => {
                    console.error('Error fetching posts:', error);
                });

            setUser({ email, id }); // Устанавливаем email и ID пользователя
        } else {
            window.location.href = '/'; // Перенаправление на авторизацию
        }
    }, []);

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        axios
            .delete(`${apiUrl}/api/posts/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                alert('Пост удален');
                setPosts(posts.filter((post) => post.id !== id));
            })
            .catch((error) => {
                console.error('Error deleting post:', error);
            });
    };

    const handleEdit = (id) => {
        // Перенаправление на страницу редактирования поста
        navigate(`/edit/${id}`);
    };

    const handleAddPost = () => {
        // Перенаправление на страницу добавления поста
        navigate('/create');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('id');
        window.location.href = '/'; // Перенаправляем на страницу авторизации
    };

    return (
        <div className="postlist-container">
            <div className="header">
                <div className="header-left">
                    <button className="add-post-btn" onClick={handleAddPost}>
                        Добавить пост
                    </button>
                </div>
                <div className="header-right">
                    {user && (
                        <div className="user-info">
                            <span>Привет, {user.email}</span>
                            <button className="logout-btn" onClick={handleLogout}>
                                Выйти
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="posts">
                {posts.map((post) => (
                    <div key={post.id} className="post-item">
                        <div className="post-content">
                            <h3>{post.message}</h3>
                            <p>{post.media}</p>
                            <p className="post-author">Автор: {post.author.email}</p>
                            <p className="post-date">
                                Создано: {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                            {user?.id && parseInt(user.id) === post.author.id && (
                                <div className="post-actions">
                                    <button onClick={() => handleEdit(post.id)} className="edit-btn">
                                        Редактировать
                                    </button>
                                    <button onClick={() => handleDelete(post.id)} className="delete-btn">
                                        Удалить
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostList;
