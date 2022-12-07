import { NavigationContainer } from "@react-navigation/native";
import React, { Suspense } from "react";
import { View } from "react-native";
import { Colors } from "../assets";

import { NavigationService } from "../services/navigation.service";

const Stack = React.lazy(() => import("./Stack"));

const AppRouter = function (): JSX.Element {
	React.useEffect(() => {
		return () => {
			NavigationService.getInstance().isNavigationReady = false;
		};
	}, []);

	return (
		<NavigationContainer
			ref={NavigationService.getInstance().navigationRef}
			onReady={() => {
				NavigationService.getInstance().isNavigationReady = true;
			}}
			theme={{
				dark: false,
				colors: {
					primary: Colors.primary,
					background: Colors.bgPrimary,
					card: Colors.primary,
					text: Colors.body,
					border: Colors.border,
					notification: Colors.secondary
				}
			}}
		>
			<Suspense fallback={<View />}>
				<Stack />
			</Suspense>
		</NavigationContainer>
	);
};

export default AppRouter;
