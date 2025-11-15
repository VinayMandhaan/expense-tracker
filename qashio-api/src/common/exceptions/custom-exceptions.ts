export class InvalidBudgetRangeError extends Error {
    constructor() {
        super('Start date must be before end date')
    }
}