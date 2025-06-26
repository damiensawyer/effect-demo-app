import { Effect } from "effect"
import { policy } from "../Domain/Policy.js"
import type { UserId } from "../Domain/User.js"

export class AccountsPolicy extends Effect.Service<AccountsPolicy>()(
  "Accounts/Policy",
  {
    // eslint-disable-next-line require-yield
    effect: Effect.gen(function*() {
      const canUpdate = (toUpdate: UserId) => policy("User", "update", (actor) => Effect.succeed(actor.id === toUpdate))

      //const canRead = (toRead: UserId) => policy("User", "read", (actor) => Effect.succeed(actor.id === toRead)) // I think that this is forcing so that you can only read your own user
      const canRead = (toRead: UserId) => policy("User", "read", (actor) => Effect.succeed(true)) // try this. 

      const canReadSensitive = (toRead: UserId) =>
        policy("User", "readSensitive", (actor) => Effect.succeed(actor.id === toRead))

      return { canUpdate, canRead, canReadSensitive } as const
    })
  }
) {}
