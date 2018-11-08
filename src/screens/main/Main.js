import React from 'react';
import {View, Image, Alert, FlatList, StyleSheet, Modal} from 'react-native';
import {Container, Content, Text, Spinner, Header, Body, Right, Title, Card,
  Button} from 'native-base';
import styles from './Style';
import {api} from '@config/server/Server';
import {allProducts, getImage, baseURL, sort} from '@config/server/UserService';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setProducts, setPrefetchedProducts} from '@redux/actions';

class Main extends React.Component{
  constructor(props){
    super(props);
    this.state={
      page: 0,
      items: 0,
      currentImageID: 0,
      isLoading: true,
      isLoadingVisible: false,
      isMenuVisible: false,
      sortOrder: '',
      maxItems: 0,
      endOfArray: false,
      itemLimit: 20
    }
  }

  initialLoad(sortMethod){
    let order = ''
    if(sortMethod === ''){
      order = ''
    }else{
      order = `${sort}${sortMethod}`
    }

    this.props.setProducts([]);
    this.props.setPrefetchedProducts([]);

    api.get(allProducts)
    .then(response=>{
      this.setState({
        maxItems: response.data.length
      })
      api.get(`${allProducts}?_page=0&_limit=${this.state.itemLimit}
        ${order}`)
      .then((response)=>{
        if(response.ok){
          this.props.setProducts(response.data);

          api.get(`${allProducts}?_page=2&_limit=${this.state.itemLimit}
            ${order}`)
          .then((response) => {
            this.props.setPrefetchedProducts(response.data)
            if(response.ok){
              this.setState({
                isLoading: false,
                prefetchedProducts: response.data,
                page: 2,
                items: this.state.itemLimit,
                isLoadingVisible: false,
                sortOrder: order
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
    }).catch((error)=>{
      console.log(error)
    })
  }

  componentDidMount(){
    this.initialLoad();
    let id = Math.floor(Math.random()*1000);
    this.setState({
      currentImageID: id
    })
  }

  onLoadItems = () =>{
    const {products, prefetchedProducts} = this.props.products;

    if(this.state.maxItems !== products.length){
      this.setState({
        isLoadingVisible: true
      });

      let currentProd = products;
      let prefetchedProd = prefetchedProducts;

      this.props.setProducts([]);
      this.props.setPrefetchedProducts([]);

      let iteratedData = products.concat(prefetchedProd);
      let pageCount = this.state.page + 1;
      let itemCount = this.state.items + this.state.itemLimit;

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

      api.get(`${allProducts}?_page=${pageCount}&_limit=${this.state.itemLimit}
        ${this.state.sortOrder}`)
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
    }else{
      this.setState({
        endOfArray: true
      })
    }
  }

  onSort = (order) => {
    this.setState({
      isMenuVisible: false,
      isLoadingVisible: true
    })
    this.initialLoad(order)
  }

  formatDate(dateInput){
    let itemDate = new Date(dateInput);
    let dateNow = new Date();
    let timeDiff = Math.abs(dateNow.getTime() - itemDate.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    let month = itemDate.getMonth();
    let date = itemDate.getDate();
    let year = itemDate.getFullYear();
    let formattedDate = ''

    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'];

    if(diffDays > 6){
      formattedDate = `${months[month]} ${date} ,${year}`
    }else{
      formattedDate = `${diffDays} days ago`
    }
    return formattedDate;
  }

  render(){
    return(
      <Container>
        {
          (this.state.isLoading)
          ?
            <View style={styles.spinnerContainer}>
              <Spinner/>
              <Text style={styles.spinnerText}>Please wait...</Text>
            </View>
          :
            <Container>
              <Modal
                onRequestClose={() => {Alert.alert('Modal has been closed.');}}
                visible={this.state.isLoadingVisible}
                transparent={true}>
                <View style={styles.transparentView1}/>

                <View style={styles.loadingModal}>
                  <View style={styles.transparentView1}/>
                  <View style={styles.transparentLoadingContainer}>
                    <Spinner/>
                    <Text style={styles.spinnerText}>Loading...</Text>
                  </View>
                  <View style={styles.transparentView1}/>
                </View>

                <View style={styles.transparentView1}/>
              </Modal>

              <Modal
                onRequestClose={() => {Alert.alert('Modal has been closed.');}}
                visible={this.state.isMenuVisible}
                transparent={true}>
                <View style={styles.transparentView1}/>

                <View style={styles.sortingModal}>
                  <View style={styles.transparentView1}/>
                  <View style={styles.sortingOptionsContainer}>
                    <Button
                      light
                      full
                      style={styles.sortingButtons}
                      onPress={()=>this.onSort('price')}>
                      <Text>By price</Text>
                    </Button>

                    <Button
                      light
                      full
                      style={styles.sortingButtons}
                      onPress={()=>this.onSort('size')}>
                      <Text>By size</Text>
                    </Button>

                    <Button
                      light
                      full
                      style={styles.sortingButtons}
                      onPress={()=>this.onSort('id')}>
                      <Text>By id</Text>
                    </Button>
                  </View>
                  <View style={styles.transparentView1}/>
                </View>
                <View style={styles.transparentView1}/>
              </Modal>

              <Header>
                <Body>
                  <Title>
                    Products Grid
                  </Title>
                </Body>
                <Right>
                  <Button
                    onPress={()=> {
                      this.setState({
                        isMenuVisible: true
                      })
                    }}>
                    <Image
                      style={styles.menuImage}
                      source={require('@assets/sort.png')}
                    />
                  </Button>
                </Right>
              </Header>
              <View style={styles.headerContainer}>
                <View style={styles.headerMessageContainer}>
                  <Text style={styles.headerMessage}>
                    Here you're sure to find a bargain on some of the finest
                    ascii available to purchase. Be sure to peruse our selection
                    of ascii faces in an exciting range of sizes and prices.
                  </Text>
                  <Text style={styles.headerMessage}>
                    But first, a word from our sponsors:
                  </Text>
                </View>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.bannerImage}
                    source={{uri: `${baseURL}${getImage}
                    ${this.state.currentImageID}`}}
                  />
                </View>
              </View>

              <Container style={styles.centeredContent}>
                <FlatList
                  data={this.props.products.products}
                  renderItem={({item}) => (
                    <Card style={styles.card}>
                      <View style={styles.faceView}>
                        <Text style={{fontSize: item.size}}>{item.face}</Text>
                      </View>
                      <View style={styles.centeredContent}>
                        <Text>Price: ${parseFloat(item.price).toFixed(2)}</Text>
                        <Text>Added: {this.formatDate(item.date)}</Text>
                      </View>
                    </Card>
                  )}
                  numColumns={2}
                  onEndReached={this.onLoadItems}
                  onEndReachedThreshold={0.1}
                  keyExtractor={(item, index) => index}
                />
              </Container>
              {
                (this.state.endOfArray)&&
                <Container style={styles.endContent}>
                  <Text>
                    -End of Catalogue-
                  </Text>
                </Container>
              }
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
