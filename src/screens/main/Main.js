import React from 'react';
import {View} from 'react-native';
import {Container, Text} from 'native-base';
import {api} from '@config/server/Server';
import {allProducts, getImage} from '@config/server/UserService';

export default class Main extends React.Component{
  componentDidMount(){
    let id = Math.floor(Math.random()*1000);
    api.get(getImage + id)
    .then((response)=>{
      console.log(response)
    }).catch((error)=>{
      console.log(error)
    })

    // api.get(allProducts)
    // .then((response)=>{
    //   console.log(response)
    // }).catch((error)=>{
    //   console.log(error)
    // })
  }

  render(){
    return(
      <Container>
        <Text>
          test
        </Text>
      </Container>
    )
  }
}
