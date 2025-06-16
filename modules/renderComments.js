import { comments } from './comments.js'
import { token, name, logout } from './api.js'
import { getCommentsList, getLoginSection } from '../index.js'
import { renderLogin } from './renderLogin.js'
import { postCommentWithRetry, fetchComments } from './api.js'

export const renderComments = () => {
    const commentsList = getCommentsList()
    const loginSection = getLoginSection()

    if (!commentsList || !loginSection) return

    commentsList.innerHTML = `
        <div class="comments-header">
            <h2>Комментарии</h2>
            ${token ? `<button class="logout-button">Выйти (${name})</button>` : ''}
        </div>
        ${comments
            .map(
                (comment, index) => `
            <li class="comment" data-index="${index}">
                <div class="comment-header">
                    <div>${comment.author}</div>
                    <div>${comment.date}</div>
                </div>
                <div class="comment-body">
                    <div class="comment-text">${comment.text}</div>
                </div>
                <div class="comment-footer">
                    <div class="likes">
                        <span class="likes-counter">${comment.likes}</span>
                        <button class="like-button 
                            ${comment.isLiked ? '-active-like' : ''} 
                            ${comment.isLikeLoading ? '-loading-like' : ''}" 
                            data-index="${index}" 
                            ${comment.isLikeLoading ? 'disabled' : ''}>
                        </button>
                    </div>
                </div>
            </li>
        `,
            )
            .join('')}
    `

    if (token) {
        const logoutButton = document.querySelector('.logout-button')
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                if (confirm('Вы действительно хотите выйти?')) {
                    logout()
                    renderComments()
                }
            })
        }
    }

    if (token) {
        loginSection.innerHTML = `
            <div class="add-form">
                <div id="reply-prefix" class="reply-prefix" style="display:none;"></div>
                <input type="text" 
                       class="add-form-name" 
                       value="${name}" 
                       readonly
                       placeholder="Ваше имя">
                <textarea class="add-form-text" 
                          placeholder="Ваш комментарий" 
                          rows="4"></textarea>
                <div class="add-form-row">
                    <button class="add-form-button" id="comment-submit-button">Написать</button>
                </div>
            </div>
            <div id="adding-loader" class="adding-loader" style="display:none;">
                Комментарий добавляется...
            </div>
        `
        const submitButton = document.getElementById('comment-submit-button')
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                const textEl = document.querySelector('.add-form-text')
                const replyPrefix = document.getElementById('reply-prefix')
                const addForm = document.querySelector('.add-form')
                const addingLoader = document.getElementById('adding-loader')

                const text = textEl?.value.trim()

                if (!text) {
                    alert('Пожалуйста, введите комментарий')
                    return
                }

                addForm?.classList.add('disabled')
                if (addingLoader) addingLoader.style.display = 'block'

                postCommentWithRetry({ name, text })
                    .then(() => fetchComments())
                    .then(() => {
                        if (textEl) textEl.value = ''
                        if (replyPrefix) replyPrefix.style.display = 'none'
                    })
                    .catch((error) => {
                        alert(error.message || 'Ошибка при отправке')
                    })
                    .finally(() => {
                        addForm?.classList.remove('disabled')
                        if (addingLoader) addingLoader.style.display = 'none'
                    })
            })
        }
    } else {
        const loginSection = getLoginSection()
        if (!loginSection) return
        loginSection.innerHTML = `
            <p>Чтобы отправить комментарий, 
            <span class="link-login">войдите</span>
            </p>
        `
        const loginLink = loginSection.querySelector('.link-login')
        if (loginLink) {
            loginLink.addEventListener('click', () => {
                const container = document.querySelector('.container')
                if (container) {
                    container.innerHTML = `
                        <div id="login-section"></div>
                    `
                    import('./renderLogin.js').then((module) => {
                        module.renderLogin()
                    })
                }
            })
        }
    }
}
