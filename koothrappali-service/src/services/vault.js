import * as vaultUtils from '../utils/vaultUtils';

export async function getEC2Price(platform) {
    return vaultUtils.getEC2Price(platform);
}

export async function getRDSPrice(Engine) {
    return vaultUtils.getRDSPrice(Engine);
}