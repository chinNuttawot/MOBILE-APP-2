import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BoardItem} from '@component/Card/Board';
import Search from '@component/Search';
import ScrollContainer from '@component/ScrollContainer';
import {CardContainer, CardRecommend} from '@component/Card';
import {homePageListApi, homePageListWNBAApi} from '@lib/action/nbaAction';
import modal from '@lib/store/store';
import {
  mapGameDataToTeamStructure,
  mapGameDataToTeamStructure2,
} from '@utils/formatter/profile-team';
import {getprofileApi} from '@lib/action/userAction';
import {I18n} from '@utils/i18n';
import {useIsFocused} from '@react-navigation/native';
import TabScroll from '@component/TabScroll';
import _ from 'lodash';

const screenWidth = Dimensions.get('window').width;

const Coming = () => {
  const [data, setData] = useState<BoardItem[]>([]);
  const [dataWNBA, setDataWNBA] = useState<BoardItem[]>([]);
  const isFocus = useIsFocused();
  const [user, setuser] = useState<any>('');
  const [activeTab, setActiveTab] = useState(0); // 0 for NBA, 1 for WNBA
  const [loading, setLoading] = useState(false);

  const scrollRef = React.useRef<ScrollView>(null);

  useEffect(() => {
    loadApi();
  }, [isFocus]);

  useEffect(() => {
    loadApi();
    profile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function loadApi() {
    setLoading(true);
    const [response, responseWNBA] = await Promise.all([
      homePageListApi(),
      homePageListWNBAApi(),
    ]);
    setLoading(false);

    const players = response.data?.players.result ?? [];
    const rawData = response.data?.nextGame?.result ?? [];

    setData(rawData.map(item => mapGameDataToTeamStructure(item, players)));

    const playersWNBA = responseWNBA.data?.players.result ?? [];
    const rawDataWNBA = responseWNBA.data?.nextGame?.result ?? [];

    setDataWNBA(
      rawDataWNBA.map(item => mapGameDataToTeamStructure2(item, playersWNBA)),
    );

    setLoading(false);
  }

  function handleSearch(text: string) {}

  async function profile() {
    const response = await getprofileApi(activeTab);

    setuser(response.data);
  }

  const onTabPress = (index: number) => {
    setActiveTab(index);
    scrollRef.current?.scrollTo({x: screenWidth * index, animated: true});
  };

  const onScroll = (event: any) => {
    const pageIndex = Math.round(
      event.nativeEvent.contentOffset.x / screenWidth,
    );
    setActiveTab(pageIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollContainer>
        <Search onChangeText={handleSearch} />
        <View style={styles.marginLeft10}>
          <Text style={styles.textName}>
            {user?.user?.username} {'ยอดรวม'} {user?.user?.total} {'บาท'}
          </Text>
        </View>

        {/* Tabs */}
        <TabScroll
          activeTab={activeTab}
          onTabPressOne={async () => {
            await AsyncStorage.setItem('type', _.toString(0));
            onTabPress(0);
          }}
          onTabPressTwo={async () => {
            await AsyncStorage.setItem('type', _.toString(1));
            onTabPress(1);
          }}
        />

        {/* Scrollable content */}

        {activeTab === 0 ? (
          <View style={styles.page}>
            <>
              {data.length > 0 ? (
                <CardContainer
                  header={I18n().comings}
                  data={data}
                  renderItem={({item}) => <CardRecommend item={item} />}
                  ListFooterComponent={undefined}
                />
              ) : (
                <>{loading && <ActivityIndicator size={'large'} />}</>
              )}
            </>
          </View>
        ) : (
          <View style={styles.page}>
            {dataWNBA.length > 0 ? (
              <CardContainer
                header={I18n().comings}
                data={dataWNBA}
                renderItem={({item}) => <CardRecommend item={item} />}
                ListFooterComponent={undefined}
              />
            ) : (
              <>{loading && <ActivityIndicator size={'large'} />}</>
            )}
          </View>
        )}
      </ScrollContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  marginLeft10: {},
  textName: {color: '#FFF', fontSize: 18, fontFamily: 'Prompt-Regular'},
  page: {
    width: screenWidth,
    padding: 20,
  },
});

export default Coming;
