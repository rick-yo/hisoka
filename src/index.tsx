import React, {
  useState,
  useEffect,
  createContext,
  FC,
  ReactNode,
} from 'react';
import equal from 'fast-deep-equal';
import produce from 'immer';

import { Model, Actions, StateSelector, Subscriber } from './typings';

function createStore<S, A extends Actions<S>>(model: Model<S, A>) {
  const subscribers: Subscriber<S>[] = [];
  let storeState = model.state;
  const { actions } = model;
  const StoreContext = createContext<S>(storeState);

  function useSelector<P>(selector: StateSelector<S, P>) {
    const [state, setState] = useState(() => selector(storeState));

    useEffect(() => {
      const subscriber: any = (oldState: S, nextState: S) => {
        const nextSelector = selector(nextState);
        const shouldUpdate = !equal(selector(oldState), nextSelector);
        if (shouldUpdate) {
          setState(nextSelector);
        }
      };
      subscribers.push(subscriber);
      return () => {
        const index = subscribers.indexOf(subscriber);
        subscribers.splice(index, 1);
      };
    }, []);

    return state;
  }

  function getState() {
    return storeState;
  }

  const dispatch = <T extends keyof A>(
    actionType: T,
    payload?: Parameters<A[T]>[1]
  ) => {
    const action = actions[actionType];
    const oldState = getState();
    const nextState = produce(oldState, (draft: S) => {
      action(draft, payload);
    });
    // FIXME fix in nest dispatch, the outer dispatch execute later, may revert the update by inner dispatch
    // see test dispatch.asyncIncrement
    notify(oldState, nextState);
  };

  function notify(oldState: S, nextState: S) {
    subscribers.forEach(subscriber => {
      subscriber(oldState, nextState);
    });
    storeState = nextState;
  }

  const EnhancedProvider: FC<{
    initialState?: S;
    children: ReactNode;
  }> = ({ initialState, children }) => {
    // useEffect to prevent update Provider's child component while rendering Provider
    useEffect(() => {
      if (initialState) {
        !equal(storeState, initialState) && notify(storeState, initialState);
      }
    }, [initialState]);
    return (
      <StoreContext.Provider value={initialState as S}>
        {children}
      </StoreContext.Provider>
    );
  };

  return { useSelector, dispatch, getState, Provider: EnhancedProvider };
}

export { createStore };
export * from './typings';
