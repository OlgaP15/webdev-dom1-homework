import { fetchComments } from './modules/api.js'
import { renderComments } from './modules/renderComments.js'
import { updateComments } from './modules/comments.js'
import { formatApiDate } from './modules/comments.js'

const mapApiComments = (apiComments) =>
    apiComments.map((comment) => ({
        author: comment.author.name,
        date: formatApiDate(comment.date),
        text: comment.text,
        likes: comment.likes,
        isLiked: comment.isLiked,
        isLikeLoading: false,
    }))

const initApp = () => {
    const loader = document.getElementById('comments-loader')
    if (loader) loader.style.display = 'block'

    fetchComments()
        .then((apiComments) => {
            updateComments(mapApiComments(apiComments))
            renderComments()
        })
        .catch((error) => {
            console.error('Ошибка загрузки:', error)
            alert(error.message || 'Не удалось загрузить комментарии')
        })
        .finally(() => {
            if (loader) loader.style.display = 'none'
        })
}

initApp()
