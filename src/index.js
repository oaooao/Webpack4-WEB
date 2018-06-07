// index.js

// 引入css文件
import './main.css'

console.log('I am index.js')

// 测试css
const obj1 = document.createElement('h1')

obj1.id = 'css'
obj1.innerHTML = '测试css'

document.body.appendChild(obj1)
