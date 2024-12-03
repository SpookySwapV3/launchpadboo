import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Bought,
  OwnershipTransferred,
  Sold,
  Swap,
  TokenCreated,
  TokenLaunched
} from "../generated/Launchpad/Launchpad"

export function createBoughtEvent(
  buyer: Address,
  token: Address,
  ethIn: BigInt,
  tokensOut: BigInt,
  newPrice: BigInt
): Bought {
  let boughtEvent = changetype<Bought>(newMockEvent())

  boughtEvent.parameters = new Array()

  boughtEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  boughtEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  boughtEvent.parameters.push(
    new ethereum.EventParam("ethIn", ethereum.Value.fromUnsignedBigInt(ethIn))
  )
  boughtEvent.parameters.push(
    new ethereum.EventParam(
      "tokensOut",
      ethereum.Value.fromUnsignedBigInt(tokensOut)
    )
  )
  boughtEvent.parameters.push(
    new ethereum.EventParam(
      "newPrice",
      ethereum.Value.fromUnsignedBigInt(newPrice)
    )
  )

  return boughtEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createSoldEvent(
  seller: Address,
  token: Address,
  ethOut: BigInt,
  tokensIn: BigInt,
  newPrice: BigInt
): Sold {
  let soldEvent = changetype<Sold>(newMockEvent())

  soldEvent.parameters = new Array()

  soldEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  soldEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  soldEvent.parameters.push(
    new ethereum.EventParam("ethOut", ethereum.Value.fromUnsignedBigInt(ethOut))
  )
  soldEvent.parameters.push(
    new ethereum.EventParam(
      "tokensIn",
      ethereum.Value.fromUnsignedBigInt(tokensIn)
    )
  )
  soldEvent.parameters.push(
    new ethereum.EventParam(
      "newPrice",
      ethereum.Value.fromUnsignedBigInt(newPrice)
    )
  )

  return soldEvent
}

export function createSwapEvent(
  sender: Address,
  amount0In: BigInt,
  amount1In: BigInt,
  amount0Out: BigInt,
  amount1Out: BigInt,
  to: Address
): Swap {
  let swapEvent = changetype<Swap>(newMockEvent())

  swapEvent.parameters = new Array()

  swapEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "amount0In",
      ethereum.Value.fromUnsignedBigInt(amount0In)
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "amount1In",
      ethereum.Value.fromUnsignedBigInt(amount1In)
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "amount0Out",
      ethereum.Value.fromUnsignedBigInt(amount0Out)
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam(
      "amount1Out",
      ethereum.Value.fromUnsignedBigInt(amount1Out)
    )
  )
  swapEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return swapEvent
}

export function createTokenCreatedEvent(
  creator: Address,
  token: Address,
  supply: BigInt,
  name: string,
  symbol: string,
  imageCid: string,
  description: string,
  links: Array<string>,
  price: BigInt,
  lpStrategy: i32
): TokenCreated {
  let tokenCreatedEvent = changetype<TokenCreated>(newMockEvent())

  tokenCreatedEvent.parameters = new Array()

  tokenCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  tokenCreatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  tokenCreatedEvent.parameters.push(
    new ethereum.EventParam("supply", ethereum.Value.fromUnsignedBigInt(supply))
  )
  tokenCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  tokenCreatedEvent.parameters.push(
    new ethereum.EventParam("symbol", ethereum.Value.fromString(symbol))
  )
  tokenCreatedEvent.parameters.push(
    new ethereum.EventParam("imageCid", ethereum.Value.fromString(imageCid))
  )
  tokenCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  tokenCreatedEvent.parameters.push(
    new ethereum.EventParam("links", ethereum.Value.fromStringArray(links))
  )
  tokenCreatedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  tokenCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "lpStrategy",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(lpStrategy))
    )
  )

  return tokenCreatedEvent
}

export function createTokenLaunchedEvent(
  creator: Address,
  token: Address,
  pair: Address
): TokenLaunched {
  let tokenLaunchedEvent = changetype<TokenLaunched>(newMockEvent())

  tokenLaunchedEvent.parameters = new Array()

  tokenLaunchedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  tokenLaunchedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  tokenLaunchedEvent.parameters.push(
    new ethereum.EventParam("pair", ethereum.Value.fromAddress(pair))
  )

  return tokenLaunchedEvent
}
