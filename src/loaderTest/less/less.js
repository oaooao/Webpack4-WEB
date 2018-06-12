import './less.less'

class LessTest {
    init () {
        const obj = document.createElement('h1')
        obj.id = 'less'
        obj.innerHTML = 'Less Test'
        document.body.appendChild(obj)
    }
}

export default new LessTest()
