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

test(`contextus throws outside contexts`, t => {
  const theContext = context()

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

test(`contextus returns the return value`, t => {
  const theContext = context()

  t.is(
    theContext.provide(`wow`, () => 2),
    2,
  )
})
