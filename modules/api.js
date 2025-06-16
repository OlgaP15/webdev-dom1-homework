import { comments, formatApiDate, formatCommentText } from './comments.js'
import { renderComments } from './renderComments.js'
import { delay } from '../index.js'
import { sanitizeHTML } from './sanitizeHtml.js'

const API_URL = 'https://wedev-api.sky.pro/api/v2/olga-petrova/comments'
const authAPI_URL = 'https://wedev-api.sky.pro/api/user'

export let token = localStorage.getItem('token') || ''

export const setToken = (newToken) => {
    token = newToken
    localStorage.setItem('token', newToken)
}

export let name = localStorage.getItem('name') || ''

export const setName = (newName) => {
    name = newName
    localStorage.setItem('name', newName)
}

export const logout = () => {
    setToken('')
    setName('')
    localStorage.removeItem('token')
    localStorage.removeItem('name')
}

export function fetchComments() {
    return fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (response.status === 500) {
                throw new Error('Сервер сломался, попробуй позже')
            }
            if (!response.ok) {
                throw new Error('Ошибка при загрузке комментариев')
            }
            return response.json()
        })
        .then((data) => {
            comments.splice(
                0,
                comments.length,
                ...data.comments.map((comment) => ({
                    author: comment.author.name,
                    date: formatApiDate(comment.date),
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: comment.isLiked,
                    isLikeLoading: false,
                })),
            )
            renderComments()
        })
}

export function postCommentWithRetry({
    name,
    text,
    retries = 3,
    delayMs = 1000,
}) {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            text: formatCommentText(text),
            name: sanitizeHTML(name),
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Имя и текст должны содержать минимум 3 символа')
        }
        if (response.status === 500) {
            if (retries > 0) {
                return delay(delayMs).then(() =>
                    postCommentWithRetry({
                        name,
                        text,
                        retries: retries - 1,
                        delayMs,
                    }),
                )
            } else {
                throw new Error('Сервер сломался, попробуй позже')
            }
        }
        if (!response.ok) {
            return response.json().then((errorData) => {
                throw new Error(
                    errorData.error || 'Ошибка при добавлении комментария',
                )
            })
        }
        return response.json()
    })
}

export const login = (login, password) => {
    return fetch(authAPI_URL + '/login', {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
        }),
    }).then((response) => {
        if (!response.ok) {
            return response.json().then((errorData) => {
                throw new Error(errorData.error || 'Ошибка авторизации')
            })
        }
        return response.json()
    })
}

export const registration = (name, login, password) => {
    return fetch(authAPI_URL, {
        method: 'POST',
        body: JSON.stringify({ name, login, password }),
    }).then((response) => {
        if (!response.ok) {
            return response.json().then((errorData) => {
                throw new Error(errorData.error || 'Ошибка регистрации')
            })
        }
        return response.json()
    })
}
