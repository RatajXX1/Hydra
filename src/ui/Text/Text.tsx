import React from "react"

function Typography(
    props: { 
        Variant?: string,
        children: React.ReactNode | React.ReactNode[] | string
    }
)
{
    if (props.Variant == undefined || props.Variant == "a") {
        return (
            <a>
                {
                    props.children
                }
            </a>
        )        
    }
    else if (props.Variant == "span") {
        return (
            <span>
                {
                    props.children
                }
            </span>
        )        
    }
    else if (props.Variant == "b") {
        return (
            <b>
                {
                    props.children
                }
            </b>
        )        
    }
    else if (props.Variant == "p") {
        return (
            <p>
                {
                    props.children
                }
            </p>
        )        
    }
    else if (props.Variant == "p") {
        return (
            <p>
                {
                    props.children
                }
            </p>
        )        
    }
    return (
        <a>
            {
                props.children
            }
        </a>
    )      
}

export {
    Typography
}