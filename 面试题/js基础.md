### Object.create 和 {} 区别

1. Object.create
    创建一个 100% 的纯对象，这个对象不会继承 Object 的任何属性和方法，比如 toString()

    ```js
        const obj = Object.create(null)
        console.log(obj)//{}
        console.log(obj.constructor)//undefined
        console.log(obj.toString)//undefined
        console.log(obj.hasOwnProperty)//undefined
    ```

### 深拷贝/浅拷贝 
1. Object.assign() 不属于深拷贝
2. JSON 的序列化和反序列化，会实现一个全新的深拷贝对象
