import { registration, setToken, setName } from './api.js'
import { renderComments } from './renderComments.js'

export const renderRegistration = () => {
    const loginSection = document.getElementById('login-section')
    if (!loginSection) return

    loginSection.innerHTML = `
    <section class="add-form">
      <h1>Регистрация</h1>
      <input type="text" 
             class="add-form-name" 
             placeholder="Имя" 
             id="name-input"
             required>
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
      <fieldset class="add-form-registry">
        <button class="add-form-button-main" type="button" id="register-button">Зарегистрироваться</button>
        <span class="add-form-button-link" id="login-link">
          Войти
        </span>
      </fieldset>
    </section>
  `

    document.getElementById('login-link')?.addEventListener('click', () => {
        import('./renderLogin.js').then((module) => {
            module.renderLogin()
        })
    })

    const registerButton = document.getElementById('register-button')
    if (registerButton) {
        registerButton.addEventListener('click', () => {
            const nameInput = document.getElementById('name-input')
            const loginInput = document.getElementById('login-input')
            const passwordInput = document.getElementById('password-input')

            const nameValue = nameInput?.value.trim()
            const loginValue = loginInput?.value.trim()
            const passwordValue = passwordInput?.value.trim()

            if (!nameValue || !loginValue || !passwordValue) {
                alert('Пожалуйста, заполните все поля')
                return
            }

            if (
                nameValue.length < 3 ||
                loginValue.length < 3 ||
                passwordValue.length < 3
            ) {
                alert('Все поля должны содержать минимум 3 символа')
                return
            }

            registerButton.disabled = true
            registerButton.textContent = 'Регистрация...'

            registration(nameValue, loginValue, passwordValue)
                .then((responseData) => {
                    setToken(responseData.user.token)
                    setName(responseData.user.name)
                    renderComments() // Изменили init() на renderComments()
                })
                .catch((error) => {
                    console.error('Registration error:', error)
                    alert(error.message || 'Произошла ошибка при регистрации')
                    if (passwordInput) passwordInput.value = ''
                })
                .finally(() => {
                    registerButton.disabled = false
                    registerButton.textContent = 'Зарегистрироваться'
                })
        })
    }
}
