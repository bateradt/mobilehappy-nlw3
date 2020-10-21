
import React, { useState, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Feather } from '@expo/vector-icons';
import { AppLoading } from 'expo';

import mapMarker from '../images/map-marker.png';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

interface IOrphanage {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
}

export default function OrphanagesMap() {
    const [orphanages, setOrphanages] = useState<IOrphanage[]>([]);
    const navigation = useNavigation();
    const [initialPosition, setInitialPosition] = useState<[number, number]>([
        0,
        0,
    ]);

    useFocusEffect(() => {
        api.get('orphanages').then(response => {
            setOrphanages(response.data);
        });
    });

    useEffect(() => {
        async function getLocation() {
            const { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;
                setInitialPosition([latitude, longitude]);
            }
        }

        getLocation();

    }, []);

    function handleNavigateToOrphanagesDetails(id: number) {
        navigation.navigate('OrphanagesDetails', { id });
    }

    function handleNavigateToCreateOrphanage() {
        navigation.navigate('SelectMapPosition');
    }

    if (initialPosition[0] === 0 && initialPosition[1] === 0) {
        // console.log('initialPosition[0]', initialPosition[0]);
        // console.log('initialPosition[1]', initialPosition[1]);

        // console.log('carrregando...');
        return <AppLoading />;
    } else {
        // console.log('carregou');
        // console.log(initialPosition[0]);
        // console.log(initialPosition[1]);
        return (
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: initialPosition[0],
                        longitude: initialPosition[1],
                        latitudeDelta: 0.008,
                        longitudeDelta: 0.008,
                    }}>

                    {orphanages.map(orphanage => {
                        return (
                            <Marker
                                key={orphanage.id}
                                icon={mapMarker}
                                coordinate={{
                                    latitude: orphanage.latitude,
                                    longitude: orphanage.longitude,
                                }}
                                calloutAnchor={{ x: 2.7, y: 0.8 }}
                            >
                                <Callout
                                    tooltip={true}
                                    onPress={() => handleNavigateToOrphanagesDetails(orphanage.id)}
                                >
                                    <View style={styles.calloutContainer}>
                                        <Text style={styles.calloutText}>{orphanage.name}</Text>
                                    </View>
                                </Callout>
                            </Marker>
                        );
                    })}

                </MapView>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        {orphanages.length} orfanatos encontrados
            </Text>
                    <RectButton style={styles.createOprhanageButton} onPress={handleNavigateToCreateOrphanage}>
                        <Feather name="plus" size={20} color="#fff" />
                    </RectButton>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121214',
    },

    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },

    calloutContainer: {
        width: 160,
        height: 46,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 12,
        justifyContent: 'center',
    },

    calloutText: {
        fontFamily: 'Nunito_700Bold',
        color: '#0089a5',
        fontSize: 14,
    },

    footer: {
        position: "absolute",
        left: 24,
        right: 24,
        bottom: 32,

        backgroundColor: '#fff',
        borderRadius: 20,
        height: 56,
        paddingLeft: 24,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        elevation: 3, // gera uma sombra no objeto
    },

    footerText: {
        fontFamily: 'Nunito_700Bold',
        color: '#8fa7b3',
    },

    createOprhanageButton: {
        width: 56,
        height: 56,
        backgroundColor: '#15c3d6',
        borderRadius: 20,

        justifyContent: 'center',
        alignItems: 'center',

    }

});
