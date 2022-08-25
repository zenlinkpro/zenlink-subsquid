import { CommonHandlerContext } from "@subsquid/substrate-processor"
import { Store } from "@subsquid/typeorm-store"
import assert from 'assert'
import { FACTORY_ADDRESS } from "../consts"
import { Bundle, Factory, LiquidityPosition, Transaction } from "../model"

let bundle: Bundle | undefined
let factory: Factory | undefined

export async function getTransaction(ctx: CommonHandlerContext<Store>, id: string) {
  const item = await ctx.store.get(Transaction, id)

  return item
}

export async function getPosition(ctx: CommonHandlerContext<Store>, id: string) {
  const item = await ctx.store.get(LiquidityPosition, id)

  return item
}

export async function getBundle(ctx: CommonHandlerContext<Store>) {
  bundle = bundle || (await ctx.store.get(Bundle, '1'))
  assert(bundle != null)

  return bundle
}

export async function getFactory(ctx: CommonHandlerContext<Store>) {
  factory = factory || (await ctx.store.get(Factory, FACTORY_ADDRESS))
  assert(factory != null)

  return factory
}
