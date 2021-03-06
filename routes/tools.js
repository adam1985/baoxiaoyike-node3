
var tools_ = {};
tools_.each = function( obj, callback, args ) {
    var name,
        i = 0,
        length = obj.length,
        isObj = length === undefined || goog.isFunction( obj );

    if ( args ) {
        if ( isObj ) {
            for ( name in obj ) {
                if ( callback.apply( obj[ name ], args ) === false ) {
                    break;
                }
            }
        } else {
            for ( ; i < length; ) {
                if ( callback.apply( obj[ i++ ], args ) === false ) {
                    break;
                }
            }
        }

        // A special, fast, case for the most common use of each
    } else {
        if ( isObj ) {
            for ( name in obj ) {
                if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
                    break;
                }
            }
        } else {
            for ( ; i < length; ) {
                if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
                    break;
                }
            }
        }
    }

    return obj;
};

/**
 * 模拟jQuery.extend方法
 * @param arg 源数据
 * @param dft 新数据
 * @param cover 是否覆盖
 * @returns {object}
 */
tools_.extend = function (arg, dft, cover) {
    for (var key in dft) {
        if ( cover ) {
            arg[key] = dft[key];
        } else {
            if (typeof arg[key] == 'undefined') {
                arg[key] = dft[key];
            }
        }

    }
    return arg;
};

module.exports = tools_;