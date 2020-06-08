import React from 'react'
import { shallow } from 'enzyme'
import { TestCounterDisplay, TestCounterButton } from './testCounter.conponent'
import * as CounterContext  from './testCounter.context'

const sel = (id: string) => {
  return `[data-testid="${id}"]`
}

describe('[COMPONENT] TestCounter', ()=> {
  it('should render with value from custom hook', () => {
    jest.spyOn(CounterContext, 'useCounterContext').mockImplementation(():any => {
      return {
        count: 100,
        increment: () => {},
        decrement: () => {}
      }
    })

    const wrapper = shallow(<TestCounterDisplay />)
		expect(wrapper.find(sel('display')).text()).toEqual('100')
  })

  it('should call counter when click buttons', () => {
    const incrementMock = jest.fn();
    const decrementMock = jest.fn();

    jest.spyOn(CounterContext, 'useCounterContext').mockImplementation(():any => {
      return {
        count: 0,
        increment: incrementMock,
        decrement: decrementMock
      }
    })

    const wrapper = shallow(<TestCounterButton />)

    wrapper.find(sel('incrementButton')).simulate('click')
    expect(incrementMock).toBeCalled()

    wrapper.find(sel('decrementButton')).simulate('click')
    expect(decrementMock).toBeCalled()
  })
})