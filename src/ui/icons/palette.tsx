import { Theme, StyleSheet } from '@metro/common';
import { SVG } from '@metro/components';
import { React } from '@metro/common';

const styles = StyleSheet.createThemedStyleSheet({
	icon: {
		color: Theme.colors.INTERACTIVE_NORMAL,
		opacity: 0.6,
		marginLeft: 0.5
	}
});

export default function ({ height, width, color = styles.icon.color, ...rest }) {
	return <SVG.Svg viewBox='0 0 24 24' style={{ height, width, ...styles.icon, color }} fill='currentColor' {...rest}>
		<SVG.Path d='M0 0h24v24H0z' fill='none' />
		<SVG.Path d='M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z' />
	</SVG.Svg>;
}