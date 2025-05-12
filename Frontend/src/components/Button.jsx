function Button(props) {
    return <button
        className="button clickable bobatron"
        onClick={props.onClick}
    >{props.children}</button>;
}

export default Button;