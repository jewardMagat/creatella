import React from 'react';
import {View, Image, Alert, FlatList, StyleSheet, Modal} from 'react-native';
import {Container, Content, Text, Spinner, Header, Body, Right, Title, Card, Footer,
  FooterTab, Button} from 'native-base';
import {api} from '@config/server/Server';
import {allProducts, getImage, baseURL} from '@config/server/UserService';
import GridView from 'react-native-super-grid';
import GridList from 'react-native-grid-list';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setProducts, setPrefetchedProducts} from '@redux/actions';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height;
};

class Main extends React.Component{
  constructor(props){
    super(props);
    this.state={
      products: [],
      prefetchedProducts: [],
      page: 0,
      items: 0,
      currentImageID: 0,
      isLoading: true,
      iterateData: false,
      isLoadingVisible: false
    }
  }

  componentDidMount(){
    let id = Math.floor(Math.random()*1000);
    api.get(allProducts + '?_page=1&_limit=10')
    .then((response)=>{
      if(response.ok){
        this.props.setProducts(response.data);

        api.get(allProducts + '?_page=2&_limit=10')
        .then((response) => {
          this.props.setPrefetchedProducts(response.data)
          if(response.ok){
            this.setState({
              isLoading: false,
              prefetchedProducts: response.data,
              page: 2,
              items: 10,
              iterateData: true,
              currentImageID: id
            })
          }else{
            Alert.alert('Server connection error');
          }
        })
      }else{
        Alert.alert('Server connection error');
      }
    }).catch((error)=>{
      console.log(error)
    })
  }

  onLoadItems = () =>{
    const {products, prefetchedProducts} = this.props.products;

    this.setState({
      isLoadingVisible: true
    });

    let currentProd = products;
    let prefetchedProd = prefetchedProducts;

    this.props.setProducts([]);
    this.props.setPrefetchedProducts([]);

    let iteratedData = products.concat(prefetchedProd);
    let pageCount = this.state.page + 1;
    let itemCount = this.state.items + 10;

    this.props.setProducts(iteratedData);

    if(this.state.items % 20 === 0){
      let getId = Math.floor(Math.random()*1000);
      if(this.state.currentImageID === getId){
        this.setState({
          currentImageID: Math.floor(Math.random()*1000)
        })
      }else{
        this.setState({
          currentImageID: getId
        })
      }
    }

    api.get(allProducts + '?_page=' + pageCount + '&_limit=10')
    .then((response)=>{
      if(response.ok){
        this.props.setPrefetchedProducts(response.data)
        this.setState({
          prefetchedProducts: response.data,
          page: pageCount,
          items: itemCount
        })
      }else{
        Alert.alert('Server connection error');
      }
      this.setState({
        isLoadingVisible: false
      });
    }).catch((error)=>{
      console.log(error);
    })
  }

  render(){
    return(
      <Container>
        {
          (this.state.isLoading)
          ?
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Spinner/>
              <Text style={{fontSize: 18, fontWeight:'bold'}}>Please wait...</Text>
            </View>
          :
            <Container>
              <Modal
                onRequestClose={() => {Alert.alert('Modal has been closed.');}}
                visible={this.state.isLoadingVisible}
                transparent={true}
              >
              <View style={{flex:1, backgroundColor: 'rgba(52, 52, 52, 0.8)'}}/>

              <View style={{flex:0.5, flexDirection: 'row'}}>
                <View style={{flex:1, backgroundColor: 'rgba(52, 52, 52, 0.8)'}}/>
                <View style={{flex:4, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
                  <Spinner/>
                  <Text style={{fontSize: 18}}>Loading...</Text>
                </View>
                <View style={{flex:1, backgroundColor: 'rgba(52, 52, 52, 0.8)'}}/>
              </View>

              <View style={{flex:1, backgroundColor: 'rgba(52, 52, 52, 0.8)'}}/>


              </Modal>
              <Header>
                <Body>
                  <Title>
                    Products Grid
                  </Title>
                </Body>
                <Right>
                  <Button>
                    <Image
                      style={{width: 30, height: 30}}
                      source={require('@assets/sort.png')}
                    />
                  </Button>
                </Right>
              </Header>
              <View style={{padding: 8}}>
                <View style={{borderBottomWidth: StyleSheet.hairlineWidth}}>
                  <Text style={{textAlign: 'center'}}>
                    Here you're sure to find a bargain on some of the finest
                    ascii available to purchase. Be sure to peruse our selection
                    of ascii faces in an exciting range of sizes and prices.
                  </Text>
                  <Text style={{textAlign: 'center'}}>
                    But first, a word from our sponsors:
                  </Text>
                </View>
                <View style={{marginTop: 8, marginBottom: 8, alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth}}>
                  <Image
                    style={{width: 100, height: 75, marginBottom: 8}}
                    source={{uri: `${baseURL}${getImage}${this.state.currentImageID}`}}
                  />
                </View>
              </View>

              <Container style={{alignItems: 'center'}}>
                <FlatList
                  data={this.props.products.products}
                  renderItem={({item}) => (
                    <Card style={{height: 250, width: 180, padding: 8, justifyContent: 'space-between'}}>
                      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: item.size}}>{item.face}</Text>
                      </View>
                      <View>
                        <Text>${parseFloat(item.price).toFixed(2)}</Text>
                        <Text>{item.date}</Text>
                      </View>
                    </Card>
                  )}
                  numColumns={2}
                  onEndReached={this.onLoadItems}
                  onEndReachedThreshold={0.1}
                  keyExtractor={(item, index) => index}
                />
              </Container>
            </Container>
        }
      </Container>
    )
  }
}

mapStateToProps = (state) =>{
  return{
    products: state.products
  }
}

mapDispatchToProps = (dispatch) => {
  return{
    setProducts: bindActionCreators(setProducts, dispatch),
    setPrefetchedProducts: bindActionCreators(setPrefetchedProducts, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
