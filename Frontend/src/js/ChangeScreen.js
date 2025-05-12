class ChangeScreen {
    constructor(ref, setLocation) {
        this.ref = ref;
        this.setLocation = setLocation;
    }

    set(location)  {
        this.ref.current.style.transitionDuration = "0.3s";

        this.hide()
        setTimeout(() => {
            this.setLocation(location)
            this.show()
        }, 300)
    }

    hide() {
        this.ref.current.style.scale = '0.8'
        this.ref.current.style.opacity = '0'
    }

    show() {
        this.ref.current.style.scale = '1'
        this.ref.current.style.opacity = '1'
    }
}

export default ChangeScreen