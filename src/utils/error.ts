class AOError extends Error {
    constructor(message: string, element?: HTMLElement) {
        super(message);
        this.name = `AutoOptions Error`;

        if (element) console.log(element);
    }
}

export { AOError };