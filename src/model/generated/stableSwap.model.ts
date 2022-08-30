import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {StableSwapEvent} from "./stableSwapEvent.model"
import {StableSwapExchange} from "./stableSwapExchange.model"
import {StableSwapDayData} from "./stableSwapDayData.model"

@Entity_()
export class StableSwap {
  constructor(props?: Partial<StableSwap>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("bytea", {nullable: false})
  address!: Uint8Array

  @Column_("bytea", {nullable: false})
  baseSwapAddress!: Uint8Array

  @Column_("int4", {nullable: false})
  numTokens!: number

  @Column_("bytea", {array: true, nullable: false})
  tokens!: (Uint8Array)[]

  @Column_("bytea", {array: true, nullable: false})
  baseTokens!: (Uint8Array)[]

  @Column_("bytea", {array: true, nullable: false})
  allTokens!: (Uint8Array)[]

  @Column_("numeric", {array: true, nullable: false})
  balances!: (bigint)[]

  @Column_("bytea", {nullable: false})
  lpToken!: Uint8Array

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  a!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  swapFee!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  adminFee!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  withdrawFee!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  virtualPrice!: bigint

  @Column_("bytea", {nullable: false})
  owner!: Uint8Array

  @OneToMany_(() => StableSwapEvent, e => e.stableSwap)
  events!: StableSwapEvent[]

  @OneToMany_(() => StableSwapExchange, e => e.stableSwap)
  exchanges!: StableSwapExchange[]

  @OneToMany_(() => StableSwapDayData, e => e.stableSwap)
  stableSwapDayData!: StableSwapDayData[]

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  tvl!: string

  /**
   * BigDecimal
   */
  @Column_("text", {nullable: false})
  volume!: string
}
