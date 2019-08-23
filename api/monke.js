import axios from 'axios';
import {MONKE_API_URL} from "~/assets/variables";

const instance = axios.create({
    baseURL: MONKE_API_URL,
});

export default instance;

/**
 *
 * @return {Promise<Transfer>}
 */
export function makeTransfer() {
    return instance.post('transfers')
        .then((response) => response.data.data);
}

/**
*
* @return {Promise<Transfer>}
*/
export function getTransfer(code) {
    return instance.get(`transfers/${code}`)
        .then((response) => response.data.data);
}

/**
 *
 * @return {Promise<Transfer>}
 */
export function getReceiveInfo(code) {
    return instance.get(`transfers/receive/${code}`)
        .then((response) => response.data.data);
}

export function claimReceive(code, address) {
    return instance.put(`transfers/receive/${code}`, {
            output_address: address,
        })
        .then((response) => response.data.data);
}

/**
 * @typedef {{receiver_id_code: string, creator_id_code: string, input_deposit: {network_code: string, address: string}, value: string, status: string}} Transfer
 * */
