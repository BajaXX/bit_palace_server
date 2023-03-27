class HttpException extends Error {
    constructor(message = 'Internal server error', code = 10001) {
        super()
        this.code = code
        this.message = message
    }
}

class ErrParameter extends HttpException {
    constructor(message = 'Error type of params') {
        super()
        this.code = 10003
        this.message = message
    }
}

class ErrDatabase extends HttpException {
    constructor(message = 'Database error') {
        super()
        this.code = 10202
        this.message = message
    }
}

class ErrDataQuery extends HttpException {
    constructor(message = 'Error data of query') {
        super()
        this.code = 10004
        this.message = message
    }
}

class ErrValidation extends HttpException {
    constructor(message) {
        super()
        this.code = 10201
        this.message = message || 'Validation failed'
    }
}

class ErrRecordNotFound extends HttpException {
    constructor(message = 'Database record not found') {
        super()
        this.code = 10203
        this.message = message
    }
}

class ErrForbidden extends HttpException {
    constructor(message = 'Token invalid') {
        super()
        this.code = 10204
        this.message = message
    }
}

module.exports = {
    HttpException,
    ErrParameter,
    ErrValidation,
    ErrDatabase,
    ErrDataQuery,
    ErrRecordNotFound,
    ErrForbidden
}
