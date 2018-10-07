import React, {Component} from 'react'
import {View, StyleSheet, StatusBar, Text, Button, TouchableOpacity, TouchableHighlight} from "react-native";
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

export interface Props {
    name: string;
    enthusiasmLevel?: number;
}

interface Checkpoint {
    latitude:number,
    longitude:number,
    altitude:number
}

interface Track {
    id:number,
    name:string,
    description:string,
    checkpoints:Checkpoint[]
}

interface Location {
    coords:Checkpoint
}

export class ExoRun extends React.Component {
    static navigationOptions = {
        header: null
    };
    interval:number = 0;
    intervalchrono:number = 0;
    currentLatitude:number = 0;
    currentLongitude:number = 0;
    currentAltitude:number = 0;
    locationError:string = "";
    distance:number = 30000;
    laps:number[] = [];
    checkpoints:Checkpoint[] = [];
    runnerPosition:Checkpoint[] = [];
    currentCheckpoint = 0;
    registeredTracks:Track[] = [{
        id: 1,
        name: "Example",
        description: "3 checkpoint(s)",
        checkpoints: [  {latitude: 43.6957831, longitude: 7.2699759, altitude: 56.70000076293945},
            {latitude: 43.6958452, longitude: 7.2701865, altitude: 56.70000076293945},
            {latitude: 43.6957831, longitude: 7.2699759, altitude: 56.70000076293945}
        ]
    },
        {
            id: 2,
            name: "Example2",
            description: "2 checkpoint(s)",
            checkpoints: [{latitude: 43.6958452, longitude: 7.2701865, altitude: 56.70000076293945},
                {latitude: 43.6958452, longitude: 7.2701865, altitude: 56.70000076293945}]
        }];
    currentTrackName:string = "";
    currentTrackDescription:string = "";
    elapsed = 0;
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

    switchToMain() {
        this.setState({screen: screens.MAIN});
    }

    /**** CREATE LAP SCREEN ****/

    _toggleModal() {
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    _createCheckpoint() {
        this.checkpoints.push({
            latitude: this.currentLatitude,
            longitude: this.currentLongitude,
            altitude: this.currentAltitude
        });
    }

    _deleteCheckpoint() {

        var array = this.checkpoints;
        var index = this.checkpoints.length - 1;
        if (index >= 0) {
            array.splice(index, 1);
            this.checkpoints = array;
        }
    }

    _confirmSaveTrack() {
        if (this.checkpoints.length > 0) {
            this._toggleModal();
            this.currentTrackName = "";
            this.currentTrackDescription = "";
        }
    }

    saveTrack() {
        if (this.currentTrackName === null
            || this.currentTrackName === "")
            this.currentTrackName =  "No Name";
        if (this.currentTrackDescription === null
            || this.currentTrackDescription === "")
            this.currentTrackDescription = "No Desc";
        this.registeredTracks.push({
            id: this.registeredTracks.length + 1,
            name: this.currentTrackName,
            description : this.currentTrackDescription,
            checkpoints: this.checkpoints,
        });

        this.checkpoints = [];
        this.currentTrackName = "";
        this.currentTrackDescription = "";
        this._toggleModal();
    }

    switchToCreate() {
        this.setState({screen: screens.CREATE, openid: 0});
    }


    @autobind
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
                <Text style={styles.baseText}>
                    Lap #{idx + 1}
                </Text>
            </View>
        ));
    }

    /**** RUN SCREEN ****/

    _onLapPress() {
        this.laps.push(this.state.timeElasped);
        this.currentCheckpoint = this.currentCheckpoint + 1;
        this.distance = 5000;
        if (this.currentCheckpoint > this.checkpoints.length - 1) {
            this.setState({stopwatch: null,
                timeElasped: null,
                timerRunning: false,
                startTime: null});
            clearInterval(this.intervalchrono);
        }
    }

    _onStartPress() {
        // check if clock is running, then stop
        this.setState({
            startTime: new Date(),
        });

        this.intervalchrono = setInterval(() => {
            this.setState({
                // @ts-ignore
                timeElasped: new Date() - this.state.startTime,
                timerRunning: true,
            });
        }, 100);
    }

    distanceToCheckpoint() {
        if (this.distance != null && this.distance <= 10 && this.currentCheckpoint === 0) {
            this.setState({
                stopwatch:
                    <View>
                        <Text style={styles.baseText}>{(this.state.timeElasped)}</Text>*/
                        <Button title="go" onPress={this._onStartPress}/>
                        <Button title="Lap" onPress={this._onLapPress}/>
                    </View>});
            this.currentCheckpoint = 1;
        }
        return <View>
            <Text style={styles.baseText}>{this.distance} m</Text>
        </View>
    }

    showRunTracks() {
        if (this.state.timerRunning === true && this.distance <= 5 && this.currentCheckpoint < this.checkpoints.length)
            this._onLapPress();
        return <View>
            <Text style={styles.upTitle}> {this.currentCheckpoint} / {this.checkpoints.length} CP</Text>
            {this.state.stopwatch ? this.state.stopwatch : null}
            {this.createLaps()}
            {this.currentCheckpoint < this.checkpoints.length ? this.distanceToCheckpoint() : null}
        </View>
    }

    @autobind
    switchToRun(){
        this.setState({screen: screens.RUN});
        this.currentCheckpoint = 0;
        this.checkpoints = this.registeredTracks[this.state.openid - 1].checkpoints;
        this.laps = [];
    }

    /**** CHOOSE TRACKS SCREEN ****/
    @autobind
    generate(key) {

        if (!key)
            return ;
        return <View key={key.id}>
            {(key.id === 1) ? <Text style={styles.upTitle}>PARCOURS</Text> : null}
            <TouchableOpacity onPress={() => {
                this.setState({openid:key.id});
            }}>
                <Text style={styles.button}>{key.name}</Text>
            </TouchableOpacity>
            <Expand value={(key.id === this.state.openid)}>
                {
                    (key.id === this.state.openid) ?
                        <View style={styles.row}>
                            <View style = {{flex: 0.8, flexDirection: 'row'}}>
                                <Text style={[styles.buttonexpend, {alignSelf: 'flex-start'}]}> {key.description} </Text>
                            </View>
                            <TouchableOpacity onPress={this.switchToRun} style = {{flex: 0.2, flexDirection: 'row', backgroundColor: "#3498db", alignItems: 'center', justifyContent:'center'}}>
                                <RkText  style={{fontFamily: 'Cochin', color: 'white', fontWeight: 'bold', textAlign: 'center'}}>Run</RkText>
                            </TouchableOpacity>
                        </View>
                        : <Text style={{padding:10}}> </Text>
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
        this.setState({});
        return <View>
            {(this.state.screen === screens.MAIN) ? <Text style={styles.baseText}>MAIN SCREEN</Text> :
                (this.state.screen === screens.RUN) ? <Text style={styles.baseText}>RUN SCREEN</Text> :
                    (this.state.screen === screens.CREATE) ? <Text style={styles.baseText}>CREATE SCREEN</Text> :
                        (this.state.screen === screens.TRACKLIST) ? <Text style={styles.baseText}>TRACKLIST SCREEN</Text> : null}
            <Text style={styles.baseText}>Current checkpoints: {this.checkpoints.length}</Text>
            <Text style={styles.baseText}>Latitude: {this.currentLatitude}</Text>
            <Text style={styles.baseText}>Longitude: {this.currentLongitude}</Text>
        </View>
    }

    /**** MAIN RENDER LOOP ****/

    updateLoc = async() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.currentLatitude =  position.coords.latitude;
                this.currentLongitude =  position.coords.longitude;
                this.currentAltitude =  position.coords.altitude ? position.coords.altitude : 0;
            },
            (error) => this.locationError = error.message,
            {enableHighAccuracy: false, timeout: 5000, maximumAge: 0},
        );
        if (this.state.screen === screens.RUN) {
            if (this.currentCheckpoint < this.checkpoints.length)
            {
                var prevDistance = this.distance;
                this.distance = geolib.getDistance(
                    {
                        latitude: this.currentLatitude,
                        longitude: this.currentLongitude
                    },
                    {
                        latitude: this.checkpoints[this.currentCheckpoint].latitude,
                        longitude: this.checkpoints[this.currentCheckpoint].longitude
                    });
                if (this.distance <= prevDistance - 1 || this.distance >= prevDistance + 1)
                    this.setState({});
            }

        }
    };

    componentDidMount() {
        this.interval = setInterval(() => {
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
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    style={{...StyleSheet.absoluteFillObject}}>
                </RNCamera>
                <ActionButton buttonColor='#09d819'>
                    <ActionButton.Item buttonColor='#9b59b6' title="Vos parcours"
                                       onPress= {this.switchToTracklist}>
                        <Icon name="md-archive" style={styles.actionButtonIcon}/>
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='#3498db' title="Nouveau parcours"
                                       onPress={this._switchToCreate}>
                        <Icon name="md-add-circle" style={styles.actionButtonIcon}/>
                    </ActionButton.Item>
                </ActionButton>

                {(this.state.screen === screens.TRACKLIST) ? this.showRegisteredTracks() :
                 (this.state.screen === screens.RUN) ? this.showRunTracks(): null}

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
});


const screens = {
    MAIN: 0,
    CREATE: 1,
    RUN: 2,
    TRACKLIST: 3,
};