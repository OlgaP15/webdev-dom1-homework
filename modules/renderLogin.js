import { login, setToken, setName } from './api.js'
import { renderComments } from './renderComments.js'
import { fetchComments } from './api.js'

export const renderLogin = () => {
    const loginSection = document.getElementById('login-section')
    if (!loginSection) return

    loginSection.innerHTML = `
        <section class="add-form">
            <h1>Форма входа</h1>
            <form>
                <input type="text" 
                    class="add-form-name" 
                    placeholder="Логин" 
                    id="login-input"
                    required>
                <input type="password" 
                    class="add-form-name" 
                    placeholder="Пароль" 
                    id="password-input"
                    required>
            </form>
            <fieldset class="add-form-registry">
                <button class="add-form-button-main" type="button" id="login-button">Войти</button>
                <span class="add-form-button-link" id="register-link">
                    Зарегистрироваться
                </span>
            </fieldset>
        </section>
    `

    document.getElementById('register-link')?.addEventListener('click', () => {
        import('./renderRegistration.js').then((module) => {
            module.renderRegistration()
        })
    })

    const loginButton = document.getElementById('login-button')
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            const loginInput = document.getElementById('login-input')
            const passwordInput = document.getElementById('password-input')

            const loginValue = loginInput?.value.trim()
            const passwordValue = passwordInput?.value.trim()

            if (!loginValue || !passwordValue) {
                alert('Пожалуйста, заполните все поля')
                return
            }

            loginButton.disabled = true
            loginButton.textContent = 'Вход...'

            login(loginValue, passwordValue)
                .then((responseData) => {
                    setToken(responseData.user.token)
                    setName(responseData.user.name)
                    return fetchComments()
                })
                .then(() => {
                    const container = document.querySelector('.container')
                    if (container) {
                        container.innerHTML = `
                            <div class="comments" id="comments"></div>
                            <div id="login-section"></div>
                            <div id="comments-loader" class="comments-loader" style="display:none;"></div>
                        `
                        renderComments()
                    }
                })
                .catch((error) => {
                    alert(error.message || 'Ошибка при входе')
                    if (passwordInput) passwordInput.value = ''
                })
                .finally(() => {
                    loginButton.disabled = false
                    loginButton.textContent = 'Войти'
                })
        })
    }
}
