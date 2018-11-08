import {StyleSheet} from 'react-native';

export default styles = {
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spinnerText: {
    fontSize: 18,
  },
  transparentView1: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  transparentLoadingContainer: {
    flex:4,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingModal: {
    flex: 0.5,
    flexDirection: 'row'
  },
  sortingModal: {
    flex: 0.65,
    flexDirection: 'row'
  },
  sortingOptionsContainer: {
    flex: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8
  },
  sortingButtons: {
    margintBottom: 8,
    marginTop: 8
  },
  menuImage: {
    width: 30,
    height: 30
  },
  headerContainer: {
    padding: 8
  },
  headerMessageContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  headerMessage: {
    textAlign: 'center'
  },
  imageContainer: {
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  bannerImage: {
    width: 100,
    height: 75,
    marginBottom: 8
  },
  centeredContent: {
    alignItems: 'center'
  },
  card: {
    height: 250,
    width: 180,
    padding: 8,
    justifyContent: 'space-between'
  },
  faceView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth
  },
  endContent: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center'
  }
}
