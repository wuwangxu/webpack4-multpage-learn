import './index.css';

if (process.env.NODE_ENV === "development") {
    require("./index.html");
}

(async function aaa(params) {
    await console.log(23333)
})()
$(() => {
    console.log("hhh")
})
console.log("i lova", process.env.NODE_ENV)