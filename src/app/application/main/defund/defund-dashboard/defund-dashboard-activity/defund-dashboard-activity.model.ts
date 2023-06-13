export interface DefundTransaction {
    type: number,
    value: number,
    transferTo: string,
    tokenIn: string,
    tokenOut: string,
    from: string,
    timestamp: string,
}

export const TRANSACTION_TYPES: string[] = [
    "None",
    "Swap",
    "Deposit",
    "Withdrawn"
];

export const DEFUND_ACTIVITY: DefundTransaction[] = [
    {
        type: 1,
        value: 10,
        transferTo: 'test',
        tokenIn: 'test',
        tokenOut: 'test',
        from: 'test',
        timestamp: 'test'
    },
    {
        type: 2,
        value: 10,
        transferTo: 'test',
        tokenIn: 'test',
        tokenOut: 'test',
        from: 'test',
        timestamp: 'test'
    },
    {
        type: 3,
        value: 10,
        transferTo: 'test',
        tokenIn: 'test',
        tokenOut: 'test',
        from: 'test',
        timestamp: 'test'
    },
    {
        type: 1,
        value: 10,
        transferTo: 'test',
        tokenIn: 'test',
        tokenOut: 'test',
        from: 'test',
        timestamp: 'test'
    },
    {
        type: 1,
        value: 10,
        transferTo: 'test',
        tokenIn: 'test',
        tokenOut: 'test',
        from: 'test',
        timestamp: 'test'
    }
]
