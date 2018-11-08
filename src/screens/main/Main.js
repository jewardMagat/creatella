import React from 'react';
import {View, Image, Alert, FlatList} from 'react-native';
import {Container, Content, Text, Spinner, Header, Body, Title, Card} from 'native-base';
import {api} from '@config/server/Server';
import {allProducts, getImage} from '@config/server/UserService';
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
      prevImageId: 0,
      currentImageID: 0,
      isLoading: true,
      iterateData: false,
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
              iterateData: true
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

    let currentProd = products;
    let prefetchedProd = prefetchedProducts;

    this.props.setProducts([]);
    this.props.setPrefetchedProducts([]);

    let iteratedData = products.concat(prefetchedProd);
    let pageCount = this.state.page + 1;
    let itemCount = this.state.items + 10;

    this.props.setProducts(iteratedData);

    console.log('==============================')
    console.log(pageCount);
    console.log(iteratedData);
    console.log('==============================')

    // this.setState({
    //   isLoading: true
    // });
    //
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
        isLoading: false
      })
    }).catch((error)=>{
      console.log(error);
    })
  }


  renderItem = ({ item, index }) => (
    <Card style={{height: 200, padding: 8, justifyContent: 'space-between'}}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: item.size}}>{item.face}</Text>
      </View>
      <View>
        <Text>${parseFloat(item.price).toFixed(2)}</Text>
        <Text>{item.date}</Text>
      </View>
    </Card>
  );



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
              <Header>
                <Body style={{flex: 1, alignItems: 'center'}}>
                  <Title>
                    Cool Faces
                  </Title>
                </Body>
              </Header>
              <Image
                style={{width: 50, height: 50}}
                source={{uri: 'http://10.10.1.111:3000/api/ads/?r=13'}}
              />

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
                  keyExtractor={(item) => `${item.id}_${item.face}_${item.size}_${item.date}`}
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
