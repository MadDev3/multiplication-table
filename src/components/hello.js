import React from "react";

const HelloWorld = () => {
    function sayHello(){
        alert('hello!');
    }

    return(
        <button onClick={sayHello}>Click me!</button>
    );
};

export default HelloWorld;