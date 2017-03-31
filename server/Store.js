module.exports = class Store {
    constructor(reducer) {
        this.reducer = reducer;
        this.state = [];
        this.listeners = [];
    }

    getState() { return this.state; }

    dispatch(action) {
        console.log(new Date(),' - ', action.type, this.state);
        this.state = this.reducer(this.state, action);
        console.log(new Date(),' - ', action.type, this.state);
        this.listeners.forEach(listener => listener());
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
}
