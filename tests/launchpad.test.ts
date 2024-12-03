import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { Bought } from "../generated/schema"
import { Bought as BoughtEvent } from "../generated/Launchpad/Launchpad"
import { handleBought } from "../src/launchpad"
import { createBoughtEvent } from "./launchpad-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let buyer = Address.fromString("0x0000000000000000000000000000000000000001")
    let token = Address.fromString("0x0000000000000000000000000000000000000001")
    let ethIn = BigInt.fromI32(234)
    let tokensOut = BigInt.fromI32(234)
    let newPrice = BigInt.fromI32(234)
    let newBoughtEvent = createBoughtEvent(
      buyer,
      token,
      ethIn,
      tokensOut,
      newPrice
    )
    handleBought(newBoughtEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Bought created and stored", () => {
    assert.entityCount("Bought", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Bought",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "buyer",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Bought",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "token",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Bought",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "ethIn",
      "234"
    )
    assert.fieldEquals(
      "Bought",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokensOut",
      "234"
    )
    assert.fieldEquals(
      "Bought",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newPrice",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
