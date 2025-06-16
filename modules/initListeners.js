import { postCommentWithRetry, fetchComments } from './api.js'
import { comments } from './comments.js'
import { renderComments } from './renderComments.js'
import {
    getNameEl,
    getTextEl,
    getButtonEl,
    getCommentsList,
    getReplyPrefix,
    getCommentsLoader,
    getAddForm,
    getAddingLoader,
    delay,
} from '../index.js'

let eventListenersInitialized = false

const handleCommentsClick = (event) => {
    if (event.target.classList.contains('like-button')) {
        const index = event.target.dataset.index
        const comment = comments[index]

        if (comment.isLikeLoading) return

        comment.isLikeLoading = true
        renderComments()
        у
        delay(2000).then(() => {
            comment.likes = comment.isLiked
                ? comment.likes - 1
                : comment.likes + 1
            comment.isLiked = !comment.isLiked
            comment.isLikeLoading = false
            renderComments()
        })
        return
    }

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

const addNewComment = () => {
    const nameEl = getNameEl()
    const textEl = getTextEl()

    if (!nameEl || !textEl) return

    const name = nameEl.value.trim()
    const text = textEl.value.trim()
    const addForm = getAddForm()
    const addingLoader = getAddingLoader()
    const replyPrefix = getReplyPrefix()

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
            console.error('Ошибка:', error)
            alert(error.message || 'Произошла ошибка при отправке')
        })
        .finally(() => {
            addForm?.classList.remove('disabled')
            if (addingLoader) addingLoader.style.display = 'none'
        })
}

const initEventListeners = () => {
    if (eventListenersInitialized) return

    const commentsList = getCommentsList()
    const buttonEl = getButtonEl()

    if (commentsList) {
        commentsList.addEventListener('click', handleCommentsClick)
    }

    if (buttonEl) {
        buttonEl.addEventListener('click', addNewComment)
    }

    eventListenersInitialized = true
}

export const initListeners = () => {
    initEventListeners()
}

export const init = () => {
    const commentsLoader = getCommentsLoader()
    const commentsList = getCommentsList()

    if (!commentsList) return

    commentsLoader.style.display = 'block'
    commentsList.innerHTML = ''

    fetchComments()
        .catch((error) => {
            console.error('Ошибка загрузки:', error)
            alert(error.message || 'Не удалось загрузить комментарии')
        })
        .finally(() => {
            commentsLoader.style.display = 'none'
            initEventListeners()
        })
}
