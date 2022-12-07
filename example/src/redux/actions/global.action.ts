import { GlobalActions } from "../type";

export function setNetworkChange(hasNetwork: boolean) {
	return {
		type: GlobalActions.HasNetwork,
		payload: hasNetwork
	};
}
