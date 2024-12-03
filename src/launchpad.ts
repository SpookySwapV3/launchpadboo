import {
  Bought as BoughtEvent,
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
  TokenLaunched
} from "../generated/schema"

export function handleBought(event: BoughtEvent): void {
  let entity = new Bought(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.buyer = event.params.buyer
  entity.token = event.params.token
  entity.ethIn = event.params.ethIn
  entity.tokensOut = event.params.tokensOut
  entity.newPrice = event.params.newPrice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
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

export function handleSold(event: SoldEvent): void {
  let entity = new Sold(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.seller = event.params.seller
  entity.token = event.params.token
  entity.ethOut = event.params.ethOut
  entity.tokensIn = event.params.tokensIn
  entity.newPrice = event.params.newPrice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSwap(event: SwapEvent): void {
  let entity = new Swap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.amount0In = event.params.amount0In
  entity.amount1In = event.params.amount1In
  entity.amount0Out = event.params.amount0Out
  entity.amount1Out = event.params.amount1Out
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokenCreated(event: TokenCreatedEvent): void {
  let entity = new TokenCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
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

  entity.save()
}
