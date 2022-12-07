import React from "react";
import { NavigationContainerRef } from "@react-navigation/native";
import { NavigationAction, NavigationState } from "@react-navigation/routers";
import { GeneralStackParamList } from "../navigation/type";

export class NavigationService {
	static myInstance: NavigationService;
	isNavigationReady = false;
	navigationRef =
		React.createRef<NavigationContainerRef<GeneralStackParamList>>();

	static getInstance(): NavigationService {
		if (!NavigationService.myInstance) {
			NavigationService.myInstance = new NavigationService();
		}

		return NavigationService.myInstance;
	}

	static navigate<K, T>(name: T, params?: K[T]) {
		if (
			NavigationService.getInstance().isNavigationReady &&
			NavigationService.getInstance().navigationRef.current
		) {
			// Perform navigation if the app has mounted
			NavigationService.getInstance().navigationRef.current?.navigate<T>(
				name,
				params
			);
		} else {
			// You can decide what to do if the app hasn't mounted
			// You can ignore this, or add these actions to a queue you can call later
		}
	}

	static dispatch(
		action:
			| NavigationAction
			| ((state: NavigationState) => NavigationAction)
	) {
		if (
			NavigationService.getInstance().isNavigationReady &&
			NavigationService.getInstance().navigationRef.current
		) {
			NavigationService.getInstance().navigationRef.current?.dispatch(
				action
			);
		}
	}
}
