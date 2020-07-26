import React from 'React';
import { createStore } from '../src/index';
import { renderHook, act } from '@testing-library/react-hooks';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const { useSelector, dispatch, getState, Provider } = createStore({
  state: {
    count: 0,
  },
  actions: {
    increment(state, payload: number) {
      state.count += payload;
    },
    decrement(state, payload: number) {
      state.count -= payload;
    },
    setCount(state, payload: number) {
      state.count = payload;
    },
    increateWithoutPayload(state) {
      state.count++;
    },
    async asyncIncrement(_, payload: number) {
      await new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 50);
      });
      dispatch.increment(payload);
    },
  },
});

test('useSelector', async () => {
  const { result, unmount } = renderHook(() => useSelector(s => s.count));

  expect(result.current).toBe(0);

  expect(getState()).toEqual({
    count: 0,
  });

  await act(async () => {
    await dispatch.increateWithoutPayload();
  });

  expect(result.current).toBe(1);

  await act(async () => {
    await dispatch.decrement(1);
    await dispatch.decrement(1);
  });

  expect(result.current).toBe(-1);

  await act(async () => {
    await dispatch.asyncIncrement(1);
  });

  expect(result.current).toBe(0);

  await act(async () => {
    await dispatch.setCount(2);
  });
  expect(result.current).toBe(2);

  unmount();
});

test('Provider', async () => {
  const role = 'counter';
  function Counter() {
    const count = useSelector(s => s.count);
    const handleIncrease = () => dispatch.increment(1);
    return (
      <div role={role} onClick={handleIncrease}>
        {count}
      </div>
    );
  }
  const component = render(
    <div>
      <Provider
        initialState={{
          count: 10,
        }}
      >
        <Counter />
      </Provider>
    </div>
  );

  expect(component.getByRole(role).textContent).toBe('10');

  // fireEvent.click(component.getByRole(role));

  // await waitFor(() => screen.getByRole(role));
  // expect(component.getByRole(role).textContent).toBe('11');
  component.unmount();
});
