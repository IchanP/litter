import { connectBroker, producer } from '../src/config/kafka'

describe('Kafka Export', () => {
  it('Produer should be undefiend before connectBroker is called', () => {
    expect(producer).toBe(undefined)
  })
})
