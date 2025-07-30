import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {I18n} from '@utils/i18n';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from 'src/routes/config';
import Button from '@component/Button';
import Typography from '@component/Typography';
import TextField from '@component/InputField';
import BetweenContainer from '@component/View/BetweenContainer';
import {authLogin} from '@lib/action/authAction';
import modal from '@lib/store/store';
import CheckBox from '@component/CheckBox';

const Profile = require('@assets/image/profile.png');
const EyeView = require('@assets/image/eyeview.png');
const Lock = require('@assets/image/lock.png');

type LeagueDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Authorization'
>;

const Login = () => {
  const [username, setUsername] = useState<string>(__DEV__ ? 'A1' : '');
  const [password, setPassword] = useState<string>(__DEV__ ? '999999' : '');
  // const [username, setUsername] = useState<string>(__DEV__ ? 'johndoe' : '');
  // const [password, setPassword] = useState<string>(
  //   __DEV__ ? 'new_user_password' : '',
  // );
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [checkBox, setCheckBox] = useState<boolean>(true);

  const navigation = useNavigation<LeagueDetailScreenNavigationProp>();

  async function handleLogin() {
    setLoading(true);

    const response = await authLogin({data: {username, password}});
    if (!response.success) {
      modal.push({
        title: 'เข้าสู่ระบบไม่สำเร็จ',
        description: 'เข้าสู่ระบบไม่สำเร็จ',
      });
    }

    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <TextField
        labelIcon={Profile}
        labelText={I18n().Username}
        value={username}
        onChangeText={setUsername}
      />

      <TextField
        labelIcon={Lock}
        labelText={I18n().Password}
        secureTextEntry={showPassword}
        value={password}
        onChangeText={setPassword}
        onIconPress={() => setShowPassword(!showPassword)}
        icon={EyeView}
      />
      <BetweenContainer>
        <CheckBox
          text={I18n().rememberPassword}
          checked={checkBox}
          onCheck={setCheckBox}
          styleProps={styles.viewcheckbox}
          styleTextProps={styles.viewcheckboxText}
        />
        <Button
          variant="tertiary"
          text={I18n().forgetPassword}
          styleTextProps={styles.btnTextChangePassword}
          onPress={() => navigation.navigate('ChangePassword')}
        />
      </BetweenContainer>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? '#E0C200' : '#FFD700', // เหลืองหม่นเวลาโหลด
          paddingVertical: 14,
          paddingHorizontal: 20,
          width: '100%',
          borderRadius: 20,
          alignItems: 'center',
          opacity: isLoading ? 0.8 : 1,
        }}>
        {isLoading ? (
          <ActivityIndicator color="#000" /> // สีดำตอนโหลด
        ) : (
          <Text style={{color: '#000', fontSize: 16, fontWeight: '500'}}>
            {I18n().login}
          </Text>
        )}
      </TouchableOpacity>

      <View style={{padding: 16}}>
        <Typography text={I18n().or} />
      </View>
      <Button
        variant="tertiary"
        text={I18n().dontHaveAccount}
        onPress={() => navigation.navigate('Register')}
        styleTextProps={styles.viewcheckboxText}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewcheckbox: {
    flexDirection: 'row',
  },
  viewcheckboxText: {
    marginLeft: 10,
    fontFamily: 'Prompt-Regular',
    fontSize: 14,
  },
  btnTextChangePassword: {
    fontFamily: 'Prompt-Regular',
    fontSize: 14,
  },
});

export default Login;
