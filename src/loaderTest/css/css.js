import './css.css'

class CssTest {
    init () {
        const obj = document.createElement('h1')
        obj.id = 'css'
        obj.innerHTML = 'Css Test'
        document.body.appendChild(obj)
    }
}

export default new CssTest()
