import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CardContainer, CardTotal, CardAllPatricia} from '@component/Card';
import {BoardItem} from '@component/Card/Board';
import ScrollContainer from '@component/ScrollContainer';
import modal from '@lib/store/store';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from 'src/routes/config';
import _ from 'lodash';
import {historyListTeamApi, totalTeamApi} from '@lib/action/nbaAction';
import {useIsFocused} from '@react-navigation/native';
import {I18n} from '@utils/i18n';

type PlayHistoryRouteProp = RouteProp<RootStackParamList, 'PlayHistory'>;

interface Props {
  route: PlayHistoryRouteProp;
}

interface RawRecord {
  s_rounds: string[];
  totalPriceByRound: number;
}

const PlayHistory = ({route}: Props) => {
  const [data, setData] = useState([]);
  const isFocus = useIsFocused();

  const {item, type} = route.params;

  useEffect(() => {
    loadTotalApi();
  }, [isFocus]);

  async function loadTotalApi() {
    const _teamID = (item?.Name || item) ?? '';
    const response = await totalTeamApi({
      type: type,
      teamId: _teamID.toString(),
    });

    if (!response.success) {
      modal.error({title: I18n().errorSystem, description: ''});
      return;
    }
    setData(response.data);
  }

  return (
    <View style={styles.container}>
      <ScrollContainer>
        <CardTotal header={I18n().latestbalance} data={data?.totals} />

        {!_.isEmpty(data) && (
          <CardContainer
            header={I18n().allparticipating}
            data={data.rawRecord}
            renderItem={({item}) => <CardAllPatricia item={item} />}
            ListFooterComponent={
              data?.recordLasts &&
              data?.recordLasts?.length > 0 && (
                <CardAllPatricia item={data.recordLasts[0]} />
              )
            }
          />
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
});
export default PlayHistory;
