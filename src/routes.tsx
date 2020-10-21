import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const { Navigator, Screen } = createStackNavigator();

import OrphanagesMap from './pages/OrphanagesMap';
import OrphanagesDetails from './pages/OrphanagesDetails';

import OrphanageData from './pages/CreateOrphanage/OrphanageData';
import SelectMapPosition from './pages/CreateOrphanage/SelectMapPosition';
import Headers from './components/Headers';

export default function Routes() {
    return (
        <NavigationContainer>
            <Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#f2f3f5' } }}>
                <Screen name="OrphanagesMap" component={OrphanagesMap} />
                <Screen name="OrphanagesDetails" component={OrphanagesDetails} options={{
                    headerShown: true,
                    header: () => <Headers showCancel={false} title="Orfanato" />
                }} />
                <Screen name="OrphanageData" component={OrphanageData} options={{
                    headerShown: true,
                    header: () => <Headers title="Dados do Orfanato" />
                }} />
                <Screen name="SelectMapPosition" component={SelectMapPosition}
                    options={{
                        headerShown: true,
                        header: () => <Headers title="Selecione no mapa" />
                    }} />
            </Navigator>
        </NavigationContainer>
    );
};