import _Bunyan from 'bunyan';
import _durationToString from 'isotropic-duration-to-string';
import _moment from 'moment-timezone';

const _logger = _Bunyan.createLogger({
    name: 'isotropic',
    serializers: {
        error (error) {
            return error && error.stack ?
                {
                    code: error.code,
                    details: error.details,
                    message: error.message,
                    name: error.name,
                    signal: error.signal,
                    stack: typeof error.stack === 'string' ?
                        error.stack.split('\n') :
                        error.stack
                } :
                error;
        }
    }
});

Object.getPrototypeOf(_logger).task = function (data, description) {
    const beginTime = _moment();

    if (typeof data === 'string') {
        description = data;
        data = {};
    }

    if (data || description) {
        this.info(data, description);
    }

    return {
        complete: (data = {}, completeDescription = null) => {
            const endTime = _moment();

            if (typeof data === 'string') {
                completeDescription = data;
                data = {};
            }

            this.info(
                {
                    duration: endTime.diff(beginTime),
                    durationString: _durationToString({
                        beginTime,
                        endTime
                    }),
                    ...data
                },
                completeDescription || (
                    description ?
                        `Done ${description.charAt(0).toLowerCase()}${description.substring(1)}` :
                        'Done'
                )
            );
        },
        error: (data = {}, errorDescription = null) => {
            const endTime = _moment();

            if (typeof data === 'string') {
                errorDescription = data;
                data = {};
            }

            this.error(
                {
                    duration: endTime.diff(beginTime),
                    durationString: _durationToString({
                        beginTime,
                        endTime
                    }),
                    ...data
                },
                errorDescription || (
                    description ?
                        `Error ${description.charAt(0).toLowerCase()}${description.substring(1)}` :
                        'Error'
                )
            );
        }
    };
};

export default _logger;
