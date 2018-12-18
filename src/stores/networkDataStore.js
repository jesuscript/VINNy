import { observable, action, computed, decorate,autorun } from 'mobx';

class NetworkDataStore {
  @observable
  learningStats = []

  @action
  setLearningStats(stats) {
    this.learningStats = stats
  }
}



export default new NetworkDataStore()
