import { comments } from './comments.js'
import { token, name, logout } from './api.js'
import { renderLogin } from './renderLogin.js'
import {
    initCommentHandlers,
    initQuoteHandlers,
    initLikeHandlers,
} from './initListeners.js'

export const renderComments = () => {
    const commentsList = document.querySelector('.comments')
    const loginSection = document.getElementById('login-section')

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
    } else {
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

    initCommentHandlers()
    initQuoteHandlers()
    initLikeHandlers()
}
