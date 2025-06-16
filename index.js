import { init } from './modules/initListeners.js'
import { renderLogin } from './modules/renderLogin.js'
import { token, fetchComments, setToken, setName } from './modules/api.js'

export const getNameEl = () => document.querySelector('.add-form-name')
export const getTextEl = () => document.querySelector('.add-form-text')
export const getButtonEl = () => document.querySelector('.add-form-button')
export const getCommentsList = () => document.querySelector('.comments')
export const getReplyPrefix = () => document.getElementById('reply-prefix')
export const getCommentsLoader = () =>
    document.getElementById('comments-loader')
export const getAddForm = () => document.querySelector('.add-form')
export const getAddingLoader = () => document.getElementById('adding-loader')
export const getLoginSection = () => document.getElementById('login-section')

export function delay(interval = 300) {
    return new Promise((resolve) => setTimeout(resolve, interval))
}

export function fetchAndRenderComments() {
    const loader = getCommentsLoader()
    if (loader) loader.style.display = 'block'
    fetchComments().finally(() => {
        if (loader) loader.style.display = 'none'
    })
}

export { token, fetchComments, setToken, setName }

init()
