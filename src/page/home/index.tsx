/* eslint-disable react-native/no-unused-styles */
import {View, StyleSheet, Text, Dimensions, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Search from '@component/Search';
import {
  CardAllPatricia,
  CardBoard,
  CardBoardSmall,
  CardContainer,
  CardRecommend,
} from '@component/Card';
import {BoardItem} from '@component/Card/Board';
import ScrollContainer from '@component/ScrollContainer';
import {
  homePageListApi,
  homePageListWNBAApi,
  totalTeamApi,
} from '@lib/action/nbaAction';
import {getprofileApi} from '@lib/action/userAction';
import modal from '@lib/store/store';
import {
  mapGameDataToTeamStructure,
  mapGameDataToTeamStructure2,
} from '@utils/formatter/profile-team';
import {I18n} from '@utils/i18n';
import {useIsFocused} from '@react-navigation/native';
import {randomNumber} from '@utils/number/random';
import {recordNBAApi, recordWNBAApi} from '@lib/action/userAction';
import {GameResult, PlayerResult, Record} from '@lib/constant/nba.contants';
import TabScroll from '@component/TabScroll';
import _ from 'lodash';
import uuid from 'react-native-uuid';

const template = {
  isWin: false,
  isTemplate: true,
};

const screenWidth = Dimensions.get('window').width;

const Home = () => {
  const [dataCurrentTeam, setDataCurrentTeam] = useState<any[]>([]);
  const [dataDefeatTeam, setDataDefeatTeam] = useState<any[]>([]);
  const [comings, setComings] = useState<BoardItem[]>([]);
  const [currentGame, setCurrentGame] = useState<BoardItem[]>([]);
  const [records, setRecords] = useState<BoardItem[]>([]);

  const [comingsWNBA, setComingsWNBA] = useState<BoardItem[]>([]);
  const [currentGameWNBA, setCurrentGameWNBA] = useState<BoardItem[]>([]);
  const [recordsWNBA, setRecordsWNBA] = useState<BoardItem[]>([]);

  const [user, setuser] = useState<any>('');
  const [activeTab, setActiveTab] = useState(0); // 0 for NBA, 1 for WNBA

  const scrollRef = React.useRef<ScrollView>(null);
  const isFocus = useIsFocused();

  function handleSearch(text: string) {}

  useEffect(() => {
    loadApi();
    profile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocus]);

  useEffect(() => {
    profile();
  }, [activeTab]);

  async function profile() {
    const response = await getprofileApi(activeTab);

    setuser(response.data);
  }

  async function loadApi() {
    const [nbaRes, wnbaRes] = await Promise.all([
      homePageListApi(),
      homePageListWNBAApi(),
    ]);

    if (!nbaRes.success) {
      modal.error({title: 'มีข้อผิดพลาดในระบบ NBA', description: ''});

      return;
    }

    if (!wnbaRes.success) {
      modal.error({title: 'มีข้อผิดพลาดในระบบ WNBA', description: ''});

      return;
    }

    // NBA
    const rawDataNBA = nbaRes.data?.nextGame?.result ?? [];
    const playersNBA = nbaRes.data?.players.result ?? [];
    const rewRecordsNBA = nbaRes.data?.record ?? [];

    await autoStart(rawDataNBA, playersNBA, rewRecordsNBA, 'nba');

    // WNBA
    const rawDataWNBA = wnbaRes.data?.nextGame?.result ?? [];
    const playersWNBA = wnbaRes.data?.players.result ?? [];
    const rewRecordsWNBA = wnbaRes.data?.record ?? [];

    await autoStart2(rawDataWNBA, playersWNBA, rewRecordsWNBA, 'wnba');

    await setupApi();
  }

  async function setupApi() {
    try {
      // เรียกข้อมูลจากทั้ง NBA และ WNBA พร้อมกัน
      const [nbaRes, wnbaRes] = await Promise.all([
        homePageListApi(),
        homePageListWNBAApi(),
      ]);

      if (!nbaRes.success) {
        modal.error({title: 'มีข้อผิดพลาดในระบบ NBA', description: ''});

        return;
      }

      if (!wnbaRes.success) {
        modal.error({title: 'มีข้อผิดพลาดในระบบ WNBA', description: ''});

        return;
      }

      // NBA
      const players = nbaRes.data?.players.result ?? [];
      const _currentGame = nbaRes.data?.currentGame?.result ?? [];
      const rawDataNBA = nbaRes.data?.nextGame?.result ?? [];
      const rewRecords =
        nbaRes.data?.record?.filter(i => i.record_type === 'nba') ?? [];

      setComings(
        rawDataNBA.map(item => mapGameDataToTeamStructure(item, players)),
      );
      setCurrentGame(
        _currentGame.map(item => mapGameDataToTeamStructure(item, players)),
      );
      setRecords(rewRecords.map(item => item.record_data));

      // WNBA
      const playersWNBA = wnbaRes.data?.players.result ?? [];
      const _currentGameWNBA = wnbaRes.data?.currentGame?.result ?? [];
      const rawDataWNBA = wnbaRes.data?.nextGame?.result ?? [];
      const rewRecordsWNBA =
        wnbaRes.data?.record?.filter(i => i.record_type === 'wnba') ?? [];
      setComingsWNBA(
        rawDataWNBA.map(item => mapGameDataToTeamStructure2(item, playersWNBA)),
      );
      setCurrentGameWNBA(
        _currentGameWNBA.map(item =>
          mapGameDataToTeamStructure2(item, playersWNBA),
        ),
      );

      setRecordsWNBA(rewRecordsWNBA.map(item => item.record_data));

      // ดึงทีมที่เกี่ยวข้องจาก result
      const extractTeams = (data: any[]) =>
        data.map(v => ({
          currentTeam: v.currentTeam,
          defeatTeam: v.defeatTeam,
        }));

      const teamPairs = [
        ...extractTeams(rawDataWNBA),
        ...extractTeams(rawDataNBA),
      ];

      const type = await AsyncStorage.getItem('type');
      const _pushDataCurrentTeams: any[] = [];
      const _pushDataDefeatTeams: any[] = [];

      // 1. รวบรวม teamId ทั้งหมดแบบไม่ซ้ำ
      const uniqueTeamIds = new Set<string>();
      for (const pair of teamPairs) {
        uniqueTeamIds.add(pair.currentTeam.toString());
        uniqueTeamIds.add(pair.defeatTeam.toString());
      }

      // 2. เรียกข้อมูลทุกทีมครั้งเดียว แล้วเก็บไว้ใน Map
      const teamRecordMap = new Map<string, any>();
      await Promise.all(
        Array.from(uniqueTeamIds).map(async teamId => {
          const res = await totalTeamApi({
            type: Number(type),
            teamId,
          });
          if (res?.data) {
            teamRecordMap.set(teamId, res.data);
          }
        }),
      );

      // 3. ฟังก์ชันดึง record ล่าสุดที่ไม่ซ้ำจาก targetList
      const getLatestRecord = (data: any, targetList: any[]) => {
        if (!data) return null;

        const allRecords = [
          ...(data.rawRecord || []),
          ...(data.recordLasts || []),
        ]
          .map(v => ({...v, uuid: `${v.currentTeam}-${v.defeatTeam}`}))
          .sort(
            (a, b) =>
              new Date(b.DateTimeUTC).getTime() -
              new Date(a.DateTimeUTC).getTime(),
          );

        return (
          allRecords.find(
            record => !targetList.some(item => item.uuid === record.uuid),
          ) || null
        );
      };

      // 4. วนทีละคู่ แล้วดึงข้อมูลจาก Map มาจัดกลุ่ม
      for (const team of teamPairs) {
        const currentTeamData = teamRecordMap.get(team.currentTeam.toString());
        const defeatTeamData = teamRecordMap.get(team.defeatTeam.toString());

        const currentRecord = getLatestRecord(
          currentTeamData,
          _pushDataCurrentTeams,
        );
        const defeatRecord = getLatestRecord(
          defeatTeamData,
          _pushDataDefeatTeams,
        );

        if (currentRecord) _pushDataCurrentTeams.push(currentRecord);
        if (defeatRecord) _pushDataDefeatTeams.push(defeatRecord);
      }

      // 5. อัปเดต state
      setDataCurrentTeam(_pushDataCurrentTeams);
      setDataDefeatTeam(_pushDataDefeatTeams);
    } catch (error) {
      modal.error({
        title: 'เกิดข้อผิดพลาด',
        description: error.message || '',
      });
    }
  }

  // auto
  async function autoStart(
    rawData: GameResult[] = [],
    players: PlayerResult[] = [],
    rewRecords: Record[] = [],
    type: string,
  ) {
    await Promise.all(
      rawData
        .map(item => mapGameDataToTeamStructure(item, players))
        .map(async item => {
          const currentItem = {
            ...item,
            thisGame: item.currentTeam,
            rounds: Array.from({length: 6}).map(() => ({
              ...template,
              name: randomNumber(),
            })),
          };

          const isStart = rewRecords.find(
            rewRecord => rewRecord.record_data.id === item.id,
          );

          if (isStart) {
            return;
          }

          const results = await recordNBAApi(activeTab, {
            random: currentItem.rounds.map(item => item.name),
            content: currentItem,
            name: item.currentTeam + ' vs ' + item.defeatTeam,
            type: type,
          });
          if (!results.success) {
            return;
          }
        }),
    );

    await Promise.all(
      rawData
        .map(item => mapGameDataToTeamStructure(item, players))
        .map(async item => {
          const currentItem = {
            ...item,
            thisGame: item.defeatTeam,
            rounds: Array.from({length: 6}).map(() => ({
              ...template,
              name: randomNumber(),
            })),
          };

          const isStart = rewRecords.find(
            rewRecord => rewRecord.record_data.id === item.id,
          );

          if (isStart) {
            return;
          }

          const results = await recordNBAApi(activeTab, {
            random: currentItem.rounds.map(item => item.name),
            content: currentItem,
            name: item.defeatTeam + ' vs ' + item.currentTeam,
            type: type,
          });

          if (!results.success) {
            return;
          }
        }),
    );
  }

  async function autoStart2(
    rawData: GameResult[] = [],
    players: PlayerResult[] = [],
    rewRecords: Record[] = [],
    type: string,
  ) {
    await Promise.all(
      rawData
        .map(item => mapGameDataToTeamStructure2(item, players))
        .map(async item => {
          const currentItem = {
            ...item,
            thisGame: item.currentTeam,
            rounds: Array.from({length: 6}).map(() => ({
              ...template,
              name: randomNumber(),
            })),
          };

          const isStart = rewRecords.find(
            rewRecord => rewRecord.record_data.id === item.id,
          );

          if (isStart) {
            return;
          }

          const results = await recordWNBAApi(activeTab, {
            random: currentItem.rounds.map(item => item.name),
            content: currentItem,
            name: item.currentTeam + ' vs ' + item.defeatTeam,
            type: type,
          });

          if (!results.success) {
            return;
          }
        }),
    );

    await Promise.all(
      rawData
        .map(item => mapGameDataToTeamStructure2(item, players))
        .map(async item => {
          const currentItem = {
            ...item,
            thisGame: item.defeatTeam,
            rounds: Array.from({length: 6}).map(() => ({
              ...template,
              name: randomNumber(),
            })),
          };
          const isStart = rewRecords.find(
            rewRecord => rewRecord.record_data.id === item.id,
          );
          if (isStart) {
            return;
          }
          const results = await recordWNBAApi(activeTab, {
            random: currentItem.rounds.map(item => item.name),
            content: currentItem,
            name: item.defeatTeam + ' vs ' + item.currentTeam,
            type: type,
          });

          if (!results.success) {
            return;
          }
        }),
    );
  }

  const onTabPress = (index: number) => {
    setActiveTab(index);
    scrollRef.current?.scrollTo({x: screenWidth * index, animated: true});
  };

  return (
    <View style={styles.container}>
      <ScrollContainer>
        <View style={styles.marginLeft10}>
          <Text style={styles.textName}>
            {user?.user?.username} {'ยอดรวม'} {user?.user?.total} {'บาท'}
          </Text>
        </View>
        <View style={styles.page}>
          <View style={styles.mainView1}>
            <CardContainer
              header={`${I18n().comings} - (ทีมเจ้าบ้าน)`}
              data={dataCurrentTeam}
              renderItem={({item}) => <CardAllPatricia item={item} />}
              ListFooterComponent={undefined}
            />
          </View>

          <View style={styles.mainView2}>
            <CardContainer
              header={`${I18n().comings} - (ทีมเยือน)`}
              data={dataDefeatTeam}
              renderItem={({item}) => <CardAllPatricia item={item} />}
              ListFooterComponent={undefined}
            />
          </View>
        </View>
      </ScrollContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView1: {
    backgroundColor: '#123416ff',
    padding: 16,
    borderRadius: 16,
  },
  mainView2: {
    marginTop: 30,
    backgroundColor: '#131234ff',
    padding: 16,
    borderRadius: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#222',
    paddingVertical: 10,
  },
  tab: {
    marginHorizontal: 20,
  },
  activeTab: {
    color: '#fff',
    borderColor: '#fff',
  },
  tabText: {
    fontSize: 18,
    color: '#888',
    borderBottomWidth: 2,
    borderColor: 'transparent',
    paddingBottom: 5,
    fontFamily: 'Prompt-Regular',
  },
  textName: {color: '#FFF', fontSize: 18, fontFamily: 'Prompt-Regular'},
  page: {
    // width: screenWidth,
    // padding: 20,
  },
  marginLeft10: {},
});

export default Home;
