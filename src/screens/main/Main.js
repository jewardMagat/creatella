import React from 'react';
import {View, Image, Alert} from 'react-native';
import {Container, Content, Text, Spinner, Header, Body, Title, Card} from 'native-base';
import {api} from '@config/server/Server';
import {allProducts, getImage} from '@config/server/UserService';
import GridView from 'react-native-super-grid';
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

    api.get(allProducts + '?_page=1_limit=10')
    .then((response)=>{
      if(response.ok){
        this.props.setProducts(response.data);

        api.get(allProducts + '?_page=2_limit=10')
        .then((response) => {
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

  onLoadItems(){
    console.log('load')
    let pageCount = this.state.page + 1;
    let itemCount = this.state.items + 10;

    this.setState({
      isLoading: true
    });

    api.get(allProducts + '?_page=' + pageCount + '_limit=10')
    .then((response)=>{
      // console.log(response);

      if(response.ok){
        this.setState({
          prefetchedProducts: response.data,
          page: pageCount,
          items: itemCount,
          iterateData: true
        })
      }else{
        Alert.alert('Server connection error');
      }
      this.setState({
        isLoading: false
      })
    }).catch((error)=>{
      console.log(error)
    })
  }

  onIterateItem(){
    let product = this.state.products;
    let additional = this.state.prefetchedProducts;
    let iteratedItems = product.concat(additional);

    this.setState({
      products: iteratedItems,
      iterateData: false
    })

    console.log('iterate')
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
              <Content
                onScroll={({nativeEvent}) => {
                  if (isCloseToBottom(nativeEvent)) {
                      this.onLoadItems();
                      if(this.state.iterateData){
                        this.onIterateItem()
                      }
                    }
                  }}
                scrollEventThrottle={400}>

                <GridView
                  itemDimension={130}
                  items={this.props.products.products}
                  renderItem={
                    item =>(
                      <Card style={{height: 250, padding: 8, justifyContent: 'space-between'}}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                          <Text style={{fontSize: item.size}}>{item.face}</Text>
                        </View>
                        <View>
                          <Text>${parseFloat(item.price).toFixed(2)}</Text>
                          <Text>{item.date}</Text>
                        </View>
                      </Card>
                    )
                  }
                />
              </Content>
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
