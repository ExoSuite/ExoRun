import React from 'react'
import {View, StyleSheet, Text, Button, TouchableOpacity} from "react-native";
// @ts-ignore
import RNCamera from 'react-native-camera'
import ActionButton from 'react-native-action-button';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';
// @ts-ignore
import Expand from 'react-native-simple-expand';
import Modal from "react-native-modal";
// @ts-ignore
import {RkAvoidKeyboard, RkButton, RkStyleSheet, RkText, RkTextInput, RkTheme} from 'react-native-ui-kitten';
import geolib from 'geolib'
import autobind from 'autobind-decorator'
import Timer = NodeJS.Timer;

export interface Props {
    name: string;
    enthusiasmLevel?: number;
}

interface Checkpoint {
    latitude: number,
    longitude: number,
    altitude: number
}

interface Track {
    id: number,
    name: string,
    description: string,
    checkpoints: Checkpoint[]
}

export default class ExoRun extends React.Component {
    interval: any = 0;
    intervalchrono: any = 0;
    currentLatitude: any = 0;
    currentLongitude: any = 0;
    currentAltitude: any = 0;
    locationError: string = "";
    distance: number = 30000;
    laps: number[] = [];
    checkpoints: Checkpoint[] = [];
    currentCheckpoint = 0;
    registeredTracks: Track[] = [{
        id: 1,
        name: "Nexus run",
        description: "3 checkpoint(s) - Nice (France)",
        checkpoints: [{latitude: 43.6957831, longitude: 7.2699759, altitude: 56.70000076293945},
            {latitude: 43.6958452, longitude: 7.2701865, altitude: 56.70000076293945},
            {latitude: 43.6957831, longitude: 7.2699759, altitude: 56.70000076293945}
        ]
    },
        {
            id: 2,
            name: "Nexus sprint",
            description: "2 checkpoint(s) - Nice (France",
            checkpoints: [{latitude: 43.6958452, longitude: 7.2701865, altitude: 56.70000076293945},
                {latitude: 43.6958452, longitude: 7.2701865, altitude: 56.70000076293945}]
        },
        {
            id: 3,
            name: "Laval run",
            description: "3 checkpoint(s) - Québec (Canada",
            checkpoints: [{latitude: 46.7889443, longitude: -71.2774904, altitude: 56.70000076293945},
                {latitude: 46.7890845, longitude: -71.2776021, altitude: 56.70000076293945},
                {latitude: 46.788935, longitude: -71.2775159, altitude: 56.70000076293945}]
        }];
    currentTrackName: string = "";
    currentTrackDescription: string = "";
    state = {
        screen: screens.MAIN,
        openid: 0,
        stopwatch: null,
        isModalVisible: false,
        timeElasped: 0,
        timerRunning: false,
        startTime: 0,
    };

    /**** CONSTRUCTOR ****/

    constructor(props: Props) {
        super(props);
    }

    /**** MAIN SCREEN ****/

    /*switchToMain() {
        this.setState({screen: screens.MAIN});
    }
*/
    /**** CREATE LAP SCREEN ****/

    @autobind
    _toggleModal() {
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    @autobind
    _createCheckpoint() {
        this.checkpoints.push({
            latitude: this.currentLatitude,
            longitude: this.currentLongitude,
            altitude: this.currentAltitude
        });
        this.setState({});
    }

    @autobind
    _deleteCheckpoint() {
        let array = this.checkpoints;
        let index = this.checkpoints.length - 1;
        if (index >= 0) {
            array.splice(index, 1);
            this.checkpoints = array;
        }
        this.setState({});
    }

    @autobind
    _confirmSaveTrack() {
        if (this.checkpoints.length > 0) {
            this._toggleModal();
            this.currentTrackName = "";
            this.currentTrackDescription = "";
        }
        this.setState({});

    }

    @autobind
    saveTrack() {
        if (this.currentTrackName === null
            || this.currentTrackName === "")
            this.currentTrackName = "No Name";
        if (this.currentTrackDescription === null
            || this.currentTrackDescription === "")
            this.currentTrackDescription = "No Desc";
        this.registeredTracks.push({
            id: this.registeredTracks.length + 1,
            name: this.currentTrackName,
            description: this.currentTrackDescription,
            checkpoints: this.checkpoints,
        });

        this.checkpoints = [];
        this.currentTrackName = "";
        this.currentTrackDescription = "";
        this._toggleModal();
    }

    @autobind
    switchToCreate() {
        this.setState({screen: screens.CREATE, openid: 0});
    }


    showCreationTracks() {
        return <ActionButton buttonColor='#09d819' position="left">
            <ActionButton.Item buttonColor='#ff8c00' title="Créer checkpoint"
                               onPress={this._createCheckpoint}>
                <Icon name="md-play" style={styles.actionButtonIcon}/>
            </ActionButton.Item>
            <ActionButton.Item buttonColor="rgba(231,76,60,1)" title="Supprimer checkpoint"
                               onPress={this._deleteCheckpoint}>
                <Icon name="md-rewind" style={styles.actionButtonIcon}/>
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#3498db' title="Enregistrer parcours"
                               onPress={this._confirmSaveTrack}>
                <Icon name="md-square" style={styles.actionButtonIcon}/>
            </ActionButton.Item>
        </ActionButton>
    }


    createLaps() {
        return this.laps.map((time, idx) => (
            <View key={idx}>
                <Text style={styles.checkpoints}>
                    Lap #{idx + 1} : {time / 1000} s
                </Text>
            </View>
        ));
    }

    /**** RUN SCREEN ****/

    @autobind
    _onLapPress() {
        this.laps.push(this.state.timeElasped);
        this.currentCheckpoint = this.currentCheckpoint + 1;
        this.distance = 5000;
        if (this.currentCheckpoint > this.checkpoints.length - 1) {
            this.setState({
                stopwatch: null,
                timeElasped: null,
                timerRunning: false,
                startTime: null
            });
            clearInterval(this.intervalchrono);
        }
    }

    @autobind
    _onStartPress() {
        // check if clock is running, then stop
        this.setState({
            startTime: new Date(),
        });

        this.currentCheckpoint = 1;
        this.distance = 30000;

        this.intervalchrono = setInterval(() => {
            this.setState({
                // @ts-ignore
                timeElasped: new Date() - this.state.startTime,
                timerRunning: true,
            });
        }, 100);
    }

    distanceToCheckpoint() {
        if (this.distance != null && this.currentCheckpoint === 0) {
            if (this.distance <= 10) {
                return <View>
                    <Button title="go" onPress={this._onStartPress}/>
                    <Text style={styles.checkpoints}>{this.state.timeElasped / 1000} s</Text>
                    <Text style={styles.checkpoints}>{this.distance < 2000 ? this.distance + " m" : "SEARCHING"}</Text>
                </View>
            }
            else {
                return <View>
                    <Text style={styles.checkpoints}>{this.state.timeElasped / 1000} s</Text>
                    <Text style={styles.checkpoints}>{this.distance < 2000 ? this.distance + " m" : "SEARCHING"}</Text>
                </View>
            }
        }
        if (this.distance != null && this.currentCheckpoint > 0) {
            if (this.distance <= 10) {
                this._onLapPress()
                this.distance = 30000;
            }
            return <View>

                <Text style={styles.checkpoints}>{this.state.timeElasped / 1000} s</Text>
                <Text style={styles.checkpoints}>{this.distance < 2000 ? this.distance + " m" : "SEARCHING"}</Text>
            </View>
        }
    }

    showRunTracks() {
        return <View>
            <Text style={styles.upTitle}> {this.currentCheckpoint} / {this.checkpoints.length} CP</Text>
            {this.currentCheckpoint < this.checkpoints.length ? this.distanceToCheckpoint() : null}
            {this.createLaps()}
        </View>
    }

    @autobind
    switchToRun() {
        this.setState({screen: screens.RUN});
        this.currentCheckpoint = 0;
        this.checkpoints = this.registeredTracks[this.state.openid - 1].checkpoints;
        this.laps = [];
    }

    /**** CHOOSE TRACKS SCREEN ****/
    @autobind
    generate(key: any) {

        if (!key)
            return;
        return <View key={key.id}>
            {(key.id === 1) ? <Text style={styles.upTitle}>PARCOURS</Text> : null}
            <TouchableOpacity onPress={() => {
                this.setState({openid: key.id});
            }}>
                <Text style={styles.button}>{key.name}</Text>
            </TouchableOpacity>
            <Expand value={(key.id === this.state.openid)}>
                {
                    (key.id === this.state.openid) ?
                        <View style={styles.row}>
                            <View style={{flex: 0.8, flexDirection: 'row'}}>
                                <Text
                                    style={[styles.buttonexpend, {alignSelf: 'flex-start'}]}> {key.description} </Text>
                            </View>
                            <TouchableOpacity onPress={this.switchToRun} style={{
                                flex: 0.2,
                                flexDirection: 'row',
                                backgroundColor: "#3498db",
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <RkText style={{
                                    fontFamily: 'Cochin',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textAlign: 'center'
                                }}>Run</RkText>
                            </TouchableOpacity>
                        </View>
                        : <Text style={{padding: 10}}> </Text>
                }

            </Expand>
        </View>
    }

    @autobind
    switchToTracklist() {
        this.setState({screen: screens.TRACKLIST});
    }

    @autobind
    showRegisteredTracks() {
        return this.registeredTracks.map(this.generate);
    }

    debug_screen() {

        return <View>
            {(this.state.screen === screens.MAIN) ? <Text style={styles.baseText}>MAIN SCREEN</Text> :
                (this.state.screen === screens.RUN) ? <Text style={styles.baseText}>RUN SCREEN</Text> :
                    (this.state.screen === screens.CREATE) ? <Text style={styles.baseText}>CREATE SCREEN</Text> :
                        (this.state.screen === screens.TRACKLIST) ?
                            <Text style={styles.baseText}>TRACKLIST SCREEN</Text> : null}
            <Text style={styles.baseText}>Current checkpoints: {this.checkpoints.length}</Text>
            <Text style={styles.baseText}>Latitude: {this.currentLatitude}</Text>
            <Text style={styles.baseText}>Longitude: {this.currentLongitude}</Text>
        </View>
    }

    /**** MAIN RENDER LOOP ****/

    updateLoc = async () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.currentLatitude = position.coords.latitude;
                this.currentLongitude = position.coords.longitude;
                this.currentAltitude = position.coords.altitude ? position.coords.altitude : 0;
                if (this.state.screen === screens.RUN) {
                    if (this.currentCheckpoint < this.checkpoints.length) {
                        this.distance = geolib.getDistance(
                            {
                                latitude: this.currentLatitude,
                                longitude: this.currentLongitude
                            },
                            {
                                latitude: this.checkpoints[this.currentCheckpoint].latitude,
                                longitude: this.checkpoints[this.currentCheckpoint].longitude
                            });
                    }
                }
                this.setState({});
            },
            (error) => this.locationError = error.message,
            {enableHighAccuracy: false, timeout: 1500, maximumAge: 0},
        );

    };

    componentDidMount() {
        this.interval = setInterval(() => {

            // noinspection JSIgnoredPromiseFromCall
            this.updateLoc();
        }, 100);

    }

    componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.intervalchrono);
    }

    render() {

        return (
            <View style={{flex: 1}}>
                <RNCamera

                    style={{...StyleSheet.absoluteFillObject}}>
                </RNCamera>
                <ActionButton buttonColor='#09d819'>
                    <ActionButton.Item buttonColor='#9b59b6' title="Vos parcours"
                                       onPress={this.switchToTracklist}>
                        <Icon name="md-archive" style={styles.actionButtonIcon}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Nouveau parcours"
                                       onPress={this.switchToCreate}>
                        <Icon name="md-add-circle" style={styles.actionButtonIcon}/>
                    </ActionButton.Item>
                </ActionButton>

                <Modal isVisible={this.state.isModalVisible}>
                    <View style={styles.modalContent}>
                        <RkTextInput rkType='rounded' placeholder='Nom du parcours'
                                     onChangeText={(text: any) => this.currentTrackName = text}/>
                        <RkTextInput rkType='rounded' placeholder='Description'
                                     onChangeText={(text: any) => this.currentTrackDescription = text}/>
                        <Button title="Sauvegarder" onPress={this.saveTrack}/>
                        <Button title="Annuler" onPress={this._toggleModal}/>
                    </View>
                </Modal>

                {(this.state.screen === screens.TRACKLIST) ? this.showRegisteredTracks() :
                    (this.state.screen === screens.RUN) ? this.showRunTracks() :
                        (this.state.screen === screens.CREATE) ? this.showCreationTracks() : null}

                {this.debug_screen()}


            </View>

        )
    }
}

const styles = StyleSheet.create({
    baseText: {
        fontFamily: 'Cochin',
        color: 'white',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#09d819bb',
        padding: 10,
        fontFamily: 'Cochin',
        color: 'white',
        fontWeight: 'bold',
    },
    upTitle: {
        alignItems: 'center',
        backgroundColor: '#09d819',
        padding: 10,
        fontFamily: 'Cochin',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        justifyContent: 'center'
    },
    checkpoints: {
        alignItems: 'center',
        backgroundColor: '#09d81900',
        padding: 10,
        fontFamily: 'Cochin',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        justifyContent: 'center'
    },
    buttonexpend: {
        alignItems: 'center',
        backgroundColor: '#53d87caa',
        padding: 10,
        fontFamily: 'Cochin',
        color: 'white',
        fontWeight: 'bold',
        flex: 1
    },
    save: {
        marginVertical: 20
    },
    col1: {
        flex: 0.8,
    },
    col2: {
        height: 40
    },
    row: {
        flexDirection: 'row',
        flex: 1
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
});


const screens = {
    MAIN: 0,
    CREATE: 1,
    RUN: 2,
    TRACKLIST: 3,
};