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

/** Creates a new context and returns it. */
declare const context: <Value>() => Context<Value>

/** A context that holds values of type `Value`. */
export type Context<Value> = {
  /**
   * Calls `fn` with the given `value` provided to it, meaning that calls to the
   * `use` method of this context will return the given `value` when called
   * transitively within `fn`. Returns the return value from calling `fn`.
   */
  provide<ReturnValue>(value: Value, fn: () => ReturnValue): ReturnValue

  /**
   * Returns the value provided by this context.
   *
   * @throws when called transitively outside the callback of this context's
   *   `provide` method, meaning that no value has been provided.
   */
  use(): Value
}

export default context
