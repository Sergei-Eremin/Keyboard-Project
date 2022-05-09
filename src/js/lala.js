
export function result(a,b){
    return a + b
}
console.log(result(1,8));

class Human{
    constructor(gender, weight){
        this.gender = gender,
        this.weight = weight
    }
}
console.dir(new Human("Male", 190))