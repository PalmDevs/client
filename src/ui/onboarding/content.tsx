import type { SharedValue } from 'react-native-reanimated';
import { useSettingsStore } from '@api/storage';
import { Reanimated } from '@api/metro/common';


const { default: { View } } = Reanimated;

export default function Content({ instance, opacity }: { instance: any, opacity: SharedValue<number>; }) {
	const settings = useSettingsStore('unbound');
	const completed = settings.get('onboarding.completed', false);

	return !completed && (
		<View style={{ opacity, height: '100%' }}>
			{instance}
		</View>
	);
}