import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v1 from './v1'
import * as v33 from './v33'

export class EvmLogEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'EVM.Log')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Ethereum events from contracts.
     */
    get isV1(): boolean {
        return this._chain.getEventHash('EVM.Log') === '9d15dce6e6d818eeb73a868dd136a22667fbfdd27463a338b39cabae62aa4a12'
    }

    /**
     * Ethereum events from contracts.
     */
    get asV1(): v1.Log {
        assert(this.isV1)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * Ethereum events from contracts.
     */
    get isV33(): boolean {
        return this._chain.getEventHash('EVM.Log') === '4edddb5632dcffc943bfbdb42201f95b9c2ffa1df042e526a7c54a39f099056a'
    }

    /**
     * Ethereum events from contracts.
     */
    get asV33(): {log: v33.Log} {
        assert(this.isV33)
        return this._chain.decodeEvent(this.event)
    }
}
