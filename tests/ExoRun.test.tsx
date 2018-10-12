import React from 'react';
import renderer from 'react-test-renderer';
import ExoRun from "app/ExoRun";

jest.mock('react-native-camera', () => 'RNCamera');

it('renders correctly with defaults', () => {
    const _ExoRun = renderer
        .create(<ExoRun />);
    expect(_ExoRun.toJSON()).toMatchSnapshot();
    _ExoRun.unmount();
});
