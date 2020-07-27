import _Bunyan from 'bunyan';
import _chai from 'chai';
import _Error from 'isotropic-error';
import _later from 'isotropic-later';
import _logger from '../js/logger.js';
import _mocha from 'mocha';
import _os from 'os';
import _process from 'process';
import _testConsole from 'test-console';

const _hostname = _os.hostname();

_mocha.describe('logger', () => {
    _mocha.it('should represent a logger instance', () => {
        _chai.expect(_logger).to.be.an.instanceOf(_Bunyan);
    });

    _mocha.it('should produce bunyan log records', () => {
        const beginTime = Date.now(),
            output = _testConsole.stdout.inspectSync(() => {
                _logger.info('This is a test info message');
                _logger.warn('This is a test warn message');
                _logger.error('This is a test error message');
                _logger.fatal('This is a test fatal message');
            }),

            endTime = Date.now();

        _chai.expect(output.length).to.equal(4);

        {
            const record = JSON.parse(output[0].match(/^(.*?)\n$/u)[1]);

            _chai.expect(record).to.be.an('object');
            _chai.expect(record.hostname).to.equal(_hostname);
            _chai.expect(record.level).to.equal(30);
            _chai.expect(record.msg).to.equal('This is a test info message');
            _chai.expect(record.name).to.equal('isotropic');
            _chai.expect(record.pid).to.equal(_process.pid);
            _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
            _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
            _chai.expect(record.v).to.equal(0);
            _chai.expect(Object.keys(record).length).to.equal(7);
        }

        {
            const record = JSON.parse(output[1].match(/^(.*?)\n$/u)[1]);

            _chai.expect(record).to.be.an('object');
            _chai.expect(record.hostname).to.equal(_hostname);
            _chai.expect(record.level).to.equal(40);
            _chai.expect(record.msg).to.equal('This is a test warn message');
            _chai.expect(record.name).to.equal('isotropic');
            _chai.expect(record.pid).to.equal(_process.pid);
            _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
            _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
            _chai.expect(record.v).to.equal(0);
            _chai.expect(Object.keys(record).length).to.equal(7);
        }

        {
            const record = JSON.parse(output[2].match(/^(.*?)\n$/u)[1]);

            _chai.expect(record).to.be.an('object');
            _chai.expect(record.hostname).to.equal(_hostname);
            _chai.expect(record.level).to.equal(50);
            _chai.expect(record.msg).to.equal('This is a test error message');
            _chai.expect(record.name).to.equal('isotropic');
            _chai.expect(record.pid).to.equal(_process.pid);
            _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
            _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
            _chai.expect(record.v).to.equal(0);
            _chai.expect(Object.keys(record).length).to.equal(7);
        }

        {
            const record = JSON.parse(output[3].match(/^(.*?)\n$/u)[1]);

            _chai.expect(record).to.be.an('object');
            _chai.expect(record.hostname).to.equal(_hostname);
            _chai.expect(record.level).to.equal(60);
            _chai.expect(record.msg).to.equal('This is a test fatal message');
            _chai.expect(record.name).to.equal('isotropic');
            _chai.expect(record.pid).to.equal(_process.pid);
            _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
            _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
            _chai.expect(record.v).to.equal(0);
            _chai.expect(Object.keys(record).length).to.equal(7);
        }
    });

    _mocha.it('should produce bunyan log records with custom fields', () => {
        const beginTime = Date.now(),
            output = _testConsole.stdout.inspectSync(() => {
                _logger.info({
                    a: 'a'
                }, 'This is a test info message');
                _logger.warn({
                    b: 'b'
                }, 'This is a test warn message');
                _logger.error({
                    c: 'c'
                }, 'This is a test error message');
                _logger.fatal({
                    d: 'd'
                }, 'This is a test fatal message');
            }),

            endTime = Date.now();

        _chai.expect(output.length).to.equal(4);

        {
            const record = JSON.parse(output[0].match(/^(.*?)\n$/u)[1]);

            _chai.expect(record).to.be.an('object');
            _chai.expect(record.a).to.equal('a');
            _chai.expect(record.hostname).to.equal(_hostname);
            _chai.expect(record.level).to.equal(30);
            _chai.expect(record.msg).to.equal('This is a test info message');
            _chai.expect(record.name).to.equal('isotropic');
            _chai.expect(record.pid).to.equal(_process.pid);
            _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
            _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
            _chai.expect(record.v).to.equal(0);
            _chai.expect(Object.keys(record).length).to.equal(8);
        }

        {
            const record = JSON.parse(output[1].match(/^(.*?)\n$/u)[1]);

            _chai.expect(record).to.be.an('object');
            _chai.expect(record.b).to.equal('b');
            _chai.expect(record.hostname).to.equal(_hostname);
            _chai.expect(record.level).to.equal(40);
            _chai.expect(record.msg).to.equal('This is a test warn message');
            _chai.expect(record.name).to.equal('isotropic');
            _chai.expect(record.pid).to.equal(_process.pid);
            _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
            _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
            _chai.expect(record.v).to.equal(0);
            _chai.expect(Object.keys(record).length).to.equal(8);
        }

        {
            const record = JSON.parse(output[2].match(/^(.*?)\n$/u)[1]);

            _chai.expect(record).to.be.an('object');
            _chai.expect(record.c).to.equal('c');
            _chai.expect(record.hostname).to.equal(_hostname);
            _chai.expect(record.level).to.equal(50);
            _chai.expect(record.msg).to.equal('This is a test error message');
            _chai.expect(record.name).to.equal('isotropic');
            _chai.expect(record.pid).to.equal(_process.pid);
            _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
            _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
            _chai.expect(record.v).to.equal(0);
            _chai.expect(Object.keys(record).length).to.equal(8);
        }

        {
            const record = JSON.parse(output[3].match(/^(.*?)\n$/u)[1]);

            _chai.expect(record).to.be.an('object');
            _chai.expect(record.d).to.equal('d');
            _chai.expect(record.hostname).to.equal(_hostname);
            _chai.expect(record.level).to.equal(60);
            _chai.expect(record.msg).to.equal('This is a test fatal message');
            _chai.expect(record.name).to.equal('isotropic');
            _chai.expect(record.pid).to.equal(_process.pid);
            _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
            _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
            _chai.expect(record.v).to.equal(0);
            _chai.expect(Object.keys(record).length).to.equal(8);
        }
    });

    _mocha.it('should serialize errors', () => {
        const beginTime = Date.now(),
            output = _testConsole.stdout.inspectSync(() => {
                _logger.error({
                    error: _Error({
                        message: 'This is a test error message'
                    })
                }, 'This is a test error message');
            }),

            endTime = Date.now();

        _chai.expect(output.length).to.equal(1);

        {
            const record = JSON.parse(output[0].match(/^(.*?)\n$/u)[1]);

            _chai.expect(record).to.be.an('object');
            _chai.expect(record.error).to.be.an('object');
            _chai.expect(record.error.message).to.equal('This is a test error message');
            _chai.expect(record.error.stack).to.be.an('array');
            _chai.expect(record.hostname).to.equal(_hostname);
            _chai.expect(record.level).to.equal(50);
            _chai.expect(record.msg).to.equal('This is a test error message');
            _chai.expect(record.name).to.equal('isotropic');
            _chai.expect(record.pid).to.equal(_process.pid);
            _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
            _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
            _chai.expect(record.v).to.equal(0);
            _chai.expect(Object.keys(record).length).to.equal(8);
        }
    });

    _mocha.it('should handle non-errors', () => {
        const beginTime = Date.now(),
            output = _testConsole.stdout.inspectSync(() => {
                _logger.error({
                    error: 'This isn\'t as error object'
                }, 'This is a test error message');
                _logger.error({
                    error: {
                        stack: 12345
                    }
                }, 'This is a test error message');
            }),

            endTime = Date.now();

        _chai.expect(output.length).to.equal(2);

        {
            const record = JSON.parse(output[0].match(/^(.*?)\n$/u)[1]);

            _chai.expect(record).to.be.an('object');
            _chai.expect(record.error).to.equal('This isn\'t as error object');
            _chai.expect(record.hostname).to.equal(_hostname);
            _chai.expect(record.level).to.equal(50);
            _chai.expect(record.msg).to.equal('This is a test error message');
            _chai.expect(record.name).to.equal('isotropic');
            _chai.expect(record.pid).to.equal(_process.pid);
            _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
            _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
            _chai.expect(record.v).to.equal(0);
            _chai.expect(Object.keys(record).length).to.equal(8);
        }

        {
            const record = JSON.parse(output[1].match(/^(.*?)\n$/u)[1]);

            _chai.expect(record).to.be.an('object');
            _chai.expect(record.error).to.be.an('object');
            _chai.expect(record.error.stack).to.equal(12345);
            _chai.expect(record.hostname).to.equal(_hostname);
            _chai.expect(record.level).to.equal(50);
            _chai.expect(record.msg).to.equal('This is a test error message');
            _chai.expect(record.name).to.equal('isotropic');
            _chai.expect(record.pid).to.equal(_process.pid);
            _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
            _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
            _chai.expect(record.v).to.equal(0);
            _chai.expect(Object.keys(record).length).to.equal(8);
        }
    });
});

_mocha.describe('logger.task', function () {
    this.timeout(987);

    _mocha.it('should be a method', () => {
        _chai.expect(_logger).has.property('task').that.is.a('function');
    });

    _mocha.it('should log the duration of a task', callbackFunction => {
        const beginTime = Date.now(),
            log = _testConsole.stdout.inspect(),
            task = _logger.task();

        _later(144, () => {
            task.complete();

            const endTime = Date.now();

            log.restore();

            _chai.expect(log.output.length).to.equal(1);

            {
                const record = JSON.parse(log.output[0].match(/^(.*?)\n$/u)[1]);

                _chai.expect(record).to.be.an('object');
                _chai.expect(record.duration).to.be.a('number');
                _chai.expect(record.duration).to.be.closeTo(endTime - beginTime, 500);
                _chai.expect(record.durationString).to.be.a('string');
                _chai.expect(record.hostname).to.equal(_hostname);
                _chai.expect(record.level).to.equal(30);
                _chai.expect(record.msg).to.equal('Done');
                _chai.expect(record.name).to.equal('isotropic');
                _chai.expect(record.pid).to.equal(_process.pid);
                _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
                _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
                _chai.expect(record.v).to.equal(0);
                _chai.expect(Object.keys(record).length).to.equal(9);
            }

            callbackFunction();
        });
    });

    _mocha.it('should log the beginning and ending of a task with a description', callbackFunction => {
        const beginTime = Date.now(),
            log = _testConsole.stdout.inspect(),
            task = _logger.task('Testing task');

        _later(144, () => {
            task.complete();

            const endTime = Date.now();

            log.restore();

            _chai.expect(log.output.length).to.equal(2);

            {
                const record = JSON.parse(log.output[0].match(/^(.*?)\n$/u)[1]);

                _chai.expect(record).to.be.an('object');
                _chai.expect(record.hostname).to.equal(_hostname);
                _chai.expect(record.level).to.equal(30);
                _chai.expect(record.msg).to.equal('Testing task');
                _chai.expect(record.name).to.equal('isotropic');
                _chai.expect(record.pid).to.equal(_process.pid);
                _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
                _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
                _chai.expect(record.v).to.equal(0);
                _chai.expect(Object.keys(record).length).to.equal(7);
            }

            {
                const record = JSON.parse(log.output[1].match(/^(.*?)\n$/u)[1]);

                _chai.expect(record).to.be.an('object');
                _chai.expect(record.duration).to.be.a('number');
                _chai.expect(record.duration).to.be.closeTo(endTime - beginTime, 500);
                _chai.expect(record.durationString).to.be.a('string');
                _chai.expect(record.hostname).to.equal(_hostname);
                _chai.expect(record.level).to.equal(30);
                _chai.expect(record.msg).to.equal('Done testing task');
                _chai.expect(record.name).to.equal('isotropic');
                _chai.expect(record.pid).to.equal(_process.pid);
                _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
                _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
                _chai.expect(record.v).to.equal(0);
                _chai.expect(Object.keys(record).length).to.equal(9);
            }

            callbackFunction();
        });
    });

    _mocha.it('should log data at the beginning of a task', callbackFunction => {
        const beginTime = Date.now(),
            log = _testConsole.stdout.inspect(),
            task = _logger.task({
                data: 'data'
            }, 'Testing task');

        _later(144, () => {
            task.complete();

            const endTime = Date.now();

            log.restore();

            _chai.expect(log.output.length).to.equal(2);

            {
                const record = JSON.parse(log.output[0].match(/^(.*?)\n$/u)[1]);

                _chai.expect(record).to.be.an('object');
                _chai.expect(record.data).to.equal('data');
                _chai.expect(record.hostname).to.equal(_hostname);
                _chai.expect(record.level).to.equal(30);
                _chai.expect(record.msg).to.equal('Testing task');
                _chai.expect(record.name).to.equal('isotropic');
                _chai.expect(record.pid).to.equal(_process.pid);
                _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
                _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
                _chai.expect(record.v).to.equal(0);
                _chai.expect(Object.keys(record).length).to.equal(8);
            }

            {
                const record = JSON.parse(log.output[1].match(/^(.*?)\n$/u)[1]);

                _chai.expect(record).to.be.an('object');
                _chai.expect(record.duration).to.be.a('number');
                _chai.expect(record.duration).to.be.closeTo(endTime - beginTime, 500);
                _chai.expect(record.durationString).to.be.a('string');
                _chai.expect(record.hostname).to.equal(_hostname);
                _chai.expect(record.level).to.equal(30);
                _chai.expect(record.msg).to.equal('Done testing task');
                _chai.expect(record.name).to.equal('isotropic');
                _chai.expect(record.pid).to.equal(_process.pid);
                _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
                _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
                _chai.expect(record.v).to.equal(0);
                _chai.expect(Object.keys(record).length).to.equal(9);
            }

            callbackFunction();
        });
    });

    _mocha.it('should log data at the end of a task', callbackFunction => {
        const beginTime = Date.now(),
            log = _testConsole.stdout.inspect(),
            task = _logger.task('Testing task');

        _later(144, () => {
            task.complete({
                data: 'data'
            });

            const endTime = Date.now();

            log.restore();

            _chai.expect(log.output.length).to.equal(2);

            {
                const record = JSON.parse(log.output[0].match(/^(.*?)\n$/u)[1]);

                _chai.expect(record).to.be.an('object');
                _chai.expect(record.hostname).to.equal(_hostname);
                _chai.expect(record.level).to.equal(30);
                _chai.expect(record.msg).to.equal('Testing task');
                _chai.expect(record.name).to.equal('isotropic');
                _chai.expect(record.pid).to.equal(_process.pid);
                _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
                _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
                _chai.expect(record.v).to.equal(0);
                _chai.expect(Object.keys(record).length).to.equal(7);
            }

            {
                const record = JSON.parse(log.output[1].match(/^(.*?)\n$/u)[1]);

                _chai.expect(record).to.be.an('object');
                _chai.expect(record.data).to.equal('data');
                _chai.expect(record.duration).to.be.a('number');
                _chai.expect(record.duration).to.be.closeTo(endTime - beginTime, 500);
                _chai.expect(record.durationString).to.be.a('string');
                _chai.expect(record.hostname).to.equal(_hostname);
                _chai.expect(record.level).to.equal(30);
                _chai.expect(record.msg).to.equal('Done testing task');
                _chai.expect(record.name).to.equal('isotropic');
                _chai.expect(record.pid).to.equal(_process.pid);
                _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
                _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
                _chai.expect(record.v).to.equal(0);
                _chai.expect(Object.keys(record).length).to.equal(10);
            }

            callbackFunction();
        });
    });

    _mocha.it('should allow a different ending description', callbackFunction => {
        const beginTime = Date.now(),
            log = _testConsole.stdout.inspect(),
            task = _logger.task('Testing task');

        _later(144, () => {
            task.complete('Different description');

            const endTime = Date.now();

            log.restore();

            _chai.expect(log.output.length).to.equal(2);

            {
                const record = JSON.parse(log.output[0].match(/^(.*?)\n$/u)[1]);

                _chai.expect(record).to.be.an('object');
                _chai.expect(record.hostname).to.equal(_hostname);
                _chai.expect(record.level).to.equal(30);
                _chai.expect(record.msg).to.equal('Testing task');
                _chai.expect(record.name).to.equal('isotropic');
                _chai.expect(record.pid).to.equal(_process.pid);
                _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
                _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
                _chai.expect(record.v).to.equal(0);
                _chai.expect(Object.keys(record).length).to.equal(7);
            }

            {
                const record = JSON.parse(log.output[1].match(/^(.*?)\n$/u)[1]);

                _chai.expect(record).to.be.an('object');
                _chai.expect(record.duration).to.be.a('number');
                _chai.expect(record.duration).to.be.closeTo(endTime - beginTime, 500);
                _chai.expect(record.durationString).to.be.a('string');
                _chai.expect(record.hostname).to.equal(_hostname);
                _chai.expect(record.level).to.equal(30);
                _chai.expect(record.msg).to.equal('Different description');
                _chai.expect(record.name).to.equal('isotropic');
                _chai.expect(record.pid).to.equal(_process.pid);
                _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
                _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
                _chai.expect(record.v).to.equal(0);
                _chai.expect(Object.keys(record).length).to.equal(9);
            }

            callbackFunction();
        });
    });

    _mocha.it('should log a failed task', callbackFunction => {
        const beginTime = Date.now(),
            log = _testConsole.stdout.inspect(),
            task = _logger.task();

        _later(144, () => {
            task.error();

            const endTime = Date.now();

            log.restore();

            _chai.expect(log.output.length).to.equal(1);

            {
                const record = JSON.parse(log.output[0].match(/^(.*?)\n$/u)[1]);

                _chai.expect(record).to.be.an('object');
                _chai.expect(record.duration).to.be.a('number');
                _chai.expect(record.duration).to.be.closeTo(endTime - beginTime, 500);
                _chai.expect(record.durationString).to.be.a('string');
                _chai.expect(record.hostname).to.equal(_hostname);
                _chai.expect(record.level).to.equal(50);
                _chai.expect(record.msg).to.equal('Error');
                _chai.expect(record.name).to.equal('isotropic');
                _chai.expect(record.pid).to.equal(_process.pid);
                _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
                _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
                _chai.expect(record.v).to.equal(0);
                _chai.expect(Object.keys(record).length).to.equal(9);
            }

            callbackFunction();
        });
    });

    _mocha.it('should log the beginning and ending of a failed task with a description', callbackFunction => {
        const beginTime = Date.now(),
            log = _testConsole.stdout.inspect(),
            task = _logger.task('Testing task');

        _later(144, () => {
            task.error();

            const endTime = Date.now();

            log.restore();

            _chai.expect(log.output.length).to.equal(2);

            {
                const record = JSON.parse(log.output[0].match(/^(.*?)\n$/u)[1]);

                _chai.expect(record).to.be.an('object');
                _chai.expect(record.hostname).to.equal(_hostname);
                _chai.expect(record.level).to.equal(30);
                _chai.expect(record.msg).to.equal('Testing task');
                _chai.expect(record.name).to.equal('isotropic');
                _chai.expect(record.pid).to.equal(_process.pid);
                _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
                _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
                _chai.expect(record.v).to.equal(0);
                _chai.expect(Object.keys(record).length).to.equal(7);
            }

            {
                const record = JSON.parse(log.output[1].match(/^(.*?)\n$/u)[1]);

                _chai.expect(record).to.be.an('object');
                _chai.expect(record.duration).to.be.a('number');
                _chai.expect(record.duration).to.be.closeTo(endTime - beginTime, 500);
                _chai.expect(record.durationString).to.be.a('string');
                _chai.expect(record.hostname).to.equal(_hostname);
                _chai.expect(record.level).to.equal(50);
                _chai.expect(record.msg).to.equal('Error testing task');
                _chai.expect(record.name).to.equal('isotropic');
                _chai.expect(record.pid).to.equal(_process.pid);
                _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
                _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
                _chai.expect(record.v).to.equal(0);
                _chai.expect(Object.keys(record).length).to.equal(9);
            }

            callbackFunction();
        });
    });

    _mocha.it('should log data at the end of a failed task', callbackFunction => {
        const beginTime = Date.now(),
            log = _testConsole.stdout.inspect(),
            task = _logger.task('Testing task');

        _later(144, () => {
            task.error({
                error: _Error({
                    message: 'Error testing task'
                })
            });

            const endTime = Date.now();

            log.restore();

            _chai.expect(log.output.length).to.equal(2);

            {
                const record = JSON.parse(log.output[0].match(/^(.*?)\n$/u)[1]);

                _chai.expect(record).to.be.an('object');
                _chai.expect(record.hostname).to.equal(_hostname);
                _chai.expect(record.level).to.equal(30);
                _chai.expect(record.msg).to.equal('Testing task');
                _chai.expect(record.name).to.equal('isotropic');
                _chai.expect(record.pid).to.equal(_process.pid);
                _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
                _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
                _chai.expect(record.v).to.equal(0);
                _chai.expect(Object.keys(record).length).to.equal(7);
            }

            {
                const record = JSON.parse(log.output[1].match(/^(.*?)\n$/u)[1]);

                _chai.expect(record).to.be.an('object');
                _chai.expect(record.duration).to.be.a('number');
                _chai.expect(record.duration).to.be.closeTo(endTime - beginTime, 500);
                _chai.expect(record.durationString).to.be.a('string');
                _chai.expect(record.error).to.be.an('object');
                _chai.expect(record.hostname).to.equal(_hostname);
                _chai.expect(record.level).to.equal(50);
                _chai.expect(record.msg).to.equal('Error testing task');
                _chai.expect(record.name).to.equal('isotropic');
                _chai.expect(record.pid).to.equal(_process.pid);
                _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
                _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
                _chai.expect(record.v).to.equal(0);
                _chai.expect(Object.keys(record).length).to.equal(10);
            }

            callbackFunction();
        });
    });

    _mocha.it('should allow a different ending description for a failed task', callbackFunction => {
        const beginTime = Date.now(),
            log = _testConsole.stdout.inspect(),
            task = _logger.task('Testing task');

        _later(144, () => {
            task.error('Different description');

            const endTime = Date.now();

            log.restore();

            _chai.expect(log.output.length).to.equal(2);

            {
                const record = JSON.parse(log.output[0].match(/^(.*?)\n$/u)[1]);

                _chai.expect(record).to.be.an('object');
                _chai.expect(record.hostname).to.equal(_hostname);
                _chai.expect(record.level).to.equal(30);
                _chai.expect(record.msg).to.equal('Testing task');
                _chai.expect(record.name).to.equal('isotropic');
                _chai.expect(record.pid).to.equal(_process.pid);
                _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
                _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
                _chai.expect(record.v).to.equal(0);
                _chai.expect(Object.keys(record).length).to.equal(7);
            }

            {
                const record = JSON.parse(log.output[1].match(/^(.*?)\n$/u)[1]);

                _chai.expect(record).to.be.an('object');
                _chai.expect(record.duration).to.be.a('number');
                _chai.expect(record.duration).to.be.closeTo(endTime - beginTime, 500);
                _chai.expect(record.durationString).to.be.a('string');
                _chai.expect(record.hostname).to.equal(_hostname);
                _chai.expect(record.level).to.equal(50);
                _chai.expect(record.msg).to.equal('Different description');
                _chai.expect(record.name).to.equal('isotropic');
                _chai.expect(record.pid).to.equal(_process.pid);
                _chai.expect(new Date(record.time).getTime() >= beginTime).to.be.true;
                _chai.expect(new Date(record.time).getTime() <= endTime).to.be.true;
                _chai.expect(record.v).to.equal(0);
                _chai.expect(Object.keys(record).length).to.equal(9);
            }

            callbackFunction();
        });
    });
});
