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

const context = () => {
  const stack = []

  return {
    provide(value, fn) {
      stack.push(value)
      try {
        return fn()
      } finally {
        stack.pop()
      }
    },
    use() {
      if (!stack.length) {
        throw new Error(`context: use called outside provide`)
      }

      return stack[stack.length - 1]
    },
  }
}

context.singleton = () => {
  let holder

  return {
    provide(value, fn) {
      if (holder) {
        throw new Error(`context: provide called in provide for singleton`)
      }

      holder = { value }

      let result
      try {
        result = fn()
      } catch (error) {
        holder = undefined
        throw error
      }

      if (!result || typeof result.then !== `function`) {
        holder = undefined
        return result
      }

      return (async () => {
        try {
          return await result
        } finally {
          holder = undefined
        }
      })()
    },
    use() {
      if (!holder) {
        throw new Error(`context: use called outside provide`)
      }

      return holder.value
    },
  }
}

export default context
