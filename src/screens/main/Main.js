import React from 'react';
import {View, Image, Alert} from 'react-native';
import {Container, Content, Text, Spinner, Header, Body, Title, Card} from 'native-base';
import {api} from '@config/server/Server';
import {allProducts, getImage} from '@config/server/UserService';
import GridView from 'react-native-super-grid';

export default class Main extends React.Component{
  constructor(props){
    super(props);
    this.state={
      products: [],
      prefetchedProducts: [],
      page: 0,
      itemCount: 0,
      prevImageId: 0,
      currentImageID: 0,
      isLoading: true
    }
  }

  componentDidMount(){
    let id = Math.floor(Math.random()*1000);
    let productArray = [];
    let prefetchedArray = [];

    api.get(allProducts)
    .then((response)=>{
      console.log(response)
      if(response.ok){
        this.setState({
          isLoading: false,
          products: response.data
        })

      }else{
        Alert.alert('Server connection error')
      }

    }).catch((error)=>{
      console.log(error)
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
                onScroll={()=>console.log('scroll')}>
                <GridView
                  itemDimension={130}
                  items={this.state.products}
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
