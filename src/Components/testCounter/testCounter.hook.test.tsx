import { renderHook, act } from '@testing-library/react-hooks';
import useCounter from './testCounter.hook';
import { CounterProvider } from './testCounter.context';

describe('[CUSTOM HOOK] useCounter', () => {
	it('should increment value', () => {
		const { result } = renderHook(() => useCounter(), {
			wrapper: CounterProvider
		});
		act(() => result.current.increment());
		expect(result.current.count).toEqual(1);
	});

	it('should decrement value', () => {
		const { result } = renderHook(() => useCounter(), {
			wrapper: CounterProvider
		});
		act(() => result.current.decrement());
		expect(result.current.count).toEqual(-1);
	});
});