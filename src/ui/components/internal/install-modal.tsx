import { Constants, ReactNative as RN, StyleSheet, Theme, Clipboard } from '@metro/common';
import type { Manager } from '@typings/managers';
import { Redesign } from '@metro/components';
import { showAlert } from '@api/dialogs';
import { capitalize } from '@utilities';
import { showToast } from '@api/toasts';
import * as managers from '@managers';
import { useSettingsStore } from '@api/storage';
import { Strings } from '@api/i18n';
import { Icons } from '@api/assets';
import { Links } from '@constants';

interface InstallModalProps {
	type: Manager;
	ref: ReturnType<typeof React.useRef<InstanceType<typeof InternalInstallInput>>>;
}

type InternalInstallModalProps = InstallModalProps & {
	settings: ReturnType<typeof useSettingsStore>;
};

export class InternalInstallInput extends React.PureComponent<InternalInstallModalProps> {
	controller = new AbortController();
	state = { url: '', loadingPaste: false, loadingInstall: false, message: null };

	get manager() {
		return managers[this.props.type];
	}

	render() {
		return <>
			{this.renderInput()}
			{this.renderButtons()}
		</>;
	}

	renderInput() {
		const { message } = this.state;
		const { settings } = this.props;

		return <RN.View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
			<RN.View style={{ flex: 1, flexGrow: 1 }}>
				<Redesign.TextInput
					isRound
					isClearable
					size={'md'}
					onChange={url => this.setState({ url })}
					onClear={() => this.setState({ error: false, message: null })}
					value={this.state.url}
					placeholder={`https://${this.manager.type}.com/manifest.json`}
					placeholderTextColor={Theme.unsafe_rawColors.PRIMARY_400}
					status={message ? 'error' : 'default'}
					errorMessage={message || undefined}
				/>
			</RN.View>

			<Redesign.IconButton
				icon={Icons['ClipboardListIcon']}
				style={{ marginLeft: 8 }}
				variant={'secondary-input'}
				size={'md'}
				loading={this.state.loadingPaste}
				onPress={() => {
					if (settings.get('onboarding.install', false)) {
						this.setState({ url: Links.OnboardingPlugin });
						return;
					}

					this.setState({ loadingPaste: true });

					Clipboard.getString().then(url => {
						this.setState({ url, loadingPaste: false });
					});
				}}
			/>
		</RN.View>;
	}

	renderButtons() {
		const { url } = this.state;
		const { settings } = this.props;

		return <>
			<Redesign.Button
				text={Strings.UNBOUND_INSTALL}
				style={{ marginTop: 18 }}
				loading={this.state.loadingInstall}
				onPress={() => {
					if (url) {
						this.setState({ loadingInstall: true });

						(this.manager).install(url, (state) => this.setState(state), this.controller.signal)
							.then(() => {
								this.setState({ loadingInstall: false });

								if (settings.get('onboarding.install', false)) {
									settings.set('onboarding.install', false);
								}
							});
					}
				}}
			/>
			<Redesign.Button
				text={Strings.CANCEL}
				style={{ marginTop: 12 }}
				onPress={() => {
					Redesign.dismissAlerts();

					if (this.state.loadingInstall) {
						this.controller.abort();

						showToast({
							title: this.manager.name,
							content: Strings.UNBOUND_INSTALL_CANCELLED.format({ type: capitalize(this.manager.type) }),
							icon: 'CloseLargeIcon'
						});
					}
				}}
				variant={'secondary'}
			/>
		</>;
	}

	getInput() {
		return this.state.url;
	}
}

function InstallInput(props: InstallModalProps) {
	const settings = useSettingsStore('unbound');

	return <InternalInstallInput settings={settings} {...props} />;
}

export function showInstallAlert({ type, ref }: InstallModalProps) {
	const manager = managers[type];

	// This uses a custom button to prevent closing the dialog after failure
	// This is also to use a custom loading state for the async install method
	showAlert({
		title: Strings.UNBOUND_INSTALL_TITLE.format({ type: manager.type }),
		content: Strings.UNBOUND_ADDON_VALID_MANIFEST.format({ type: manager.type }),
		component: (
			<InstallInput
				type={type}
				ref={ref}
			/>
		),
		componentMargin: false,
		cancelButton: false
	});
}

export default { InstallInput, InternalInstallInput };