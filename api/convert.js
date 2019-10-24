import axios from 'axios';
import {CONVERT_API_URL} from "~/assets/variables";
import {convertToPower, convertFromPower} from '~/assets/utils';

const instance = axios.create({
    baseURL: CONVERT_API_URL,
});

export default instance;

const decimalDigits = 4;


/**
 * @typedef {Object} PriceData
 * @property {number} price
 * @property {number} delta
 * @property {timestamp|string} next_update
 */

/**
 *
 * @return {Promise<PriceData>}
 */
export function getPrice() {
    return instance.get('price')
        .then((response) => {
            response.data.data.price = convertFromPower(response.data.data.price, decimalDigits);
            response.data.data.btc_price = convertFromPower(response.data.data.btc_price, decimalDigits);
            return response.data.data;
        });
}


