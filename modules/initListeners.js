import { postCommentWithRetry, token, fetchComments } from './api.js'
import { comments } from './comments.js'
import { renderComments } from './renderComments.js'

const getTextEl = () => document.querySelector('.add-form-text')
const getButtonEl = () => document.querySelector('.add-form-button')
const getCommentsList = () => document.querySelector('.comments')
const getReplyPrefix = () => document.getElementById('reply-prefix')
const getAddForm = () => document.querySelector('.add-form')
const getAddingLoader = () => document.getElementById('adding-loader')

export const initCommentHandlers = () => {
    const buttonEl = getButtonEl()
    if (buttonEl) {
        buttonEl.addEventListener('click', (event) => {
            addNewComment()
        })
    }
}

export const initQuoteHandlers = () => {
    const commentsList = getCommentsList()
    if (commentsList) {
        commentsList.addEventListener('click', handleQuoteClick)
    }
}

export const initLikeHandlers = () => {
    const commentsList = getCommentsList()
    if (commentsList) {
        commentsList.addEventListener('click', (event) => {
            if (event.target.classList.contains('like-button')) {
                event.preventDefault()
                handleLikeClick(event)
            }
        })
    }
}

const addNewComment = () => {
    const textEl = getTextEl()
    const replyPrefix = getReplyPrefix()
    const addForm = getAddForm()
    const addingLoader = getAddingLoader()

    const text = textEl?.value.trim()

    if (!text) {
        alert('Пожалуйста, введите комментарий')
        return
    }

    addForm?.classList.add('disabled')
    if (addingLoader) addingLoader.style.display = 'block'

    postCommentWithRetry({ name, text })
        .then(() => {
            return fetchComments()
        })
        .then(() => {
            if (textEl) textEl.value = ''
            if (replyPrefix) replyPrefix.style.display = 'none'
            renderComments()
        })
        .catch((error) => {
            alert(error.message || 'Ошибка при отправке')
        })
        .finally(() => {
            addForm?.classList.remove('disabled')
            if (addingLoader) addingLoader.style.display = 'none'
        })
}

const handleQuoteClick = (event) => {
    if (event.target.closest('.comment')) {
        const commentEl = event.target.closest('.comment')
        const index = commentEl.dataset.index
        const comment = comments[index]
        const textEl = getTextEl()

        if (textEl) {
            const replyText = `> ${comment.text.replace(/<br>/g, '\n> ')}\n\n@${comment.author}, `
            textEl.value = replyText
            textEl.focus()

            const replyPrefix = getReplyPrefix()
            if (replyPrefix) {
                replyPrefix.textContent = `Ответ на комментарий ${comment.author}`
                replyPrefix.style.display = 'block'
            }
        }
    }
}

const handleLikeClick = (event) => {
    if (event.target.classList.contains('like-button')) {
        if (!token) {
            alert('Пожалуйста, авторизуйтесь, чтобы поставить лайк')
            return
        }

        const index = event.target.dataset.index
        const comment = comments[index]

        if (comment.isLikeLoading) return

        comment.isLikeLoading = true
        renderComments()

        setTimeout(() => {
            comment.likes = comment.isLiked
                ? comment.likes - 1
                : comment.likes + 1
            comment.isLiked = !comment.isLiked
            comment.isLikeLoading = false
            renderComments()
        }, 2000)
    }
}
