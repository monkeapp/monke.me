import Big from 'big.js';
import decode from 'entity-decode';
import prettyNum, {PRECISION_SETTING, ROUNDING_MODE} from 'pretty-num';
import stripZeros from 'pretty-num/src/strip-zeros';
import fromExponential from 'from-exponential';


/**
 * @param {number,string,Big} num
 * @param {number} power
 * @return {string}
 */
export function convertToPower(num, power) {
    const pow = new Big(10).pow(power);

    return new Big(num).times(pow).round().toFixed();
}

/**
 * @param {number,string,Big} num
 * @param {number} power
 * @return {string}
 */
export function convertFromPower(num, power) {
    const pow = new Big(10).pow(power);

    return new Big(num).div(pow).toFixed();
}


/**
 * @param {string|number} value
 * @param {ROUNDING_MODE} [roundingMode]
 * @return {string}
 */
export function pretty(value, roundingMode) {
    const PRECISION = 2;
    if (value >= 1 || value <= -1 || Number(value) === 0) {
        return decode(prettyNum(value, {precision: PRECISION, precisionSetting: PRECISION_SETTING.FIXED, roundingMode, thousandsSeparator: '&#x202F;'}));
    } else {
        value = decode(prettyNum(value, {precision: PRECISION, precisionSetting: PRECISION_SETTING.REDUCE_SIGNIFICANT, roundingMode, thousandsSeparator: '&#x202F;'}));
        value = value.substr(0, 10);
        if (value === '0.00000000') {
            return '0.00';
        }
        return value;
    }
}


// support
export let support = {};
support.passiveListener = (function() {
    let supportsPassive = false;
    try {
        let opts = Object.defineProperty({}, 'passive', {
            /* eslint-disable-next-line getter-return */
            get: function() {
                supportsPassive = true;
            },
        });
        window.addEventListener('testPassiveListener', null, opts);
    } catch (e) {}
    return supportsPassive;
})();


/**
 * Make function to accept imask values
 * @param {string} propName
 * @param {boolean} [isAcceptUnmasked]
 * @return {Function}
 */
export function makeAccepter(propName, isAcceptUnmasked) {
    return function(e) {
        this.form[propName] = isAcceptUnmasked ? e.detail._unmaskedValue : e.detail._value;
    };
}
