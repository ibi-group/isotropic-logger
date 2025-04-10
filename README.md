# isotropic-logger

[![npm version](https://img.shields.io/npm/v/isotropic-logger.svg)](https://www.npmjs.com/package/isotropic-logger)
[![License](https://img.shields.io/npm/l/isotropic-logger.svg)](https://github.com/ibi-group/isotropic-logger/blob/main/LICENSE)
![](https://img.shields.io/badge/tests-passing-brightgreen.svg)
![](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

A pre-configured Bunyan logger instance with enhanced error serialization and task duration tracking.

Isotropic relies upon [bunyan](https://github.com/trentm/node-bunyan) for JSON logging.

## Why Use This?

- **Singleton Logger**: Import once, use everywhere in your application
- **Structured Logging**: JSON-formatted logs for easy parsing and analysis
- **Enhanced Error Handling**: Proper serialization of error objects with stack traces
- **Task Tracking**: Built-in task logging with duration measurements
- **Consistent Format**: Standardized log format across your application

## Installation

```bash
npm install isotropic-logger
```

## Usage

```javascript
import _Error from 'isotropic-error';
import _logger from 'isotropic-logger';

// Basic logging
_logger.info('Application started');
_logger.warn('Configuration missing, using defaults');
_logger.error('Failed to connect to database');

// Logging with additional data
_logger.info({
    action: 'login',
    userId: 123
}, 'User logged in');

// Logging errors
try {
    // Some code that might throw
    throw _Error({
        message: 'Something went wrong'
    });
} catch (error) {
    logger.error({
        error
    }, 'Error during operation');
}
```

## Log Levels

The logger supports Bunyan's standard log levels:

| Method | Level |
|--------|-------|
| `logger.trace()` | 10 |
| `logger.debug()` | 20 |
| `logger.info()` | 30 |
| `logger.warn()` | 40 |
| `logger.error()` | 50 |
| `logger.fatal()` | 60 |

## Task Logging

The module provides a special `task()` method for logging the start and completion of operations with duration tracking:

```javascript
import _logger from 'isotropic-logger';

{
    // Start a task
    const task = _logger.task('Processing files');

    // Do some work...
    // ...

    // Complete the task successfully
    task.complete();
    // Logs: "Done processing files" with duration info

    // Or if the task failed
    task.error();
    // Logs: "Error processing files" with duration info
}
```

### Task API

#### logger.task([data], [description])

Begins tracking a task and optionally logs the start of the task.

- `data` (Object, optional): Additional data to include in the log entry
- `description` (String, optional): Description of the task

Returns an object with the following methods:

- `complete([data], [description])`: Logs successful completion of the task with duration
- `error([data], [description])`: Logs failure of the task with duration

### Task Examples

```javascript
{
    // Basic task with start and end logging
    const task = _logger.task('Importing data');

    importData()
        .then(() => task.complete())
        .catch(error => task.error({
            error
        }));
}

{
    // Task with custom complete message
    const task = _logger.task('Starting backup');
    backup()
        .then(result => backupTask.complete({
            size: result.size
        }, 'Backup completed successfully'))
        .catch(error => backupTask.error({
            error
        }, 'Backup failed'));
}

{
    // Task with additional data
    const userId = 123,
        userTask = logger.task({
            userId
        }, 'Processing user data');

    processUser(userId)
        .then(result => userTask.complete({
            changedFields: result.changes,
            userId
        }))
        .catch(error => userTask.error({
            error,
            userId
        }));
}
```

## Error Serialization

The logger automatically serializes error objects for better readability:

```javascript
import _Error from 'isotropic-error';
import _logger from 'isotropic-logger';

// Regular Error objects
try {
    throw _Error({
        message: 'Something failed'
    });
} catch (error) {
    _logger.error({
        error
    }, 'Operation failed');
}

// isotropic-error objects with nested errors
try {
    throw _Error({
        message: 'Network timeout'
    });
} catch (error) {
    _logger.error({
        error: _Error({
            error,
            message: 'Database connection failed'
        })
    }, 'Cannot initialize system');
}
```

The error serializer extracts:

- Error message
- Error name
- Stack trace (formatted as an array of lines)
- Error code (if available)
- Signal (if available)
- Details object (from isotropic-error)

## Async/Await Example

```javascript
import _logger from 'isotropic-logger';

const _processItems = async items => {
    const task = _logger.task({
        count: items.length
    }, 'Processing items');

  try {
        for (const item of items) {
            _logger.debug({
                itemId: item.id
            }, 'Processing item');

            await processItem(item);
        }

        task.complete({
            processedCount: items.length
        });

        return true;
    } catch (error) {
        task.error({
            error
        });

        return false;
    }
}
```

## Express Middleware Example

```javascript
import _express from 'express';
import _logger from 'isotropic-logger';

const app = express();

// Request logging middleware
app.use((req, res, next) => {
    const originalEnd = res.end,
        task = _logger.task({
            ip: req.ip,
            method: req.method,
            url: req.url
        }, 'HTTP Request');

    // Store task in request for later use
    req.task = task;

    res.end = function (...args) {
        // Restore original end
        res.end = originalEnd;

        const responseTime = Date.now() - req._startTime;

        // Log task completion with status code
        if (res.statusCode >= 400) {
            task.error({
                responseTime,
                statusCode: res.statusCode
            });
        } else {
            task.complete({
                responseTime,
                statusCode: res.statusCode
            });
        }

        return Reflect.apply(originalEnd, this, args);
    };

    // Set start time and continue
    req._startTime = Date.now();
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (req.task) {
        req.task.error({
            error: err
        });
    } else {
        logger.error({
            error: err,
            method: req.method,
            url: req.url
        }, 'Unhandled error in request');
    }

    res.status(500).json({
        error: 'Internal Server Error'
    });
});
```

## Log Output Format

The log output is JSON-formatted for easy parsing:

```json
{
    "hostname": "server-name",
    "level": 30,
    "msg": "Application started",
    "name": "isotropic",
    "pid": 12345,
    "time": "2023-06-15T12:34:56.789Z",
    "v": 0
}
```

For tasks with duration tracking:

```json
{
    "duration": 1234,
    "durationString": "1.234 seconds",
    "hostname": "server-name",
    "level": 30,
    "msg": "Done processing files",
    "name": "isotropic",
    "pid": 12345,
    "time": "2023-06-15T12:34:56.789Z",
    "v": 0
}
```

## Contributing

Please refer to [CONTRIBUTING.md](https://github.com/ibi-group/isotropic-logger/blob/main/CONTRIBUTING.md) for contribution guidelines.

## Issues

If you encounter any issues, please file them at https://github.com/ibi-group/isotropic-logger/issues
