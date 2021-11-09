/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import process from 'process'
import { fc, testProp } from 'ava-fast-check'
import test from 'ava'
import context from '../src/index.js'

testProp(
  `contextus provides the given value to the callback`,
  [fc.anything()],
  (t, providedValue) => {
    const theContext = context()

    theContext.provide(providedValue, () =>
      (() =>
        (() => {
          const value = theContext.use()

          t.is(value, providedValue)
        })())(),
    )
  },
)

testProp(
  `contextus singleton provides the given value to the callback`,
  [fc.anything()],
  (t, providedValue) => {
    const theContext = context.singleton()

    theContext.provide(providedValue, () =>
      (() =>
        (() => {
          const value = theContext.use()

          t.is(value, providedValue)
        })())(),
    )
  },
)

testProp(
  `contextus supports nested contexts`,
  [fc.set(fc.anything(), { minLength: 2, maxLength: 2 })],
  (t, value1, value2) => {
    const theContext = context()

    theContext.provide(value1, () => {
      t.is(theContext.use(), value1)

      theContext.provide(value2, () => {
        t.is(theContext.use(), value2)
      })

      t.is(theContext.use(), value1)
    })
  },
)

testProp(
  `contextus singleton does not support nested contexts`,
  [fc.set(fc.anything(), { minLength: 2, maxLength: 2 })],
  (t, value1, value2) => {
    const theContext = context.singleton()

    theContext.provide(value1, () => {
      t.is(theContext.use(), value1)

      // eslint-disable-next-line no-empty-function
      t.throws(() => theContext.provide(value2, () => {}), {
        instanceOf: Error,
        message: `context: provide called in provide for singleton`,
      })

      t.is(theContext.use(), value1)
    })
  },
)

test(`contextus throws outside contexts`, t => {
  const theContext = context()

  t.throws(() => theContext.use(), {
    instanceOf: Error,
    message: `context: use called outside provide`,
  })
})

test(`contextus singleton throws outside contexts`, t => {
  const theContext = context.singleton()

  t.throws(() => theContext.use(), {
    instanceOf: Error,
    message: `context: use called outside provide`,
  })
})

test(`contextus state isn't corrupted by a throwing function`, t => {
  const theContext = context()

  t.throws(
    () =>
      theContext.provide(`wow`, () => {
        throw new Error(`BOOM!`)
      }),
    {
      instanceOf: Error,
      message: `BOOM!`,
    },
  )
  t.throws(() => theContext.use(), {
    instanceOf: Error,
    message: `context: use called outside provide`,
  })
})

test(`contextus singleton state isn't corrupted by a throwing function`, t => {
  const theContext = context.singleton()

  t.throws(
    () =>
      theContext.provide(`wow`, () => {
        throw new Error(`BOOM!`)
      }),
    {
      instanceOf: Error,
      message: `BOOM!`,
    },
  )
  t.throws(() => theContext.use(), {
    instanceOf: Error,
    message: `context: use called outside provide`,
  })
})

test(`contextus singleton state isn't corrupted by a throwing promise`, async t => {
  const theContext = context.singleton()

  await t.throwsAsync(
    () =>
      theContext.provide(`wow`, async () => {
        await tick()
        throw new Error(`BOOM!`)
      }),
    {
      instanceOf: Error,
      message: `BOOM!`,
    },
  )
  t.throws(() => theContext.use(), {
    instanceOf: Error,
    message: `context: use called outside provide`,
  })
})

test(`contextus returns the return value`, t => {
  const theContext = context()

  t.is(
    theContext.provide(`wow`, () => 2),
    2,
  )
})

test(`contextus singleton returns the return value`, t => {
  const theContext = context.singleton()

  t.is(
    theContext.provide(`wow`, () => 2),
    2,
  )
})

test(`contextus singleton waits for async promise before closing`, async t => {
  const theContext = context.singleton()
  let resolve

  const promise = theContext.provide(
    `wow`,
    () => new Promise(res => (resolve = res)),
  )

  t.is(theContext.use(), `wow`)

  resolve(2)
  await tick()

  t.throws(() => theContext.use(), {
    instanceOf: Error,
    message: `context: use called outside provide`,
  })
  t.is(await promise, 2)
})

const tick = () => new Promise(process.nextTick)
