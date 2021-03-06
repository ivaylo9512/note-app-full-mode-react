import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSaga from 'redux-saga';
import LoginWatcher from '../../../app/sagas/login'
import { Provider } from 'react-redux'
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import authenticate from '../../../app/slices/authenticateSlice'
import Login from '../Login';
import { act } from 'react-dom/test-utils';

const saga = createSaga();
const middleware = [...getDefaultMiddleware({ thunk: false }), saga]

const store = configureStore({
    reducer: {
        authenticate
    },
    middleware
})

saga.run(function*(){
    yield LoginWatcher
})

global.fetch = jest.fn();

const createWrapper = () => {
    return mount(
        <Provider store={store}>
            <Router>
                <Login />
            </Router>
        </Provider>
    )
}

describe('Login integration tests', () => {
    beforeAll(() => {
        jest.useFakeTimers('modern');
        jest.setSystemTime(1614636000000);
    });
    
    afterAll(() => {
        jest.useRealTimers();
    });

    beforeEach(() => {
        fetch.mockClear();
    })

    it('should render error', async() => {
        fetch.mockImplementationOnce(() => new Response('Bad credentials.', { status: 401 }));

        const wrapper = createWrapper();

        wrapper.findByTestid('username').simulate('change', { target: { value: 'username' }});
        wrapper.findByTestid('password').simulate('change', { target: { value: 'password' }});

        await act(async() => wrapper.find('form').simulate('submit', { preventDefault: jest.fn()}));
        wrapper.update();

        expect(wrapper.findByTestid('error').text()).toBe('Bad credentials.');
    })

    it('should call fetch with data', async() => {
        fetch.mockImplementationOnce(() => new Response(JSON.stringify({}), { status: 200 }))

        const wrapper = createWrapper({ isLoading: false, error: null });
        
        wrapper.findByTestid('username').simulate('change', { target: { value: 'username' }});
        wrapper.findByTestid('password').simulate('change', { target: { value: 'password' }});
        
        await act(async() => wrapper.find('form').simulate('submit', { preventDefault: jest.fn()}));

        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/users/login', {body: JSON.stringify({username: 'username', password: 'password'}), headers: {'Content-Type': 'Application/json'}, method: 'POST'})
    })
})