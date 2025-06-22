import { sanitizeHTML } from './sanitizeHtml.js'

export let comments = []

export function updateComments(newComments) {
    comments.length = 0
    comments.push(...newComments)
}

export function formatApiDate(apiDate) {
    const date = new Date(apiDate)
    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getFullYear()).slice(2)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export function formatCommentText(text) {
    return sanitizeHTML(text).replace(/\n/g, '<br>')
}
