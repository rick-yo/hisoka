# Hisoka

![CI](https://github.com/luvsic3/hisoka/workflows/CI/badge.svg)
[![npm](https://img.shields.io/badge/TypeScript-%E2%9C%93-007ACC.svg)](https://www.typescriptlang.org/) 

React state management library Based on Hooks

## Feature

Hisoka is opinionated, it has these benefits:

* Easy to use, like Vuex
* Fully typescript support
* Hooks based, no `connect、mapState`
* Multiple store

## Installation

```sh
npm i hisoka
```

## Quick Start

```js
import { createStore } from 'hisoka'

const { useSelector, dispatch, Provider } = createStore({
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
    async asyncIncrement(state, payload: number) {
      await new Promise(resolve => {
        setTimeout(() => {
          state.count += payload;
          resolve()
        }, 1000)
      })
      dispatch.increment(payload);
    },
  }
})

const Counter = () => {
  const count = useSelector(S => S.count)
  return (
    <div>
      <span>{count}</span>
      <div>
        <button onClick={() => dispatch.decrement(1)}>-</button>
        <button onClick={() => dispatch.increment(1)}>+</button>
        <button onClick={() => dispatch.asyncIncrement(1)}>async+</button>
      </div>
    </div>
  )
}
```

## Examples

See `/example`

## API

### state

The initial state of a store

```js
const someStore = createStore({
  state: {
    count: 0,
  },
})
```

### actions

Update state in actions

```js
const { dispatch } = createStore({
  actions: {
    increment(state, payload) {
      state.count += payload
    },
    async asyncIncrement() {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
      dispatch.increment(1)
    },
  },
})
```

### useSelector

Get state in React component using hooks

```js
const App = () => {
  const { useSelector } = counterStore
  const count = useSelector(S => S.count)
  return <span>{count}</span>
}
```

### dispatch

Dispatch an Action to update state

```js
const { useSelector, dispatch } = counterStore
const Count = () => {
  const count = useStore(S => S.count)
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch.increment(1)}>-</button>
      <button onClick={() => dispatch.decrement(1)}>+</button>
    </div>
  )
}
```

## License

[MIT License](https://github.com/luvsic3/hisoka/blob/master/LICENSE)
