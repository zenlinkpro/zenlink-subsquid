import { EvmLogHandlerContext } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import { Big as BigDecimal } from 'big.js'
import { FACTORY_ADDRESS, ZERO_BD } from "../consts";
import { 
  Bundle, 
  Factory, 
  Pair, 
  PairDayData, 
  PairHourData, 
  Token, 
  TokenDayData, 
  ZenlinkDayData 
} from "../model";

export async function updateZenlinkDayData(ctx: EvmLogHandlerContext<Store>) {
  const factory = (await ctx.store.get(Factory, FACTORY_ADDRESS))!
  const { timestamp } = ctx.block
  const dayID = parseInt((timestamp / 86400000).toString(), 10)
  const dayStartTimestamp = Number(dayID) * 86400000
  let zenlinkDayData = await ctx.store.get(ZenlinkDayData, dayID.toString())
  if (!zenlinkDayData) {
    zenlinkDayData = new ZenlinkDayData({
      id: dayID.toString(),
      date: new Date(dayStartTimestamp),
      dailyVolumeUSD: ZERO_BD.toString(),
      dailyVolumeETH: ZERO_BD.toString(),
      totalVolumeUSD: ZERO_BD.toString(),
      totalVolumeETH: ZERO_BD.toString(),
      dailyVolumeUntracked: ZERO_BD.toString()
    })
  }
  zenlinkDayData.totalLiquidityUSD = factory.totalLiquidityUSD
  zenlinkDayData.totalLiquidityETH = factory.totalLiquidityETH
  zenlinkDayData.txCount = factory.txCount
  await ctx.store.save(zenlinkDayData)
  return zenlinkDayData
}

export async function updatePairDayData(ctx: EvmLogHandlerContext<Store>) {
  const contractAddress = ctx.event.args.address
  const { timestamp } = ctx.block
  const dayID = parseInt((timestamp / 86400000).toString(), 10)
  const dayStartTimestamp = Number(dayID) * 86400000
  const dayPairID = `${contractAddress as string}-${dayID}`
  const pair = (await ctx.store.get(Pair, contractAddress))!
  let pairDayData = await ctx.store.get(PairDayData, dayPairID)
  if (!pairDayData) {
    pairDayData = new PairDayData({
      id: dayPairID,
      date: new Date(dayStartTimestamp),
      token0: pair.token0,
      token1: pair.token1,
      pairAddress: contractAddress,
      dailyVolumeToken0: ZERO_BD.toString(),
      dailyVolumeToken1: ZERO_BD.toString(),
      dailyVolumeUSD: ZERO_BD.toString(),
      dailyTxns: 0
    })
  }
  pairDayData.totalSupply = pair.totalSupply
  pairDayData.reserve0 = pair.reserve0
  pairDayData.reserve1 = pair.reserve1
  pairDayData.reserveUSD = pair.reserveUSD
  pairDayData.dailyTxns += 1
  await ctx.store.save(pairDayData)
  return pairDayData
}

export async function updatePairHourData(ctx: EvmLogHandlerContext<Store>) {
  const contractAddress = ctx.event.args.address
  const { timestamp } = ctx.block
  const hourIndex = parseInt((timestamp / 3600000).toString(), 10)
  const hourStartUnix = Number(hourIndex) * 3600000
  const dayPairID = `${contractAddress as string}-${hourIndex}`
  const pair = (await ctx.store.get(Pair, contractAddress))!
  let pairHourData = await ctx.store.get(PairHourData, dayPairID)
  if (!pairHourData) {
    pairHourData = new PairHourData({
      id: dayPairID,
      hourStartUnix: BigInt(hourStartUnix),
      pair,
      hourlyVolumeToken0: ZERO_BD.toString(),
      hourlyVolumeToken1: ZERO_BD.toString(),
      hourlyVolumeUSD: ZERO_BD.toString(),
      hourlyTxns: 0
    })
  }
  pairHourData.totalSupply = pair.totalSupply
  pairHourData.reserve0 = pair.reserve0
  pairHourData.reserve1 = pair.reserve1
  pairHourData.reserveUSD = pair.reserveUSD
  pairHourData.hourlyTxns += 1
  await ctx.store.save(pairHourData)
  return pairHourData
}

export async function updateTokenDayData(ctx: EvmLogHandlerContext<Store>, token: Token) {
  const bundle = (await ctx.store.get(Bundle, '1'))!
  const { timestamp } = ctx.block
  const dayID = parseInt((timestamp / 86400000).toString(), 10)
  const dayStartTimestamp = Number(dayID) * 86400000
  const tokenDayID = `${token.id}-${dayID}`
  let tokenDayData = await ctx.store.get(TokenDayData, tokenDayID)
  if (!tokenDayData) {
    tokenDayData = new TokenDayData({
      id: tokenDayID,
      date: new Date(dayStartTimestamp),
      token,
      priceUSD: BigDecimal(token.derivedETH).times(bundle.ethPrice).toString(),
      dailyVolumeToken: ZERO_BD.toString(),
      dailyVolumeETH: ZERO_BD.toString(),
      dailyVolumeUSD: ZERO_BD.toString(),
      dailyTxns: 0,
      totalLiquidityUSD: ZERO_BD.toString()
    })
  }
  tokenDayData.priceUSD = BigDecimal(token.derivedETH).times(bundle.ethPrice).toString()
  tokenDayData.totalLiquidityToken = token.totalLiquidity
  tokenDayData.totalLiquidityETH = BigDecimal(token.totalLiquidity).times(token.derivedETH).toString()
  tokenDayData.totalLiquidityUSD = BigDecimal(tokenDayData.totalLiquidityETH).times(bundle.ethPrice).toString()
  tokenDayData.dailyTxns += 1
  await ctx.store.save(tokenDayData)
  return tokenDayData
}
