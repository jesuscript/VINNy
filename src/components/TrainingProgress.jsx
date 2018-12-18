import {inject,observer,Observer} from 'mobx-react'
import {autorun,observable} from 'mobx'
import React from 'react'
import _ from 'lodash'

import "../styles/training-progress.less"
import LearningStatsGraph from "../LearningStatsGraph"



var statsToList = (stats) => _.compact(_.map(stats,(v,k)=> _.isNumber(v) && (k!=="epoch") && k))

@observer
@inject('networkDataStore')
export default class App extends React.Component {
  @observable
  selectedStat = null
  
  constructor(props){
    super(props)

    this.svg = React.createRef()
    this.openFile = React.createRef()
  }
  
  loadFile(e){
    e.preventDefault()
    
    var file = e.target.files[0]

    let reader = new FileReader(),
        store = this.props.networkDataStore

    reader.onload = (e) => {
      store.setLearningStats(JSON.parse(reader.result))
    }

    reader.readAsText(file)

    $(this.openFile.current).hide()
  }

  statSelectClicked(e){
    e.preventDefault()

    this.selectedStat = $(e.currentTarget).data("key")
  }

  render(){
    var props = this.props,
        self = this
    
    return (
      <div id="training-progress">
        <div className="open-file" ref={this.openFile}>
          <input type="file" onChange={ this.loadFile.bind(this) }/>
        </div>
        <svg ref={this.svg}></svg>
        <Observer>{
          () => {
            var stats = props.networkDataStore.learningStats,
                rows = []

            if(stats[0]){
              rows = _.map(
                statsToList(stats[0]),
                (v) => <a
                         href="#!"
                         className={
                           'collection-item' + ((v==self.selectedStat) ? ' active' : '')
                         }
                         key = {v}
                         data-key = {v}
                         onClick = {self.statSelectClicked.bind(self)}
   > {v} </a> 
              )
            }

            return (
              <ul id="stats-legend" className="collection">
                {rows}
              </ul>
            )
          }
        }</Observer>
      </div>
    )
  }

  componentDidMount(){
    var graph = this.graph = new LearningStatsGraph(this.svg.current),
        props = this.props,
        store = props.networkDataStore

    $(this.openFile.current).find("input").dropify({
      showRemove: false
    })

    //DEBUG>
    //store.setLearningStats([{"epoch":0,"evaluation_cost":1.5143975,"evaluation_accuracy":77.0,"training_cost":1.4590033,"training_accuracy":80.2},{"epoch":1,"evaluation_cost":1.1377238,"evaluation_accuracy":82.58,"training_cost":1.054403,"training_accuracy":87.7},{"epoch":2,"evaluation_cost":0.95378053,"evaluation_accuracy":85.94,"training_cost":0.8337686,"training_accuracy":92.6},{"epoch":3,"evaluation_cost":0.91978914,"evaluation_accuracy":85.93,"training_cost":0.7674025,"training_accuracy":94.1},{"epoch":4,"evaluation_cost":0.8287499,"evaluation_accuracy":87.53,"training_cost":0.6716734,"training_accuracy":95.4},{"epoch":5,"evaluation_cost":0.8109859,"evaluation_accuracy":87.55,"training_cost":0.6468738,"training_accuracy":95.9},{"epoch":6,"evaluation_cost":0.78751695,"evaluation_accuracy":87.91,"training_cost":0.6011384,"training_accuracy":97.5},{"epoch":7,"evaluation_cost":0.8283543,"evaluation_accuracy":86.77,"training_cost":0.606249,"training_accuracy":97.5},{"epoch":8,"evaluation_cost":0.7927132,"evaluation_accuracy":87.84,"training_cost":0.575915,"training_accuracy":98.0},{"epoch":9,"evaluation_cost":0.79731244,"evaluation_accuracy":87.63,"training_cost":0.5660126,"training_accuracy":97.8}])
    //DEBUG<

    autorun(reaction => {
      if(store.learningStats.length){
        if(!this.selectedStat) this.selectedStat = statsToList(store.learningStats[0])[0]
        
        graph.display(store.learningStats, this.selectedStat) 
      }
    })
  }
}
