import {
  Bought as BoughtEvent,
  FakePoolCreated as FakePoolCreatedEvent,
  FakePoolMCapReached as FakePoolMCapReachedEvent,
  FakePoolReserveChanged as FakePoolReserveChangedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Sold as SoldEvent,
  Swap as SwapEvent,
  TokenCreated as TokenCreatedEvent,
  TokenLaunched as TokenLaunchedEvent
} from "../generated/Launchpad/Launchpad"
import {
  Bought,
  OwnershipTransferred,
  Sold,
  Swap,
  TokenCreated,
  TokenLaunched,
  Pool,
  TransactionContext,
  FakePoolCreated,
  FakePoolMCapReached,
  FakePoolReserveChanged,
  PoolDayData,
  PoolHourData,
} from "../generated/schema"
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"

export function handleFakePoolCreated(event: FakePoolCreatedEvent): void {
  let entity = new FakePoolCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.sellPenalty = event.params.sellPenalty
  entity.ethReserve = event.params.ethReserve
  entity.tokenReserve = event.params.tokenReserve

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFakePoolMCapReached(
  event: FakePoolMCapReachedEvent
): void {
  let entity = new FakePoolMCapReached(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash


  // Link to TokenCreated
  let tokenCreated = TokenCreated.load(event.params.token)
  if (tokenCreated) {
    entity.tokenCreated = tokenCreated.id
  }
  entity.save()

}

export function handleFakePoolReserveChanged(
  event: FakePoolReserveChangedEvent
): void {
  let entity = new FakePoolReserveChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.ethReserve = event.params.ethReserve
  entity.tokenReserve = event.params.tokenReserve

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}


function getOrCreatePool(tokenAddress: Address): Pool {
  let id = tokenAddress
  let pool = Pool.load(id)
  if (pool == null) {
    pool = new Pool(id)
    pool.token = tokenAddress
    pool.price = BigInt.fromI32(0)

    let tokenCreated = TokenCreated.load(tokenAddress)
    if (tokenCreated) {
      pool.tokenCreated = tokenCreated.id
    } else {
      pool.tokenCreated = null
    }

    pool.save()
  }
  return pool as Pool
}

function createTransactionContext(
  txHash: Bytes,
  token: Address,
  poolId: Bytes
): void {
  let context = new TransactionContext(txHash)
  context.token = token
  context.pool = poolId
  context.save()
}

function clearTransactionContext(txHash: Bytes): void {
  // Not strictly required to remove it. 
  // The Graph doesn't allow entity removal once created
}

export function handleBought(event: BoughtEvent): void {
  let entity = new Bought(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.buyer = event.params.buyer
  entity.token = event.params.token
  entity.ethIn = event.params.ethIn
  entity.tokensOut = event.params.tokensOut
  entity.newPrice = event.params.newPrice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  // Update pool price
  let pool = getOrCreatePool(event.params.token)
  pool.price = event.params.newPrice
  pool.save()

  entity.pool = pool.id
  entity.save()

  // Store transaction context for subsequent Swap event
  createTransactionContext(event.transaction.hash, event.params.token, pool.id)
  let volumeChange = event.params.ethIn
  let tokenVolumeChange = event.params.tokensOut
  let ethVolumeChange = event.params.ethIn

  updatePoolDayData(pool, event.block.timestamp, volumeChange, ethVolumeChange, tokenVolumeChange)
  updatePoolHourData(pool, event.block.timestamp, volumeChange, ethVolumeChange, tokenVolumeChange)

}

export function handleSold(event: SoldEvent): void {
  let entity = new Sold(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.seller = event.params.seller
  entity.token = event.params.token
  entity.ethOut = event.params.ethOut
  entity.tokensIn = event.params.tokensIn
  entity.newPrice = event.params.newPrice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  // Update pool price
  let pool = getOrCreatePool(event.params.token)
  pool.price = event.params.newPrice
  pool.save()

  entity.pool = pool.id
  entity.save()

  // Store transaction context for subsequent Swap event
  createTransactionContext(event.transaction.hash, event.params.token, pool.id)

  let volumeChange = event.params.ethOut
  let tokenVolumeChange = event.params.tokensIn
  let ethVolumeChange = event.params.ethOut

  updatePoolDayData(pool, event.block.timestamp, volumeChange, ethVolumeChange, tokenVolumeChange)
  updatePoolHourData(pool, event.block.timestamp, volumeChange, ethVolumeChange, tokenVolumeChange)

}

export function handleSwap(event: SwapEvent): void {
  let entity = new Swap(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.sender = event.params.sender
  entity.amount0In = event.params.amount0In
  entity.amount1In = event.params.amount1In
  entity.amount0Out = event.params.amount0Out
  entity.amount1Out = event.params.amount1Out
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  // Retrieve token and pool from transaction context
  let context = TransactionContext.load(event.transaction.hash)
  if (context != null) {
    entity.pool = context.pool
  } else {
    // If for some reason there's no context, we need a fallback strategy.
    // But ideally, `Bought` or `Sold` preceded `Swap` in the same transaction.
  }

  entity.save()

  //clearTransactionContext(event.transaction.hash)
}

export function handleTokenCreated(event: TokenCreatedEvent): void {

  let entity = new TokenCreated(
    event.params.token
  )
  entity.creator = event.params.creator
  entity.token = event.params.token
  entity.supply = event.params.supply
  entity.name = event.params.name
  entity.symbol = event.params.symbol
  entity.imageCid = event.params.imageCid
  entity.description = event.params.description
  entity.links = event.params.links
  entity.price = event.params.price
  entity.lpStrategy = event.params.lpStrategy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  // Initialize a pool for this token
  let pool = getOrCreatePool(event.params.token)
  pool.price = event.params.price

  pool.tokenCreated = entity.id // Link Pool to TokenCreated
  pool.save()
}

export function handleTokenLaunched(event: TokenLaunchedEvent): void {
  let entity = new TokenLaunched(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.creator = event.params.creator
  entity.token = event.params.token
  entity.pair = event.params.pair

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  // Link to TokenCreated
  let tokenCreated = TokenCreated.load(event.params.token)
  if (tokenCreated) {
    entity.tokenCreated = tokenCreated.id
  }

  entity.save()

  let pool = getOrCreatePool(event.params.token)
  pool.save()

}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

function getDayStartTimestamp(timestamp: BigInt): i32 {
  return (timestamp.toI32() / 86400) * 86400
}

function getHourStartTimestamp(timestamp: BigInt): i32 {
  return (timestamp.toI32() / 3600) * 3600
}

function updatePoolDayData(pool: Pool, timestamp: BigInt, volumeChange: BigInt, volumeETHChange: BigInt, volumeTokenChange: BigInt): void {
  let dayStartTimestamp = getDayStartTimestamp(timestamp)
  let dayID = pool.id.concat(Bytes.fromUTF8("-")).concat(Bytes.fromI32(dayStartTimestamp))

  let poolDayData = PoolDayData.load(dayID)
  if (poolDayData == null) {
    poolDayData = new PoolDayData(dayID)
    poolDayData.date = dayStartTimestamp
    poolDayData.pool = pool.id
    poolDayData.dailyVolume = BigInt.zero()
    poolDayData.dailyVolumeETH = BigInt.zero()
    poolDayData.dailyVolumeToken = BigInt.zero()
  }

  poolDayData.dailyVolume = poolDayData.dailyVolume.plus(volumeChange)
  poolDayData.dailyVolumeETH = poolDayData.dailyVolumeETH.plus(volumeETHChange)
  poolDayData.dailyVolumeToken = poolDayData.dailyVolumeToken.plus(volumeTokenChange)
  poolDayData.save()
}

function updatePoolHourData(pool: Pool, timestamp: BigInt, volumeChange: BigInt, volumeETHChange: BigInt, volumeTokenChange: BigInt): void {
  let hourStartTimestamp = getHourStartTimestamp(timestamp)
  let hourID = pool.id.concat(Bytes.fromUTF8("-")).concat(Bytes.fromI32(hourStartTimestamp))

  let poolHourData = PoolHourData.load(hourID)
  if (poolHourData == null) {
    poolHourData = new PoolHourData(hourID)
    poolHourData.hourStartUnix = hourStartTimestamp
    poolHourData.pool = pool.id
    poolHourData.hourlyVolume = BigInt.zero()
    poolHourData.hourlyVolumeETH = BigInt.zero()
    poolHourData.hourlyVolumeToken = BigInt.zero()
  }

  poolHourData.hourlyVolume = poolHourData.hourlyVolume.plus(volumeChange)
  poolHourData.hourlyVolumeETH = poolHourData.hourlyVolumeETH.plus(volumeETHChange)
  poolHourData.hourlyVolumeToken = poolHourData.hourlyVolumeToken.plus(volumeTokenChange)
  poolHourData.save()
}
