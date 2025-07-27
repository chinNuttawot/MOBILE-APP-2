import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import DynamicImage from '@component/Image/Image';
import {getString} from '@utils/number/random';
import dayjs from 'dayjs';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from 'src/routes/config';

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
  DateTimeUTC?: string;
  s_rounds?: string[];
  totalPriceByRound?: string;
  Quarters: Quarter[];
  quoter: Quarter[];
};

export type Competition = {
  name: string;
};

export type Round = {
  isWin: boolean;
  name: string;
  isTemplate?: boolean;
  quarter: Quarter;
};

export type Quarter = {
  AwayScore: number;
  GameID: number;
  HomeScore: number;
  Name: string;
  Number: number;
  QuarterID: number;
};

function getBackgroundTotal(quoter: any, round: number) {
  if (quoter[0]?.AwayScore === 0) {
    return '#FFF';
  }

  return round > 0 ? '#0000ff' : '#ff0000';
}

function getBackgroundText(quoter: any, round: number) {
  if (quoter[0]?.AwayScore === 0) {
    return '#000000';
  }

  return '#FFF';
}

function setQ(index: number): string {
  if (index === 0 || index === 1) {
    return `Q${index + 1}`;
  } else if (index === 2) {
    return 'FH';
  } else if (index === 3) {
    return `Q${3}`;
  } else if (index === 4) {
    return `Q${4}`;
  } else {
    return 'FN';
  }
}

function getStringColor(params: string) {
  if (params === '1') {
    return '#1FAA21';
  }

  return '#833c0c';
}

type LeagueDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PlayHistory'
>;

export default function AllParticiCard({item}: BoardParam) {
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
        {item?.rounds?.map((_, rIndex) => (
          <View
            key={rIndex}
            style={[
              styles.color,
              {
                backgroundColor: '#F0D313',
              },
            ]}>
            <Text style={styles.textlabel}>{setQ(rIndex)}</Text>
          </View>
        ))}

        <View
          style={[
            styles.color,
            {
              backgroundColor: '#F0D313',
            },
          ]}>
          <Text style={styles.textlabel}>Total</Text>
        </View>
      </View>

      <View style={[styles.items, {marginTop: 14}]}>
        {item?.Quarters?.map((round, rIndex) => (
          <View
            key={rIndex}
            style={[
              styles.color,
              {
                backgroundColor: '#FFF',
              },
            ]}>
            {item?.Quarters ? (
              <Text
                style={
                  styles.textlabel
                }>{`${round?.HomeScore} - ${round?.AwayScore}`}</Text>
            ) : (
              <Text style={styles.textlabel}>-</Text>
            )}
          </View>
        ))}
        <View style={{width: 52, height: 35}} />
      </View>

      <View style={[styles.items, {marginTop: 14}]}>
        {item?.rounds?.map((round, rIndex) => (
          <View
            key={rIndex}
            style={[
              styles.color,
              {
                backgroundColor: getStringColor(round?.name),
              },
            ]}>
            <Text style={[styles.textlabel, {color: '#FFF'}]}>
              {getString(round?.name)}
            </Text>
          </View>
        ))}
        {!item?.isExample && <View style={{width: 52, height: 35}} />}
      </View>

      {item?.totals?.rounds && (
        <View style={[styles.items, {marginTop: 14}]}>
          {item?.totals?.rounds?.map((round, rIndex) => (
            <View
              key={rIndex}
              style={[
                styles.color,
                {
                  backgroundColor: getBackgroundTotal(item?.Quarters, round),
                },
              ]}>
              <Text
                style={[
                  styles.textlabel,
                  {color: getBackgroundText(item?.Quarters, round)},
                ]}>
                {round}
              </Text>
            </View>
          ))}

          <View style={[styles.color, {backgroundColor: '#fff'}]}>
            <Text style={styles.textlabel}>
              {item?.totals?.totalPriceByRound}
            </Text>
          </View>
        </View>
      )}

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
          วันที่แข่งขัน : {dayjs(item?.DateTimeUTC).format('DD-MM-YYYY')}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#FFF',
            fontFamily: 'Prompt-Regular',
          }}>
          เวลาแข่งขัน : {dayjs(item?.DateTimeUTC).format('HH:mm น.')}
        </Text>
      </View>

      <View style={styles?.match}>
        <View style={styles.matchDetail}>
          <DynamicImage
            width={32}
            height={32}
            uri={item?.currentTeamLogo ?? ''}
          />

          <Text style={styles.matchLabel}>{item?.currentTeam}</Text>
        </View>

        <View style={{width: '10%', marginHorizontal: 5}}>
          <Text style={styles.textvs}>VS</Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.push('PlayHistory', {
              ...item,
              item: item?.defeatTeam,
            } as never)
          }
          style={styles.matchDetail}>
          <DynamicImage
            width={32}
            height={32}
            uri={item?.defeatTeamLogo ?? ''}
          />

          <Text style={styles.matchLabel}>{item?.defeatTeam} </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  items: {
    width: '97%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  details: {
    width: '100%',
    height: null,
    backgroundColor: '#FFFFFF70',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  color: {
    width: 50,
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
    marginVertical: 10,
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
    color: '#000000',
  },
  textvs: {
    fontSize: 16,
    color: '#FFF',
  },
});
