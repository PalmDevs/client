import { Asset } from '@typings/api/assets';
import { findByProps } from '@metro';
import Patcher from '@patcher';
import { createLogger } from '@logger';

export const assets = new Set<Asset>();
export const registry = findByProps('registerAsset');

const Logger = createLogger('Assets');

function initialize() {
	Patcher.after('unbound-assets', registry, 'registerAsset', (_, [asset]: [Asset], id: number) => {
		Object.assign(asset, { id });
		assets.add(asset);
	});

	// Capture all assets that loaded before our patch
	for (let id = 1; ; id++) {
		const asset: Asset | undefined = registry.getAssetByID(id);
		if (!asset) break;

		if (assets.has(asset)) continue;

		Object.assign(asset, { id });
		assets.add(asset);
	}
}

export function find(filter): Asset | null {
	return Object.values(assets).find(filter as any);
}

export function getByName(name: string, type: 'svg' | 'png' = 'png'): Asset | null {
	return [...assets].find(a => a.name === name && a.type === type);
}

export function getByID(id: number): Asset | null {
	return registry.getAssetByID(id);
}

export function getIDByName(name: string, type: 'svg' | 'png' = 'png'): number | null {
	return getByName(name, type)?.id;
}

export function getAll() {
	return [...assets];
}

export const Icons: Record<any, any> = new Proxy({}, {
	get: (_, name: string) => {
		return getIDByName(name);
	}
});

try {
	initialize();
} catch (e) {
	Logger.error('Failed to initialize assets:', e.message);
}

export default { assets, getByName, getByID, getIDByName };