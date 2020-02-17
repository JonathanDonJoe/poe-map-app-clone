import React, { Component } from 'react';

class CompletionCheckboxes extends Component {
    // state = {}
    render() { 
        return (
            <div className='filter-completion-container'>
            <div className='filter-completion'>
                Completed ({this.props.completionCount.completed}/{this.props.mapCount})
                <input type="checkbox" checked={this.props.filterByCompletion[0]} id='completed-0' name='completed' onChange={this.props.toggleCompletionFilter} />
            </div>
            <div className='filter-completion'>
                Awakened ({this.props.completionCount.awakened}/{this.props.mapCount})
                <input type="checkbox" checked={this.props.filterByCompletion[1]} id='completed-1' name='awakened' onChange={this.props.toggleCompletionFilter} />
            </div>
            <div className='filter-completion'>
                Temp ({this.props.completionCount.tempCompleted})
                <input type="checkbox" checked={this.props.filterByCompletion[2]} id='completed-2' name='tempCompleted' onChange={this.props.toggleCompletionFilter} />
            </div>
        </div>
        );
    }
}
 
export default CompletionCheckboxes;