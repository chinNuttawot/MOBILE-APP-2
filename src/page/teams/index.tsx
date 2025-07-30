import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Search from '@component/Search';
import {CardContainer, CardPlayerDetail} from '@component/Card';
import ScrollContainer from '@component/ScrollContainer';
import {
  homePageListApi,
  favoritePageListApi,
  homePageListWNBAApi,
} from '@lib/action/nbaAction';
import {favoriteApi, getprofileApi} from '@lib/action/userAction';
import modal from '@lib/store/store';
import {PlayerResult, FavoriteResult} from '@lib/constant/nba.contants';
import {I18n} from '@utils/i18n';
import {useIsFocused} from '@react-navigation/native';
import _ from 'lodash';
import TabScroll from '@component/TabScroll';

const screenWidth = Dimensions.get('window').width;

const Teams = () => {
  const [player, setPlayer] = useState<PlayerResult[]>([]);

  const [playerWNBA, setplayerWNBA] = useState<PlayerResult[]>([]);
  const [user, setuser] = useState<any>(null);
  const [playersWithStatus, setPlayersWithStatus] = useState<PlayerResult[]>(
    [],
  );
  const [mplayersWithStatus, setMPlayersWithStatus] = useState<PlayerResult[]>(
    [],
  );
  const [favorite, setFavorite] = useState<FavoriteResult[]>([]);
  const [activeTab, setActiveTab] = useState(0); // 0 for NBA, 1 for WNBA
  const [loading, setLoading] = useState(false);

  const scrollRef = React.useRef<ScrollView>(null);
  const isFocus = useIsFocused();

  function handleSearch(text: string) {
    const filteredPlayers = filterPlayers(text);
    setPlayersWithStatus(filteredPlayers);
  }

  function filterPlayers(text: string) {
    const dataClone = _.cloneDeep(mplayersWithStatus);
    if (text.length > 3) {
      return _.filter(dataClone, i =>
        i.Name.toLowerCase().includes(text.toLowerCase()),
      );
    }
    return dataClone;
  }

  useEffect(() => {
    loadApi();
    loadfavoriteApi();
  }, [isFocus]);

  useEffect(() => {
    loadApi();
    loadfavoriteApi();
    profile();
  }, [activeTab]);

  useEffect(() => {
    const _player = [...player];
    const _favorite = [...favorite];

    const updatedPlayers = _player.map(player => ({
      ...player,
      isFavorite: _favorite.some(team => team.team_id === player.TeamID),
    }));

    setPlayersWithStatus(updatedPlayers);
    setMPlayersWithStatus(updatedPlayers);
  }, [player, favorite]);

  async function loadApi() {
    const [response, responseWNBA] = await Promise.all([
      homePageListApi(),
      homePageListWNBAApi(),
    ]);
    setLoading(false);

    if (!response.success) {
      modal.error({title: I18n().errorSystem, description: ''});

      return;
    }

    const players = response.data?.players.result ?? [];
    setPlayer(players);

    const playersWNBA = responseWNBA.data?.players.result ?? [];
    setplayerWNBA(playersWNBA);
  }

  async function loadfavoriteApi() {
    const response = await favoritePageListApi(activeTab);

    if (!response.success) {
      modal.error({title: I18n().errorSystem, description: ''});

      return;
    }

    const teams = response.data?.rows ?? [];
    setFavorite(teams);
  }

  async function _setfavoriteApi(item: PlayerResult) {
    const response = await favoriteApi(activeTab, {
      teamId: item.TeamID.toString(),
    });

    if (!response.success) {
      modal.error({title: I18n().errorSystem, description: ''});
      return;
    }
    await loadApi();
    await loadfavoriteApi();
  }

  async function _setfavoriteApi2(item: PlayerResult) {
    const response = await favoriteApi(activeTab, {
      teamId: item.Key.toString(),
    });

    if (!response.success) {
      modal.error({title: I18n().errorSystem, description: ''});
      return;
    }
    await loadApi();
    await loadfavoriteApi();
  }

  async function profile() {
    const response = await getprofileApi(activeTab);
    setuser(response.data);
  }

  const onTabPress = (index: number) => {
    setActiveTab(index);
    scrollRef.current?.scrollTo({x: screenWidth * index, animated: true});
  };

  return (
    <View style={styles.container}>
      <ScrollContainer>
        <Search onChangeText={handleSearch} />
        <View>
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
              {playersWithStatus.length > 0 ? (
                <CardContainer
                  header={I18n().allTeams}
                  data={playersWithStatus}
                  renderItem={({item}) => (
                    <CardPlayerDetail
                      item={item}
                      _setfavoriteApi={_setfavoriteApi}
                    />
                  )}
                  ListFooterComponent={undefined}
                />
              ) : (
                <>{loading && <ActivityIndicator size={'large'} />}</>
              )}
            </>
          </View>
        ) : (
          <View style={styles.page}>
            <>
              {playerWNBA.length > 0 ? (
                <CardContainer
                  header={I18n().allTeams}
                  data={playerWNBA}
                  renderItem={({item}) => (
                    <CardPlayerDetail
                      item={item}
                      _setfavoriteApi={_setfavoriteApi2}
                    />
                  )}
                  ListFooterComponent={undefined}
                />
              ) : (
                <>{loading && <ActivityIndicator size={'large'} />}</>
              )}
            </>
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
  textName: {color: '#FFF', fontSize: 18, fontFamily: 'Prompt-Regular'},
  page: {
    width: screenWidth,
    padding: 20,
  },
});

export default Teams;
