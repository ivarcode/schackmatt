export class Exercise {
    private _name: string;
    private _info: string[];
    private _setup: Function;
    private _nextMove: Function;
    private _moveValidator: Function;
    private _complete: Function;

    constructor(
        name: string,
        info: string[],
        setup: Function,
        nextMove: Function,
        moveValidator: Function,
        complete: Function
    ) {
        this.name = name;
        this.info = info;
        this.setup = setup;
        this.nextMove = nextMove;
        this.moveValidator = moveValidator;
        this.complete = complete;
    }

    set name(name: string) {
        this._name = name;
    }
    set info(info: string[]) {
        this._info = info;
    }
    set setup(setup: Function) {
        this._setup = setup;
    }
    set nextMove(nM: Function) {
        this._nextMove = nM;
    }
    set moveValidator(mV: Function) {
        this._moveValidator = mV;
    }
    set complete(c: Function) {
        this._complete = c;
    }

    /**
     * @description name of the exercise
     */
    get name(): string {
        return this._name;
    }
    /**
     * @description information about the exercise
     */
    get info(): string[] {
        return this._info;
    }
    /**
     * @param board - board containing the init position
     * @function setup is void and sets the board up to the initial position
     */
    get setup(): Function {
        return this._setup;
    }
    /**
     * @param board - current board
     * @function nextMove returns the string notation of the opponent's following move
     * @returns {string} move notation
     */
    get nextMove(): Function {
        return this._nextMove;
    }
    /**
     * @param board - resulting board
     * @param move - move made
     * @function moveValidator validates the move made by checking the resulting board
     * @returns {boolean} whether or not the move was valid
     */
    get moveValidator(): Function {
        return this._moveValidator;
    }
    /**
     * @param board - position to test whether the exercise is completed
     * @function complete determines whether the board is in the completed state
     * @returns {boolean} whether the exercise is complete
     */
    get complete(): Function {
        return this._complete;
    }
}
