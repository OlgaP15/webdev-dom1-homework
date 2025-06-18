import { fetchComments } from './modules/api.js'
import { renderComments } from './modules/renderComments.js'

const initApp = () => {
    const loader = document.getElementById('comments-loader')
    if (loader) loader.style.display = 'block'

    fetchComments()
        .then(() => renderComments())
        .catch((error) => {
            console.error('Ошибка загрузки:', error)
            alert(error.message || 'Не удалось загрузить комментарии')
        })
        .finally(() => {
            if (loader) loader.style.display = 'none'
        })
}

initApp()
