import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import DynamicImage from '@component/Image/Image';
import {getString} from '@utils/number/random';
import dayjs from 'dayjs';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from 'src/routes/config';
import {useNavigation} from '@react-navigation/native';
import {Quarter} from './AllParticiCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type BoardParam = {
  item: BoardItem;
};

export type BoardItem = {
  id?: number;
  competitions: Competition[];
  rounds: Round[];
  currentTeam: string;
  defeatTeam: string;
  currentTeamLogo?: string;
  defeatTeamLogo?: string;
  Quarters: Quarter[];
};

export type Competition = {
  name: string;
};

export type Round = {
  isWin: boolean;
  name: string;
  isTemplate?: boolean;
};

function getBackground(round: Round) {
  if (round.isTemplate) {
    return '#fff';
  }

  return round.isWin ? '#1FAA21' : '#F33232';
}

function setQ(index: number): string {
  if (index === 0 || index === 1) {
    return `Q${index + 1}`;
  } else if (index === 3) {
    return `Q${3}`;
  } else if (index === 4) {
    return `Q${4}`;
  } else {
    return 'FN';
  }
}
type LeagueDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PlayHistory'
>;

export default function Board({item}: BoardParam) {
  const navigation = useNavigation<LeagueDetailScreenNavigationProp>();

  return (
    <View style={styles.details}>
      <View style={styles.items}>
        {item?.competitions?.map((competition, cIndex) => (
          <View key={cIndex} style={styles.color}>
            <Text style={styles.textlabel}>{competition?.name}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.items, {marginTop: 14}]}>
        {item?.rounds?.map((round, rIndex) => (
          <View
            key={rIndex}
            style={[
              styles.color,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                backgroundColor: '#F0D313',
              },
            ]}>
            <Text style={styles.textlabel}>{setQ(rIndex)}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.items, {marginTop: 14}]}>
        {item?.rounds?.map((round, rIndex) => (
          <View
            key={rIndex}
            style={[
              styles.color,
              {
                backgroundColor: getBackground(round),
              },
            ]}>
            <Text style={styles.textlabel}>{getString(round?.name)}</Text>
          </View>
        ))}
      </View>

      <View style={styles?.match}>
        <TouchableOpacity
          onPress={async () => {
            const type = await AsyncStorage.getItem('type');
            navigation.navigate('PlayHistory', {
              ...item,
              item: item?.currentTeam,
              type: Number(type),
            } as never);
          }}
          style={styles.matchDetail}>
          <DynamicImage
            width={32}
            height={32}
            uri={item.currentTeamLogo ?? ''}
          />

          <Text style={styles.matchLabel}>{item.currentTeam}</Text>
        </TouchableOpacity>

        <View style={{width: '10%', marginHorizontal: 5}}>
          <Text style={styles.textvs}>VS</Text>
        </View>

        <TouchableOpacity
          onPress={async () => {
            const type = await AsyncStorage.getItem('type');
            navigation.navigate('PlayHistory', {
              ...item,
              item: item?.defeatTeam,
              type: Number(type),
            } as never);
          }}
          style={styles.matchDetail}>
          <DynamicImage
            width={32}
            height={32}
            uri={item.defeatTeamLogo ?? ''}
          />

          <Text style={styles.matchLabel}>{item.defeatTeam} </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          width: '95%',
          height: 45,
          justifyContent: 'center',
          marginTop: 10,
        }}>
        <Text
          style={{
            fontSize: 14,
            color: '#FFF',
            fontFamily: 'Prompt-Regular',
          }}>
          วันที่แข่งขัน : {dayjs(item.DateTimeUTC).format('DD-MM-YYYY')}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#FFF',
            fontFamily: 'Prompt-Regular',
          }}>
          เวลาแข่งขัน : {dayjs(item.DateTimeUTC).format('HH:mm น.')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  items: {
    width: '75%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  details: {
    width: '100%',
    height: 230,
    backgroundColor: '#FFFFFF70',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  color: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#F0D313',
  },
  match: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 10,
    height: 50,
    alignItems: 'center',
  },
  matchDetail: {
    width: '44%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchLabel: {
    fontSize: 12,
    color: '#FFF',
    marginLeft: 10,
    width: '40%',
    fontFamily: 'Prompt-Regular',
  },
  textlabel: {
    fontFamily: 'Prompt-Regular',
    fontSize: 12,
    color: 'black',
  },
  textvs: {
    fontSize: 16,
    color: '#FFF',
  },
});
