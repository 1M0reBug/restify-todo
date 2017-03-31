require('dotenv').config();
const restify = require('restify');

const Store = require('./Store');

const server = restify.createServer();

server.use(restify.CORS());
server.use(restify.bodyParser());

const reducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                {
                    id: action.id,
                    text: action.text,
                    completed: false,
                },
            ];
        case 'REMOVE_TODO':
            return state.filter(t => t.id !== action.id);
        case 'REMOVE_COMPLETED':
            return state.filter(t => !t.completed);
        case 'TOGGLE_TODO':
            return state.map(todo => {
                return todo.id === action.id
                        ? Object.assign({}, todo, { completed: !todo.completed })
                        : todo;
            })
        default:
            return state;
    }
}

const store = new Store(reducer);

let id = 0;

server.get('/', (req, res, next) => {
    res.json(store.getState());
    return next();
});

server.get('/:id', (req, res, next) => {
    res.json(store.getState().find(t => t.id === +req.params.id));
    return next();
})

server.post('/', (req, res, next) => {
    if (!req.body.text)
        return next(new restify.InvalidContentError('You should provide a text key'));
    store.dispatch({ type: 'ADD_TODO', id: (id++), text: req.body.text });
    res.json(store.getState());
    return next();
});

server.put('/:id', (req, res, next) => {
    store.dispatch({ type: 'TOGGLE_TODO', id: +req.params.id });
    res.json(store.getState());
    return next();
});

server.del('/completed', (req, res, next) => {
    store.dispatch({ type: 'REMOVE_COMPLETED' })
    res.json(store.getState());
    return next();
});

server.del('/:id', (req, res, next) => {
    if (!req.params.id) return next(restify.InvalidArgumentError('You should define a todo to remove'));
    store.dispatch({ type: 'REMOVE_TODO', id: +req.params.id });
    res.json(store.getState());
    return next();
});

server.listen(process.env.HTTP_PORT);
