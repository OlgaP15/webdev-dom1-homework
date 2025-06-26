export function sanitizeHTML(str) {
    const tempDiv = document.createElement('div')
    tempDiv.textContent = str
    return tempDiv.innerHTML
}
