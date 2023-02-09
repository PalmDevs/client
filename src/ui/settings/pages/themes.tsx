import { React, ReactNative as RN } from '@metro/common';
import { Navigation } from '@metro/components';
import Addons from '../partials/addons';

import Themes from '@managers/themes';

export default () => {
  const navigation = Navigation.useNavigation();

  React.useEffect(() => {
    navigation.setOptions({ headerRight: () => <Add /> });
  }, []);

  return <RN.View style={{ flex: 1 }}>
    <Addons
      type='themes'
      addons={Themes.addons}
    />
  </RN.View>;
};

function Add() {
  return <RN.Text style={{ color: 'white', marginRight: 15 }} onPress={() => console.log('hio')}>
    Add
  </RN.Text>;
}