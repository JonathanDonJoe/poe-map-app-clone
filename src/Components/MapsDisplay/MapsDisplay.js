import React, { Component } from 'react';

import './MapsDisplay.css';
import { mapData, regions } from '../../mapData.json';
import SingleMap from '../SingleMap/SingleMap';
import CompletionCheckboxes from '../CompletionCheckboxes/CompletionCheckboxes';

class MapsDisplay extends Component {

    state = {
        showRegions: [true, true, true, true, true, true, true, true],
        filterByCompletion: [false, false, false],
        mapCompletion: {}
    }

    componentDidMount() {
        if (localStorage.getItem(`atlasState`)) {
            this.setState(JSON.parse(localStorage.getItem(`atlasState`))
            )
        } else {
            this.resetMapCompletion()
        }
    }

    resetMapCompletion = () => {
        const completionObj = {}
        Object.keys(mapData).forEach(k => {
            completionObj[k] = {
                completed: false,
                awakened: false,
                tempCompleted: false
            }
        })
        this.setState({
            showRegions: [true, true, true, true, true, true, true, true],
            filterByCompletion: [false, false, false],
            mapCompletion: completionObj
        }, this.saveToLocal)
    }

    completionCount = () => {
        let completion = {
            completed: 0,
            awakened: 0,
            tempCompleted: 0
        }
        Object.keys(this.state.mapCompletion).forEach(mapKey => {
            if (this.state.mapCompletion[mapKey].completed) {
                completion.completed += 1
            }
            if (this.state.mapCompletion[mapKey].awakened) {
                completion.awakened += 1
            }
            if (this.state.mapCompletion[mapKey].tempCompleted) {
                completion.tempCompleted += 1
            }
        })
        return completion
    }

    changeMapCompletion = (mapId, completionKey) => {
        let newState = Object.assign({}, this.state.mapCompletion);
        if (completionKey === 'completed') {
            if (newState[mapId].completed) {
                newState[mapId].completed = false;
                newState[mapId].awakened = false;
                newState[mapId].tempCompleted = false;
            } else {
                newState[mapId].completed = true;
            }

        } else if (completionKey === 'awakened') {
            newState[mapId].awakened = newState[mapId].awakened ? false : true;
            newState[mapId].completed = true;
        } else if (completionKey === 'tempCompleted') {
            newState[mapId].tempCompleted = newState[mapId].tempCompleted ? false : true;
            newState[mapId].completed = true;
        }
        this.setState({
            mapCompletion: newState
        }, this.saveToLocal)
    }

    createMapComponentsArr = () => {
        let mapDataKeys = Object.keys(mapData);
        let mapItems = mapDataKeys.map((k, key) =>
            < SingleMap
                key={key}
                k={key}
                mapData={mapData[k]}
                filterByCompletion={this.state.filterByCompletion}
                changeMapCompletion={this.changeMapCompletion}
                mapCompletion={this.state.mapCompletion}
            />
        ).filter(this.filterMaps)
        return mapItems
    }
    regionsCheckboxes = () => {
        let checkboxes = Object.keys(regions).map((regionKey, k) =>
            <div className='filter-region' key={k}>
                {regions[regionKey]}
                <input type="checkbox" checked={this.state.showRegions[k]} id={`region-${k}`} name={regions[regionKey]} onChange={this.toggleFilter} />
            </div>
        )
        return <div className='filter-region-container'>
            {checkboxes}
        </div>
    }

    toggleCompletionFilter = (e) => {
        let filterId = e.target.id.slice(10);
        let newFilter = [...this.state.filterByCompletion];
        newFilter[filterId] = newFilter[filterId] ? false : true;
        this.setState({
            filterByCompletion: newFilter
        }, this.saveToLocal)
    }

    toggleFilter = (e) => {
        let filterId = e.target.id.slice(7);
        let newFilter = [...this.state.showRegions];
        newFilter[filterId] = newFilter[filterId] ? false : true;
        this.setState({
            showRegions: newFilter
        }, this.saveToLocal)
    }

    filteredRegions = () => {
        return this.state.showRegions.map((item, k) => {
            return item ? regions[k] : null
        }).filter(item => item)
    }

    filterMaps = (item, mapKey) => {
        const localRegion = mapData[mapKey].region
        const isFiltered = this.filteredRegions().includes(localRegion)
        return isFiltered
    }
    saveToLocal = () => {
        localStorage.setItem(`atlasState`, JSON.stringify(this.state));
    }
    render() {
        return (
            <div className='container'>
                <h1 className='app-title'>Path of Exile Map Tracker</h1>
                <div className='filter-container'>
                    <button className='reset-button' onClick={this.resetMapCompletion}>Reset</button>
                    < CompletionCheckboxes
                        toggleCompletionFilter={this.toggleCompletionFilter}
                        filterByCompletion={this.state.filterByCompletion}
                        completionCount={this.completionCount()}
                        mapCount={Object.keys(mapData).length}
                    />
                    {this.regionsCheckboxes()}
                </div>
                <SingleMap
                    mapData={{ image_url: '', name: 'Name', region: 'Region', tiers: ['Tiers'] }}
                    filterByCompletion={{ filterByCompletion: [false, false, false] }}
                />
                {this.createMapComponentsArr()}
            </div>
        );
    }
}

export default MapsDisplay;