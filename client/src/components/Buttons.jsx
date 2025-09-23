import React from "react";

export default function Button(text){
    return(
        <button onClick={text.onClick} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200">
            {text.text}
        </button>
    )
}