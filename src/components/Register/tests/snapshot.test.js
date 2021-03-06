import Register from '../Register';
import { shallow } from 'enzyme';
import * as redux from 'react-redux';

describe("RegisterSnapshotTests", () => {
    let selectorSpy;
    let dispatchSpy;
    
    beforeAll(() => {
        jest.useFakeTimers('modern');
        jest.setSystemTime(1614636000000);

        selectorSpy = jest.spyOn(redux, 'useSelector');
        dispatchSpy = jest.spyOn(redux, 'useDispatch');

        dispatchSpy.mockReturnValue(jest.fn());
    })

    afterAll(() => {
        jest.useRealTimers();
    });

    const createWrapper = (state) => {
        selectorSpy.mockReturnValue(state);
        
        return shallow(
            <Register /> 
        )
    }

    it('renders correctly page 0', () => {
        const wrapper = createWrapper({isLoading: false, error: null});
     
        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly page 1', () => {
        const wrapper = createWrapper({isLoading: false, error: null});
    
        const form = wrapper.find('form');
        form.simulate('submit', { target: form, preventDefault: jest.fn() });

        expect(wrapper).toMatchSnapshot();
    });
    
    it('renders correctly with passed errors props and page 0', () => {
        const wrapper = createWrapper({isLoading: false, error: {username: 'Username is already taken.', password: 'Password must be between 10 and 20 characters.', email: 'Email is already taken.'}});

        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with passed errors props and page 1', () => {
        const wrapper = createWrapper({isLoading: false, error: {country: 'Country is invalid.', age: 'Age is required.', firstName: 'First name is required.', lastName: 'Last name is required.'}});

        const form = wrapper.find('form');
        form.simulate('submit', { target: form, preventDefault: jest.fn() });

        expect(wrapper).toMatchSnapshot();
    });
});